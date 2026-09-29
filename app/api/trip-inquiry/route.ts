import { NextResponse } from "next/server"
import { z } from "zod"
import { siteConfig } from "@/lib/site"
import { buildWelcomeEmail, sendResendEmail } from "@/lib/emails"

export const runtime = "nodejs"

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{8,16}$/, "Phone must include country code and number"),
  email: z.string().trim().email().max(160),
  destination: z.string().trim().min(1).max(240),
  promo: z.literal(true, {
    errorMap: () => ({ message: "Promotional email consent is required." }),
  }),
})

type SheetResult =
  | { ok: true }
  | { ok: false; duplicate: true; field?: string }
  | { ok: false; duplicate?: false; error: string }

async function appendToGoogleSheet(payload: {
  submittedAt: string
  name: string
  phone: string
  email: string
  destination: string
  promo: boolean
}): Promise<SheetResult> {
  const webhook = process.env.TRIP_FORM_WEBHOOK_URL
  if (!webhook) {
    return { ok: false, error: "TRIP_FORM_WEBHOOK_URL is not set" }
  }

  // Apps Script web apps often 302 to a one-time URL; follow redirects and
  // re-POST if Google turns the follow into a GET (common 404 HTML page).
  const body = JSON.stringify({
    timestamp: payload.submittedAt,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    destination: payload.destination,
    promo: payload.promo ? "Yes" : "No",
    source: "jazora-web",
  })

  let res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "manual",
  })

  // Follow up to 5 redirects, preserving POST where possible
  let hops = 0
  while (hops < 5 && res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location")
    if (!location) break
    hops += 1
    res = await fetch(location, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "manual",
    })
  }

  // If we still landed on a redirect that became a non-POST, try one follow-all POST
  if (res.status >= 300 && res.status < 400) {
    res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "follow",
    })
  }

  const text = await res.text().catch(() => "")
  if (!res.ok) {
    return {
      ok: false,
      error: `Google Sheet webhook failed (${res.status}): ${text.slice(0, 240)}`,
    }
  }

  try {
    const parsed = JSON.parse(text) as {
      ok?: boolean
      duplicate?: boolean
      field?: string
      error?: string
    }

    if (parsed.duplicate) {
      return { ok: false, duplicate: true, field: parsed.field }
    }
    if (parsed.ok === false) {
      return { ok: false, error: parsed.error || "Google Sheet rejected the row" }
    }
    return { ok: true }
  } catch {
    // Non-JSON success body from older deployments
    if (text.includes("Sorry") || text.includes("<!DOCTYPE")) {
      return {
        ok: false,
        error: `Google Sheet webhook returned HTML instead of JSON (${res.status}). Redeploy the Apps Script web app and update TRIP_FORM_WEBHOOK_URL.`,
      }
    }
    return { ok: true }
  }
}

async function notifyTeam(payload: {
  submittedAt: string
  name: string
  phone: string
  email: string
  destination: string
  promo: boolean
}) {
  const to = process.env.TRIP_FORM_NOTIFY_EMAIL || siteConfig.email
  return sendResendEmail({
    to,
    replyTo: payload.email,
    subject: `Trip inquiry — ${payload.name} → ${payload.destination}`,
    text: [
      "New trip inquiry from the website",
      "",
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Email: ${payload.email}`,
      `Destination: ${payload.destination}`,
      `Promotional emails: ${payload.promo ? "Yes" : "No"}`,
      `Submitted: ${payload.submittedAt}`,
    ].join("\n"),
  })
}

async function sendWelcomeIfOptedIn(payload: {
  name: string
  email: string
  destination: string
  promo: boolean
}) {
  if (!payload.promo) return { ok: true as const, skipped: true as const }

  const welcome = buildWelcomeEmail(payload)
  return sendResendEmail({
    to: payload.email,
    subject: welcome.subject,
    text: welcome.text,
    html: welcome.html,
  })
}

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 })
  }

  if (!process.env.TRIP_FORM_WEBHOOK_URL) {
    return NextResponse.json(
      {
        error:
          "Google Sheet is not connected yet. Add TRIP_FORM_WEBHOOK_URL to your environment.",
      },
      { status: 503 },
    )
  }

  const inquiry = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
  }

  try {
    const sheetResult = await appendToGoogleSheet(inquiry)

    if (!sheetResult.ok && sheetResult.duplicate) {
      return NextResponse.json(
        {
          error:
            "Looks like you've already submitted an inquiry with this email or phone. Our trip desk will be in touch — or message us on WhatsApp anytime.",
          duplicate: true,
          field: sheetResult.field,
        },
        { status: 409 },
      )
    }

    // Always attempt emails — don't lose the lead if Sheets is briefly down
    const [team, welcome] = await Promise.allSettled([
      notifyTeam(inquiry),
      sendWelcomeIfOptedIn(inquiry),
    ])

    if (team.status === "fulfilled" && !team.value.ok && !team.value.skipped) {
      console.warn("[trip-inquiry] team notify failed", team.value.error)
    }
    if (welcome.status === "fulfilled" && !welcome.value.ok && !welcome.value.skipped) {
      console.warn("[trip-inquiry] welcome email failed", welcome.value.error)
    }
    if (welcome.status === "rejected") {
      console.warn("[trip-inquiry] welcome email error", welcome.reason)
    }
    if (team.status === "rejected") {
      console.warn("[trip-inquiry] team notify error", team.reason)
    }

    if (!sheetResult.ok) {
      console.error("[trip-inquiry] sheet failed", sheetResult.error)
      const teamOk =
        team.status === "fulfilled" && (team.value.ok || team.value.skipped)
      const welcomeOk =
        welcome.status === "fulfilled" && (welcome.value.ok || welcome.value.skipped)

      // Soft success if at least one email path worked — lead is not lost
      if (teamOk || welcomeOk) {
        return NextResponse.json({
          ok: true,
          warning: "saved_via_email",
        })
      }

      return NextResponse.json(
        {
          error:
            "Could not reach Google Sheet. Check TRIP_FORM_WEBHOOK_URL on Vercel matches the latest Apps Script /exec deploy URL.",
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[trip-inquiry]", err)
    return NextResponse.json(
      { error: "Could not save your inquiry. Please try WhatsApp or email us." },
      { status: 502 },
    )
  }
}

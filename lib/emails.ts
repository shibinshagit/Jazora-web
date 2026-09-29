import { siteConfig } from "@/lib/site"

type WelcomePayload = {
  name: string
  email: string
  destination: string
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there"
}

export function buildWelcomeEmail(payload: WelcomePayload) {
  const greet = firstName(payload.name)
  const site = siteConfig.url
  const whatsapp = siteConfig.whatsapp

  const text = [
    `Hi ${greet},`,
    "",
    "Welcome to Team Jazora.",
    "",
    `Got your note about ${payload.destination} — someone from our side will reach out soon.`,
    "",
    "If you want to chat sooner, just WhatsApp us:",
    whatsapp,
    "",
    "Happy to have you with us.",
    "",
    "— Jazora",
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome to Team Jazora</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;">
          <tr>
            <td style="padding:8px 4px 28px;color:#111;font-size:16px;line-height:1.7;">
              <p style="margin:0 0 20px;">Hi ${escapeHtml(greet)},</p>
              <p style="margin:0 0 20px;font-size:22px;line-height:1.35;font-family:Georgia,'Times New Roman',serif;">
                Welcome to Team Jazora.
              </p>
              <p style="margin:0 0 20px;color:#333;">
                Got your note about <strong>${escapeHtml(payload.destination)}</strong> — someone from our side will reach out soon.
              </p>
              <p style="margin:0 0 20px;color:#333;">
                If you want to chat sooner, just
                <a href="${whatsapp}" style="color:#111;text-decoration:underline;">WhatsApp us</a>.
              </p>
              <p style="margin:0 0 28px;color:#333;">
                Happy to have you with us.
              </p>
              <p style="margin:0;color:#111;">
                — Jazora
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 4px 0;border-top:1px solid #eee;">
              <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#999;">
                <a href="${site}" style="color:#999;text-decoration:none;">jazoraholidays.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return {
    subject: `Welcome to Team Jazora, ${greet}`,
    text,
    html,
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function sendResendEmail(options: {
  to: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    return { ok: false as const, skipped: true as const, error: "Resend env not set" }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      reply_to: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }),
  })

  const body = await res.text().catch(() => "")
  if (!res.ok) {
    return { ok: false as const, skipped: false as const, error: `${res.status}: ${body.slice(0, 240)}` }
  }

  return { ok: true as const, skipped: false as const }
}

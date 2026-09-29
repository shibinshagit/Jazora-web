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
  const logo = `${site}/images/logo/logomain.png`
  const icon = `${site}/images/logo/logoicon.png`
  const destination = payload.destination.trim()

  const text = [
    `Hey, traveller!`,
    "",
    "Your Jazora trip enquiry is in!",
    destination ? `Route: ${destination}` : null,
    "",
    "We're checking the details and will be in touch soon with some travel magic.",
    "",
    "Can't wait? WhatsApp us and let's get planning:",
    whatsapp,
    "",
    "Adventure awaits.",
    "— Team Jazora",
  ]
    .filter((line) => line !== null)
    .join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Jazora trip enquiry is in</title>
</head>
<body style="margin:0;padding:0;background:#ece8df;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ece8df;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#0b0b0b;border-radius:24px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:36px 32px 28px;background:#0b0b0b;">
              <img src="${logo}" alt="Jazora Holidays" width="220" style="display:block;width:220px;max-width:80%;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#c9a227,#f1d27a,#c9a227);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 12px;background:#fffaf3;color:#1a1a1a;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#8a7a52;">Trip enquiry</p>
              <h1 style="margin:0 0 20px;font-size:28px;line-height:1.25;font-weight:600;color:#111;">
                Hey, traveller! &#128075;&#127757;
              </h1>
              <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#222;">
                Your Jazora trip enquiry is in! &#127881;
              </p>
              ${
                destination
                  ? `<p style="margin:0 0 20px;display:inline-block;padding:8px 14px;border-radius:999px;background:#111;color:#f6e7b2;font-size:13px;letter-spacing:0.02em;">${escapeHtml(destination)}</p>`
                  : ""
              }
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#444;">
                We're checking the details and will be in touch soon with some travel magic. &#10024;
              </p>
              <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#444;">
                Can't wait? WhatsApp us and let's get planning! &#128172;
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 32px;">
                <tr>
                  <td align="center" style="border-radius:999px;background:#111;">
                    <a href="${whatsapp}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;letter-spacing:0.02em;">
                      WhatsApp Team Jazora
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px;font-size:16px;line-height:1.6;color:#222;">
                Adventure awaits. &#127965;&#65039;&#9992;&#65039;
              </p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#111;">
                &mdash; Team Jazora
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 32px 32px;background:#fffaf3;border-top:1px solid #efe6d4;">
              <img src="${icon}" alt="" width="44" height="44" style="display:block;margin:0 auto 12px;width:44px;height:44px;border:0;" />
              <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a7a52;">
                The Aura of Discovering The World
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#aaa;">
                <a href="${site}" style="color:#aaa;text-decoration:none;">jazoraholidays.com</a>
                &nbsp;&middot;&nbsp;
                <a href="${whatsapp}" style="color:#aaa;text-decoration:none;">WhatsApp</a>
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
    subject: `${greet}, your Jazora trip enquiry is in`,
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

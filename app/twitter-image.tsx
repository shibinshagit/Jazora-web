import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #0f1419 0%, #1c2a24 45%, #2a1f14 100%)",
          color: "#f7f4ef",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.72,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Jazora Holidays
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 400,
              maxWidth: 900,
            }}
          >
            See the world, with Jazora
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              opacity: 0.82,
              maxWidth: 820,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            International trips we design and lead — Georgia, Armenia, Azerbaijan, and beyond.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "system-ui, sans-serif",
            fontSize: 22,
            opacity: 0.75,
          }}
        >
          <span>{siteConfig.tagline}</span>
          <span>jazoraholidays.com</span>
        </div>
      </div>
    ),
    { ...size },
  )
}

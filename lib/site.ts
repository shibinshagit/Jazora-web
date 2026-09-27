export const siteConfig = {
  name: "Jazora Holidays",
  shortName: "Jazora",
  tagline: "The Aura of Discovering The World",
  description:
    "Jazora Holidays designs and leads international trips from the UAE — small-group departures and private journeys across Georgia, Armenia, Azerbaijan, and beyond. Flights, stays, guides, and on-the-ground support included.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://jazoraholidays.com",
  locale: "en_AE",
  phone: "+971529612199",
  phoneDisplay: "+971 52 961 2199",
  email: "info@jazoraholidays.com",
  whatsapp: "https://wa.me/971529612199",
  instagram:
    "https://www.instagram.com/mintsulaimani?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
  keywords: [
    "Jazora Holidays",
    "Jazora",
    "international trips UAE",
    "Caucasus tours",
    "Georgia Armenia Azerbaijan travel",
    "small group tours",
    "private journeys",
    "trip operator Dubai",
    "guided tours from UAE",
    "WhatsApp trip booking",
  ],
} as const

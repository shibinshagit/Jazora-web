export const SRI_LANKA_WHATSAPP = "https://wa.me/971588409478"

export const sriLankaPhotos = [
  { src: "/trips/srilanka/web/02.jpg", label: "Tea country" },
  { src: "/trips/srilanka/web/03.jpg", label: "Hill country" },
  { src: "/trips/srilanka/03.jpg", label: "On the road" },
] as const

export const sriLankaTrip = {
  name: "Sri Lanka",
  dateLabel: "17 December 2026",
  /** Dubai departure — FitsAir 8D 822 */
  departsAt: "2026-12-17T18:00:00+04:00",
  nights: "4 nights",
  days: "5 days",
  duration: "5 days · 4 nights",
  from: "Dubai ⇄ Colombo",
  summary: "Five days from Dubai. Kandy, the tea hills, and Colombo with one small group.",
  groupSize: 22,
  booked: 10,
  price: "AED 3,499",
  priceNote: "per person",
  location: "Negombo, Kandy, Nuwara Eliya & Colombo",
} as const

export function sriLankaBookUrl() {
  const text = encodeURIComponent(
    [
      "Hi Jazora — I'd like to join the Sri Lanka departure.",
      "",
      `Trip: ${sriLankaTrip.name}`,
      `Date: ${sriLankaTrip.dateLabel}`,
      `Duration: ${sriLankaTrip.duration}`,
      `From: ${sriLankaTrip.from}`,
    ].join("\n"),
  )
  return `${SRI_LANKA_WHATSAPP}?text=${text}`
}

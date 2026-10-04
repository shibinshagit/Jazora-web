export const MALAYSIA_WHATSAPP = "https://wa.me/971588409478"

export const malaysiaPhotos = [
  { src: "/trips/malaysia/petronas.jpg", label: "Petronas at night" },
  { src: "/trips/malaysia/putrajaya.jpg", label: "Putra Mosque" },
  { src: "/trips/malaysia/alor.jpg", label: "Jalan Alor" },
  { src: "/trips/malaysia/genting.jpg", label: "Genting Skyway" },
] as const

export const malaysiaDays = [
  {
    day: "01",
    title: "Putrajaya, then city night",
    line: "Pink mosque, then Bukit Bintang for street food.",
  },
  {
    day: "02",
    title: "Up to Genting",
    line: "Morning visit, then the Skyway and Chin Swee.",
  },
  {
    day: "03",
    title: "Kuala Lumpur, slowly",
    line: "Gardens, Chinatown, Petronas after dark.",
  },
  {
    day: "04",
    title: "Last views, then home",
    line: "One more stop, then Sharjah.",
  },
] as const

export const malaysiaTrip = {
  name: "Malaysia",
  dateLabel: "18 November 2026",
  /** Sharjah local — morning of the 18 Nov departure */
  departsAt: "2026-11-18T08:00:00+04:00",
  nights: "3 nights",
  days: "4 days",
  duration: "4 days · 3 nights",
  from: "Sharjah ⇄ Kuala Lumpur",
  groupSize: 20,
  booked: 12,
  price: "AED 3,299",
  priceNote: "per person",
  location: "Kuala Lumpur, Putrajaya & Genting",
  included: ["Return flights", "Hotels & breakfast", "Daily meals", "Private tours", "Key tickets"],
} as const

export function malaysiaBookUrl() {
  const text = encodeURIComponent(
    [
      "Hi Jazora — I'd like to join the Malaysia departure.",
      "",
      `Trip: ${malaysiaTrip.name}`,
      `Date: ${malaysiaTrip.dateLabel}`,
      `Duration: ${malaysiaTrip.duration}`,
      `From: ${malaysiaTrip.from}`,
    ].join("\n"),
  )
  return `${MALAYSIA_WHATSAPP}?text=${text}`
}

"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TripCard } from "./trip-card"

const trips = [
  {
    name: "Amalfi Coast",
    location: "Positano, Italy",
    duration: "8 days",
    season: "May–October",
    image: "/images/property-beach-villa.jpg",
    price: 14290,
    type: "Coastal journey",
    highlights: ["Cliff towns", "Boat day", "Local cooking"],
    includes: ["Flights", "Guide", "Hotels"],
    rating: 4.9,
  },
  {
    name: "Patagonia Trek",
    location: "El Chaltén, Argentina",
    duration: "11 days",
    season: "March & November",
    image: "/images/property-mountain-cabin.jpg",
    price: 19900,
    type: "Wilderness expedition",
    highlights: ["Glacier hike", "Estancia stay", "Expert guides"],
    includes: ["Meals", "Transfers", "Guide"],
    rating: 4.8,
  },
  {
    name: "Japan in Spring",
    location: "Tokyo to Kyoto",
    duration: "12 days",
    season: "March–April",
    image: "/images/property-city-loft.jpg",
    price: 17180,
    type: "Small-group departure",
    highlights: ["Temples", "Bullet train", "Ryokan nights"],
    includes: ["Flights", "Rail", "Guide"],
    rating: 4.9,
  },
  {
    name: "Tuscan Harvest",
    location: "Florence, Italy",
    duration: "7 days",
    season: "September–October",
    image: "/images/property-tuscan-estate.jpg",
    price: 15120,
    type: "Private journey",
    highlights: ["Vineyards", "Cooking class", "Hill towns"],
    includes: ["Hotels", "Driver", "Meals"],
    rating: 4.9,
  },
  {
    name: "Bali & Beyond",
    location: "Ubud, Indonesia",
    duration: "9 days",
    season: "Year-round",
    image: "/images/property-tropical-bungalow.jpg",
    price: 10130,
    type: "Island retreat",
    highlights: ["Rice terraces", "Temples", "Sunrise trek"],
    includes: ["Hotels", "Guide", "Transfers"],
    rating: 4.8,
  },
  {
    name: "Swiss Lakes",
    location: "Lucerne, Switzerland",
    duration: "6 days",
    season: "June–September",
    image: "/images/property-lakefront-modern.jpg",
    price: 12990,
    type: "Scenic rail",
    highlights: ["Lake cruise", "Mountain railway", "Alpine villages"],
    includes: ["Rail pass", "Hotels", "Guide"],
    rating: 4.9,
  },
]

export function PricingSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = () => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < max - 8)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateArrows()
    el.addEventListener("scroll", updateArrows, { passive: true })
    window.addEventListener("resize", updateArrows)
    return () => {
      el.removeEventListener("scroll", updateArrows)
      window.removeEventListener("resize", updateArrows)
    }
  }, [])

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-trip-card]")
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.85
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28 md:py-32">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="whitespace-nowrap text-center text-[22vw] font-bold leading-none tracking-tighter text-zinc-100 sm:text-[18vw] md:text-[14vw]">
          TRIPS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl text-left md:max-w-2xl">
            <h2 className="mb-3 font-serif text-3xl font-normal text-balance sm:mb-4 sm:text-4xl md:text-5xl">
              Upcoming departures
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              International trips we design and lead. Prices are per person and include the route, stays, and local
              team.
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous trips"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next trips"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 md:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {trips.map((trip) => (
            <div
              key={trip.name}
              data-trip-card
              className="w-[min(86vw,340px)] shrink-0 snap-center sm:w-[min(70vw,380px)] sm:snap-start lg:w-[400px]"
            >
              <TripCard {...trip} currency="AED" />
            </div>
          ))}
          {/* end spacer so last card can snap with breathing room */}
          <div className="w-1 shrink-0 sm:w-2" aria-hidden />
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground md:hidden">Swipe to see more departures</p>
      </div>
    </section>
  )
}

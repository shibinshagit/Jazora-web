"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TripCard } from "./trip-card"

const trips = [
  {
    name: "Malaysia",
    location: "Kuala Lumpur to the islands",
    duration: "3–4 days",
    season: "Coming season",
    image: "/trips/upcoming/malaysia.jpg",
    type: "Next departure",
    highlights: ["Petronas Towers", "Street food trails", "Island evenings"],
    includes: ["Flights", "Guide", "Hotels"],
    popular: true,
  },
  {
    name: "Vietnam",
    location: "Ha Long Bay to Hanoi",
    duration: "4–5 days",
    season: "Coming season",
    image: "/trips/upcoming/vietnam.jpg",
    type: "Next departure",
    highlights: ["Ha Long Bay", "Old Quarter nights", "Local kitchens"],
    includes: ["Flights", "Guide", "Hotels"],
    popular: true,
  },
  {
    name: "Thailand",
    location: "Bangkok to the islands",
    duration: "4–5 days",
    season: "Coming season",
    image: "/trips/upcoming/thailand.jpg",
    type: "Next departure",
    highlights: ["Temple mornings", "Long-tail boats", "Street food trails"],
    includes: ["Flights", "Guide", "Hotels"],
    popular: true,
  },
  {
    name: "Jordan",
    location: "Amman to Petra",
    duration: "3–4 days",
    season: "Coming season",
    image: "/trips/upcoming/jordan.jpg",
    type: "Next departure",
    highlights: ["Petra at dawn", "Wadi Rum nights", "Dead Sea float"],
    includes: ["Flights", "Guide", "Hotels"],
  },
  {
    name: "Kyrgyzstan",
    location: "Issyk-Kul to Song-Kul",
    duration: "3–4 days",
    season: "Coming soon",
    image: "/trips/kyrgyzstan/web/03.jpg",
    type: "Coming soon",
    highlights: ["Alpine lakes", "Yurt nights", "Tian Shan ridges"],
    includes: ["Flights", "Guide", "Hotels"],
    comingSoon: true,
  },
  {
    name: "Uzbekistan",
    location: "Samarkand to Bukhara",
    duration: "3–4 days",
    season: "Coming soon",
    image: "/trips/uzbekistan/web/01.jpg",
    type: "Coming soon",
    highlights: ["Registan square", "Blue domes", "Silk Road cities"],
    includes: ["Flights", "Guide", "Hotels"],
    comingSoon: true,
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
        <span className="text-center text-[22vw] leading-none font-bold tracking-tighter whitespace-nowrap text-zinc-100 sm:text-[18vw] md:text-[14vw]">
          TRIPS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl text-left md:max-w-2xl">
            <h2 className="font-serif text-3xl font-normal text-balance sm:text-4xl md:text-5xl">
              Upcoming departures
            </h2>
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
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-6 md:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {trips.map((trip) => (
            <div
              key={trip.name}
              data-trip-card
              className="group w-[min(82vw,320px)] shrink-0 snap-center sm:w-[min(62vw,350px)] sm:snap-start lg:w-[360px]"
            >
              <TripCard {...trip} />
            </div>
          ))}
          <div className="w-1 shrink-0 sm:w-2" aria-hidden />
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground md:hidden">Swipe to see more departures</p>
      </div>
    </section>
  )
}

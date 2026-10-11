"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { DepartureCountdown } from "@/components/departure-countdown"
import { malaysiaBookUrl, malaysiaPhotos, malaysiaTrip } from "@/lib/malaysia-departure"

export function NextDepartureSection() {
  const loop = [...malaysiaPhotos, ...malaysiaPhotos]
  const soldOut = malaysiaTrip.booked >= malaysiaTrip.groupSize
  const remaining = malaysiaTrip.groupSize - malaysiaTrip.booked

  return (
    <section id="next-departure" className="relative overflow-hidden bg-zinc-100 py-12 sm:py-16 md:py-20">
      <div className="relative mx-auto grid max-w-7xl items-stretch gap-4 px-4 sm:gap-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-5">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-zinc-950 p-6 text-white sm:p-8">
          {soldOut ? (
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 z-20 h-28 w-28 overflow-hidden rounded-tr-[1.5rem]"
            >
              <div className="absolute top-[1.7rem] -right-[2.35rem] w-[9.5rem] rotate-45 bg-white py-1.5 text-center shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                <span className="block text-[10px] font-bold tracking-[0.2em] text-zinc-950 uppercase">
                  Sold out
                </span>
              </div>
            </div>
          ) : null}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                Next departure
              </span>
            </div>

            <h2 className="mt-4 font-serif text-[2.75rem] leading-[0.92] tracking-tight sm:text-5xl md:text-[3.5rem]">
              {malaysiaTrip.name}
            </h2>
            <p className="mt-3 text-sm text-white/55 sm:text-base">{malaysiaTrip.dateLabel}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
              Four days from Sharjah. A small group, one desk, the city and the highlands.
            </p>

            <div className="mt-7">
              <p className="mb-2.5 text-[11px] font-medium tracking-[0.16em] text-white/40 uppercase">Departs in</p>
              <DepartureCountdown targetIso={malaysiaTrip.departsAt} variant="panel" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-sm">
              <div>
                <p className="text-[10px] tracking-[0.14em] text-white/35 uppercase">Duration</p>
                <p className="mt-1 text-white/90">{malaysiaTrip.duration}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.14em] text-white/35 uppercase">Route</p>
                <p className="mt-1 text-white/90">{malaysiaTrip.from}</p>
              </div>
            </div>

            {soldOut ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="font-serif text-xl leading-snug text-white sm:text-[1.35rem]">
                  Thank you — this group is full
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  All {malaysiaTrip.groupSize} seats are taken. Browse upcoming trips and reserve your place early.
                </p>
                <a
                  href="#pricing"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Book an upcoming trip
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="mt-5">
                <div className="flex items-end justify-between gap-3">
                  <p className="font-serif text-3xl tabular-nums text-white">
                    {malaysiaTrip.booked}
                    <span className="text-lg text-white/40">/{malaysiaTrip.groupSize}</span>
                  </p>
                  <p className="pb-1 text-xs text-white/50">{remaining} seats left</p>
                </div>
                <div
                  className="mt-3 h-1 overflow-hidden rounded-full bg-white/15"
                  role="progressbar"
                  aria-valuenow={malaysiaTrip.booked}
                  aria-valuemin={0}
                  aria-valuemax={malaysiaTrip.groupSize}
                >
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${(malaysiaTrip.booked / malaysiaTrip.groupSize) * 100}%` }}
                  />
                </div>
              </div>
            )}

          </div>

          {!soldOut ? (
            <a
              href={malaysiaBookUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
            >
              Book this departure
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-zinc-900 sm:min-h-[400px] lg:min-h-full">
          <div className="malaysia-marquee flex h-full min-h-[300px] w-max gap-2.5 p-2.5 sm:min-h-[400px] lg:absolute lg:inset-0 lg:min-h-0">
            {loop.map((photo, i) => (
              <figure
                key={`${photo.src}-${i}`}
                className="relative h-full w-[70vw] shrink-0 overflow-hidden rounded-xl sm:w-[240px] lg:w-[260px]"
              >
                <Image src={photo.src} alt={photo.label} fill sizes="260px" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
                  <figcaption className="text-xs font-medium text-white">{photo.label}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

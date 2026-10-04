"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { DepartureCountdown } from "@/components/departure-countdown"
import { malaysiaBookUrl, malaysiaDays, malaysiaPhotos, malaysiaTrip } from "@/lib/malaysia-departure"

const dayTones = ["bg-[#f4f1ea]", "bg-[#e7eee8]", "bg-[#e8eef2]", "bg-[#efe9e2]"]

export function NextDepartureSection() {
  const loop = [...malaysiaPhotos, ...malaysiaPhotos]
  const remaining = malaysiaTrip.groupSize - malaysiaTrip.booked
  const fill = (malaysiaTrip.booked / malaysiaTrip.groupSize) * 100

  return (
    <section id="next-departure" className="relative overflow-hidden bg-background py-14 sm:py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#e7eee8]/80 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-[#e8eef2]/90 blur-2xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-stretch gap-8 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
        <div className="flex flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.05] sm:p-7">
          <p className="w-fit rounded-full bg-[#f4f1ea] px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-zinc-600">
            Next departure
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-[0.9] text-zinc-950 sm:text-5xl">{malaysiaTrip.name}</h2>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">{malaysiaTrip.dateLabel}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
            Four days from Sharjah. A small group, one desk, the city and the highlands.
          </p>

          <div className="mt-6">
            <DepartureCountdown targetIso={malaysiaTrip.departsAt} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e7eee8] px-3 py-1.5 text-xs font-medium text-zinc-800">
              {malaysiaTrip.duration}
            </span>
            <span className="rounded-full bg-[#e8eef2] px-3 py-1.5 text-xs font-medium text-zinc-800">
              {malaysiaTrip.from}
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-[#e5ebe6] px-4 py-3.5">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-zinc-900">
                {malaysiaTrip.booked}
                <span className="font-normal text-zinc-500"> / {malaysiaTrip.groupSize} seats</span>
              </p>
              <p className="text-xs font-medium text-emerald-700">{remaining} left</p>
            </div>
            <div
              className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/80"
              role="progressbar"
              aria-valuenow={malaysiaTrip.booked}
              aria-valuemin={0}
              aria-valuemax={malaysiaTrip.groupSize}
              aria-label={`${malaysiaTrip.booked} of ${malaysiaTrip.groupSize} seats taken`}
            >
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${fill}%` }} />
            </div>
          </div>

          <ol className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {malaysiaDays.map((item, i) => (
              <li key={item.day} className={`rounded-2xl px-3.5 py-3 ring-1 ring-black/[0.04] ${dayTones[i]}`}>
                <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-400 uppercase">Day {item.day}</p>
                <p className="mt-1 font-serif text-[0.95rem] leading-snug text-zinc-950">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{item.line}</p>
              </li>
            ))}
          </ol>

          <a
            href={malaysiaBookUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-7"
          >
            Book this departure
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-[1.75rem] bg-[#e8eef2] ring-1 ring-black/[0.04] sm:min-h-[380px] lg:min-h-full">
          <div className="malaysia-marquee flex h-full min-h-[300px] w-max gap-3 p-3 sm:min-h-[380px] lg:absolute lg:inset-0 lg:min-h-0">
            {loop.map((photo, i) => (
              <figure
                key={`${photo.src}-${i}`}
                className="relative h-full w-[72vw] shrink-0 overflow-hidden rounded-[1.25rem] sm:w-[250px] lg:w-[270px]"
              >
                <Image src={photo.src} alt={photo.label} fill sizes="270px" className="object-cover" />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-zinc-800">
                  {photo.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

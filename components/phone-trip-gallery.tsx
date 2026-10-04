"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { DepartureCountdown } from "@/components/departure-countdown"
import { malaysiaBookUrl, malaysiaPhotos, malaysiaTrip } from "@/lib/malaysia-departure"

const PHOTO_MS = 3400

export function PhoneTripGallery() {
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    malaysiaPhotos.forEach((photo) => {
      const img = new window.Image()
      img.src = photo.src
    })
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % malaysiaPhotos.length)
    }, PHOTO_MS)
    return () => window.clearInterval(id)
  }, [ready])

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-zinc-950 [contain:paint] [clip-path:inset(0)]">
      {malaysiaPhotos.map((photo, i) => (
        <div
          key={photo.src}
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 700ms ease",
            zIndex: i === index ? 1 : 0,
          }}
        >
          <img
            src={photo.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-black/10 to-black/80" />

      <div className="absolute top-[8.5%] right-0 left-0 z-20 px-[8%]">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-medium tracking-[0.16em] text-white/90 uppercase">Next</span>
          </div>
          <span className="text-[10px] tracking-wide text-white/70">{malaysiaTrip.dateLabel}</span>
        </div>
        <div className="mt-3 flex gap-1">
          {malaysiaPhotos.map((item, i) => (
            <div key={item.src} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                key={`${item.src}-${i === index ? "on" : "off"}`}
                className={`h-full origin-left bg-white ${i === index ? "phone-photo-progress" : ""}`}
                style={i < index ? { transform: "scaleX(1)" } : i > index ? { transform: "scaleX(0)" } : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 bottom-[6%] left-0 z-20 px-[7%]">
        <p className="text-[10px] tracking-[0.16em] text-white/70 uppercase">{malaysiaPhotos[index].label}</p>
        <h3 className="mt-1.5 font-serif text-[1.7rem] leading-[0.95] text-white md:text-[1.95rem] lg:text-[2.2rem]">
          {malaysiaTrip.name}
        </h3>
        <p className="mt-2 text-[11px] text-white/80 md:text-xs">{malaysiaTrip.duration}</p>
        <DepartureCountdown targetIso={malaysiaTrip.departsAt} variant="phone" />

        <a
          href={malaysiaBookUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-[13px] font-medium text-zinc-900 shadow-lg transition-opacity hover:opacity-90 active:scale-[0.98] md:py-3 md:text-sm"
        >
          Book now
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

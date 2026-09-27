"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const trips = [
  {
    src: "/gallery/web/IMG_2421.jpg",
    place: "Tashkent",
    note: "Discover with Jazora",
  },
  {
    src: "/gallery/web/IMG_2431.jpg",
    place: "Tashkent",
    note: "Under the plane trees",
  },
  {
    src: "/gallery/web/IMG_0503.jpg",
    place: "Canyon day",
    note: "The whole crew showed up",
  },
  {
    src: "/gallery/web/IMG_0519.jpg",
    place: "Alpine winter",
    note: "Snow on the road home",
  },
  {
    src: "/gallery/web/IMG_0549.jpg",
    place: "Autumn park",
    note: "Hands up for the group shot",
  },
  {
    src: "/gallery/web/IMG_0550.jpg",
    place: "City light",
    note: "Sunglasses required",
  },
  {
    src: "/gallery/web/IMG_0551.jpg",
    place: "Lobby meet",
    note: "Ready for the next stop",
  },
  {
    src: "/gallery/web/IMG_0552.jpg",
    place: "The Elements",
    note: "Four hearts, one trip",
  },
]

const SLIDE_MS = 3800
const INSTAGRAM_URL =
  "https://www.instagram.com/mintsulaimani?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="

export function PhoneTripGallery() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % trips.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [paused, index])

  const current = trips[index]

  const goTo = (next: number) => {
    setIndex((next + trips.length) % trips.length)
  }

  return (
    <div
      className="absolute inset-0 bg-zinc-950 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={current.src}
          src={current.src}
          alt={`${current.place} — ${current.note}`}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.7, ease: "easeOut" },
            scale: { duration: SLIDE_MS / 1000, ease: "linear" },
          }}
        />
      </AnimatePresence>

      {/* cinematic overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />

      {/* top chrome — above tap zones so Follow stays clickable */}
      <div className="pointer-events-none absolute left-0 right-0 top-[7.5%] z-40 px-[7%]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            <span className="truncate text-[11px] font-semibold tracking-tight text-white md:text-[12px] lg:text-[13px]">
              mintsulaimani
            </span>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto shrink-0 rounded-[8px] bg-[#0095F6] px-3 py-1.5 text-[11px] font-semibold leading-none text-white shadow-sm transition-colors hover:bg-[#1877F2] md:text-[12px]"
          >
            Follow
          </a>
        </div>

        {/* progress segments */}
        <div className="mt-2.5 flex gap-1">
          {trips.map((_, i) => (
            <div key={i} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full origin-left bg-white"
                style={
                  i < index
                    ? { transform: "scaleX(1)" }
                    : i === index
                      ? {
                          transform: "scaleX(0)",
                          animation: `trip-film-progress ${SLIDE_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }
                      : { transform: "scaleX(0)" }
                }
                key={i === index ? `active-${index}` : `seg-${i}`}
              />
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes trip-film-progress {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }
        `}</style>
      </div>

      {/* tap zones — middle band only, so top Follow + bottom filmstrip stay free */}
      <button
        type="button"
        aria-label="Previous photo"
        className="absolute left-0 top-[18%] z-10 h-[55%] w-1/3 cursor-pointer bg-transparent"
        onClick={() => goTo(index - 1)}
      />
      <button
        type="button"
        aria-label="Next photo"
        className="absolute right-0 top-[18%] z-10 h-[55%] w-1/3 cursor-pointer bg-transparent"
        onClick={() => goTo(index + 1)}
      />

      {/* bottom caption + filmstrip */}
      <div className="absolute bottom-[5.5%] left-0 right-0 z-40 px-[6%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.place + current.note}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="mb-3"
          >
            <p className="font-serif text-[1.35rem] leading-none text-white md:text-[1.55rem] lg:text-[1.85rem]">
              {current.place}
            </p>
            <p className="mt-1.5 text-[10px] tracking-wide text-white/75 md:text-[11px] lg:text-xs">
              {current.note}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1.5 overflow-hidden rounded-xl bg-black/25 p-1.5 backdrop-blur-md ring-1 ring-white/10">
          {trips.map((trip, i) => (
            <button
              key={trip.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${trip.place}`}
              className={`relative h-9 flex-1 overflow-hidden rounded-md transition-all duration-300 md:h-10 lg:h-12 ${
                i === index ? "ring-2 ring-white scale-[1.02]" : "opacity-55 hover:opacity-90"
              }`}
            >
              <img src={trip.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

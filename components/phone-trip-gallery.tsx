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
    src: "/gallery/web/IMG_0563.jpg",
    place: "Iris Hotel",
    note: "Lobby frame, Baku nights",
  },
  {
    src: "/gallery/web/IMG_2431.jpg",
    place: "Tashkent",
    note: "Under the plane trees",
  },
  {
    src: "/gallery/web/IMG_6954.jpg",
    place: "Bridge walk",
    note: "Snow on the cables",
  },
  {
    src: "/gallery/web/IMG_0503.jpg",
    place: "Canyon day",
    note: "The whole crew showed up",
  },
  {
    src: "/gallery/web/IMG_0564.jpg",
    place: "City bloom",
    note: "Roses and ready smiles",
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
const INSTAGRAM_URL = "https://www.instagram.com/jazoraholidays?stkn=ZTVqdmpkNTF2bzU4"

function InstagramSpinner({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-3.5 w-3.5 border-[1.5px]" : "h-9 w-9 border-[2.5px]"
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${dim} animate-spin rounded-full border-white/20 border-t-white`}
    />
  )
}

export function PhoneTripGallery() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [thumbLoaded, setThumbLoaded] = useState<Record<string, boolean>>({})

  const current = trips[index]

  useEffect(() => {
    setLoaded(false)
  }, [current.src])

  // Prefetch neighbors so the spinner is brief on advance
  useEffect(() => {
    const next = trips[(index + 1) % trips.length]
    const prev = trips[(index - 1 + trips.length) % trips.length]
    ;[next.src, prev.src].forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [index])

  useEffect(() => {
    if (paused || !loaded) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % trips.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [paused, index, loaded])

  const goTo = (next: number) => {
    setIndex((next + trips.length) % trips.length)
  }

  return (
    <div
      className="absolute inset-0 select-none bg-zinc-950"
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
          animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1.12 : 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.55, ease: "easeOut" },
            scale: { duration: SLIDE_MS / 1000, ease: "linear" },
          }}
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0) setLoaded(true)
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </AnimatePresence>

      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="ig-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950"
          >
            <InstagramSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />

      <div className="pointer-events-none absolute top-[7.5%] right-0 left-0 z-40 px-[7%]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            <span className="truncate text-[11px] font-semibold tracking-tight text-white md:text-[12px] lg:text-[13px]">
              jazoraholidays
            </span>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto shrink-0 rounded-[8px] bg-[#0095F6] px-3 py-1.5 text-[11px] leading-none font-semibold text-white shadow-sm transition-colors hover:bg-[#1877F2] md:text-[12px]"
          >
            Follow
          </a>
        </div>

        <div className="mt-2.5 flex gap-1">
          {trips.map((_, i) => (
            <div key={i} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full origin-left bg-white"
                style={
                  i < index
                    ? { transform: "scaleX(1)" }
                    : i === index && loaded
                      ? {
                          transform: "scaleX(0)",
                          animation: `trip-film-progress ${SLIDE_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }
                      : { transform: "scaleX(0)" }
                }
                key={i === index ? `active-${index}-${loaded}` : `seg-${i}`}
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

      <button
        type="button"
        aria-label="Previous photo"
        className="absolute top-[18%] left-0 z-10 h-[55%] w-1/3 cursor-pointer bg-transparent"
        onClick={() => goTo(index - 1)}
      />
      <button
        type="button"
        aria-label="Next photo"
        className="absolute top-[18%] right-0 z-10 h-[55%] w-1/3 cursor-pointer bg-transparent"
        onClick={() => goTo(index + 1)}
      />

      <div className="absolute right-0 bottom-[5.5%] left-0 z-40 px-[6%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.place + current.note}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 10 }}
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

        <div className="flex gap-1.5 overflow-hidden rounded-xl bg-black/25 p-1.5 ring-1 ring-white/10 backdrop-blur-md">
          {trips.map((trip, i) => (
            <button
              key={trip.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${trip.place}`}
              className={`relative h-9 flex-1 overflow-hidden rounded-md transition-all duration-300 md:h-10 lg:h-12 ${
                i === index ? "scale-[1.02] ring-2 ring-white" : "opacity-55 hover:opacity-90"
              }`}
            >
              {!thumbLoaded[trip.src] && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
                  <InstagramSpinner size="sm" />
                </div>
              )}
              <img
                src={trip.src}
                alt=""
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  thumbLoaded[trip.src] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() =>
                  setThumbLoaded((prev) => (prev[trip.src] ? prev : { ...prev, [trip.src]: true }))
                }
                onError={() =>
                  setThumbLoaded((prev) => (prev[trip.src] ? prev : { ...prev, [trip.src]: true }))
                }
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

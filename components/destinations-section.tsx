"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const WHATSAPP_URL = "https://wa.me/971588409478"
const IMG_V = "v5"
const PHOTO_MS = 4200
const COUNTRY_MS = 16000

type Destination = {
  id: string
  name: string
  line: string
  season: string
  duration: string
  images: string[]
}

const destinations: Destination[] = [
  {
    id: "armenia",
    name: "Armenia",
    line: "Monasteries on cliffs, apricot orchards, and Yerevan at dusk.",
    season: "May–October",
    duration: "6–9 days",
    images: [
      "/trips/armenia/02.jpg",
      "/trips/armenia/web/01.jpg",
      "/trips/armenia/01.jpg",
      "/trips/armenia/04.jpg",
      "/trips/armenia/web/02.jpg",
      "/trips/armenia/13.jpg",
      "/trips/armenia/web/03.jpg",
      "/trips/armenia/06.jpg",
    ],
  },
  {
    id: "azerbaijan",
    name: "Azerbaijan",
    line: "Flame towers, Caspian light, and mountain villages inland.",
    season: "April–November",
    duration: "6–8 days",
    images: [
      "/trips/azerbaijan/web/01.jpg",
      "/trips/azerbaijan/01.jpg",
      "/trips/azerbaijan/05.jpg",
      "/trips/azerbaijan/web/02.jpg",
      "/trips/azerbaijan/02.jpg",
      "/trips/azerbaijan/08.jpg",
      "/trips/azerbaijan/web/03.jpg",
      "/trips/azerbaijan/04.jpg",
    ],
  },
  {
    id: "georgia",
    name: "Georgia",
    line: "Wine valleys, Caucasus ridges, and long tables in Tbilisi.",
    season: "April–October",
    duration: "7–10 days",
    images: [
      "/trips/georgia/03.jpg",
      "/trips/georgia/web/01.jpg",
      "/trips/georgia/07.jpg",
      "/trips/georgia/web/02.jpg",
      "/trips/georgia/02.jpg",
      "/trips/georgia/08.jpg",
      "/trips/georgia/web/03.jpg",
      "/trips/georgia/05.jpg",
    ],
  },
  {
    id: "kyrgyzstan",
    name: "Kyrgyzstan",
    line: "Alpine lakes, yurt nights, and open sky on the Silk Road.",
    season: "June–September",
    duration: "7–10 days",
    images: [
      "/trips/kyrgyzstan/01.jpg",
      "/trips/kyrgyzstan/web/01.jpg",
      "/trips/kyrgyzstan/02.jpg",
      "/trips/kyrgyzstan/03.jpg",
      "/trips/kyrgyzstan/web/02.jpg",
      "/trips/kyrgyzstan/04.jpg",
      "/trips/kyrgyzstan/web/03.jpg",
      "/trips/kyrgyzstan/05.jpg",
    ],
  },
  {
    id: "thailand",
    name: "Thailand",
    line: "Temple mornings, long-tail boats, and warm island evenings.",
    season: "November–April",
    duration: "7–9 days",
    images: [
      "/trips/thailand/web/01.jpg",
      "/trips/thailand/01.jpg",
      "/trips/thailand/02.jpg",
      "/trips/thailand/web/02.jpg",
      "/trips/thailand/03.jpg",
      "/trips/thailand/web/03.jpg",
      "/trips/thailand/04.jpg",
      "/trips/thailand/05.jpg",
    ],
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    line: "Blue domes, desert caravanserais, and Samarkand at golden hour.",
    season: "April–June & September–October",
    duration: "7–10 days",
    images: [
      "/trips/uzbekistan/01.jpg",
      "/trips/uzbekistan/web/01.jpg",
      "/trips/uzbekistan/02.jpg",
      "/trips/uzbekistan/web/02.jpg",
      "/trips/uzbekistan/03.jpg",
      "/trips/uzbekistan/04.jpg",
      "/trips/uzbekistan/web/03.jpg",
      "/trips/uzbekistan/05.jpg",
    ],
  },
]

const src = (path: string) => `${path}?${IMG_V}`

export function DestinationsSection() {
  const [activeId, setActiveId] = useState(destinations[0].id)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loadedPaths, setLoadedPaths] = useState<Set<string>>(() => new Set())
  const stripRef = useRef<HTMLDivElement>(null)

  const active = destinations.find((d) => d.id === activeId) ?? destinations[0]
  const photo = active.images[photoIndex % active.images.length]
  const photoReady = loadedPaths.has(photo)

  const markLoaded = useCallback((path: string) => {
    setLoadedPaths((prev) => {
      if (prev.has(path)) return prev
      const next = new Set(prev)
      next.add(path)
      return next
    })
  }, [])

  useEffect(() => {
    setPhotoIndex(0)
  }, [activeId])

  // Prefetch next few frames of active destination
  useEffect(() => {
    active.images.slice(0, 4).forEach((path) => {
      const img = new window.Image()
      img.src = src(path)
      img.onload = () => markLoaded(path)
      img.onerror = () => markLoaded(path)
    })
  }, [active.images, markLoaded])

  useEffect(() => {
    if (paused || !photoReady) return
    const id = window.setTimeout(() => {
      setPhotoIndex((i) => (i + 1) % active.images.length)
    }, PHOTO_MS)
    return () => window.clearTimeout(id)
  }, [paused, photoReady, photoIndex, active.images.length])

  useEffect(() => {
    if (paused || !photoReady) return
    const id = window.setTimeout(() => {
      setActiveId((current) => {
        const index = destinations.findIndex((d) => d.id === current)
        return destinations[(index + 1) % destinations.length].id
      })
    }, COUNTRY_MS)
    return () => window.clearTimeout(id)
  }, [paused, photoReady, activeId])

  const goCountry = (dir: -1 | 1) => {
    const index = destinations.findIndex((d) => d.id === activeId)
    const next = destinations[(index + dir + destinations.length) % destinations.length]
    setActiveId(next.id)
  }

  const selectCountry = (id: string) => {
    setActiveId(id)
    const el = stripRef.current
    if (!el) return
    const btn = el.querySelector<HTMLElement>(`[data-dest="${id}"]`)
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }

  return (
    <section id="destinations" className="relative overflow-hidden bg-zinc-950 py-16 text-white sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl font-normal text-balance sm:text-4xl md:text-5xl">
              Destinations we lead
            </h2>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous destination"
              onClick={() => goCountry(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next destination"
              onClick={() => goCountry(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Destinations"
          className="mb-8 flex gap-1 overflow-x-auto border-b border-white/15 pb-px md:mb-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {destinations.map((dest) => {
            const isActive = dest.id === activeId
            return (
              <button
                key={dest.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectCountry(dest.id)}
                className={cn(
                  "relative shrink-0 px-3 py-3 text-sm transition-colors sm:px-4 md:px-5 md:text-base",
                  isActive ? "text-white" : "text-white/45 hover:text-white/80",
                )}
              >
                {dest.name}
                {isActive && (
                  <motion.span
                    layoutId="destination-tab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cinematic stage */}
      <div
        className="relative mx-auto max-w-7xl px-5 sm:px-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] md:aspect-[21/10] md:min-h-[520px]">
          {!photoReady && <Skeleton className="absolute inset-0 z-[1] h-full w-full rounded-none bg-zinc-800" />}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${active.id}-${photo}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={src(photo)}
                alt={`${active.name} destination`}
                fill
                priority
                sizes="100vw"
                className={cn("object-cover", photoReady ? "opacity-100" : "opacity-0")}
                onLoad={() => markLoaded(photo)}
                onError={() => markLoaded(photo)}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                className="max-w-2xl"
              >
                <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-white/65 uppercase sm:text-xs">
                  {active.season} · {active.duration}
                </p>
                <h3 className="font-serif text-4xl leading-[0.95] font-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  {active.name}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base md:text-lg">
                  {active.line}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0 overflow-hidden rounded-full bg-white py-1.5 pr-1.5 pl-5 text-zinc-900 transition-opacity hover:opacity-90"
                  >
                    <span className="pr-3 text-sm font-medium">Ask about this route</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>

                  <div className="flex items-center gap-1.5" aria-hidden>
                    {active.images.map((path, i) => (
                      <button
                        key={path}
                        type="button"
                        aria-label={`Show photo ${i + 1}`}
                        onClick={() => setPhotoIndex(i)}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          i === photoIndex % active.images.length
                            ? "w-7 bg-white"
                            : "w-1.5 bg-white/35 hover:bg-white/60",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Destination strip */}
      <div className="mx-auto mt-6 max-w-7xl px-5 sm:mt-8 sm:px-6">
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {destinations.map((dest) => {
            const isActive = dest.id === activeId
            const thumb = dest.images[0]
            return (
              <button
                key={dest.id}
                type="button"
                data-dest={dest.id}
                onClick={() => selectCountry(dest.id)}
                aria-pressed={isActive}
                className={cn(
                  "group relative h-28 w-[42vw] shrink-0 overflow-hidden transition-all duration-300 sm:h-32 sm:w-44 md:w-48",
                  isActive ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={src(thumb)}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onLoad={() => markLoaded(thumb)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-left font-serif text-lg text-white sm:text-xl">
                  {dest.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

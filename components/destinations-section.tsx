"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const WHATSAPP_URL = "https://wa.me/971588409478"
const IMG_V = "v2"
const FEATURED_MS = 3000
const COUNTRY_MS = 14000

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
      "/trips/armenia/01.jpg",
      "/trips/armenia/04.jpg",
      "/trips/armenia/13.jpg",
      "/trips/armenia/06.jpg",
      "/trips/armenia/03.jpg",
      "/trips/armenia/05.jpg",
      "/trips/armenia/07.jpg",
      "/trips/armenia/08.jpg",
      "/trips/armenia/09.jpg",
      "/trips/armenia/10.jpg",
      "/trips/armenia/11.jpg",
      "/trips/armenia/12.jpg",
      "/trips/armenia/14.jpg",
      "/trips/armenia/15.jpg",
      "/trips/armenia/16.jpg",
      "/trips/armenia/17.jpg",
      "/trips/armenia/18.jpg",
      "/trips/armenia/19.jpg",
      "/trips/armenia/20.jpg",
    ],
  },
  {
    id: "azerbaijan",
    name: "Azerbaijan",
    line: "Flame towers, Caspian light, and mountain villages inland.",
    season: "April–November",
    duration: "6–8 days",
    images: [
      "/trips/azerbaijan/01.jpg",
      "/trips/azerbaijan/05.jpg",
      "/trips/azerbaijan/02.jpg",
      "/trips/azerbaijan/08.jpg",
      "/trips/azerbaijan/04.jpg",
      "/trips/azerbaijan/03.jpg",
      "/trips/azerbaijan/06.jpg",
      "/trips/azerbaijan/07.jpg",
      "/trips/azerbaijan/09.jpg",
      "/trips/azerbaijan/10.jpg",
      "/trips/azerbaijan/11.jpg",
      "/trips/azerbaijan/12.jpg",
      "/trips/azerbaijan/13.jpg",
      "/trips/azerbaijan/14.jpg",
      "/trips/azerbaijan/15.jpg",
      "/trips/azerbaijan/16.jpg",
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
      "/trips/georgia/07.jpg",
      "/trips/georgia/02.jpg",
      "/trips/georgia/08.jpg",
      "/trips/georgia/05.jpg",
      "/trips/georgia/01.jpg",
      "/trips/georgia/04.jpg",
      "/trips/georgia/06.jpg",
      "/trips/georgia/09.jpg",
      "/trips/georgia/10.jpg",
      "/trips/georgia/11.jpg",
      "/trips/georgia/12.jpg",
      "/trips/georgia/13.jpg",
    ],
  },
]

const src = (path: string) => `${path}?${IMG_V}`

function DestinationImage({
  path,
  alt,
  className,
  sizes,
  priority,
  loaded,
  onLoaded,
}: {
  path: string
  alt: string
  className?: string
  sizes: string
  priority?: boolean
  loaded: boolean
  onLoaded: (path: string) => void
}) {
  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 z-[1] h-full w-full rounded-none" />}
      <Image
        src={src(path)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={() => onLoaded(path)}
        onError={() => onLoaded(path)}
      />
    </>
  )
}

export function DestinationsSection() {
  const [activeId, setActiveId] = useState(destinations[0].id)
  const [paused, setPaused] = useState(false)
  const [galleryPaused, setGalleryPaused] = useState(false)
  const [loadedPaths, setLoadedPaths] = useState<Set<string>>(() => new Set())
  const active = destinations.find((d) => d.id === activeId) ?? destinations[0]
  const [featured, setFeatured] = useState(active.images[0])

  useEffect(() => {
    setFeatured(active.images[0])
  }, [active.id, active.images])

  const markLoaded = useCallback((path: string) => {
    setLoadedPaths((prev) => {
      if (prev.has(path)) return prev
      const next = new Set(prev)
      next.add(path)
      return next
    })
  }, [])

  const isLoaded = useCallback((path: string) => loadedPaths.has(path), [loadedPaths])

  const supporting = useMemo(
    () => active.images.filter((path) => path !== featured),
    [active.images, featured],
  )
  const mosaic = useMemo(() => supporting.slice(0, 4), [supporting])
  const filmstrip = useMemo(() => supporting.slice(4), [supporting])

  const featuredReady = loadedPaths.has(featured)
  const destinationSeedReady = active.images.slice(0, 4).every((path) => loadedPaths.has(path))

  // Cycle the main photo every few seconds
  useEffect(() => {
    if (paused || galleryPaused || !featuredReady) return
    const id = window.setTimeout(() => {
      setFeatured((current) => {
        const imgs = active.images
        const index = imgs.indexOf(current)
        const next = imgs[(index + 1 + imgs.length) % imgs.length]
        return next
      })
    }, FEATURED_MS)
    return () => window.clearTimeout(id)
  }, [paused, galleryPaused, featuredReady, featured, active.images])

  // Country tabs advance more slowly so photos can cycle
  useEffect(() => {
    if (paused || !destinationSeedReady) return
    const id = window.setTimeout(() => {
      setActiveId((current) => {
        const index = destinations.findIndex((d) => d.id === current)
        return destinations[(index + 1) % destinations.length].id
      })
    }, COUNTRY_MS)
    return () => window.clearTimeout(id)
  }, [paused, destinationSeedReady, activeId])

  const resumeTimerRef = useRef<number | null>(null)

  const selectFeatured = (path: string) => {
    setFeatured(path)
    setGalleryPaused(true)
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = window.setTimeout(() => {
      setGalleryPaused(false)
      resumeTimerRef.current = null
    }, FEATURED_MS * 2)
  }

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    }
  }, [])

  return (
    <section id="destinations" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute top-1/2 left-0 right-0 z-0 flex -translate-y-1/2 justify-center">
        <span className="whitespace-nowrap text-center text-[18vw] font-bold leading-none tracking-tighter text-zinc-100 sm:text-[16vw] md:text-[14vw]">
          ROUTES
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 max-w-2xl md:mb-14"
        >
          <p className="mb-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">From the road</p>
          <h2 className="mb-4 font-serif text-4xl font-normal text-balance md:text-5xl">
            Georgia, Armenia, Azerbaijan
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Real frames from trips we design and lead across the Caucasus — not stock, not staged.
          </p>
        </motion.div>

        <div
          role="tablist"
          aria-label="Destinations"
          className="mb-8 flex gap-1 overflow-x-auto border-b border-border pb-px md:mb-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false)
            }
          }}
        >
          {destinations.map((dest) => {
            const isActive = dest.id === activeId
            return (
              <button
                key={dest.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(dest.id)}
                className={`relative shrink-0 px-4 py-3 text-sm transition-colors md:px-5 md:text-base ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {dest.name}
                {isActive && (
                  <motion.span
                    layoutId="destination-tab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl">{active.name}</h3>
                <p className="mt-2 max-w-md text-muted-foreground">{active.line}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span>{active.season}</span>
                <span className="hidden text-border sm:inline">|</span>
                <span>{active.duration}</span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground transition-opacity hover:opacity-70"
                >
                  Ask about this route
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Editorial mosaic — desktop */}
            <div
              className="mb-4 hidden h-[560px] gap-3 md:grid md:grid-cols-12 md:grid-rows-2"
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
            >
              <div className="relative col-span-5 row-span-2 overflow-hidden bg-zinc-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <DestinationImage
                      path={featured}
                      alt={`${active.name} trip`}
                      sizes="40vw"
                      priority
                      loaded={isLoaded(featured)}
                      onLoaded={markLoaded}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {mosaic[0] && (
                <button
                  type="button"
                  onClick={() => selectFeatured(mosaic[0])}
                  className="group relative col-span-7 overflow-hidden bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                >
                  <DestinationImage
                    path={mosaic[0]}
                    alt={`${active.name} landscape`}
                    sizes="50vw"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                    loaded={isLoaded(mosaic[0])}
                    onLoaded={markLoaded}
                  />
                </button>
              )}
              <div className="col-span-7 grid min-h-0 grid-cols-3 gap-3">
                {mosaic.slice(1, 4).map((path, i) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => selectFeatured(path)}
                    className="group relative min-h-0 overflow-hidden bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  >
                    <DestinationImage
                      path={path}
                      alt={`${active.name} moment ${i + 2}`}
                      sizes="20vw"
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                      loaded={isLoaded(path)}
                      onLoaded={markLoaded}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: cover + snap filmstrip */}
            <div
              className="md:hidden"
              onTouchStart={() => setGalleryPaused(true)}
              onTouchEnd={() => setGalleryPaused(false)}
            >
              <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <DestinationImage
                      path={featured}
                      alt={`${active.name} trip`}
                      sizes="100vw"
                      priority
                      loaded={isLoaded(featured)}
                      onLoaded={markLoaded}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="-mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {active.images.map((path, i) => {
                  const isSelected = path === featured
                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => selectFeatured(path)}
                      aria-pressed={isSelected}
                      className={cn(
                        "relative h-48 w-[38vw] shrink-0 snap-start overflow-hidden bg-zinc-100 ring-offset-2 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                        isSelected ? "ring-2 ring-foreground opacity-100" : "opacity-80",
                      )}
                    >
                      <DestinationImage
                        path={path}
                        alt={`${active.name} ${i + 1}`}
                        sizes="40vw"
                        loaded={isLoaded(path)}
                        onLoaded={markLoaded}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Desktop filmstrip of remaining frames */}
            {filmstrip.length > 0 && (
              <div className="mt-3 hidden gap-3 overflow-x-auto pb-1 md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filmstrip.map((path, i) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => selectFeatured(path)}
                    className="group relative h-36 w-28 shrink-0 overflow-hidden bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground sm:h-40 sm:w-32"
                  >
                    <DestinationImage
                      path={path}
                      alt={`${active.name} gallery ${i + 6}`}
                      sizes="128px"
                      className="transition-transform duration-500 group-hover:scale-105"
                      loaded={isLoaded(path)}
                      onLoaded={markLoaded}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

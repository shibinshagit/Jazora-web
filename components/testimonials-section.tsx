"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const stories = [
  {
    quote: "Jazora handled the trains, the ryokan, and a guide who actually knew the back streets of Kyoto.",
    name: "Marie Dupont",
    trip: "Japan in Spring",
    year: "2025",
    image: "/trips/georgia/01.jpg?v2",
  },
  {
    quote: "I never had to chase a transfer. Someone from the trip was waiting every time we landed.",
    name: "Thomas Martin",
    trip: "Georgia Highlands",
    year: "2025",
    image: "/trips/georgia/04.jpg?v2",
  },
  {
    quote: "The route felt considered, and the local team knew when the weather was about to turn.",
    name: "Sophie Bernard",
    trip: "Armenia Heritage",
    year: "2026",
    image: "/trips/armenia/07.jpg?v2",
  },
  {
    quote: "Eight days on the coast, and the only thing I booked myself was dinner on the free evening.",
    name: "Lucas Petit",
    trip: "Amalfi Coast",
    year: "2025",
    image: "/trips/azerbaijan/03.jpg?v2",
  },
  {
    quote: "Private where it mattered, guided where we would have gotten lost. Exactly the pace we wanted.",
    name: "Emma Laurent",
    trip: "Caucasus Triangle",
    year: "2026",
    image: "/trips/armenia/19.jpg?v2",
  },
  {
    quote: "Rail passes, hotels, and the boat were already in the itinerary. We just showed up.",
    name: "Antoine Rousseau",
    trip: "Swiss Lakes",
    year: "2025",
    image: "/trips/azerbaijan/13.jpg?v2",
  },
]

const ROTATE_MS = 7000

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const story = stories[index]

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % stories.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused])

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + stories.length) % stories.length)
  }

  return (
    <section id="testimonials" className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="whitespace-nowrap text-center text-[20vw] font-bold leading-none tracking-tighter text-zinc-100 sm:text-[16vw] md:text-[14vw]">
          NOTES
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="mb-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">From travellers</p>
          <h2 className="font-serif text-4xl font-normal text-balance md:text-5xl">Notes from recent trips</h2>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false)
            }
          }}
        >
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center sm:min-h-[300px] md:min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={story.name + story.trip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex max-w-3xl flex-col items-center"
              >
                <Avatar className="mb-6 size-16 ring-1 ring-border sm:mb-8 sm:size-20">
                  <AvatarImage src={story.image} alt={story.name} className="object-cover" />
                  <AvatarFallback className="bg-zinc-100 text-muted-foreground">
                    <User className="size-7 sm:size-8" strokeWidth={1.5} />
                  </AvatarFallback>
                </Avatar>

                <p className="font-serif text-2xl leading-snug text-foreground text-balance sm:text-3xl md:text-4xl md:leading-snug">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <footer className="mt-8 md:mt-10">
                  <cite className="flex flex-col items-center not-italic">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                      {story.name}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {story.trip}
                      <span className="mx-2 text-border">·</span>
                      {story.year}
                    </span>
                  </cite>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 md:mt-10">
            <button
              type="button"
              aria-label="Previous story"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Stories">
              {stories.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show story from ${item.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-foreground" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next story"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-zinc-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

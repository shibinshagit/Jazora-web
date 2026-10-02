"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, User } from "lucide-react"

const stories = [
  {
    quote:
      "From a close friend to my trusted travel advisor — we've travelled together from mountains to the sea, snowy escapes to endless road trips. Now I know I'm in the safest hands for every journey ahead.",
    name: "Flaimy Francis",
    image: "/notes/flaimy-francis.jpg",
  },
  {
    quote:
      "Some journeys are not measured by the miles we travel, but by the memories we create, the laughter we share, and the love we carry in our hearts. Thank you, Jazeera, for inspiring these beautiful thoughts and for giving us a journey filled with wonderful moments and precious memories.",
    name: "Jessy Roy",
    image: "/notes/jessy-roy.jpg",
  },
  {
    quote:
      "From one destination to another, we collected stories, laughter, cra that last forever moments & memories.",
    name: "Sajna Afsal",
    image: "/notes/sajna-afsal.jpg",
  },
  {
    quote:
      "From being part of her very first ladies' trip to sharing 10 unforgettable international journeys, what a beautiful journey it has been! What started as a trip became a special friendship filled with memories, laughter, and endless adventures. Here's to many more!",
    name: "Sheeba Nazer",
    image: "/notes/sheeba-nazer.jpg",
  },
  {
    quote:
      "The world is full of beautiful places, but the sweetest memories are made with the right people and the perfect journey! Some journeys take us to beautiful destinations, while some create beautiful memories that stay in our hearts forever. With excitement in our hearts and dreams in our eyes, we begin another wonderful international journey with Jazeera!",
    name: "Simna Sadick",
    image: "/notes/simna-sadick.jpg",
  },
  {
    quote:
      "My first ladies' trip with Jazeera to Georgia — a journey that filled my heart with laughter, love, and memories I'll hold onto forever. Some moments simply become a part of you.",
    name: "Starly Shibu",
    image: "/notes/starly-shibu.jpg",
  },
  {
    quote:
      "A trip full of emotions and memories. ❤️ Every trip gives us a new story, but this one made our friendship even stronger. 🥹🫶",
    name: "Shaeema",
    image: "/notes/shaeema.jpg",
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
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex max-w-3xl flex-col items-center"
              >
                <div className="relative mb-6 size-16 overflow-hidden rounded-full ring-1 ring-border sm:mb-8 sm:size-20">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>

                <p className="font-serif text-2xl leading-snug text-foreground text-balance sm:text-3xl md:text-4xl md:leading-snug">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <footer className="mt-8 md:mt-10">
                  <cite className="flex flex-col items-center not-italic">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                      {story.name}
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

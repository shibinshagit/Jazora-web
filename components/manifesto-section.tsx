"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const marqueeLines = [
  "Your Passport to Possibilities",
  "Find Your Next Somewhere",
  "More Than a Trip",
  "Your Journey. Your Story",
]

const promises = [
  {
    line: "Where Journeys Become Memories",
    note: "Every route is built to be felt — not just checked off.",
    tone: "bg-[#f4f1ea] text-foreground",
  },
  {
    line: "Your World. Our Expertise.",
    note: "Local knowledge, global standards, one desk with you.",
    tone: "bg-[#e7eee8] text-foreground",
  },
  {
    line: "Travel Beyond Expectations",
    note: "The quiet details that turn a trip into a story.",
    tone: "bg-[#e8eef2] text-foreground",
  },
  {
    line: "Dream. Travel. Discover.",
    note: "From the first idea to the flight home — we stay with it.",
    tone: "bg-[#efe9e2] text-foreground",
  },
  {
    line: "More Places. More Memories.",
    note: "New corridors, same care — always led, never left alone.",
    tone: "bg-[#e5ebe6] text-foreground",
  },
]

function StackCard({
  promise,
  index,
  total,
}: {
  promise: (typeof promises)[number]
  index: number
  total: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const number = String(index + 1).padStart(2, "0")

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        top: `calc(5.25rem + ${index * 0.55}rem)`,
        zIndex: index + 1,
      }}
      className="sticky origin-top"
    >
      <article
        className={`relative overflow-hidden rounded-[1.5rem] px-6 py-8 ring-1 ring-black/[0.06] sm:rounded-[1.75rem] sm:px-10 sm:py-10 md:px-12 md:py-12 ${promise.tone}`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-3 font-serif text-[5.5rem] leading-none tracking-tighter text-foreground/[0.06] sm:text-[7rem] md:text-[8.5rem]"
        >
          {number}
        </span>

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
            <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/50 uppercase">
              Promise {number}
            </p>
            <p className="font-mono text-[11px] tracking-[0.2em] text-foreground/35 tabular-nums">
              {number} / {String(total).padStart(2, "0")}
            </p>
          </div>

          <h3 className="max-w-xl font-serif text-[1.65rem] leading-[1.15] tracking-tight text-balance sm:text-3xl md:text-4xl">
            {promise.line}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60 sm:mt-4 sm:text-[0.95rem]">
            {promise.note}
          </p>
        </div>
      </article>
    </motion.div>
  )
}

export function ManifestoSection() {
  const loop = [...marqueeLines, ...marqueeLines]

  return (
    <section id="manifesto" className="relative bg-background pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-24 z-0 flex justify-center md:top-28">
        <span className="whitespace-nowrap text-center text-[16vw] font-bold leading-none tracking-tighter text-zinc-100 md:text-[11vw]">
          STORY
        </span>
      </div>

      <div className="relative z-10 mb-12 md:mb-16">
        <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <motion.div
            className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 md:gap-16 md:pr-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          >
            {loop.map((line, i) => (
              <span key={`${line}-${i}`} className="flex items-center gap-10 md:gap-16">
                <span className="font-serif text-2xl text-foreground/80 md:text-4xl lg:text-5xl">
                  {line}
                </span>
                <span className="text-muted-foreground/50" aria-hidden>
                  —
                </span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10"
        >
          <p className="mb-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">
            How we see travel
          </p>
          <h2 className="max-w-lg font-serif text-3xl font-normal text-balance md:text-5xl">
            Five promises we keep on every route
          </h2>
        </motion.div>
      </div>

      {/* Tight stack — only a small gap between cards in document flow */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-3 px-5 sm:gap-4 sm:px-6">
        {promises.map((promise, index) => (
          <StackCard
            key={promise.line}
            promise={promise}
            index={index}
            total={promises.length}
          />
        ))}
      </div>
    </section>
  )
}

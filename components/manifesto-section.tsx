"use client"

import { motion } from "framer-motion"

const marqueeLines = [
  "Your Passport to Possibilities",
  "Find Your Next Somewhere",
  "More Than a Trip",
  "Your Journey. Your Story",
]

const promises = [
  "Where Journeys Become Memories",
  "Your World. Our Expertise.",
  "Travel Beyond Expectations",
  "Dream. Travel. Discover.",
  "More Places. More Memories.",
]

export function ManifestoSection() {
  const loop = [...marqueeLines, ...marqueeLines]

  return (
    <section id="manifesto" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 z-0 flex -translate-y-1/2 justify-center">
        <span className="whitespace-nowrap text-center text-[16vw] font-bold leading-none tracking-tighter text-zinc-100 md:text-[12vw]">
          STORY
        </span>
      </div>

      <div className="relative z-10 mb-16 md:mb-24">
        <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <motion.div
            className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 md:gap-16 md:pr-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          >
            {loop.map((line, i) => (
              <span key={`${line}-${i}`} className="flex items-center gap-10 md:gap-16">
                <span className="font-serif text-2xl text-foreground/80 md:text-4xl lg:text-5xl">{line}</span>
                <span className="text-muted-foreground/50" aria-hidden>
                  —
                </span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-sm tracking-[0.2em] text-muted-foreground uppercase md:mb-14"
        >
          How we see travel
        </motion.p>

        <ol className="space-y-0">
          {promises.map((line, index) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="group flex items-baseline gap-5 border-t border-border py-6 last:border-b md:gap-10 md:py-8"
            >
              <span className="w-8 shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-foreground/70 md:text-3xl lg:text-4xl">
                {line}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

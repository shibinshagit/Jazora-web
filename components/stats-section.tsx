"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const INSTAGRAM_URL = "https://www.instagram.com/mintsulaimani"

const stats = [
  {
    id: "countries",
    value: 24,
    suffix: "",
    label: "Countries",
    note: "Routes designed and led across continents",
  },
  {
    id: "followers",
    value: 157,
    suffix: "K+",
    label: "Followers",
    note: "People following the journeys on Instagram",
    href: INSTAGRAM_URL,
  },
  {
    id: "community",
    value: 3,
    suffix: "K+",
    label: "Community",
    note: "Travellers who have walked the routes with us",
    href: "https://www.instagram.com/whs.uae/",
  },
] as const

function CountUp({
  value,
  suffix,
  active,
}: {
  value: number
  suffix: string
  active: boolean
}) {
  const [count, setCount] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!active) return
    if (doneRef.current) {
      setCount(value)
      return
    }

    const duration = 1100
    let startTime: number | undefined
    let frame = 0

    const tick = (now: number) => {
      if (startTime === undefined) startTime = now
      const t = Math.min(1, (now - startTime) / duration)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(ease * value))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        doneRef.current = true
        setCount(value)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value])

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <section
      id="stats-section"
      ref={ref}
      className="relative overflow-hidden bg-zinc-950 py-20 text-white sm:py-24 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(255,255,255,0.05), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-medium tracking-[0.22em] text-white/45 uppercase sm:text-xs">
            The road so far
          </p>
          <h2 className="mt-3 font-serif text-3xl font-normal text-balance sm:text-4xl md:text-5xl">
            Numbers that travel with us
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-white/15 pt-10 sm:mt-16 sm:grid-cols-3 sm:gap-0 sm:pt-14 md:mt-20">
          {stats.map((stat, index) => {
            const content = (
              <>
                <p className="text-[11px] tracking-[0.22em] text-white/45 uppercase sm:text-xs">
                  {stat.label}
                </p>
                <p className="mt-3 font-serif text-6xl leading-none tracking-tight text-white sm:text-7xl md:text-8xl">
                  <CountUp value={stat.value} suffix={stat.suffix} active={inView} />
                </p>
                <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-white/55 sm:mt-5">
                  {stat.note}
                </p>
                {"href" in stat && stat.href && (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors group-hover:text-white">
                    Follow on Instagram
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </>
            )

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.55,
                  delay: 0.12 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={
                  index > 0
                    ? "sm:border-l sm:border-white/15 sm:pl-8 md:pl-12 lg:pl-14"
                    : "sm:pr-8 md:pr-12 lg:pr-14"
                }
              >
                {"href" in stat && stat.href ? (
                  <a
                    href={stat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

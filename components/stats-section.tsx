"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

const INSTAGRAM_URL = "https://www.instagram.com/jazoraholidays?stkn=ZTVqdmpkNTF2bzU4"

type Milestone =
  | { id: string; kind: "intro"; eyebrow: string; title: string; line: string }
  | {
      id: string
      kind: "stat"
      value: number
      suffix: string
      label: string
      note: string
      href?: string
    }

const milestones: Milestone[] = [
  {
    id: "intro",
    kind: "intro",
    eyebrow: "The road so far",
    title: "Numbers that travel with us",
    line: "A few markers from the routes we design and lead.",
  },
  {
    id: "countries",
    kind: "stat",
    value: 24,
    suffix: "",
    label: "Countries",
    note: "Routes designed and led across continents",
  },
  {
    id: "followers",
    kind: "stat",
    value: 157,
    suffix: "K+",
    label: "Followers",
    note: "People following the journeys on Instagram",
    href: INSTAGRAM_URL,
  },
  {
    id: "community",
    kind: "stat",
    value: 2,
    suffix: "K+",
    label: "Community",
    note: "Travellers who have walked the routes with us",
  },
]

/** Even ranges across the scrub, with a short hold on the last milestone */
function rangeFor(index: number, total: number) {
  const travel = 0.88
  const start = (index / total) * travel
  const end = ((index + 1) / total) * travel
  return { start, end, mid: (start + end) / 2 }
}

function usePanelMotion(scrollYProgress: MotionValue<number>, index: number, total: number) {
  const { start, end } = rangeFor(index, total)
  const fadeIn = start
  const solid = start + (end - start) * 0.22
  const fadeOut = end - (end - start) * 0.18
  const gone = end

  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, solid, fadeOut, gone],
    index === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  )
  const y = useTransform(
    scrollYProgress,
    [fadeIn, solid, fadeOut, gone],
    index === total - 1 ? [48, 0, 0, 0] : [48, 0, 0, -36],
  )
  const scale = useTransform(
    scrollYProgress,
    [fadeIn, solid, fadeOut, gone],
    index === total - 1 ? [0.94, 1, 1, 1] : [0.94, 1, 1, 0.97],
  )
  const blur = useTransform(
    scrollYProgress,
    [fadeIn, solid, fadeOut, gone],
    index === total - 1 ? [8, 0, 0, 0] : [8, 0, 0, 6],
  )
  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  return { opacity, y, scale, filter }
}

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

    const duration = 900
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

function MilestoneLayer({
  milestone,
  index,
  total,
  active,
  scrollYProgress,
}: {
  milestone: Milestone
  index: number
  total: number
  active: boolean
  scrollYProgress: MotionValue<number>
}) {
  const { opacity, y, scale, filter } = usePanelMotion(scrollYProgress, index, total)

  return (
    <motion.div
      style={{ opacity, y, scale, filter }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-8"
      aria-hidden={!active}
    >
      <div
        className={`mx-auto w-full max-w-3xl text-center ${active ? "pointer-events-auto" : ""}`}
      >
        {milestone.kind === "intro" ? (
          <>
            <p className="mb-4 text-xs tracking-[0.22em] text-muted-foreground uppercase">
              {milestone.eyebrow}
            </p>
            <h2 className="font-serif text-4xl font-normal leading-[1.08] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              {milestone.title}
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:text-lg">
              {milestone.line}
            </p>
          </>
        ) : (
          <>
            <p className="font-mono text-xs tracking-[0.28em] text-muted-foreground uppercase">
              {milestone.label}
            </p>
            <p className="mt-3 font-serif text-[26vw] leading-none tracking-tight text-foreground sm:text-[18vw] md:text-[12vw] lg:text-[9.5rem]">
              <CountUp value={milestone.value} suffix={milestone.suffix} active={active} />
            </p>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
              {milestone.note}
            </p>
            {milestone.href && (
              <a
                href={milestone.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex border-b border-foreground pb-0.5 text-sm text-foreground transition-opacity hover:opacity-70"
              >
                Follow on Instagram
              </a>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const total = milestones.length

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const progressBar = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 36,
    restDelta: 0.001,
  })

  // Atmosphere drifts gently with scroll — no sideways content scrub
  const mapX = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"])
  const ridgeX = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"])
  const farRidgeX = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"])
  const skyShift = useTransform(scrollYProgress, [0, 1], [0, 24])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let next = 0
    for (let i = 0; i < total; i++) {
      const { start, end } = rangeFor(i, total)
      if (latest >= start && latest < end) {
        next = i
        break
      }
      if (latest >= 0.88) next = total - 1
    }
    setActiveIndex(next)
  })

  return (
    <section
      id="stats-section"
      ref={containerRef}
      className="relative"
      style={{ height: `${total * 95 + 40}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            y: skyShift,
            background: `
              linear-gradient(
                180deg,
                #d9e4ec 0%,
                #e8eef2 28%,
                #f0efe9 58%,
                #e5e0d6 78%,
                #d8d2c6 100%
              )
            `,
          }}
        />

        <motion.div
          aria-hidden
          style={{ x: mapX }}
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
        >
          <div
            className="h-full w-[140%]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(40,50,45,0.09) 1px, transparent 1px),
                linear-gradient(90deg, rgba(40,50,45,0.09) 1px, transparent 1px)
              `,
              backgroundSize: "72px 48px",
            }}
          />
        </motion.div>

        <motion.div
          aria-hidden
          style={{ x: farRidgeX }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] opacity-40"
        >
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="h-full w-[130%] text-[#b7c0c4]"
          >
            <path
              fill="currentColor"
              d="M0 320V180L160 120L320 200L480 80L640 160L800 60L960 140L1120 90L1280 170L1440 100V320H0Z"
            />
          </svg>
        </motion.div>

        <motion.div
          aria-hidden
          style={{ x: ridgeX }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] opacity-55"
        >
          <svg
            viewBox="0 0 1440 280"
            preserveAspectRatio="none"
            className="h-full w-[140%] text-[#9aa49a]"
          >
            <path
              fill="currentColor"
              d="M0 280V160L120 200L280 100L420 180L580 90L740 170L900 70L1060 150L1220 110L1380 190L1440 150V280H0Z"
            />
          </svg>
        </motion.div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
          style={{
            background:
              "linear-gradient(to top, rgba(232,226,214,0.8) 0%, rgba(232,226,214,0.28) 55%, transparent 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Stacked milestones — crossfade / rise / soft blur */}
        <div className="relative z-10 h-full">
          {milestones.map((milestone, index) => (
            <MilestoneLayer
              key={milestone.id}
              milestone={milestone}
              index={index}
              total={total}
              active={activeIndex === index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <div className="absolute right-6 bottom-6 left-6 z-20 flex items-center gap-4 sm:right-10 sm:bottom-8 sm:left-10 md:right-16 md:left-16">
          <div className="h-px flex-1 overflow-hidden bg-foreground/10">
            <motion.div
              className="h-full origin-left bg-foreground"
              style={{ scaleX: progressBar }}
            />
          </div>
          <div className="flex items-center gap-2">
            {milestones.map((m, i) => (
              <span
                key={m.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  )
}

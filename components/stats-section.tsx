"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

const INSTAGRAM_URL =
  "https://www.instagram.com/mintsulaimani?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="

type Panel =
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

const panels: Panel[] = [
  {
    id: "intro",
    kind: "intro",
    eyebrow: "The road so far",
    title: "Numbers that travel with us",
    line: "Scroll sideways through what the community has become.",
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

function StatPanel({
  panel,
  active,
  scrollYProgress,
  panelIndex,
}: {
  panel: Extract<Panel, { kind: "stat" }>
  active: boolean
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  panelIndex: number
}) {
  const [count, setCount] = useState(0)
  const completedRef = useRef(false)
  const animatingRef = useRef(false)

  // Kick a fast count as soon as this panel becomes the active one
  useEffect(() => {
    if (!active || completedRef.current || animatingRef.current) return
    animatingRef.current = true

    const duration = 700
    let startTime: number | undefined
    let frame: number
    const from = count

    const animate = (now: number) => {
      if (startTime === undefined) startTime = now
      const t = Math.min(1, (now - startTime) / duration)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(from + (panel.value - from) * ease))
      if (t < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        completedRef.current = true
        animatingRef.current = false
        setCount(panel.value)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when becoming active
  }, [active, panel.value])

  // Also front-load via scroll so fast scrubbers still see the number fill in
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (completedRef.current) {
      setCount(panel.value)
      return
    }

    const n = panels.length
    const travelStart = (panelIndex / n) * 0.82
    const travelEnd = travelStart + (0.82 / n) * 0.4 // finish count in first 40% of panel

    if (latest < travelStart) return

    const t = Math.min(1, (latest - travelStart) / Math.max(0.001, travelEnd - travelStart))
    const next = Math.floor((1 - Math.pow(1 - t, 3)) * panel.value)
    setCount((prev) => Math.max(prev, next))
    if (t >= 1) completedRef.current = true
  })

  const display = `${count}${panel.suffix}`

  return (
    <div className="flex h-full w-full flex-col items-start justify-center px-8 sm:px-12 md:px-20 lg:px-28">
      <motion.p
        animate={{ opacity: active ? 1 : 0.45, y: active ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        className="font-mono text-xs tracking-[0.28em] text-muted-foreground uppercase"
      >
        {panel.label}
      </motion.p>
      <motion.p
        animate={{ opacity: active || count > 0 ? 1 : 0.45, scale: active ? 1 : 0.98 }}
        transition={{ duration: 0.3 }}
        className="mt-4 origin-left font-serif text-[22vw] leading-none tracking-tight text-foreground sm:text-[16vw] md:text-[12vw] lg:text-[9rem]"
      >
        {display}
      </motion.p>
      <motion.p
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        {panel.note}
      </motion.p>
      {panel.href && (
        <a
          href={panel.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex border-b border-foreground pb-0.5 text-sm text-foreground transition-opacity hover:opacity-70"
        >
          Follow on Instagram
        </a>
      )}
    </div>
  )
}

export function StatsSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Track follows scroll 1:1 (no spring lag) so the section doesn't unpin mid-panel.
  // Last ~18% of the scrub holds on the final number.
  const x = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    ["0vw", `-${(panels.length - 1) * 100}vw`, `-${(panels.length - 1) * 100}vw`],
  )

  const progressBar = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.001,
  })

  // Travel atmosphere — parallax layers
  const mapX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"])
  const ridgeX = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"])
  const farRidgeX = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const travel = Math.min(1, latest / 0.82)
    // Activate the next panel a bit early so counts start before the panel is centered
    const index = Math.min(
      panels.length - 1,
      Math.max(0, Math.floor(travel * panels.length + 0.2)),
    )
    setActiveIndex(index)
  })

  // Extra scroll distance so each number has time to land
  const scrubHeight = `${panels.length * 130 + 120}vh`

  return (
    <section
      id="stats-section"
      ref={containerRef}
      className="relative"
      style={{ height: scrubHeight }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Dawn sky → earth horizon */}
        <div
          className="absolute inset-0"
          style={{
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

        {/* Cartography grid — latitude / longitude */}
        <motion.div
          aria-hidden
          style={{ x: mapX }}
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
        >
          <div
            className="h-full w-[160%]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(40,50,45,0.09) 1px, transparent 1px),
                linear-gradient(90deg, rgba(40,50,45,0.09) 1px, transparent 1px)
              `,
              backgroundSize: "72px 48px",
            }}
          />
        </motion.div>

        {/* Far mountain ridge */}
        <motion.div
          aria-hidden
          style={{ x: farRidgeX }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] opacity-40"
        >
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="h-full w-[140%] text-[#b7c0c4]"
          >
            <path
              fill="currentColor"
              d="M0 320V180L160 120L320 200L480 80L640 160L800 60L960 140L1120 90L1280 170L1440 100V320H0Z"
            />
          </svg>
        </motion.div>

        {/* Near ridge / foothills */}
        <motion.div
          aria-hidden
          style={{ x: ridgeX }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] opacity-55"
        >
          <svg
            viewBox="0 0 1440 280"
            preserveAspectRatio="none"
            className="h-full w-[150%] text-[#9aa49a]"
          >
            <path
              fill="currentColor"
              d="M0 280V160L120 200L280 100L420 180L580 90L740 170L900 70L1060 150L1220 110L1380 190L1440 150V280H0Z"
            />
          </svg>
        </motion.div>

        {/* Ground wash so content stays readable over ridges */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background:
              "linear-gradient(to top, rgba(232,226,214,0.75) 0%, rgba(232,226,214,0.25) 50%, transparent 100%)",
          }}
        />

        {/* Soft film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <motion.div style={{ x }} className="relative z-10 flex h-full will-change-transform">
          {panels.map((panel, index) => (
            <div key={panel.id} className="relative h-full w-screen shrink-0">
              {panel.kind === "intro" ? (
                <div className="flex h-full w-full flex-col items-start justify-center px-8 sm:px-12 md:px-20 lg:px-28">
                  <motion.p
                    animate={{ opacity: activeIndex === index ? 1 : 0.4 }}
                    className="mb-4 text-xs tracking-[0.22em] text-muted-foreground uppercase"
                  >
                    {panel.eyebrow}
                  </motion.p>
                  <motion.h2
                    animate={{
                      opacity: activeIndex === index ? 1 : 0.45,
                      y: activeIndex === index ? 0 : 16,
                    }}
                    transition={{ duration: 0.45 }}
                    className="max-w-xl font-serif text-4xl font-normal leading-[1.1] text-balance sm:text-5xl md:text-6xl lg:text-7xl"
                  >
                    {panel.title}
                  </motion.h2>
                  <motion.p
                    animate={{ opacity: activeIndex === index ? 1 : 0.35 }}
                    className="mt-6 max-w-md text-base text-muted-foreground md:text-lg"
                  >
                    {panel.line}
                  </motion.p>
                  <p className="mt-10 flex items-center gap-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    Scroll to explore
                    <span className="inline-block h-px w-10 bg-muted-foreground/40" />
                  </p>
                </div>
              ) : (
                <StatPanel
                  panel={panel}
                  active={activeIndex === index}
                  scrollYProgress={scrollYProgress}
                  panelIndex={index}
                />
              )}
            </div>
          ))}
        </motion.div>

        <div className="absolute right-6 bottom-6 left-6 z-20 flex items-center gap-4 sm:right-10 sm:bottom-8 sm:left-10 md:right-16 md:left-16">
          <div className="h-px flex-1 overflow-hidden bg-foreground/10">
            <motion.div
              className="h-full origin-left bg-foreground"
              style={{ scaleX: progressBar }}
            />
          </div>
          <div className="flex items-center gap-2">
            {panels.map((panel, i) => (
              <span
                key={panel.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  )
}

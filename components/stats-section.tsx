"use client"

import { useEffect, useState } from "react"

function useCountUp(end: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { value: count + suffix, start: () => setHasStarted(true) }
}

const INSTAGRAM_URL =
  "https://www.instagram.com/mintsulaimani?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  const countries = useCountUp(24, 1800, "")
  const followers = useCountUp(157, 2200, "K+")
  const community = useCountUp(2, 1600, "K+")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          countries.start()
          followers.start()
          community.start()
        }
      },
      { threshold: 0.3 },
    )

    const section = document.getElementById("stats-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <section id="stats-section" className="relative overflow-hidden bg-background px-6 py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="whitespace-nowrap text-center text-[20vw] font-bold leading-none tracking-tighter text-zinc-100 sm:text-[18vw] md:text-[16vw] lg:text-[14vw]">
          ROAD
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
          <div
            className={`text-center transition-all duration-1000 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="mb-2 text-6xl font-light leading-none text-foreground md:text-7xl">
              {countries.value}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Countries</p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-center transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="mb-2 text-6xl font-light leading-none text-foreground md:text-7xl">
              {followers.value}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Followers</p>
          </a>

          <div
            className={`text-center transition-all duration-1000 delay-400 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="mb-2 text-6xl font-light leading-none text-foreground md:text-7xl">
              {community.value}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Community</p>
          </div>
        </div>
      </div>
    </section>
  )
}

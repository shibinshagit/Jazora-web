"use client"

import { Compass, Users, Plane } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { MissionBanner } from "@/components/growth-flight-scene"

const services = [
  {
    icon: Compass,
    title: "Routes we design",
    description: "Itineraries built around the places, pace, and season — not a generic package off a shelf.",
  },
  {
    icon: Plane,
    title: "Logistics we run",
    description: "Flights, hotels, rail, transfers, and entry paperwork arranged before you leave home.",
  },
  {
    icon: Users,
    title: "People on the ground",
    description: "Local guides and a trip desk that stays with the group from arrival through the flight home.",
  },
]

function AnimatedIcon({ Icon }: { Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }> }) {
  const [isVisible, setIsVisible] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (iconRef.current) {
      observer.observe(iconRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={iconRef} className="relative">
      <Icon
        className={`text-foreground h-16 w-16 ${isVisible ? "animate-draw-icon" : ""}`}
        strokeWidth={1}
        style={{
          strokeDasharray: isVisible ? undefined : 1000,
          strokeDashoffset: isVisible ? undefined : 1000,
        }}
      />
    </div>
  )
}

export function ServicesSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-6 py-32 pb-24">
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-0 flex justify-center">
        <span className="text-center text-[18vw] leading-none font-bold tracking-tighter whitespace-nowrap text-zinc-100 sm:text-[16vw] md:text-[14vw] lg:text-[12vw]">
          WORLD
        </span>
      </div>

      <style jsx>{`
        @keyframes drawPath {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
        :global(.animate-draw-icon) :global(path),
        :global(.animate-draw-icon) :global(line),
        :global(.animate-draw-icon) :global(polyline),
        :global(.animate-draw-icon) :global(circle),
        :global(.animate-draw-icon) :global(rect) {
          animation: drawPath 2s ease-out forwards;
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-7xl">
        <MissionBanner />

        <div className="mb-20 text-center">
          <h2 className="mb-6 font-serif text-4xl font-normal text-balance md:text-5xl">What a departure includes</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
            One operator for the whole trip: the route, the reservations, and the people waiting when you land.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group rounded-3xl p-8 text-center transition-colors duration-300 hover:bg-zinc-50"
            >
              <div className="mb-6 flex justify-center">
                <AnimatedIcon Icon={service.icon} />
              </div>
              <h3 className="mb-3 text-xl font-medium text-foreground">{service.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

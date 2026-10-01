"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Looping cinematic scene: child walks → grows → wings → flight.
 * Pure SVG/CSS so it runs without external video credits.
 */
export function GrowthFlightScene({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <style jsx>{`
        @keyframes skyDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-4%, -2%, 0);
          }
        }
        @keyframes sunPulse {
          0%,
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        @keyframes pathScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20%);
          }
        }
        @keyframes figureStory {
          0% {
            transform: translate(8%, 58%) scale(0.42);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          38% {
            transform: translate(42%, 52%) scale(0.72);
          }
          58% {
            transform: translate(58%, 46%) scale(1);
          }
          68% {
            transform: translate(62%, 42%) scale(1.05);
          }
          78% {
            transform: translate(68%, 28%) scale(1.08) rotate(-4deg);
          }
          100% {
            transform: translate(88%, -8%) scale(1.2) rotate(-10deg);
            opacity: 0.15;
          }
        }
        @keyframes walkBob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3%);
          }
        }
        @keyframes wingReveal {
          0%,
          62% {
            opacity: 0;
            transform: scaleX(0.15) rotate(18deg);
          }
          70% {
            opacity: 1;
            transform: scaleX(1) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scaleX(1.05) rotate(-6deg);
          }
        }
        @keyframes wingFlapL {
          0%,
          70% {
            transform: rotate(8deg);
          }
          85% {
            transform: rotate(-18deg);
          }
          100% {
            transform: rotate(12deg);
          }
        }
        @keyframes wingFlapR {
          0%,
          70% {
            transform: rotate(-8deg);
          }
          85% {
            transform: rotate(18deg);
          }
          100% {
            transform: rotate(-12deg);
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.55;
          }
        }
        .sky {
          animation: skyDrift 28s ease-in-out infinite alternate;
        }
        .sun {
          animation: sunPulse 7s ease-in-out infinite;
          transform-origin: center;
        }
        .ground-scroll {
          animation: pathScroll 18s linear infinite;
        }
        .figure {
          animation: figureStory 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: center bottom;
        }
        .figure-bob {
          animation: walkBob 0.55s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .wing {
          transform-origin: center;
          animation: wingReveal 14s ease-in-out infinite;
        }
        .wing-l {
          animation:
            wingReveal 14s ease-in-out infinite,
            wingFlapL 14s ease-in-out infinite;
          transform-origin: 58% 48%;
        }
        .wing-r {
          animation:
            wingReveal 14s ease-in-out infinite,
            wingFlapR 14s ease-in-out infinite;
          transform-origin: 42% 48%;
        }
        .spark {
          animation: sparkle 3.5s ease-in-out infinite;
        }
        .spark:nth-child(2) {
          animation-delay: 0.6s;
        }
        .spark:nth-child(3) {
          animation-delay: 1.2s;
        }
      `}</style>

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="42%" stopColor="#5b6f9a" />
            <stop offset="72%" stopColor="#c9976a" />
            <stop offset="100%" stopColor="#e8c9a0" />
          </linearGradient>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6a8a9e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3d5a6a" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff8ef" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f0d5a8" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9b8" stopOpacity="1" />
            <stop offset="55%" stopColor="#ffc878" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffc878" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1600" height="900" fill="url(#skyGrad)" />
        <g className="sky">
          <circle className="sun" cx="1180" cy="220" r="160" fill="url(#sunGlow)" />
          <ellipse cx="320" cy="160" rx="180" ry="36" fill="#ffffff" opacity="0.12" />
          <ellipse cx="520" cy="210" rx="140" ry="28" fill="#ffffff" opacity="0.08" />
          <ellipse cx="980" cy="140" rx="200" ry="40" fill="#ffffff" opacity="0.1" />
        </g>

        {/* Distant ridges */}
        <path
          d="M0 520 L180 440 L340 500 L520 400 L740 480 L960 390 L1180 470 L1400 410 L1600 460 L1600 900 L0 900 Z"
          fill="#2f3d4a"
          opacity="0.35"
        />
        <path
          d="M0 560 L220 490 L400 550 L620 470 L860 540 L1100 460 L1340 530 L1600 480 L1600 900 L0 900 Z"
          fill="#24323d"
          opacity="0.5"
        />

        {/* Sea */}
        <rect y="620" width="1600" height="280" fill="url(#seaGrad)" />
        <path
          d="M0 640 Q200 628 400 642 T800 636 T1200 648 T1600 634 L1600 900 L0 900 Z"
          fill="#4e6d7c"
          opacity="0.35"
        />

        {/* Walking path / ground scroll */}
        <g className="ground-scroll">
          <path
            d="M-200 700 C200 660, 500 720, 900 680 S1500 700, 1900 660 L1900 900 L-200 900 Z"
            fill="#3a3228"
            opacity="0.85"
          />
          <path
            d="M-200 720 C180 690, 520 740, 880 705 S1480 730, 1900 700"
            fill="none"
            stroke="#c4a574"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M-160 760 C240 730, 560 780, 920 745 S1520 770, 1880 740"
            fill="none"
            stroke="#8a7352"
            strokeWidth="3"
            opacity="0.35"
          />
        </g>

        {/* Sparks near flight */}
        <g className="spark" fill="#ffe9c4">
          <circle cx="980" cy="320" r="3" />
          <circle cx="1040" cy="260" r="2" />
          <circle cx="1100" cy="300" r="2.5" />
        </g>

        {/* Figure: grows while walking, then flies */}
        <g className="figure">
          <g className="figure-bob">
            {/* Wings */}
            <path
              className="wing wing-l"
              d="M780 470 C700 430, 620 390, 560 420 C600 360, 690 340, 760 390 C770 420, 775 450, 780 470 Z"
              fill="url(#wingGrad)"
              filter="url(#softGlow)"
            />
            <path
              className="wing wing-r"
              d="M820 470 C900 430, 980 390, 1040 420 C1000 360, 910 340, 840 390 C830 420, 825 450, 820 470 Z"
              fill="url(#wingGrad)"
              filter="url(#softGlow)"
            />

            {/* Body silhouette */}
            <ellipse cx="800" cy="455" rx="18" ry="22" fill="#1a1410" />
            <path
              d="M800 475 C770 490, 760 540, 770 575 C785 590, 815 590, 830 575 C840 540, 830 490, 800 475 Z"
              fill="#1a1410"
            />
            <path d="M785 575 L778 620" stroke="#1a1410" strokeWidth="10" strokeLinecap="round" />
            <path d="M815 575 L822 620" stroke="#1a1410" strokeWidth="10" strokeLinecap="round" />
            <path d="M775 510 L750 545" stroke="#1a1410" strokeWidth="9" strokeLinecap="round" />
            <path d="M825 510 L850 545" stroke="#1a1410" strokeWidth="9" strokeLinecap="round" />

            {/* Dress / flow */}
            <path
              d="M770 520 C760 555, 765 585, 800 590 C835 585, 840 555, 830 520 Z"
              fill="#2a2118"
              opacity="0.9"
            />
          </g>
        </g>

        {/* Soft base wash handled by overlays outside SVG */}
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  )
}

export function MissionBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`relative mb-32 min-h-[28rem] overflow-hidden rounded-3xl px-6 py-16 sm:min-h-[32rem] lg:min-h-[26rem] lg:px-8 lg:py-20 ${
        isVisible ? "opacity-100" : "opacity-95"
      }`}
    >
      <GrowthFlightScene className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-1 lg:order-2 lg:col-start-2">
          <p className="mb-4 text-sm font-medium tracking-[0.2em] text-white/80 uppercase">Our mission</p>
          <h2 className="mb-8 text-balance font-sans text-5xl font-medium text-white md:text-4xl lg:text-5xl">
            We operate the journey, not just the booking
          </h2>
          <div className="space-y-6 leading-relaxed text-white/90">
            <p>
              Jazora plans and leads international trips. A departure is a route, a team, and a schedule we run — from
              the first flight to the transfer home.
            </p>
            <p>
              Small groups and private journeys share the same standard: vetted stays, local guides, and a desk that
              answers while you are abroad.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

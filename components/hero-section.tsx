"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedText } from "./animated-text"
import { PhoneTripGallery } from "./phone-trip-gallery"
import { Skeleton } from "@/components/ui/skeleton"
import { HERO_READY_EVENT } from "@/components/site-ready-gate"
import { cn } from "@/lib/utils"

const HERO_VIDEO =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/af7687fd-f2ad-4f2a-96f0-b56fa7d3769c-08wERpo5U1sktxs1vcRsJW9ueslNZv.mp4"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLImageElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [frameReady, setFrameReady] = useState(false)
  const readyFired = useRef(false)

  const contentReady = videoReady && frameReady

  useEffect(() => {
    if (!contentReady || readyFired.current) return
    readyFired.current = true

    // Brief beat so skeletons don't flash off abruptly
    const show = window.setTimeout(() => {
      setIsVisible(true)
      window.dispatchEvent(new Event(HERO_READY_EVENT))
    }, 180)

    return () => window.clearTimeout(show)
  }, [contentReady])

  // Cached media may already be ready before handlers attach
  useEffect(() => {
    const video = videoRef.current
    if (video && video.readyState >= 3) setVideoReady(true)

    const frame = frameRef.current
    if (frame?.complete && frame.naturalWidth > 0) setFrameReady(true)
  }, [])

  useEffect(() => {
    let rafId: number
    let currentProgress = 0

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 400
      const targetProgress = Math.min(scrollY / maxScroll, 1)

      const smoothUpdate = () => {
        currentProgress += (targetProgress - currentProgress) * 0.1

        if (Math.abs(targetProgress - currentProgress) > 0.001) {
          setScrollProgress(currentProgress)
          rafId = requestAnimationFrame(smoothUpdate)
        } else {
          setScrollProgress(targetProgress)
        }
      }

      cancelAnimationFrame(rafId)
      smoothUpdate()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const easeOutQuad = (t: number) => t * (2 - t)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const scale = 1 - easeOutQuad(scrollProgress) * 0.15
  const borderRadius = easeOutCubic(scrollProgress) * 48
  const heightVh = 100 - easeOutQuad(scrollProgress) * 37.5

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-12">
      <div className="absolute inset-0 top-0">
        <div
          className="w-full overflow-hidden will-change-transform"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            height: `${heightVh}vh`,
          }}
        >
          {!videoReady && (
            <Skeleton className="absolute inset-0 z-[1] h-full w-full rounded-none bg-zinc-300/80" />
          )}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={cn(
              "h-full w-full object-cover transition-opacity duration-700",
              videoReady ? "opacity-100" : "opacity-0",
            )}
            src={HERO_VIDEO}
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(true)}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-[5] flex w-full items-end justify-center overflow-hidden"
        style={{
          transform: `translateY(${scrollProgress * 150}px)`,
          opacity: videoReady ? 1 - scrollProgress * 0.8 : 0,
          height: "100%",
        }}
      >
        <span className="block text-center text-[28vw] leading-none font-bold tracking-tighter text-white select-none sm:text-[25vw] md:text-[22vw] lg:text-[20vw]">
          Jazora
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center">
          {/* Mobile skeleton for headline while media boots */}
          <div className="md:hidden">
            {!isVisible ? (
              <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-4">
                <Skeleton className="h-10 w-[85%] rounded-md bg-white/50" />
                <Skeleton className="h-10 w-[65%] rounded-md bg-white/40" />
              </div>
            ) : (
              <h1 className="mx-auto mb-6 w-full max-w-6xl px-4 font-serif text-[3.5rem] leading-tight font-normal text-balance">
                <AnimatedText text="See the world, with Jazora" delay={0.15} />
              </h1>
            )}
          </div>

          {/* Desktop headline */}
          <div className="hidden md:block">
            <div
              className={cn(
                "transition-all delay-[400ms] duration-1000",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
              )}
            >
              <h1 className="mx-auto mb-6 w-full max-w-6xl px-4 font-serif text-[3.5rem] leading-tight font-normal text-balance sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] 2xl:text-[8.5rem]">
                <AnimatedText text="See the world, with Jazora" delay={0.3} />
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative">
            {/* Mobile phone skeleton */}
            {!isVisible && (
              <div className="relative w-[234px] md:hidden">
                <Skeleton className="mx-auto aspect-[9/19] w-full rounded-[2rem] bg-white/45" />
              </div>
            )}

            <div
              className={cn(
                "relative w-[234px] will-change-transform transition-all delay-300 duration-[1200ms] ease-out md:w-[281px] lg:w-[351px]",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none absolute translate-y-10 opacity-0 md:static md:translate-y-[200px]",
              )}
            >
              <div
                className="absolute overflow-hidden"
                style={{
                  left: "3.12%",
                  top: "1.05%",
                  width: "93.76%",
                  height: "98.31%",
                  borderRadius: "14.4% / 6.7%",
                }}
              >
                {isVisible ? (
                  <PhoneTripGallery />
                ) : (
                  <Skeleton className="h-full w-full rounded-none bg-zinc-200/80" />
                )}
              </div>
              <img
                ref={frameRef}
                src="/images/iphone-frame-cutout.png"
                alt=""
                className="relative z-10 h-auto w-full pointer-events-none"
                onLoad={() => setFrameReady(true)}
                onError={() => setFrameReady(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

export const HERO_READY_EVENT = "jazora:hero-ready"

export function SiteReadyGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const markReady = () => setReady(true)
    window.addEventListener(HERO_READY_EVENT, markReady)

    // Failsafe — never block the site forever on slow networks
    const failsafe = window.setTimeout(markReady, 6000)

    return () => {
      window.removeEventListener(HERO_READY_EVENT, markReady)
      window.clearTimeout(failsafe)
    }
  }, [])

  useEffect(() => {
    if (!ready) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
    }
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [ready])

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="site-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
          >

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center gap-6"
            >
              <Image
                src="/images/logo/logomain.png"
                alt="Jazora Holidays"
                width={180}
                height={48}
                className="h-10 w-auto sm:h-12"
                priority
              />
              <div className="flex flex-col items-center gap-3">
                <p className="font-serif text-lg text-foreground/80 sm:text-xl">
                  Preparing your journey
                </p>
                <div className="h-[2px] w-28 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    className="h-full w-1/2 rounded-full bg-foreground/70"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5, delay: ready ? 0.1 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}

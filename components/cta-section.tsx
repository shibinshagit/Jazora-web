"use client"

import { ArrowUpRight } from "lucide-react"
import { useTripInquiry } from "@/components/trip-inquiry-provider"

export function CTASection() {
  const { openInquiry } = useTripInquiry()

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bold font-sans tracking-tighter leading-none text-zinc-100 whitespace-nowrap">
          WANDER
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-normal leading-tight max-w-4xl mx-auto mb-6 font-serif">
            Ready for the next departure?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Tell us where you want to go. Jazora builds the route and runs the trip with you.
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={openInquiry}
              className="relative flex items-center justify-center gap-0 bg-foreground text-background rounded-full pl-6 pr-1.5 py-1.5 transition-all duration-300 group overflow-hidden"
            >
              <span className="text-sm pr-4">Plan a trip</span>
              <span className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-foreground" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

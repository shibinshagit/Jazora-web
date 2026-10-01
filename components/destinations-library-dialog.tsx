"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { destinationCatalog } from "@/lib/destination-catalog"
import { cn } from "@/lib/utils"

const WHATSAPP_BASE = "https://wa.me/971588409478"
const IMG_V = "v1"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectFeatured?: (featuredId: string) => void
}

export function DestinationsLibraryDialog({ open, onOpenChange, onSelectFeatured }: Props) {
  const askAbout = (name: string) => {
    const text = encodeURIComponent(
      `Hi Jazora — I'd like to explore a trip to ${name}. Can you share options?`,
    )
    window.open(`${WHATSAPP_BASE}?text=${text}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(92vh,880px)] w-[calc(100%-1.25rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl border-white/10 bg-zinc-950 p-0 text-white shadow-2xl sm:max-w-5xl",
          "[&_[data-slot=dialog-close]]:text-white/70 [&_[data-slot=dialog-close]]:hover:bg-white/10 [&_[data-slot=dialog-close]]:hover:text-white [&_[data-slot=dialog-close]]:hover:opacity-100",
        )}
      >
        <DialogHeader className="shrink-0 space-y-1 border-b border-white/10 px-5 py-5 text-left sm:px-7 sm:py-6">
          <DialogTitle className="font-serif text-2xl font-normal tracking-tight text-white sm:text-3xl">
            Destination library
          </DialogTitle>
          <DialogDescription className="text-sm text-white/55 sm:text-base">
            Twenty places we plan and lead — tap a country to explore it with us.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-3.5">
            {destinationCatalog.map((place) => {
              const isFeatured = Boolean(place.featuredId)
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    if (place.featuredId && onSelectFeatured) {
                      onSelectFeatured(place.featuredId)
                      onOpenChange(false)
                      return
                    }
                    askAbout(place.name)
                    onOpenChange(false)
                  }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl text-left outline-none ring-offset-2 ring-offset-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <Image
                    src={`${place.image}?${IMG_V}`}
                    alt={place.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-3.5">
                    <div className="min-w-0">
                      <p className="text-lg leading-none sm:text-xl" aria-hidden>
                        {place.flag}
                      </p>
                      <p className="mt-1.5 truncate font-serif text-base text-white sm:text-lg">
                        {place.name}
                      </p>
                      <p className="mt-0.5 text-[10px] tracking-wide text-white/55 uppercase sm:text-[11px]">
                        {isFeatured ? "Featured route" : "Ask to plan"}
                      </p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 px-5 py-4 sm:px-7">
          <p className="text-center text-xs text-white/45 sm:text-sm">
            Looking for somewhere else?{" "}
            <a
              href={`${WHATSAPP_BASE}?text=${encodeURIComponent("Hi Jazora — I'd like to plan a custom destination.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 underline-offset-2 hover:text-white hover:underline"
            >
              Message us on WhatsApp
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

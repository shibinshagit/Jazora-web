"use client"

import Image from "next/image"
import { ArrowUpRight, Calendar, Heart, MapPin, Plane, Users, Utensils, Car, TrainFront } from "lucide-react"
import { cn } from "@/lib/utils"

const WHATSAPP_URL = "https://wa.me/971588409478"

export interface TripCardProps {
  name: string
  location: string
  duration: string
  season: string
  image: string
  type?: string
  highlights?: string[]
  includes?: string[]
  popular?: boolean
  comingSoon?: boolean
  className?: string
}

export function TripCard({
  name,
  location,
  duration,
  season,
  image,
  highlights = [],
  includes = [],
  popular = false,
  comingSoon = false,
  className,
}: TripCardProps) {
  const bookOnWhatsApp = () => {
    if (comingSoon) return
    const lines = [
      "Hi Jazora — I'd like to book a trip.",
      "",
      `Trip: ${name}`,
      `Location: ${location}`,
      `Season: ${season}`,
      `Duration: ${duration}`,
      highlights.length ? `Highlights: ${highlights.join(", ")}` : null,
    ].filter(Boolean)

    window.open(
      `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    )
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_40px_-16px_rgba(0,0,0,0.28)] ring-1 ring-black/[0.04]",
        className,
      )}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[4/3]">
        <Image
          src={image || "/images/logo/icon-192.png"}
          alt={name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            comingSoon ? "grayscale-[25%]" : "group-hover:scale-[1.03]",
          )}
          sizes="(max-width: 768px) 85vw, 380px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute top-3 right-3 flex items-center gap-2 sm:top-4 sm:right-4">
          {popular && !comingSoon && (
            <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-zinc-800 backdrop-blur-sm">
              Popular
            </span>
          )}
          {comingSoon && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-zinc-800 backdrop-blur-sm">
              Coming soon
            </span>
          )}
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-zinc-700 backdrop-blur-sm"
            aria-hidden
          >
            <Heart className="h-4 w-4" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <h3 className="font-serif text-xl leading-tight font-normal text-white sm:text-2xl">
              {name}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/85 sm:text-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          </div>

          {comingSoon ? (
            <span className="shrink-0 rounded-full bg-white/20 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm">
              Soon
            </span>
          ) : (
            <button
              type="button"
              onClick={bookOnWhatsApp}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium text-zinc-900 transition-opacity hover:opacity-90 active:scale-[0.98] sm:px-4 sm:text-sm"
            >
              Book
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {season} · {duration}
            </span>
          </div>
        </div>

        {highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {highlights.slice(0, 3).map((item) => (
              <span
                key={item}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {includes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {includes.slice(0, 3).map((item) => {
              const label = item.toLowerCase()
              let Icon = Users
              if (label.includes("flight")) Icon = Plane
              if (label.includes("meal")) Icon = Utensils
              if (label.includes("transfer") || label.includes("driver")) Icon = Car
              if (label.includes("rail")) Icon = TrainFront

              return (
                <div key={item} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}

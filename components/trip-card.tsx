"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import { Calendar, MapPin, Plane, Users, Utensils, Car, TrainFront } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const WHATSAPP_URL = "https://wa.me/971529612199"

export interface TripCardProps {
  name: string
  location: string
  duration: string
  season: string
  image: string
  price: number
  currency?: string
  type?: string
  highlights?: string[]
  includes?: string[]
  rating?: number
  className?: string
}

export function TripCard({
  name,
  location,
  duration,
  season,
  image,
  price,
  currency = "AED",
  type,
  highlights = [],
  includes = [],
  rating,
  className,
}: TripCardProps) {
  const [open, setOpen] = useState(false)
  const [guestName, setGuestName] = useState("")

  const sendToWhatsApp = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = guestName.trim()
    if (!trimmed) return

    const lines = [
      "Hi Jazora — I'd like to reserve a trip.",
      "",
      `Name: ${trimmed}`,
      `Trip: ${name}`,
      type ? `Type: ${type}` : null,
      `Location: ${location}`,
      `Season: ${season}`,
      `Duration: ${duration}`,
      `Price: ${currency} ${price.toLocaleString()} / person`,
      highlights.length ? `Highlights: ${highlights.join(", ")}` : null,
      includes.length ? `Includes: ${includes.join(", ")}` : null,
      rating != null ? `Rating: ${rating.toFixed(1)}` : null,
    ].filter(Boolean)

    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`
    window.open(url, "_blank", "noopener,noreferrer")
    setOpen(false)
    setGuestName("")
  }

  return (
    <>
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] md:rounded-3xl",
          className,
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
          <Image
            src={image || "/images/logo/icon-192.png"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 85vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {rating != null && (
            <div className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              ★ {rating.toFixed(1)}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            {type && (
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">{type}</p>
            )}
            <h3 className="font-serif text-2xl font-normal leading-tight text-white sm:text-[1.75rem]">{name}</h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
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

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">From</p>
              <p className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                <span className="mr-1 text-sm font-medium text-muted-foreground">{currency}</span>
                {price.toLocaleString()}
                <span className="ml-1 text-xs font-normal text-muted-foreground">/person</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 active:scale-[0.98] sm:px-5"
            >
              Reserve
            </button>
          </div>
        </div>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve {name}</DialogTitle>
            <DialogDescription>
              Enter your name and we&apos;ll open WhatsApp with this trip&apos;s details ready to send.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sendToWhatsApp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`guest-name-${name}`}>Your name</Label>
              <Input
                id={`guest-name-${name}`}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {location} · {season} · {duration} · {currency} {price.toLocaleString()}/person
            </p>
            <DialogFooter>
              <button
                type="submit"
                disabled={!guestName.trim()}
                className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Book
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

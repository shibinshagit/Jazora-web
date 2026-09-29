"use client"

import { useState, type FormEvent } from "react"
import { Check, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COUNTRY_CODES = [
  { code: "971", label: "AE +971" },
  { code: "91", label: "IN +91" },
  { code: "966", label: "SA +966" },
  { code: "974", label: "QA +974" },
  { code: "968", label: "OM +968" },
  { code: "965", label: "KW +965" },
  { code: "973", label: "BH +973" },
  { code: "20", label: "EG +20" },
  { code: "44", label: "UK +44" },
  { code: "1", label: "US +1" },
  { code: "92", label: "PK +92" },
  { code: "880", label: "BD +880" },
  { code: "94", label: "LK +94" },
  { code: "977", label: "NP +977" },
  { code: "62", label: "ID +62" },
  { code: "66", label: "TH +66" },
  { code: "84", label: "VN +84" },
] as const

function formatLocalNumber(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 12)
}

function buildPhone(dialCode: string, local: string) {
  const digits = formatLocalNumber(local)
  if (!digits) return `+${dialCode}`
  return `+${dialCode}${digits}`
}

function isValidPhone(dialCode: string, local: string) {
  const digits = formatLocalNumber(local)
  return /^\d{1,4}$/.test(dialCode) && /^\d{7,12}$/.test(digits)
}

export function TripInquiryDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("")
  const [dialCode, setDialCode] = useState("971")
  const [localPhone, setLocalPhone] = useState("")
  const [email, setEmail] = useState("")
  const [destination, setDestination] = useState("")
  const [promo, setPromo] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">(
    "idle",
  )
  const [error, setError] = useState("")

  const phone = buildPhone(dialCode, localPhone)
  const canSubmit =
    name.trim().length > 0 &&
    isValidPhone(dialCode, localPhone) &&
    email.trim().length > 0 &&
    destination.trim().length > 0 &&
    promo &&
    status !== "loading"

  const reset = () => {
    setName("")
    setDialCode("971")
    setLocalPhone("")
    setEmail("")
    setDestination("")
    setPromo(false)
    setStatus("idle")
    setError("")
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (status !== "loading") reset()
    }
    onOpenChange(next)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim() || !destination.trim()) {
      setError("Please fill in all required fields.")
      return
    }
    if (!isValidPhone(dialCode, localPhone)) {
      setError("Enter a valid WhatsApp number (7–12 digits after the country code).")
      return
    }
    if (!promo) {
      setError("Please agree to receive emails from Jazora to submit your request.")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch("/api/trip-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          email: email.trim(),
          destination: destination.trim(),
          promo: true,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        duplicate?: boolean
      }
      if (res.status === 409 || data.duplicate) {
        setStatus("duplicate")
        setError(
          data.error ||
            "Looks like you've already submitted an inquiry with this email or phone.",
        )
        return
      }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.")
      }
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[min(92dvh,720px)] overflow-y-auto border-zinc-200/80 p-0 shadow-2xl sm:max-w-md",
          "rounded-2xl bg-[#faf9f7]",
        )}
      >
        <div className="relative overflow-hidden px-5 pt-6 pb-5 sm:px-7 sm:pt-8 sm:pb-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-90"
            style={{
              background:
                "linear-gradient(180deg, rgba(217,228,236,0.65) 0%, rgba(250,249,247,0) 100%)",
            }}
          />

          {status === "success" ? (
            <div className="relative flex flex-col items-center py-10 text-center">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <DialogHeader className="items-center space-y-2">
                <DialogTitle className="font-serif text-3xl font-normal tracking-tight">
                  Request received
                </DialogTitle>
                <DialogDescription className="max-w-xs text-base leading-relaxed">
                  Thanks, {name.split(" ")[0] || "traveller"}. The Jazora desk will reach out shortly
                  on WhatsApp or email.
                </DialogDescription>
              </DialogHeader>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-8 rounded-full bg-foreground px-6 py-2.5 text-sm text-background transition-opacity hover:opacity-90"
              >
                Close
              </button>
            </div>
          ) : status === "duplicate" ? (
            <div className="relative flex flex-col items-center py-10 text-center">
              <DialogHeader className="items-center space-y-2">
                <DialogTitle className="font-serif text-3xl font-normal tracking-tight">
                  Already submitted
                </DialogTitle>
                <DialogDescription className="max-w-sm text-base leading-relaxed">
                  {error ||
                    "We already have an inquiry with this email or phone. Our trip desk will be in touch — or WhatsApp us anytime."}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background transition-opacity hover:opacity-90"
                >
                  WhatsApp the desk
                </a>
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm transition-colors hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-5">
              <DialogHeader className="space-y-2 text-left">
                <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                  Trip desk
                </p>
                <DialogTitle className="font-serif text-3xl font-normal tracking-tight sm:text-[2rem]">
                  Plan your trip
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed sm:text-[15px]">
                  Tell us a little about you and where you want to go. We&apos;ll get back with
                  routes and dates.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="trip-name">
                    Full name <span className="text-foreground/50">*</span>
                  </Label>
                  <Input
                    id="trip-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 rounded-xl border-zinc-200 bg-white/80 px-3.5 text-base shadow-none md:text-[15px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="trip-phone">
                    WhatsApp <span className="text-foreground/50">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <select
                      aria-label="Country code"
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="h-11 shrink-0 rounded-xl border border-zinc-200 bg-white/80 px-2.5 text-sm text-foreground shadow-none outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      id="trip-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      required
                      value={localPhone}
                      onChange={(e) => setLocalPhone(formatLocalNumber(e.target.value))}
                      placeholder="501234567"
                      maxLength={12}
                      className="h-11 flex-1 rounded-xl border-zinc-200 bg-white/80 px-3.5 text-base shadow-none md:text-[15px]"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Digits only · saves as {phone.length > dialCode.length + 1 ? phone : `+${dialCode}…`}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="trip-email">
                    Email <span className="text-foreground/50">*</span>
                  </Label>
                  <Input
                    id="trip-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="h-11 rounded-xl border-zinc-200 bg-white/80 px-3.5 text-base shadow-none md:text-[15px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="trip-destination">
                    Where do you want to go? <span className="text-foreground/50">*</span>
                  </Label>
                  <Input
                    id="trip-destination"
                    name="destination"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Georgia, Armenia, Japan…"
                    className="h-11 rounded-xl border-zinc-200 bg-white/80 px-3.5 text-base shadow-none md:text-[15px]"
                  />
                </div>

                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                    promo
                      ? "border-foreground/20 bg-white"
                      : "border-zinc-200/80 bg-white/50",
                  )}
                >
                  <Checkbox
                    checked={promo}
                    onCheckedChange={(v) => setPromo(v === true)}
                    className="mt-0.5"
                    id="trip-promo"
                    required
                  />
                  <span className="text-sm leading-snug text-muted-foreground">
                    <span className="text-foreground">Required.</span> Receive promotional emails
                    about new departures and offers from Jazora Holidays.
                  </span>
                </label>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Submit request"
                )}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                By submitting you agree we may contact you about this trip inquiry.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

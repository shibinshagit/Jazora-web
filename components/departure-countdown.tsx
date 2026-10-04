"use client"

import { useEffect, useState } from "react"

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function split(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

function useCountdown(targetIso: string) {
  const [parts, setParts] = useState<Parts | null>(null)

  useEffect(() => {
    const target = new Date(targetIso).getTime()
    const tick = () => setParts(split(target - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetIso])

  return parts
}

const units = [
  { key: "days" as const, label: "Days", tone: "bg-[#f4f1ea]" },
  { key: "hours" as const, label: "Hours", tone: "bg-[#e7eee8]" },
  { key: "minutes" as const, label: "Mins", tone: "bg-[#e8eef2]" },
  { key: "seconds" as const, label: "Secs", tone: "bg-[#efe9e2]" },
]

export function DepartureCountdown({
  targetIso,
  variant = "light",
}: {
  targetIso: string
  variant?: "light" | "phone"
}) {
  const parts = useCountdown(targetIso)

  if (variant === "phone") {
    return (
      <div className="mt-2 grid grid-cols-4 gap-1">
        {units.map((unit) => (
          <div key={unit.key} className="rounded-md bg-black/35 px-0.5 py-1 text-center backdrop-blur-sm">
            <p className="font-serif text-[13px] leading-none text-white tabular-nums">
              {parts ? (unit.key === "days" ? parts.days : pad(parts[unit.key])) : "—"}
            </p>
            <p className="mt-0.5 text-[7px] tracking-[0.12em] text-white/65 uppercase">{unit.label}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {units.map((unit) => (
        <div
          key={unit.key}
          className={`${unit.tone} rounded-2xl px-1.5 py-3 text-center ring-1 ring-black/[0.04] sm:px-2 sm:py-4`}
        >
          <p className="font-serif text-[1.55rem] leading-none text-zinc-950 tabular-nums sm:text-[1.85rem]">
            {parts ? (unit.key === "days" ? parts.days : pad(parts[unit.key])) : "—"}
          </p>
          <p className="mt-1.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">{unit.label}</p>
        </div>
      ))}
    </div>
  )
}

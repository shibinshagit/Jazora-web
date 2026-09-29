"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { TripInquiryDialog } from "@/components/trip-inquiry-dialog"

type TripInquiryContextValue = {
  openInquiry: () => void
}

const TripInquiryContext = createContext<TripInquiryContextValue | null>(null)

export function TripInquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const openInquiry = useCallback(() => setOpen(true), [])
  const value = useMemo(() => ({ openInquiry }), [openInquiry])

  return (
    <TripInquiryContext.Provider value={value}>
      {children}
      <TripInquiryDialog open={open} onOpenChange={setOpen} />
    </TripInquiryContext.Provider>
  )
}

export function useTripInquiry() {
  const ctx = useContext(TripInquiryContext)
  if (!ctx) {
    throw new Error("useTripInquiry must be used within TripInquiryProvider")
  }
  return ctx
}

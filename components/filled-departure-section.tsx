"use client"

import { DepartureShowcase } from "@/components/departure-showcase"
import { malaysiaBookUrl, malaysiaPhotos, malaysiaTrip } from "@/lib/malaysia-departure"

export function FilledDepartureSection() {
  return (
    <DepartureShowcase
      id="filled-departure"
      eyebrow="Filled departure"
      name={malaysiaTrip.name}
      dateLabel={malaysiaTrip.dateLabel}
      departsAt={malaysiaTrip.departsAt}
      duration={malaysiaTrip.duration}
      from={malaysiaTrip.from}
      summary="Four days from Sharjah. A small group, one desk, the city and the highlands."
      groupSize={malaysiaTrip.groupSize}
      booked={malaysiaTrip.booked}
      bookUrl={malaysiaBookUrl()}
      photos={malaysiaPhotos}
      soldOutHref="#next-departure"
      soldOutLabel="See the next departure"
    />
  )
}

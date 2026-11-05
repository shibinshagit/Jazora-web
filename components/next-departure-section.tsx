"use client"

import { DepartureShowcase } from "@/components/departure-showcase"
import { sriLankaBookUrl, sriLankaPhotos, sriLankaTrip } from "@/lib/sri-lanka-departure"

export function NextDepartureSection() {
  return (
    <DepartureShowcase
      id="next-departure"
      eyebrow="Next departure"
      name={sriLankaTrip.name}
      dateLabel={sriLankaTrip.dateLabel}
      departsAt={sriLankaTrip.departsAt}
      duration={sriLankaTrip.duration}
      from={sriLankaTrip.from}
      summary={sriLankaTrip.summary}
      groupSize={sriLankaTrip.groupSize}
      booked={sriLankaTrip.booked}
      bookUrl={sriLankaBookUrl()}
      photos={sriLankaPhotos}
    />
  )
}

"use client"

import { useRef, useEffect, useState } from "react"
import { PropertyBookingCard } from "./property-booking-card"

const properties = [
  {
    propertyName: "Amalfi Coast",
    location: "Positano, Italy",
    duration: "8 days",
    availableDate: "May–October",
    image: "/images/property-beach-villa.jpg",
    pricePerNight: 3890,
    propertyType: "Coastal journey",
    features: ["Cliff towns", "Boat day", "Local cooking", "Small group"],
    amenities: ["Flights", "Guide", "Hotels"],
    rating: 4.9,
  },
  {
    propertyName: "Patagonia Trek",
    location: "El Chaltén, Argentina",
    duration: "11 days",
    availableDate: "March & November",
    image: "/images/property-mountain-cabin.jpg",
    pricePerNight: 5420,
    propertyType: "Wilderness expedition",
    features: ["Glacier hike", "Estancia stay", "Expert guides", "Small group"],
    amenities: ["Meals", "Transfers", "Guide"],
    rating: 4.8,
  },
  {
    propertyName: "Japan in Spring",
    location: "Tokyo to Kyoto",
    duration: "12 days",
    availableDate: "March–April",
    image: "/images/property-city-loft.jpg",
    pricePerNight: 4680,
    propertyType: "Small-group departure",
    features: ["Temples", "Bullet train", "Ryokan nights", "Cherry blossom"],
    amenities: ["Flights", "Rail", "Guide"],
    rating: 4.9,
  },
  {
    propertyName: "Tuscan Harvest",
    location: "Florence, Italy",
    duration: "7 days",
    availableDate: "September–October",
    image: "/images/property-tuscan-estate.jpg",
    pricePerNight: 4120,
    propertyType: "Private journey",
    features: ["Vineyards", "Cooking class", "Hill towns", "Private driver"],
    amenities: ["Hotels", "Driver", "Meals"],
    rating: 4.9,
  },
  {
    propertyName: "Bali & Beyond",
    location: "Ubud, Indonesia",
    duration: "9 days",
    availableDate: "Year-round",
    image: "/images/property-tropical-bungalow.jpg",
    pricePerNight: 2760,
    propertyType: "Island retreat",
    features: ["Rice terraces", "Temples", "Sunrise trek", "Small group"],
    amenities: ["Hotels", "Guide", "Transfers"],
    rating: 4.8,
  },
  {
    propertyName: "Swiss Lakes",
    location: "Lucerne, Switzerland",
    duration: "6 days",
    availableDate: "June–September",
    image: "/images/property-lakefront-modern.jpg",
    pricePerNight: 3540,
    propertyType: "Scenic rail",
    features: ["Lake cruise", "Mountain railway", "Alpine villages", "Small group"],
    amenities: ["Rail pass", "Hotels", "Guide"],
    rating: 4.9,
  },
]

export function PricingSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const positionRef = useRef(0)
  const animationRef = useRef<number>()

  const duplicatedProperties = [...properties, ...properties, ...properties]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const speed = isHovered ? 0.3 : 1 // Slow down on hover instead of changing animation duration
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      positionRef.current += speed * (deltaTime / 16)

      const totalWidth = scrollContainer.scrollWidth / 3

      if (positionRef.current >= totalWidth) {
        positionRef.current = 0
      }

      scrollContainer.style.transform = `translateX(-${positionRef.current}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  return (
    <section id="pricing" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Upcoming departures</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          International trips we design and lead. Prices are per person and include the route, stays, and local team.
        </p>
      </div>

      <div className="relative w-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div ref={scrollRef} className="flex gap-6" style={{ width: "fit-content" }}>
          {duplicatedProperties.map((property, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[400px]">
              <PropertyBookingCard {...property} onBook={() => console.log(`Booking ${property.propertyName}`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

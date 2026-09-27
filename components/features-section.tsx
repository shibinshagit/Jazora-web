"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  "Flights and hotels arranged",
  "Local guides on every trip",
  "Visa and entry support",
  "24/7 trip desk",
  "Private airport transfers",
  "Travel cover options",
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-center pointer-events-none z-0">
        <span className="font-bold text-center text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] leading-none tracking-tighter text-zinc-100 whitespace-nowrap">
          GUIDE
        </span>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">
            A trip desk that stays with you
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
            Reach the team that is already in the country with you — from the first flight to the transfer home.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 rounded-xl p-3 py-1 transition-colors duration-300 hover:bg-zinc-50"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

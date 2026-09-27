import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { DestinationsSection } from "@/components/destinations-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { SiteReadyGate } from "@/components/site-ready-gate"

export default function Home() {
  return (
    <SiteReadyGate>
      <main className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <DestinationsSection />
        <PricingSection />
        <ManifestoSection />
        <StatsSection />
        <ServicesSection />
        <CTASection />
        <TestimonialsSection />
        <FeaturesSection />
        <FAQSection />
        <Footer />
        <WhatsAppFloat />
      </main>
    </SiteReadyGate>
  )
}

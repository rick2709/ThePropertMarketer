import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/home/hero-section"
import { PillarsSection } from "@/components/home/pillars-section"
import { OffersSection } from "@/components/home/offers-section"
import { PropertiesSection } from "@/components/home/properties-section"
import { StatsSection } from "@/components/home/stats-section"
import { CalendarSection } from "@/components/home/calendar-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <PillarsSection />
      {/* <OffersSection /> */}
      <PropertiesSection />
      <StatsSection />
      <CalendarSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}

"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"

export function NewsletterSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary py-28">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url(/images/installment.webp)" }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div
        className={`relative mx-auto max-w-3xl px-6 text-center transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">
            Ready to Begin?
          </span>
        </div>

        <h2 className="mb-5 font-serif text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
          Find Your Next Property
          <br />
          <span className="text-primary-foreground/90">With a Trusted Expert</span>
        </h2>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          Get in touch for viewings, off-market opportunities, or a no-obligation chat about your goals.
          High-end clients deserve a trusted, experienced partner.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-card px-8 py-3.5 font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-xl"
          >
            Browse Listings
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-lg border-2 border-primary-foreground/40 bg-primary-foreground/10 px-8 py-3.5 font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:border-primary-foreground/70 hover:bg-primary-foreground/20"
          >
            Contact Me
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-primary-foreground/70">
          <Phone className="h-4 w-4" />
          <span className="text-sm">Or call directly: </span>
          <a href="tel:+263716437751" className="text-sm font-semibold text-primary-foreground transition-colors hover:text-primary-foreground/90">
            +263 716 437 751
          </a>
        </div>
      </div>
    </section>
  )
}

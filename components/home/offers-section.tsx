"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { MapPin, Home, Landmark, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

const offers = [
  {
    icon: MapPin,
    title: "Stands",
    desc: "Residential and commercial stands ready for development. Prime locations across Harare.",
    link: "/properties?category=Stand",
    linkText: "View Stands",
  },
  {
    icon: Home,
    title: "Airbnb & Rentals",
    desc: "Short-term and holiday let opportunities with strong income potential.",
    link: "/properties?category=Airbnb",
    linkText: "View Listings",
  },
  {
    icon: Landmark,
    title: "Land & Development",
    desc: "Land parcels and development projects for the serious investor.",
    link: "/properties?category=Land%20Development",
    linkText: "View Developments",
  },
  {
    icon: Building2,
    title: "Residential & Luxury",
    desc: "Premium houses, apartments, and high-end investment properties.",
    link: "/properties",
    linkText: "Browse All",
  },
]

export function OffersSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section className="bg-background py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            Explore Listings
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Property <span className="text-primary">Categories</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            From stands to luxury residences — find the perfect opportunity across all property types.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, i) => (
            <Link
              key={offer.title}
              href={offer.link}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                <offer.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="mb-2.5 font-serif text-lg font-bold text-foreground">
                {offer.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {offer.desc}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                {offer.linkText} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

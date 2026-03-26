"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import type { Property } from "@/lib/properties"

function toProperty(p: Record<string, unknown>): Property {
  return {
    id: String(p.id),
    title: String(p.title),
    excerpt: String(p.excerpt),
    content: String(p.content ?? ''),
    category: String(p.category),
    image: String(p.image || '/images/rearesidential.webp'),
    date: String(p.date),
    readTime: (p.read_time as string) || (p.readTime as string) || '—',
    featured: Boolean(p.featured),
    published: Boolean(p.published),
    created_at: String(p.created_at ?? ''),
    updated_at: String(p.updated_at ?? ''),
  }
}

export function PropertiesSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data.slice(0, 3).map((p: Record<string, unknown>) => toProperty(p)))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="portfolio" className="bg-background py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Featured Listings
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Latest <span className="text-accent">Properties</span>
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No listings yet. Check back soon or get in touch for off-market opportunities.</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-3">
              {properties.map((property, i) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className={`group overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <article>
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground text-xs">{property.category}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                        {property.title}
                      </h3>
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">{property.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> Listed {property.date}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-accent transition-all group-hover:gap-2">
                          View <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                View All Listings
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

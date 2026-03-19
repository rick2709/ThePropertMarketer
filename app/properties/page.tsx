"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Property } from "@/lib/properties"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight, Loader2 } from "lucide-react"

const propertyTypes = [
  { name: "All", description: "Browse all current listings across every category." },
  { name: "Stand", description: "Residential and commercial stands ready for development." },
  { name: "Airbnb", description: "Short-term rental and holiday let opportunities." },
  { name: "Land Development", description: "Land parcels and development projects." },
  { name: "Residential", description: "Houses, apartments, and residential investments." },
  { name: "Commercial", description: "Office, retail, and mixed-use properties." },
  { name: "Luxury", description: "High-end and premium listings." },
]

function PropertiesContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = useMemo(() => searchParams.get("category"), [searchParams])
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "All")
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    if (categoryFromUrl && propertyTypes.some((c) => c.name === categoryFromUrl)) {
      setActiveCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(data => {
        const items = (Array.isArray(data) ? data : [])
          .map((s: Record<string, unknown>) => ({
            ...s,
            readTime: s.read_time ?? '—',
          }))
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
            new Date((b.date as string) || 0).getTime() - new Date((a.date as string) || 0).getTime()
          )
        setAllProperties(items as Property[])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeCategory === "All"
    ? allProperties
    : allProperties.filter((p) => p.category === activeCategory)

  const activeDesc = propertyTypes.find(c => c.name === activeCategory)?.description ?? ""
  const featured = allProperties.find(p => p.featured) ?? allProperties[0]
  const gridProperties = filtered.slice(0, visibleCount)

  return (
    <main>
      <Navigation />

      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-primary pt-[88px] sm:pt-[104px] md:pt-[120px] lg:pt-[136px]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">Listings</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            Properties & <span className="text-primary-foreground/90">Opportunities</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/85">
            Curated stands, Airbnb opportunities, land developments, and premium real estate. Your next investment or dream home starts here.
          </p>
        </div>
      </section>

      {loading && (
        <section className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </section>
      )}

      {!loading && featured && (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="group grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2">
              <div className="relative h-72 overflow-hidden md:h-auto">
                <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-accent-foreground">{featured.category}</Badge>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Featured Listing</p>
                <h2 className="mb-4 font-serif text-2xl font-bold text-foreground transition-colors group-hover:text-accent md:text-3xl">{featured.title}</h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Listed {featured.date}</span>
                </div>
                <Link href={`/properties/${featured.id}`} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {!loading && (
        <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {propertyTypes.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setActiveCategory(cat.name); setVisibleCount(6) }}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="mb-12 text-center">
              <p className="text-muted-foreground">{activeDesc}</p>
            </div>

            {gridProperties.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No listings in this category yet.</div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {gridProperties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <article>
                      <div className="relative h-52 overflow-hidden">
                        <Image src={property.image} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-accent-foreground text-xs">{property.category}</Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">{property.title}</h3>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{property.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Listed {property.date}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {visibleCount < filtered.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Load More Listings
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <main>
        <Navigation />
        <section className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </section>
        <Footer />
      </main>
    }>
      <PropertiesContent />
    </Suspense>
  )
}

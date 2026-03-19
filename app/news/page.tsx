"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Story } from "@/lib/stories"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, Loader2 } from "lucide-react"

const categories = [
  { name: "All", description: "Browse all stories from across our coverage areas." },
  { name: "Biodiversity & Wildlife", description: "The heart of the living world - stories about species, habitats, and the efforts to protect them." },
  { name: "Climate & Energy", description: "Making sense of the defining challenge of our time and the transition to clean energy." },
  { name: "Food & Agriculture", description: "Exploring how we grow, produce, and consume food, and its impact on the planet." },
  { name: "Extractives & Industry", description: "Investigating the impact of mining, oil drilling, and large-scale infrastructure on communities." },
  { name: "Forests, Water & Oceans", description: "Dedicated to the ecosystems that sustain all life, both above and below water." },
  { name: "People, Culture & Community Voices", description: "Where conservation meets human rights, traditional knowledge, and culture." },
  { name: "Analysis & Policy", description: "Cutting through jargon to explain what decisions in boardrooms and governments actually mean." },
  { name: "Solutions & Action", description: "A hopeful space focused on what's working and how people can get involved." },
]

export default function NewsPage() {
  const [allStories, setAllStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    fetch('/api/stories')
      .then(r => r.json())
      .then(data => {
        const stories = data
          .map((s: Record<string, unknown>) => ({
            ...s,
            readTime: s.read_time || '5 min read',
          }))
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
            new Date(b.date as string).getTime() - new Date(a.date as string).getTime()
          )
        setAllStories(stories)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeCategory === "All"
    ? allStories
    : allStories.filter((s) => s.category === activeCategory)

  const activeDesc = categories.find(c => c.name === activeCategory)?.description || ""
  const featured = allStories.find(s => s.featured) ?? allStories[0]
  const gridStories = filtered.slice(0, visibleCount)

  return (
    <main>
      <Navigation />

      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-[88px] sm:pt-[104px] md:pt-[120px] lg:pt-[136px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/realestate.jpg)" }} />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">From the Field</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            News & <span className="text-accent">Stories</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            Explore verified environmental journalism, community stories, and expert analysis from around the world.
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
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Featured Story</p>
                <h2 className="mb-4 font-serif text-2xl font-bold text-foreground transition-colors group-hover:text-accent md:text-3xl">{featured.title}</h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime}</span>
                </div>
                <Link href={`/news/${featured.id}`} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3">
                  Read Full Story <ArrowRight className="h-4 w-4" />
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
              {categories.map((cat) => (
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

            {gridStories.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">No stories in this category yet.</div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {gridStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/news/${story.id}`}
                    className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <article>
                      <div className="relative h-52 overflow-hidden">
                        <Image src={story.image} alt={story.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-accent-foreground text-xs">{story.category}</Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">{story.title}</h3>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{story.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{story.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{story.readTime}</span>
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
                  Load More Stories
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

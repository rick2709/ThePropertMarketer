"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"
import type { Story } from "@/lib/stories"
import { allStories as fallbackStories } from "@/lib/stories-data"

function toStory(s: Record<string, unknown>): Story {
  return {
    id: String(s.id),
    title: String(s.title),
    excerpt: String(s.excerpt),
    content: String(s.content ?? ''),
    category: String(s.category),
    image: String(s.image || '/images/realestate.jpg'),
    date: String(s.date),
    readTime: (s.read_time as string) || (s.readTime as string) || '5 min read',
    featured: Boolean(s.featured),
    published: Boolean(s.published),
    created_at: String(s.created_at ?? ''),
    updated_at: String(s.updated_at ?? ''),
  }
}

const FALLBACK = fallbackStories
  .slice(0, 3)
  .map(s => toStory({ ...s, read_time: s.readTime }))

export function StoriesSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [stories, setStories] = useState<Story[]>(FALLBACK)

  useEffect(() => {
    fetch('/api/stories')
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setStories(data.slice(0, 3).map(s => toStory(s as Record<string, unknown>)))
        }
        // if API fails or returns empty, keep the fallback already in state
      })
      .catch(() => {}) // fallback already in state
  }, [])

  return (
    <section className="bg-background py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            From the Field
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Latest <span className="text-accent">Stories</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story, i) => (
            <Link
              key={story.id}
              href={`/news/${story.id}`}
              className={`group overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <article>
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-accent-foreground text-xs">{story.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                    {story.title}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{story.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {story.readTime}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-accent transition-all group-hover:gap-2">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            View All Stories
          </Link>
        </div>
      </div>
    </section>
  )
}

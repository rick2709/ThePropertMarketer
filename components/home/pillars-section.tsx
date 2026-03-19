"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Home, Landmark, Megaphone, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const pillars = [
  { icon: Home, title: "Airbnb & Short-Term", desc: "Maximise returns with strategic short-term rental positioning, listing optimisation, and guest experience design." },
  { icon: Landmark, title: "Land & Development", desc: "From stands to full-scale developments—expert guidance on zoning, feasibility, and bringing projects to market." },
  { icon: Megaphone, title: "Brand Building", desc: "Build a distinctive real estate brand that attracts high-end clients and commands trust in the market." },
  { icon: TrendingUp, title: "Marketing Strategy", desc: "Data-driven campaigns, digital presence, and sales execution that close deals and grow your portfolio." },
]

export function PillarsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <>
      <section className="bg-card py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            Why The Property Marketer
          </p>
          <h2 className="mb-6 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Experience & <span className="text-primary">Trust</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            With over 8 years as a senior sales agent and her current role as marketing executive at Leengate,
            she brings a rare blend of on-the-ground sales experience and strategic marketing. Whether you&apos;re
            investing in stands, listing an Airbnb, or developing land, you get clarity, professionalism, and results.
          </p>
        </div>
      </section>

      <section className="bg-muted/50 py-24" ref={ref}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              What I Offer
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Core <span className="text-primary">Expertise</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item, i) => (
              <div
                key={item.title}
                className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
                <Link
                  href="/our-work"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

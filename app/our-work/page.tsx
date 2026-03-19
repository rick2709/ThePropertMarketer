"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Home, Landmark, Megaphone, TrendingUp, ArrowRight, Quote } from "lucide-react"
import Link from "next/link"

const pillars = [
  {
    num: "01",
    icon: Home,
    title: "Airbnb & Short-Term Rentals",
    desc: "Maximise occupancy and returns with the right positioning.",
    details: "From listing optimisation and photography to pricing strategy and guest experience design, I help property owners and investors get the most from short-term and holiday let opportunities. Ideal for high-yield portfolios and single units alike.",
  },
  {
    num: "02",
    icon: Landmark,
    title: "Land & Stand Development",
    desc: "Stands, parcels, and full-scale development projects.",
    details: "Whether you're selling residential or commercial stands or bringing a development to market, I provide clarity on zoning, feasibility, and positioning. From first-time buyers to institutional investors, the approach is tailored and professional.",
  },
  {
    num: "03",
    icon: Megaphone,
    title: "Brand Building",
    desc: "A real estate brand that attracts high-end clients.",
    details: "Trust and recognition don't happen by accident. I work with agents and agencies to build a distinctive brand—messaging, visual identity, and presence—that commands attention and attracts serious buyers and sellers.",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Marketing Strategy",
    desc: "Campaigns and channels that close deals.",
    details: "Data-informed marketing that drives viewings and sales. From digital campaigns and social presence to listing strategy and follow-up systems, the focus is on results: more enquiries, better qualified leads, and faster closes.",
  },
]

function PillarDetail({ pillar, index }: { pillar: (typeof pillars)[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const isEven = index % 2 === 0
  return (
    <div
      ref={ref}
      className={`grid gap-12 py-16 md:grid-cols-2 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={isEven ? "" : "md:order-2"}>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-serif text-5xl font-bold text-accent/20">{pillar.num}</span>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <pillar.icon className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h3 className="mb-4 font-serif text-2xl font-bold text-foreground">{pillar.title}</h3>
        <p className="mb-4 leading-relaxed text-muted-foreground">{pillar.desc}</p>
        <p className="leading-relaxed text-muted-foreground">{pillar.details}</p>
      </div>
      <div className={`flex items-center ${isEven ? "" : "md:order-1"}`}>
        <div className="relative w-full overflow-hidden rounded-xl bg-primary/5 p-8">
          <Quote className="mb-4 h-10 w-10 text-accent/30" />
          <blockquote className="font-serif text-lg italic leading-relaxed text-foreground">
            {index === 0 && "\"The right positioning turns a property into an opportunity.\""}
            {index === 1 && "\"Land and development need clarity and trust—from first viewing to handover.\""}
            {index === 2 && "\"Your brand should say quality before you say a word.\""}
            {index === 3 && "\"Marketing that doesn't drive viewings isn't marketing—it's noise.\""}
          </blockquote>
        </div>
      </div>
    </div>
  )
}

export default function OurWorkPage() {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1)

  return (
    <main>
      <Navigation />

      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-primary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">Expertise</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            What I <span className="text-primary-foreground/90">Offer</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            Airbnb, land development, brand building, and marketing strategy—backed by 8+ years as a senior sales agent and my role as marketing executive at Leengate.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-6">
          {pillars.map((pillar, i) => (
            <PillarDetail key={pillar.num} pillar={pillar} index={i} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary py-20" ref={ctaRef}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className={`relative mx-auto max-w-3xl px-6 text-center ${ctaVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="mb-4 font-serif text-3xl font-bold text-secondary-foreground md:text-4xl">
            Ready to Work Together?
          </h2>
          <p className="mb-8 text-lg text-secondary-foreground/85">
            Whether you have a stand to sell, an Airbnb to list, or a brand to build—get in touch for a no-obligation conversation.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-card px-8 py-3.5 font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-xl"
          >
            Get In Touch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

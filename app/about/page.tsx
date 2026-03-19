"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"
import { Award, Users, Shield, Target } from "lucide-react"

const values = [
  { icon: Target, title: "Results-Driven", desc: "Every listing and campaign is built to attract the right buyers and close deals." },
  { icon: Users, title: "Client-First", desc: "High-end clients deserve white-glove service, clear communication, and total discretion." },
  { icon: Shield, title: "Trust & Integrity", desc: "Your interests come first. Honest advice, transparent process, no pressure." },
  { icon: Award, title: "Expertise You Can Rely On", desc: "8+ years in sales and marketing strategy—stands, Airbnb, land development, and luxury." },
]

const milestones = [
  { year: "2016+", title: "Senior Sales Agent", desc: "Years of hands-on experience in residential and commercial real estate sales." },
  { year: "Today", title: "Marketing Executive", desc: "Leading marketing strategy at Leengate, combining sales and brand building." },
  { year: "Focus", title: "Airbnb & Land", desc: "Specialisation in short-term rentals, stands, and land development projects." },
]

function ValuesGrid() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <section className="bg-card py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Guiding Principles</p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">My <span className="text-accent">Values</span></h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={v.title}
              className={`rounded-xl border border-border bg-background p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold text-foreground">{v.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Timeline() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <section className="bg-card py-24" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Experience</p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Career <span className="text-accent">Highlights</span></h2>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={`relative mb-12 flex flex-col md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`w-full pl-12 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <span className="font-serif text-2xl font-bold text-accent">{m.year}</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-foreground">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
              <div className="absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-4 border-accent bg-card md:left-1/2 md:-translate-x-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main>
      <Navigation />

      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url(/images/real2.webp)" }} />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">About</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            Your Trusted <span className="text-primary-foreground/90">Real Estate Partner</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            Senior sales agent and marketing executive with 8+ years of experience. Specialising in Airbnb, land development, brand building, and marketing strategy at Leengate and beyond.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">The Brand</p>
            <h2 className="mb-6 font-serif text-3xl font-bold text-foreground">The Property <span className="text-accent">Marketer</span></h2>
          </div>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            The Property Marketer represents a commitment to sophistication, clarity, and results. Whether you are selling a stand, listing an Airbnb, or developing land, you get a partner who combines deep sales experience with strategic marketing—so your property reaches the right audience and closes with confidence.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Currently serving as Marketing Executive at Leengate, she brings both on-the-ground sales expertise and high-level brand and campaign strategy. The goal is simple: attract high-end clients, build trust, and deliver a seamless experience from first contact to keys in hand.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/rearesidential.webp"
                alt="Luxury residential property"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Vision</p>
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">Premium, <span className="text-accent">Personal</span> Service</h2>
            <p className="leading-relaxed text-muted-foreground">
              A real estate experience where every client is treated as a priority—with tailored listings, clear communication, and a brand that reflects quality and trust.
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Mission</p>
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">Results Through <span className="text-accent">Expertise</span></h2>
            <p className="leading-relaxed text-muted-foreground">
              To leverage 8+ years of sales and marketing experience to help clients buy, sell, and invest in property with confidence—from stands and Airbnb to land development and luxury.
            </p>
          </div>
        </div>
      </section>

      <ValuesGrid />
      <Timeline />
      <Footer />
    </main>
  )
}

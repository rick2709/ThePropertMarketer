"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Calendar, Phone, Search, Key } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: Phone,
    label: "Initial Consultation",
    desc: "Discuss your property goals, budget, and timeline in a no-obligation call.",
    href: "/contact",
  },
  {
    number: "02",
    icon: Search,
    label: "Tailored Property Search",
    desc: "Receive a curated selection of properties matching your exact criteria.",
    href: "/properties",
  },
  {
    number: "03",
    icon: Calendar,
    label: "Schedule Viewings",
    desc: "Visit shortlisted properties at times convenient for you.",
    href: "/contact",
  },
  {
    number: "04",
    icon: Key,
    label: "Close with Confidence",
    desc: "Expert support from offer negotiation right through to receiving the keys.",
    href: "/contact",
  },
]

export function CalendarSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section className="bg-background py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            How It Works
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Work With <span className="text-primary">Me</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
            A simple, structured process designed to make your property journey effortless and successful.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Link
              key={i}
              href={step.href}
              className={`group relative rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mb-5 font-serif text-5xl font-bold leading-none text-primary/30 transition-colors duration-300">
                {step.number}
              </div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold text-foreground">
                {step.label}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block" style={{ zIndex: 1 }}>
                  <div className="h-px w-6 bg-border" />
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 hover:bg-primary/90 active:scale-95"
          >
            Start the Conversation
          </Link>
        </div>
      </div>
    </section>
  )
}

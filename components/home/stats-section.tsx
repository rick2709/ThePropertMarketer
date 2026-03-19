"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useEffect, useState } from "react"
import { Award, Users, TrendingUp, Building } from "lucide-react"

const stats = [
  { value: 8, suffix: "+", label: "Years Experience", sublabel: "Senior Sales Agent", icon: Award },
  { value: 150, suffix: "+", label: "Happy Clients", sublabel: "Trusted relationships", icon: Users },
  { value: 200, suffix: "+", label: "Listings Sold", sublabel: "Successful closings", icon: TrendingUp },
  { value: 50, suffix: "+", label: "Properties Listed", sublabel: "Active portfolio", icon: Building },
]

function AnimatedNumber({ target, suffix, isVisible }: { target: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible || target === 0) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isVisible, target])

  return (
    <span className="font-serif text-4xl font-bold text-secondary-foreground md:text-5xl">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section ref={ref} className="relative overflow-hidden bg-secondary py-20">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary-foreground/70">
            By the Numbers
          </p>
          <h2 className="font-serif text-3xl font-bold text-secondary-foreground md:text-4xl">
            Proven Track Record
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-secondary-foreground/15 bg-secondary-foreground/10 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-secondary-foreground/15 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-foreground/20">
                <stat.icon className="h-6 w-6 text-secondary-foreground/90" />
              </div>
              <AnimatedNumber target={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              <p className="mt-1.5 text-sm font-semibold text-secondary-foreground/95">{stat.label}</p>
              <p className="mt-0.5 text-xs text-secondary-foreground/60">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

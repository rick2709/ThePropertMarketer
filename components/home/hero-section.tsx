"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, Play } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center justify-items-center">

          {/* Hero Image — first on mobile, second on desktop */}
          <div
            className={`order-1 lg:order-2 relative w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* Decorative background shapes — behind the image */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 border-2 border-accent/30 rounded-3xl -z-10" />
            <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-20 h-20 sm:w-32 sm:h-32 bg-accent/10 rounded-3xl -z-10" />

            {/* Image container */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-muted">
              <Image
                src="/images/hero-property.jpg"
                alt="Luxury real estate property"
                width={600}
                height={750}
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.02]"
                priority
                style={{ display: "block" }}
              />
            </div>

            {/* Stats card — sits below the image, never overlaps */}
            <div className="mt-3 sm:mt-4 mx-2 px-4 sm:px-6 py-3 sm:py-4 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border/40">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-accent">8+</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">Years of Excellence</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">In Real Estate Marketing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content — second on mobile, first on desktop */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start justify-center space-y-6 sm:space-y-8 w-full max-w-xl text-center lg:text-left">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Marketing Executive at Leengate
            </div>

            {/* Main Heading */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] text-foreground transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block">Elevating</span>
              <span className="block text-accent">Real Estate</span>
              <span className="block">Brands</span>
            </h1>

            {/* Subheading */}
            <p
              className={`text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              With 8+ years of expertise in real estate marketing, I transform properties into
              compelling stories that captivate high-end clients and drive exceptional results.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <a
                href="#portfolio"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              >
                View My Work
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </a>
              <a
                href="/about"
                className="group px-8 py-4 border-2 border-foreground/20 text-foreground rounded-full font-medium transition-all duration-300 hover:border-accent hover:bg-accent/5 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Learn More
              </a>
            </div>

            {/* Scrolling Marquee */}
            <div
              className={`flex items-center gap-4 pt-2 w-full transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="text-sm text-muted-foreground whitespace-nowrap">Specializing in:</span>
              <div className="overflow-hidden flex-1">
                <div className="flex animate-marquee gap-8">
                  {["Airbnb Marketing", "Land Development", "Brand Building", "Marketing Strategy", "Airbnb Marketing", "Land Development", "Brand Building", "Marketing Strategy"].map((item, i) => (
                    <span key={i} className="text-sm font-medium text-foreground whitespace-nowrap">
                      {item} <span className="text-accent mx-2">•</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 rounded-full border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all duration-300 animate-bounce"
        aria-label="Scroll to services"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </section>
  )
}

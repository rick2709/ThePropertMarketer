"use client"

import { useState, useEffect, useRef } from "react"

const panels = [
  {
    heading: "Residential Stands",
    desc: "Prime stands across Harare's top neighbourhoods, ready for immediate development.",
  },
  {
    heading: "Commercial Stands",
    desc: "Strategic commercial plots positioned for high visibility and business growth.",
  },
  {
    heading: "Air BNB",
    desc: "High-yield short-term rental opportunities with strong year-round income potential.",
  },
  {
    heading: "Residential & Luxury Apartments",
    desc: "Premium residences and high-end apartments for discerning buyers and investors.",
  },
]

const FALLBACK_IMAGE = "/images/realestate.jpg"

const PANEL_IMAGES = [
  "/images/rearesidential.webp",
  "/images/real2.webp",
  "/images/installment.webp",
  "/images/realestate.jpg",
] as const

const BRAND_OVERLAY =
  "linear-gradient(180deg, rgba(0,40,140,0.48) 0%, rgba(0,15,60,0.82) 100%)"

export function HeroSection() {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null)
  // Track whether the device is touch / narrow so we can adjust behaviour
  const [isMobile, setIsMobile] = useState(false)
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Touch handlers — give a brief "active" flash then release
  const handleTouchStart = (i: number) => {
    if (touchTimer.current) clearTimeout(touchTimer.current)
    setHoveredPanel(i)
  }
  const handleTouchEnd = () => {
    touchTimer.current = setTimeout(() => setHoveredPanel(null), 700)
  }

  return (
    <section
      className="hero-section min-h-screen"
      style={{ height: "100vh", position: "relative", overflow: "hidden" }}
    >
      {/* Layer 0 — fallback still image */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${FALLBACK_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Layer 1 — background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      >
        <source src="/vid/backgroundvid.mp4" type="video/mp4" />
      </video>

      {/* Layer 2 — global brand overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          background: BRAND_OVERLAY,
          zIndex: 2,
        }}
      />

      {/* Layer 3 — column layout */}
      <div
        className="hero-columns"
        style={{
          position: "relative", zIndex: 3,
          height: "100%", display: "flex", width: "100%",
        }}
      >
        {panels.map((panel, i) => {
          const isActive = hoveredPanel === i

          // Description is ALWAYS visible on mobile; hover-driven on desktop
          const showDesc = isActive || isMobile

          // Text lift only on desktop hover — on mobile the text is static
          const liftText = isActive && !isMobile

          const isLast = i === panels.length - 1

          return (
            <div
              key={i}
              className="hero-panel"
              onMouseEnter={() => setHoveredPanel(i)}
              onMouseLeave={() => setHoveredPanel(null)}
              onTouchStart={() => handleTouchStart(i)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => setHoveredPanel(null)}
              style={{
                flex: 1,
                height: "100vh",
                borderRight: isLast
                  ? "none"
                  : "0.8px solid rgba(255,255,255,0.30)",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              {/* Per-panel parallax layer — always in DOM so opacity transitions work */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `${BRAND_OVERLAY}, url(${PANEL_IMAGES[i % PANEL_IMAGES.length]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: isActive ? "scale(1.05)" : "scale(1.0)",
                  opacity: isActive ? 1 : 0,
                  // Slow zoom in, fast reset so next touch/hover starts clean
                  transition: isActive
                    ? "transform 6s ease, opacity 350ms ease"
                    : "opacity 350ms ease, transform 450ms ease",
                  zIndex: 0,
                }}
              />

              {/* Text block — anchored to bottom, lifts on desktop hover */}
              <div
                className="hero-text"
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  padding: "0 10% 8%",
                  zIndex: 1,
                  transform: liftText ? "translateY(-12px)" : "translateY(0px)",
                  transition: "transform 400ms cubic-bezier(0.25,0.46,0.45,0.94)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Geomanist-Medium, Helvetica, Arial, sans-serif",
                    fontSize: "1.75em",
                    fontWeight: 500,
                    color: "rgb(255,255,255)",
                    textAlign: "left",
                    lineHeight: "1.4em",
                    margin: 0,
                    marginBottom: "0.55em",
                  }}
                >
                  {panel.heading}
                </h2>

                <p
                  className="hero-panel-desc"
                  style={{
                    fontFamily: "DM Sans, Helvetica, Arial, sans-serif",
                    fontSize: "0.82em",
                    fontWeight: 400,
                    color: "rgba(209,224,255,0.88)",
                    textAlign: "left",
                    lineHeight: "1.65em",
                    margin: 0,
                    maxWidth: "26ch",
                    // Driven by showDesc — React state, not CSS override
                    opacity: showDesc ? 1 : 0,
                    transform: showDesc ? "translateY(0)" : "translateY(8px)",
                    transition: isMobile
                      ? "none"
                      : "opacity 380ms ease 80ms, transform 380ms ease 80ms",
                  }}
                >
                  {panel.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

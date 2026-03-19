"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, type Variants } from "framer-motion"

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

// Richer navy overlay — heavier on mobile via a second layer
const BRAND_OVERLAY =
  "linear-gradient(180deg, rgba(0,30,110,0.62) 0%, rgba(0,10,50,0.92) 100%)"

const PANEL_OVERLAY =
  "linear-gradient(180deg, rgba(0,20,80,0.55) 0%, rgba(0,8,45,0.96) 100%)"

// ── Animation variants ──────────────────────────────────────────────────────

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const

// Per-panel: fades + slides up when it enters the viewport.
// On desktop all panels are in-view at once → feels like a stagger (delay by index).
// On mobile panels are stacked and scroll in → each triggers individually.
const panelVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.1 },
  }),
}

// Text block slides up inside the panel once the panel is visible
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: 0.2 },
  },
}

const descVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.2, ease: "easeIn" },
  },
}

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.05 },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.18, ease: "easeIn" },
  },
}

export function HeroSection() {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleTouchStart = (i: number) => {
    if (touchTimer.current) clearTimeout(touchTimer.current)
    setHoveredPanel(i)
  }
  const handleTouchEnd = () => {
    touchTimer.current = setTimeout(() => setHoveredPanel(null), 900)
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

      {/* Layer 2 — global navy brand overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          background: BRAND_OVERLAY,
          zIndex: 2,
        }}
      />

      {/* Layer 2b — extra mobile darkening so video never looks washed out */}
      <div
        aria-hidden="true"
        className="mobile-extra-overlay"
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,12,55,0.38)",
          zIndex: 3,
        }}
      />

      {/* Layer 3 — column layout */}
      <div
        className="hero-columns"
        style={{
          position: "relative", zIndex: 4,
          height: "100%", display: "flex", width: "100%",
        }}
      >
        {panels.map((panel, i) => {
          const isActive = hoveredPanel === i
          const showDesc = isActive || isMobile
          const isLast = i === panels.length - 1

          return (
            <motion.div
              key={i}
              className="hero-panel"
              custom={i}
              variants={panelVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
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
                  : "0.8px solid rgba(255,255,255,0.22)",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              {/* Per-panel image layer with deeper navy overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `${PANEL_OVERLAY}, url(${PANEL_IMAGES[i % PANEL_IMAGES.length]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: isActive ? "scale(1.07)" : "scale(1.0)",
                  opacity: isActive ? 1 : 0,
                  transition: isActive
                    ? "transform 6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 400ms ease"
                    : "opacity 400ms ease, transform 500ms ease",
                  zIndex: 0,
                }}
              />

              {/* Text block — slides up when panel enters view; lifts further on desktop hover */}
              <motion.div
                className="hero-text"
                variants={textVariants}
                animate={{
                  y: isActive && !isMobile ? -32 : 0,
                }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  padding: "0 10% 8%",
                  zIndex: 1,
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

                <AnimatePresence mode="wait">
                  {showDesc && (
                    <motion.p
                      key="desc"
                      className="hero-panel-desc"
                      variants={descVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{
                        fontFamily: "DM Sans, Helvetica, Arial, sans-serif",
                        fontSize: "0.82em",
                        fontWeight: 400,
                        color: "rgba(209,224,255,0.88)",
                        textAlign: "left",
                        lineHeight: "1.65em",
                        margin: 0,
                        marginBottom: "1.1em",
                        maxWidth: "26ch",
                      }}
                    >
                      {panel.desc}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {(isActive || isMobile) && (
                    <motion.div
                      key="btn"
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href="/properties"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45em",
                          padding: "0.52em 1.1em",
                          background: "rgba(255,255,255,0.12)",
                          border: "1px solid rgba(255,255,255,0.35)",
                          borderRadius: "4px",
                          color: "rgba(255,255,255,0.92)",
                          fontFamily: "DM Sans, Helvetica, Arial, sans-serif",
                          fontSize: "0.75em",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          backdropFilter: "blur(6px)",
                          WebkitBackdropFilter: "blur(6px)",
                          transition: "background 220ms ease, border-color 220ms ease",
                        }}
                        onMouseEnter={e => {
                          ;(e.currentTarget as HTMLAnchorElement).style.background =
                            "rgba(255,255,255,0.22)"
                          ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                            "rgba(255,255,255,0.65)"
                        }}
                        onMouseLeave={e => {
                          ;(e.currentTarget as HTMLAnchorElement).style.background =
                            "rgba(255,255,255,0.12)"
                          ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                            "rgba(255,255,255,0.35)"
                        }}
                      >
                        Explore
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                          style={{ flexShrink: 0 }}
                        >
                          <path
                            d="M2 6h8M7 3l3 3-3 3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

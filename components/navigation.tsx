"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Instagram, Facebook, MessageCircle } from "lucide-react"

const socialLinks = [
  { href: "https://wa.me/263783580470", icon: MessageCircle, label: "WhatsApp", color: "hover:text-[#25D366]" },
  { href: "https://www.instagram.com/theconservation_compass?igsh=ZXU1cXplemY0a3pz", icon: Instagram, label: "Instagram", color: "hover:text-[#E1306C]" },
  { href: "https://www.facebook.com/share/1KxvVSWvgC/", icon: Facebook, label: "Facebook", color: "hover:text-[#1877F2]" },
]

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Expertise" },
  { href: "/properties", label: "Properties" },
]

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Always solid: no "transparent at top" navbar behavior.
  const navBg = "bg-card border border-border shadow-lg shadow-black/5"
  const linkActive = "text-accent bg-accent/10"
  const linkInactive = "text-foreground hover:text-accent hover:bg-accent/5"
  const ctaClass = "bg-accent text-white hover:bg-accent/90 hover:shadow-accent/20"
  const phoneClass = "text-muted-foreground hover:text-accent"

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 sm:py-2 ${navBg}`}
        >
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo-full.png"
              alt="The Property Marketer"
              width={280}
              height={70}
              className="h-9 w-auto transition-all duration-300 sm:h-10"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium tracking-wide transition-colors ${
                  pathname === link.href ? linkActive : linkInactive
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {/* Social icons */}
            <div className="flex items-center gap-1 mr-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted ${s.color}`}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <a
              href="tel:+263783580470"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${phoneClass}`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">+263 78 358 0470</span>
            </a>
            <Link
              href="/contact"
              className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${ctaClass}`}
            >
              Get In Touch
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors lg:hidden ${
              "text-foreground hover:bg-muted"
            }`}
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <div
          className={`mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all duration-300 lg:hidden ${
            isMobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              {/* Social links in mobile menu */}
              <div className="flex items-center gap-2 px-4 py-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted ${s.color}`}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <a
                href="tel:+263783580470"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-accent hover:bg-accent/5 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +263 78 358 0470
              </a>
              <Link
                href="/contact"
                className="mt-1 flex justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
              >
                Get In Touch
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}

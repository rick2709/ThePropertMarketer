"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 sm:px-5 sm:py-2">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo-full.png"
              alt="The Property Marketer"
              width={280}
              height={70}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium tracking-wide transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="tel:+263716437751"
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">+263 716 437 751</span>
            </a>
            <Link
              href="/contact"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-primary/20 active:scale-[0.98]"
            >
              Get In Touch
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted lg:hidden"
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
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <a
                href="tel:+263716437751"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                <Phone className="h-4 w-4" />
                +263 716 437 751
              </a>
              <Link
                href="/contact"
                className="mt-1 flex justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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

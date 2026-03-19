import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from "lucide-react"

const footerLinks = [
  { href: "/about", label: "About Us" },
  { href: "/our-work", label: "Expertise" },
  { href: "/properties", label: "Properties" },
  { href: "/contact", label: "Contact" },
]

const socialLinks = [
  { href: "https://wa.me/263783580470", icon: MessageCircle, label: "WhatsApp", color: "hover:border-[#25D366]/60 hover:bg-[#25D366]/10 hover:text-[#25D366]" },
  { href: "https://www.instagram.com/theconservation_compass?igsh=ZXU1cXplemY0a3pz", icon: Instagram, label: "Instagram", color: "hover:border-[#E1306C]/60 hover:bg-[#E1306C]/10 hover:text-[#E1306C]" },
  { href: "https://www.facebook.com/share/1KxvVSWvgC/", icon: Facebook, label: "Facebook", color: "hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 hover:text-[#1877F2]" },
]

export function Footer() {
  return (
    <footer className="bg-primary">
      {/* Top border accent */}
      <div className="h-1 w-full bg-primary-foreground/20" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/logo-full.png"
                alt="The Property Marketer"
                width={240}
                height={60}
                className="h-14 w-auto md:h-16"
              />
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              Premium real estate marketing & sales. 8+ years of expertise in Airbnb, land development,
              brand building & marketing strategy. Your trusted partner for high-end property in Zimbabwe.
            </p>
            {/* Contact info */}
            <div className="flex flex-col gap-2.5">
              <a href="tel:+263783580470" className="flex items-center gap-2.5 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary-foreground/90" />
                +263 78 358 0470
              </a>
              <a href="mailto:info@thepropertymarketer.com" className="flex items-center gap-2.5 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary-foreground/90" />
                info@thepropertymarketer.com
              </a>
              <span className="flex items-center gap-2.5 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary-foreground/90" />
                Harare, Zimbabwe
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & CTA */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">Connect With Us</h3>
            <div className="mb-6 flex flex-col gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`flex items-center gap-3 rounded-xl border border-primary-foreground/20 px-3.5 py-2.5 text-primary-foreground/80 transition-all ${social.color}`}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{social.label}</span>
                </a>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary-foreground"
            >
              Book a Viewing
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-8">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-xs text-primary-foreground/60">
              &copy; {new Date().getFullYear()} The Property Marketer. All Rights Reserved.
            </p>
            <p className="text-xs text-primary-foreground/60">
              Developed by{" "}
              <a
                href="https://www.synaptixinnovationlabs.co.zw/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Synaptix Innovation Labs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

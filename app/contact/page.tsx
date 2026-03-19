"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { MapPin, Phone, Mail, Send, Instagram, Facebook, AlertCircle, MessageCircle } from "lucide-react"

const subjects = [
  "Property Viewing",
  "List My Property",
  "Airbnb / Short-Term",
  "Land & Development",
  "Marketing / Brand",
  "General Inquiry",
]

const socialLinks = [
  { href: "https://wa.me/263716437751", icon: MessageCircle, label: "WhatsApp" },
  { href: "https://www.instagram.com/theconservation_compass?igsh=ZXU1cXplemY0a3pz", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/share/1KxvVSWvgC/", icon: Facebook, label: "Facebook" },
]

const CONTACT_EMAIL = "hello@thepropertymarketer.com"

type FormErrors = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        return undefined
      case "email":
        if (!value.trim()) return "Email is required"
        if (!validateEmail(value)) return "Please enter a valid email address"
        return undefined
      case "subject":
        if (!value) return "Please select a subject"
        return undefined
      case "message":
        if (!value.trim()) return "Message is required"
        if (value.trim().length < 10) return "Message must be at least 10 characters"
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    newErrors.name = validateField("name", formData.name)
    newErrors.email = validateField("email", formData.email)
    newErrors.subject = validateField("subject", formData.subject)
    newErrors.message = validateField("message", formData.message)
    
    // Remove undefined entries
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors]
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, subject: true, message: true })
    
    if (!validateForm()) {
      return
    }
    
    // Build the mailto URL with encoded parameters
    const emailSubject = `[${formData.subject}] Contact from ${formData.name}`
    const emailBody = `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent via The Property Marketer Contact Form`
    
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    
    // Open the default email client
    window.location.href = mailtoUrl
    
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="relative flex min-h-[45vh] items-center justify-center overflow-hidden bg-primary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">Reach Out</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            Get In <span className="text-primary-foreground/90">Touch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            Schedule a viewing, list your property, or discuss your next move. I&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-background py-24" ref={ref}>
        <div
          className={`mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">Email App Opened!</h3>
                <p className="max-w-sm text-muted-foreground">
                  Your default email application should now be open with your message pre-filled. 
                  Simply review and click send in your email app.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  If the email app did not open, please email us directly at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: "", email: "", subject: "", message: "" })
                    setErrors({})
                    setTouched({})
                  }}
                  className="mt-6 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
                >
                  Start a new message
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-2 font-serif text-2xl font-bold text-foreground">Send a Message</h2>
                <p className="mb-8 text-sm text-muted-foreground">Fill out the form and I will get back to you as soon as possible.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your full name"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                        errors.name && touched.name
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-accent focus:ring-accent"
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p id="name-error" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                        errors.email && touched.email
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-accent focus:ring-accent"
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p id="email-error" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={errors.subject ? "true" : "false"}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-1 ${
                        errors.subject && touched.subject
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-accent focus:ring-accent"
                      }`}
                    >
                      <option value="" disabled>Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.subject && touched.subject && (
                      <p id="subject-error" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={`w-full resize-none rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                        errors.message && touched.message
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-accent focus:ring-accent"
                      }`}
                    />
                    {errors.message && touched.message && (
                      <p id="message-error" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:bg-primary/90 active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    Open Email to Send
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Clicking submit will open your default email application with your message pre-filled.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Contact Info + Map */}
          <div className="flex flex-col gap-8">
            {/* Map Placeholder */}
            <div className="relative h-72 overflow-hidden rounded-2xl border border-border bg-muted">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto mb-3 h-10 w-10 text-accent" />
                  <p className="font-serif text-lg font-bold text-foreground">Leengate & Beyond</p>
                  <p className="text-sm text-muted-foreground">Premium real estate marketing</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-6 font-serif text-xl font-bold text-foreground">Contact Information</h3>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">Serving clients through Leengate and independently</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone / WhatsApp</p>
                    <a 
                      href="https://wa.me/263716437751" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                      +263 71 643 7751
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">hello@thepropertymarketer.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="mb-4 text-sm font-medium text-foreground">Connect</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

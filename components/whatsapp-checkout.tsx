"use client"

import { useState } from "react"
import { X, MessageCircle, ChevronRight, Check, MapPin, ShoppingBag, User, CreditCard, Truck } from "lucide-react"
import type { CartItem } from "@/lib/cart-context"

// ── Types ─────────────────────────────────────────────────────
type PaymentMethod = "EcoCash" | "Bank Transfer" | "Cash on Delivery" | "International Card"
type FulfilmentType = "collect" | "delivery"

interface FormState {
  name: string
  phone: string
  paymentMethod: PaymentMethod | ""
  fulfilment: FulfilmentType | ""
  address: string
  notes: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  "EcoCash",
  "Bank Transfer",
  "Cash on Delivery",
  "International Card",
]

// ── Props ─────────────────────────────────────────────────────
interface WhatsAppCheckoutProps {
  items: CartItem[]
  totalPrice: number
  onClose: () => void
  onSuccess: () => void
}

// ── Helpers ───────────────────────────────────────────────────
function buildWhatsAppMessage(form: FormState, items: CartItem[], total: number): string {
  const orderLines = items
    .map(i => `  • ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n")

  const fulfilmentLine =
    form.fulfilment === "delivery"
      ? `Delivery to: ${form.address}`
      : "Collection (I will collect in person)"

  const msg = [
    "🧭 *New Order — Conservation Compass Shop*",
    "",
    `*Customer:* ${form.name}`,
    `*Phone:* ${form.phone}`,
    "",
    "*Order Items:*",
    orderLines,
    "",
    `*Order Total:* $${total.toFixed(2)}`,
    "",
    `*Payment Method:* ${form.paymentMethod}`,
    `*Fulfilment:* ${fulfilmentLine}`,
    form.notes ? `\n*Notes:* ${form.notes}` : "",
    "",
    "_Sent from conservationcompass.co.zw_",
  ]
    .filter(l => l !== undefined)
    .join("\n")

  return encodeURIComponent(msg)
}

// ── Component ─────────────────────────────────────────────────
export function WhatsAppCheckout({ items, totalPrice, onClose, onSuccess }: WhatsAppCheckoutProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    paymentMethod: "",
    fulfilment: "",
    address: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [step, setStep] = useState<1 | 2>(1)

  const set = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  // ── Validation ────────────────────────────────────────────
  function validateStep1() {
    const errs: typeof errors = {}
    if (!form.name.trim())     errs.name = "Please enter your full name"
    if (!form.phone.trim())    errs.phone = "Please enter a contact number"
    if (!form.paymentMethod)   errs.paymentMethod = "Please select a payment method"
    if (!form.fulfilment)      errs.fulfilment = "Please choose collect or delivery"
    if (form.fulfilment === "delivery" && !form.address.trim())
      errs.address = "Please enter your delivery address"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleReview() {
    if (validateStep1()) setStep(2)
  }

  function handleSendToWhatsApp() {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "263771234567"
    const msg = buildWhatsAppMessage(form, items, totalPrice)
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank")
    onSuccess()
  }

  // ── Step 1: Customer details form ─────────────────────────
  const Step1 = (
    <div className="space-y-5">

      {/* Name */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <User className="h-3.5 w-3.5" /> Full Name <span className="text-accent">*</span>
        </label>
        <input
          value={form.name}
          onChange={e => set("name", e.target.value)}
          placeholder="e.g. Tatenda Moyo"
          className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10 ${errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp / Phone <span className="text-accent">*</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => set("phone", e.target.value)}
          placeholder="e.g. 0771 234 567"
          className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10 ${errors.phone ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
      </div>

      {/* Payment method */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5" /> Payment Method <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(method => (
            <button
              key={method}
              type="button"
              onClick={() => set("paymentMethod", method)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                form.paymentMethod === method
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              }`}
            >
              {method === "EcoCash" && <span className="mb-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#00A651] text-[9px] font-bold text-white">EC</span>}
              {method}
            </button>
          ))}
        </div>
        {errors.paymentMethod && <p className="mt-1 text-xs text-destructive">{errors.paymentMethod}</p>}
      </div>

      {/* Collect vs Delivery */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Truck className="h-3.5 w-3.5" /> How do you want your order? <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => set("fulfilment", "collect")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-4 text-center text-sm font-medium transition-all ${
              form.fulfilment === "collect"
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                : "border-border bg-background text-foreground hover:border-primary/50"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Collect</span>
            <span className="text-[11px] font-normal text-muted-foreground">Pick up in person</span>
          </button>
          <button
            type="button"
            onClick={() => set("fulfilment", "delivery")}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-4 text-center text-sm font-medium transition-all ${
              form.fulfilment === "delivery"
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                : "border-border bg-background text-foreground hover:border-primary/50"
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span>Delivery</span>
            <span className="text-[11px] font-normal text-muted-foreground">We bring it to you</span>
          </button>
        </div>
        {errors.fulfilment && <p className="mt-1 text-xs text-destructive">{errors.fulfilment}</p>}
      </div>

      {/* Address — only shown when delivery */}
      {form.fulfilment === "delivery" && (
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Delivery Address <span className="text-accent">*</span>
          </label>
          <textarea
            value={form.address}
            onChange={e => set("address", e.target.value)}
            placeholder="Street, suburb, city / town…"
            rows={3}
            className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10 ${errors.address ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
          />
          {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Additional Notes <span className="font-normal normal-case text-muted-foreground/60">(optional)</span>
        </label>
        <textarea
          value={form.notes}
          onChange={e => set("notes", e.target.value)}
          placeholder="Any special requests or instructions…"
          rows={2}
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <button
        onClick={handleReview}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
      >
        Review Order <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )

  // ── Step 2: Order summary + confirm ───────────────────────
  const Step2 = (
    <div className="space-y-5">
      {/* Order items */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Order</p>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
              <span className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-bold">
            <span>Total</span>
            <span className="text-accent">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer details summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2 text-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Details</p>
        <p><span className="font-semibold">Name:</span> {form.name}</p>
        <p><span className="font-semibold">Phone:</span> {form.phone}</p>
        <p><span className="font-semibold">Payment:</span> {form.paymentMethod}</p>
        <p>
          <span className="font-semibold">Fulfilment:</span>{" "}
          {form.fulfilment === "delivery" ? `Delivery → ${form.address}` : "Collection (in person)"}
        </p>
        {form.notes && <p><span className="font-semibold">Notes:</span> {form.notes}</p>}
      </div>

      <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-4 text-sm text-foreground">
        <p className="font-semibold text-[#128C7E]">Clicking the button below will open WhatsApp</p>
        <p className="mt-1 text-muted-foreground">Your order details will be pre-filled in a message to our team. We will confirm your order and provide payment instructions.</p>
      </div>

      <button
        onClick={handleSendToWhatsApp}
        className="flex w-full items-center justify-center gap-3 rounded-xl py-4 font-bold text-white transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.853L0 24l6.335-1.508A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.034-1.376l-.361-.214-3.741.981 1.001-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
        </svg>
        Send Order via WhatsApp
      </button>

      <button
        onClick={() => setStep(1)}
        className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
      >
        ← Edit Details
      </button>
    </div>
  )

  // ── Modal shell ───────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl border-b border-border bg-background/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              {step === 1 ? "Complete Your Order" : "Confirm & Send"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Step {step} of 2 — {step === 1 ? "Your details" : "Review & send via WhatsApp"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step > s ? "bg-primary text-primary-foreground" :
                step === s ? "bg-accent text-accent-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </div>
              <span className={`text-xs font-medium ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Details" : "Confirm"}
              </span>
              {s < 2 && <div className={`h-px w-8 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Form body */}
        <div className="px-6 py-5">
          {step === 1 ? Step1 : Step2}
        </div>
      </div>
    </div>
  )
}

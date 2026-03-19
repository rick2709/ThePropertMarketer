"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"
import { ShoppingBag, Heart, Check } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { staticProducts } from "@/lib/products-data"

type ShopProduct = { id: string; name: string; desc: string; price: number; priceZWG: string; image: string; category: string }

function toShopProduct(p: Product): ShopProduct {
  return { id: p.id, name: p.name, desc: p.description, price: p.price, priceZWG: p.price_zwg, image: p.image, category: p.category }
}

function ProductCard({ product }: { product: ShopProduct }) {
  const { addItem } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
            wishlisted ? "bg-destructive text-destructive-foreground" : "bg-card/80 text-muted-foreground hover:bg-card"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-6">
        <h3 className="mb-1 font-serif text-lg font-bold text-foreground">{product.name}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{product.desc}</p>
        <div className="mb-4">
          <span className="text-xl font-bold text-accent">${product.price}</span>
          <span className="ml-2 text-xs text-muted-foreground">({product.priceZWG})</span>
        </div>
        <button
          onClick={handleAdd}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all ${
            justAdded
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [products, setProducts] = useState<ShopProduct[]>(staticProducts.map(toShopProduct))

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts((data as Product[]).map(toShopProduct))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-[88px] sm:pt-[104px] md:pt-[120px] lg:pt-[136px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/installment.webp)" }} />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">The Engine</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            Navigate Change With <span className="text-accent">Every Purchase</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            Our storytelling is free for everyone. The Conservation Compass Shop is how we sustain it. As a social enterprise, every purchase you make directly fuels our mission to make conservation knowledge a public good.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="bg-background py-24" ref={ref}>
        <div className="mx-auto max-w-7xl px-6">
          <div
            className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${
              isVisible ? "animate-fade-in" : "opacity-0"
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Our Promise</p>
            <h2 className="font-serif text-3xl font-bold text-foreground">Where Your <span className="text-accent">Purchase Goes</span></h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="font-serif text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold text-foreground">Fund the Mission</h3>
              <p className="text-sm text-muted-foreground">All proceeds (after product costs) are reinvested into our platform, fellowships, and operations.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="font-serif text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold text-foreground">Ethical & Sustainable</h3>
              <p className="text-sm text-muted-foreground">We partner with suppliers and artisans who share our values.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="font-serif text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold text-foreground">Transparent Impact</h3>
              <p className="text-sm text-muted-foreground">We regularly report back on how shop revenue is supporting our work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Payment Methods</h2>
          <p className="mb-8 text-muted-foreground">
            We accept multiple payment methods including EcoCash, bank transfer, and international cards.
            
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00A651]">
                <span className="text-xs font-bold text-card">EC</span>
              </div>
              <span className="text-sm font-medium text-foreground">EcoCash</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3">
              <span className="text-sm font-medium text-foreground">Bank Transfer</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3">
              <span className="text-sm font-medium text-foreground">International Cards</span>
            </div>
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  )
}

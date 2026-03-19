"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useCart } from "@/lib/cart-context"
import { ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { staticProducts } from "@/lib/products-data"

const DEFAULT_PREVIEW = staticProducts.slice(0, 4).map(p => ({
  id: p.id, name: p.name, price: p.price, image: p.image, desc: p.description,
}))

export function ShopPreview() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const { addItem } = useCart()
  const [products, setProducts] = useState(DEFAULT_PREVIEW)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            (data as Product[]).slice(0, 4).map(p => ({
              id: p.id, name: p.name, price: p.price, image: p.image, desc: p.description,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-background py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Support Conservation
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            From the Conservation <span className="text-accent">Compass Shop</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`group overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-serif text-lg font-bold text-foreground">{product.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">${product.price}</span>
                  <button
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90"
          >
            Browse Full Shop
          </Link>
        </div>
      </div>
    </section>
  )
}

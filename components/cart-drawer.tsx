"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { WhatsAppCheckout } from "@/components/whatsapp-checkout"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  function handleCheckoutSuccess() {
    setShowCheckout(false)
    setIsCartOpen(false)
    clearCart()
  }

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col bg-card">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl text-foreground">Your Cart</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {items.length === 0 ? "Your cart is empty." : `${items.length} item(s) in your cart.`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-border py-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-accent">${item.price.toFixed(2)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between pb-4">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-accent">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.853L0 24l6.335-1.508A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.034-1.376l-.361-.214-3.741.981 1.001-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
                </svg>
                Checkout via WhatsApp
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Your order will be sent to our team on WhatsApp
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* WhatsApp checkout modal — rendered outside Sheet so it overlays properly */}
      {showCheckout && (
        <WhatsAppCheckout
          items={items}
          totalPrice={totalPrice}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  )
}

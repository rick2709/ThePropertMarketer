"use client"

import { useState } from "react"
import { X, MessageCircle } from "lucide-react"

const WA_NUMBER = "263783580470"
const WA_MESSAGE = encodeURIComponent(
  "Hi! I found you on The Property Marketer website and I'd like to enquire about a property. 🏡"
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`

export function WhatsAppFloatButton() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubble popup */}
      {open && (
        <div className="relative w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3.5">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#25D366] bg-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">The Property Marketer</p>
              <p className="text-[11px] text-white/80">Typically replies within minutes</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Message preview */}
          <div className="px-4 pt-4 pb-2">
            <div className="rounded-2xl rounded-tl-sm bg-[#F0F0F0] px-3.5 py-2.5 text-sm text-gray-800 leading-relaxed">
              👋 Hi there! Looking for your dream property in Zimbabwe? Chat with me directly on WhatsApp — I reply fast!
            </div>
            <p className="mt-1.5 text-right text-[10px] text-gray-400">Just now</p>
          </div>

          {/* CTA button */}
          <div className="px-4 pb-4">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.853L0 24l6.335-1.508A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.034-1.376l-.361-.214-3.741.981 1.001-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
              </svg>
              Start Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/50 active:scale-95"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.529 5.853L0 24l6.335-1.508A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.034-1.376l-.361-.214-3.741.981 1.001-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
          </svg>
        )}
        {/* Tooltip */}
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  )
}

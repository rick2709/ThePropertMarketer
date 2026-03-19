import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-accent',
  display: 'swap',
})

function normalizeBaseUrl(value: string) {
  const raw = value.trim()
  if (!raw) return 'https://www.thepropertymarketer.com'
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_URL || 'https://www.thepropertymarketer.com')

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'The Property Marketer | Premium Real Estate & Marketing',
  description: 'Senior real estate sales agent & marketing executive. 8+ years expertise in Airbnb, land development, brand building & marketing strategy. Your trusted partner for high-end property and Leengate listings.',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Property Marketer',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F7F3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
        </CartProvider>
        <WhatsAppFloatButton />
        <Analytics />
      </body>
    </html>
  )
}

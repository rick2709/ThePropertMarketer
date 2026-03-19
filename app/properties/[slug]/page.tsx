import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { getPropertyById, getRelatedProperties } from "@/lib/properties"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, MessageCircle } from "lucide-react"
import { CopyLinkButton } from "@/components/copy-link-button"
import { notFound } from "next/navigation"

function toHtml(content: string | undefined | null): string {
  if (!content?.trim()) return ''
  let c = content.trim()
  if (c.startsWith('"') && c.endsWith('"')) c = c.slice(1, -1)
  c = c.replace(/""/g, '"')
  c = c
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
  if (/^<[a-zA-Z]/i.test(c)) return c
  return c
    .split(/\n{2,}/)
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

type ContentSegment =
  | { type: "html"; content: string }
  | { type: "youtube"; src: string }

function parseContentSegments(html: string): ContentSegment[] {
  const segments: ContentSegment[] = []
  const youtubeRegex =
    /<div[^>]*data-youtube-video[^>]*>[\s\S]*?<iframe[^>]*src="([^"]*)"[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = youtubeRegex.exec(html)) !== null) {
    if (match.index > lastIndex) segments.push({ type: "html", content: html.slice(lastIndex, match.index) })
    segments.push({ type: "youtube", src: match[1] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < html.length) segments.push({ type: "html", content: html.slice(lastIndex) })
  return segments.length > 0 ? segments : [{ type: "html", content: html }]
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getPropertyById(slug)
  if (!property) return { title: "Property Not Found | The Property Marketer" }
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.thepropertymarketer.com"
  const imageUrl = property.image.startsWith("http") ? property.image : `${baseUrl}${property.image}`
  return {
    title: `${property.title} | The Property Marketer`,
    description: property.excerpt,
    openGraph: {
      title: property.title,
      description: property.excerpt,
      url: `${baseUrl}/properties/${property.id}`,
      siteName: "The Property Marketer",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: property.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getPropertyById(slug)
  if (!property) notFound()

  const related = await getRelatedProperties(property.id, property.category, 3)
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.thepropertymarketer.com"

  return (
    <main>
      <Navigation />

      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image src={property.image} alt={property.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/40" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground">{property.category}</Badge>
          <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-primary-foreground md:text-4xl lg:text-5xl">
            {property.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Listed {property.date}</span>
          </div>
        </div>
      </section>

      <article className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/properties" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>

          <p className="mb-8 text-xl font-medium leading-relaxed text-foreground">{property.excerpt}</p>

          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-img:rounded-xl prose-img:my-6 prose-img:w-full prose-img:object-cover max-w-none">
            {parseContentSegments(toHtml(property.content)).map((segment, i) =>
              segment.type === "youtube" ? (
                <YoutubeEmbed key={i} src={segment.src} />
              ) : (
                <div key={i} dangerouslySetInnerHTML={{ __html: segment.content }} />
              )
            )}
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Share2 className="h-4 w-4" />
                Share this listing:
              </span>
              <div className="flex gap-2">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/properties/${property.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent" aria-label="Share on Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}/properties/${property.id}`)}&text=${encodeURIComponent(property.title)}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent" aria-label="Share on Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${property.title} ${baseUrl}/properties/${property.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent" aria-label="Share on WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </a>
                <CopyLinkButton url={`${baseUrl}/properties/${property.id}`} title="Copy link" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent" />
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">More Listings</p>
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Similar <span className="text-accent">Properties</span>
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/properties/${item.id}`} className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground text-xs">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">{item.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{item.excerpt}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
                      View Details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 font-serif text-2xl font-bold text-primary-foreground md:text-3xl">
            Interested in This Property?
          </h2>
          <p className="mb-8 text-primary-foreground/90">
            Get in touch for a viewing, pricing details, or to explore more listings tailored to you.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/properties" className="rounded-lg border-2 border-primary-foreground/80 px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary">
              View All Listings
            </Link>
            <Link href="/contact" className="rounded-lg bg-accent px-8 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { getStoryById, getRelatedStories } from "@/lib/stories"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, MessageCircle } from "lucide-react"
import { CopyLinkButton } from "@/components/copy-link-button"
import { notFound } from "next/navigation"

function toHtml(content: string | undefined | null): string {
  if (!content?.trim()) return ''

  let c = content.trim()

  // Strip wrapping quotes if the whole string is quoted (CSV artifact)
  if (c.startsWith('"') && c.endsWith('"')) {
    c = c.slice(1, -1)
  }

  // Fix double-escaped quotes: "" → "
  c = c.replace(/""/g, '"')

  // Decode HTML entities in correct order
  c = c
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))

  // If it now looks like HTML, return it directly
  if (/^<[a-zA-Z]/i.test(c)) return c

  // Otherwise treat as legacy plain text and wrap paragraphs in <p> tags
  return c
    .split(/\n{2,}/)
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

/**
 * Splits HTML content into segments — either plain HTML strings
 * or YouTube video objects — so YouTube blocks can be rendered
 * as React components instead of raw iframes.
 */
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
    if (match.index > lastIndex) {
      segments.push({ type: "html", content: html.slice(lastIndex, match.index) })
    }
    segments.push({ type: "youtube", src: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < html.length) {
    segments.push({ type: "html", content: html.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ type: "html", content: html }]
}

// Dynamic rendering so new stories appear without a redeploy
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStoryById(slug)

  if (!story) return { title: "Story Not Found | The Conservation Compass" }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.theconservationcompass.org"
  const imageUrl = story.image.startsWith("http")
    ? story.image
    : `${baseUrl}${story.image}`

  return {
    title: `${story.title} | The Conservation Compass`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      url: `${baseUrl}/news/${story.id}`,
      siteName: "The Conservation Compass",
      type: "article",
      publishedTime: story.date,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: story.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStoryById(slug)

  if (!story) notFound()

  const relatedStories = await getRelatedStories(story.id, story.category, 3)
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.theconservationcompass.org"

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image src={story.image} alt={story.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/40" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground">{story.category}</Badge>
          <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-primary-foreground md:text-4xl lg:text-5xl">
            {story.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-primary-foreground/80">
            <span>{story.date}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {story.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/news" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Back to News & Stories
          </Link>

          <p className="mb-8 text-xl font-medium leading-relaxed text-foreground">{story.excerpt}</p>

          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-img:rounded-xl prose-img:my-6 prose-img:w-full prose-img:object-cover max-w-none">
            {parseContentSegments(toHtml(story.content)).map((segment, i) =>
              segment.type === "youtube" ? (
                <YoutubeEmbed key={i} src={segment.src} />
              ) : (
                <div key={i} dangerouslySetInnerHTML={{ __html: segment.content }} />
              )
            )}
          </div>

          {/* Share */}
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Share2 className="h-4 w-4" />
                Share this story:
              </span>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/news/${story.id}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}/news/${story.id}`)}&text=${encodeURIComponent(story.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${story.title} ${baseUrl}/news/${story.id}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <CopyLinkButton
                  url={`${baseUrl}/news/${story.id}`}
                  title="Copy story link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Keep Reading</p>
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Related <span className="text-accent">Stories</span>
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedStories.map((related) => (
                <Link
                  key={related.id}
                  href={`/news/${related.id}`}
                  className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src={related.image} alt={related.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground text-xs">{related.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-accent">{related.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{related.excerpt}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
                      Read More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 font-serif text-2xl font-bold text-primary-foreground md:text-3xl">
            Want More Conservation Stories?
          </h2>
          <p className="mb-8 text-primary-foreground/70">
            Subscribe to our newsletter for the latest environmental news, analysis, and community stories delivered to your inbox.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/news" className="rounded-lg border-2 border-primary-foreground/80 px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary">
              Browse All Stories
            </Link>
            <Link href="/contact" className="rounded-lg bg-accent px-8 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

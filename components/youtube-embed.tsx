"use client"

type Props = {
  src: string
  className?: string
}

/** Extracts YouTube video ID from any YouTube URL format */
export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    // youtu.be/ID
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0]
    // youtube.com/watch?v=ID
    if (u.searchParams.get("v")) return u.searchParams.get("v")
    // youtube.com/embed/ID
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("?")[0]
    // youtube.com/shorts/ID
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1].split("?")[0]
    return null
  } catch {
    return null
  }
}

export function YoutubeEmbed({ src, className }: Props) {
  const videoId = extractYouTubeId(src)
  if (!videoId) return null

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl my-6 ${className ?? ""}`}
      style={{ paddingBottom: "56.25%", height: 0 }}
    >
      <iframe
        src={embedUrl}
        title="Embedded video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  )
}

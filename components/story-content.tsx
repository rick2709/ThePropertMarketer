"use client"

import { useEffect, useRef } from "react"

type Props = {
  html: string
  className?: string
}

/**
 * Renders story HTML and fixes YouTube embeds so they display.
 * Tiptap outputs <div data-youtube-video=""><iframe ...></iframe></div> but
 * global CSS can be overridden by prose or load order. We apply inline styles
 * in useEffect so the embed always has correct dimensions.
 */
export function StoryContent({ html, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const wrappers = el.querySelectorAll<HTMLDivElement>("[data-youtube-video]")
    wrappers.forEach((wrapper) => {
      const iframe = wrapper.querySelector("iframe")
      if (!iframe || !iframe.src) return

      // Wrapper: responsive 16:9 box with a real content height
      wrapper.style.position = "relative"
      wrapper.style.width = "100%"
      wrapper.style.aspectRatio = "16 / 9"
      wrapper.style.borderRadius = "0.75rem"
      wrapper.style.overflow = "hidden"
      wrapper.style.margin = "1.5rem 0"

      // Iframe: fill the wrapper (override any width/height HTML attributes)
      iframe.style.position = "absolute"
      iframe.style.inset = "0"
      iframe.style.width = "100%"
      iframe.style.height = "100%"
      iframe.style.border = "none"
      iframe.style.borderRadius = "0.75rem"
    })
  }, [html])

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

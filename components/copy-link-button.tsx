"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

type Props = {
  url: string
  className?: string
  title?: string
}

export function CopyLinkButton({ url, className = "", title = "Copy link" }: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      className={className}
      aria-label={copied ? "Copied!" : title}
    >
      {copied ? (
        <Check className="h-4 w-4 text-accent" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}

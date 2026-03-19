"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExtension from "@tiptap/extension-underline"
import LinkExtension from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect, useCallback } from "react"
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Unlink, Youtube, Image as ImageIcon,
  Undo2, Redo2, Heading2, Heading3,
} from "lucide-react"
import { SafeYoutube } from "@/lib/tiptap-youtube-extension"

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Write here…" }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({
        HTMLAttributes: {
          class: "text-accent underline underline-offset-2 hover:text-accent/80 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      SafeYoutube,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl my-6 w-full object-cover max-h-[520px]",
        },
        allowBase64: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[360px] px-5 py-4 font-serif text-base leading-loose text-foreground outline-none",
      },
    },
  })

  // Sync external value changes (e.g. when loading an existing story)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false)
    }
  }, [editor, value])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Paste image URL:")
    if (!url?.trim()) return
    try {
      new URL(url)
    } catch {
      window.alert("Please enter a valid URL")
      return
    }
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length

  const btn = (active: boolean) =>
    `flex items-center justify-center rounded-md p-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted"
    }`

  const addLink = () => {
    const url = window.prompt("Enter URL:")
    if (!url) return
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addYoutube = () => {
    const url = window.prompt("Enter YouTube URL:")
    if (!url) return
    editor.commands.setYoutubeVideo({ src: url })
  }

  return (
    <div className="rounded-xl border border-border bg-background transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-3 py-2">

        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
          className={btn(false)}
          disabled={!editor.can().undo()}
          title="Undo (⌘Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
          className={btn(false)}
          disabled={!editor.can().redo()}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Headings */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
          className={btn(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }}
          className={btn(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Inline marks */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          className={btn(editor.isActive("bold"))}
          title="Bold (⌘B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          className={btn(editor.isActive("italic"))}
          title="Italic (⌘I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
          className={btn(editor.isActive("underline"))}
          title="Underline (⌘U)"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
          className={btn(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Lists & blockquote */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
          className={btn(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
          className={btn(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
          className={btn(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Text alignment */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("left").run() }}
          className={btn(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("center").run() }}
          className={btn(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("right").run() }}
          className={btn(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("justify").run() }}
          className={btn(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Link */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); addLink() }}
          className={btn(editor.isActive("link"))}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run() }}
          className={btn(false)}
          disabled={!editor.isActive("link")}
          title="Remove Link"
        >
          <Unlink className="h-4 w-4" />
        </button>

        {/* YouTube */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); addYoutube() }}
          className={btn(false)}
          title="Embed YouTube"
        >
          <Youtube className="h-4 w-4" />
        </button>
        {/* Inline image */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); addImage() }}
          className={btn(false)}
          title="Embed image from URL"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* ── Editor area ── */}
      <EditorContent editor={editor} />

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <span className="text-xs text-muted-foreground">
          {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
        </span>
        <span className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
          <span>⌘B Bold</span>
          <span className="text-border">·</span>
          <span>⌘I Italic</span>
          <span className="text-border">·</span>
          <span>⌘U Underline</span>
          <span className="text-border">·</span>
          <span>⌘Z Undo</span>
        </span>
      </div>
    </div>
  )
}

import { Node, mergeAttributes } from "@tiptap/core"
import { extractYouTubeId } from "@/components/youtube-embed"

export const SafeYoutube = Node.create({
  name: "youtube",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video]",
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          const iframe = el.querySelector('iframe[src*="youtube"]')
          const src = iframe?.getAttribute("src") ?? null
          return src ? { src } : {}
        },
      },
      {
        tag: 'iframe[src*="youtube"]',
        getAttrs: (dom) => {
          const src = (dom as HTMLIFrameElement).getAttribute("src")
          return src ? { src } : {}
        },
      },
      {
        tag: 'iframe[src*="youtube-nocookie"]',
        getAttrs: (dom) => {
          const src = (dom as HTMLIFrameElement).getAttribute("src")
          return src ? { src } : {}
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const videoId = extractYouTubeId(HTMLAttributes.src ?? "")
    const embedUrl = videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
      : HTMLAttributes.src
    return [
      "div",
      mergeAttributes({ "data-youtube-video": "" }),
      [
        "iframe",
        mergeAttributes({
          src: embedUrl,
          allowfullscreen: "true",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          referrerpolicy: "strict-origin-when-cross-origin",
          style:
            "position:absolute;top:0;left:0;width:100%;height:100%;border:0;",
        }),
      ],
    ]
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options: { src: string }) =>
        ({ commands }: { commands: { insertContent: (content: { type: string; attrs: { src: string } }) => boolean } }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src: options.src },
          }),
    }
  },
})

import { mergeAttributes, Node } from "@tiptap/react"
import { normalizeEmbedSrc } from "@/lib/embed-url"

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attrs: { src: string }) => ReturnType
    }
  }
}

export const Embed = Node.create({
  name: "embed",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed"]',
        getAttrs: (el) => {
          if (typeof el === "string") return false
          const iframe = el.querySelector("iframe")
          const src = iframe?.getAttribute("src")
          if (!src) return false
          const normalized = normalizeEmbedSrc(src)
          return normalized ? { src: normalized } : false
        },
      },
      {
        tag: "iframe[src]",
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false
          const src = el.getAttribute("src")
          if (!src) return false
          const normalized = normalizeEmbedSrc(src)
          return normalized ? { src: normalized } : false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src as string | undefined
    if (!src) return ["div", { "data-type": "embed", class: "tiptap-embed" }]
    return [
      "div",
      { "data-type": "embed", class: "tiptap-embed" },
      [
        "iframe",
        mergeAttributes({
          src,
          class: "tiptap-embed-iframe",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
        }),
      ],
    ]
  },

  addCommands() {
    return {
      setEmbed:
        (attrs: { src: string }) =>
        ({ chain }) => {
          const src = normalizeEmbedSrc(attrs.src)
          if (!src) return false
          return chain()
            .focus()
            .insertContent({ type: this.name, attrs: { src } })
            .run()
        },
    }
  },
})

export default Embed

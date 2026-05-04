const YT_ID = /^[\w-]{6,}$/

function toHttps(href: string) {
  return href.startsWith("http://") ? `https://${href.slice(7)}` : href
}

export function normalizeEmbedSrc(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return null
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null
  const host = url.hostname.toLowerCase()
  const hostNoWww = host.replace(/^www\./, "")

  if (
    hostNoWww === "youtube.com" ||
    hostNoWww === "youtube-nocookie.com" ||
    hostNoWww === "m.youtube.com"
  ) {
    if (url.pathname.startsWith("/embed/")) {
      const id = url.pathname.slice("/embed/".length).split("/")[0]
      if (id && YT_ID.test(id))
        return `https://www.youtube.com/embed/${id}`
    }
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2]
      if (id && YT_ID.test(id)) return `https://www.youtube.com/embed/${id}`
    }
    const v = url.searchParams.get("v")
    if (v && YT_ID.test(v)) return `https://www.youtube.com/embed/${v}`
    return null
  }

  if (hostNoWww === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0]
    if (id && YT_ID.test(id)) return `https://www.youtube.com/embed/${id}`
    return null
  }

  if (hostNoWww === "vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean)
    const id = parts[0]
    if (id && /^\d+$/.test(id))
      return `https://player.vimeo.com/video/${id}`
    return null
  }

  if (hostNoWww === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
    return toHttps(`https://player.vimeo.com${url.pathname}`)
  }

  if (hostNoWww === "loom.com") {
    if (url.pathname.startsWith("/embed/"))
      return toHttps(url.href)
    if (url.pathname.startsWith("/share/")) {
      const id = url.pathname.replace("/share/", "").split("/")[0]
      if (id) return `https://www.loom.com/embed/${id}`
    }
    return null
  }

  return null
}

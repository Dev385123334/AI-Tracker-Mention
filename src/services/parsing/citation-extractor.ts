export interface CitationData {
  url: string
  domain: string
  title: string | null
}

const URL_PATTERN = /https?:\/\/(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)(?:\/[^\s)"'\]}]*)?/gi

export function extractCitations(text: string): CitationData[] {
  const matches = Array.from(text.matchAll(URL_PATTERN))
  const seen = new Set<string>()

  return matches
    .map((m) => ({
      url: m[0].replace(/[)"'\]}]+$/, ""),
      domain: m[1].toLowerCase(),
      title: null,
    }))
    .filter((c) => {
      const key = c.url.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export interface BrandMention {
  brandName: string
  position: number | null
  frequency: number
}

const BRAND_PATTERN = /\b[A-Z][a-zA-Z0-9]{2,}(?:Inc|Corp|Labs|Tech|HQ|Systems|Works|Soft|Sync|Flow|Stack|Up|Point|Spot|Hub|Mind|Wave|Nova|Edge|Core|Stratus|Helix|Vantage)?\b/g

const NUMBERED_LINE = /^(\d+)[.)]\s+([A-Z][a-zA-Z0-9 ]+?)\s*[-–—]/

export function extractBrands(text: string, knownBrands: string[]): BrandMention[] {
  const mentionMap = new Map<string, { position: number | null; count: number }>()
  const knownLower = knownBrands.map((b) => b.toLowerCase())

  const lines = text.split("\n")

  for (const line of lines) {
    const numberedMatch = line.match(NUMBERED_LINE)
    if (numberedMatch) {
      const pos = parseInt(numberedMatch[1], 10)
      const name = numberedMatch[2].trim()
      addBrand(mentionMap, name, pos)
      continue
    }
  }

  const allMatches = text.matchAll(BRAND_PATTERN)
  for (const match of allMatches) {
    const name = match[0]
    const nameLower = name.toLowerCase()

    const isKnown = knownLower.some((k) => nameLower.includes(k) || k.includes(nameLower))
    if (isKnown) {
      addBrand(mentionMap, name, null)
      continue
    }

    if (knownLower.length === 0) {
      addBrand(mentionMap, name, null)
    }
  }

  return Array.from(mentionMap.entries()).map(([brandName, data]) => ({
    brandName,
    position: data.position,
    frequency: data.count,
  }))
}

function addBrand(
  map: Map<string, { position: number | null; count: number }>,
  name: string,
  position: number | null
) {
  const existing = map.get(name)
  if (existing) {
    existing.count++
    if (position !== null && existing.position === null) {
      existing.position = position
    }
  } else {
    map.set(name, { position, count: 1 })
  }
}

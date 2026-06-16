import { extractBrands, type BrandMention } from "./brand-extractor"
import { extractCitations, type CitationData } from "./citation-extractor"
import { analyzeSentiment, type SentimentData } from "./sentiment-analyzer"

export type { BrandMention, CitationData, SentimentData }

export interface ParsedResult {
  mentions: (BrandMention & { sentiment: SentimentData })[]
  citations: CitationData[]
}

export function parseResponse(
  responseText: string,
  knownBrands: string[]
): ParsedResult {
  const brands = extractBrands(responseText, knownBrands)

  const sentiments = brands.map((b) => analyzeSentiment(responseText, b.brandName, knownBrands))

  const citations = extractCitations(responseText)

  const mentions = brands.map((b) => ({
    ...b,
    sentiment: sentiments.find((s) => s.brandName === b.brandName) ?? {
      brandName: b.brandName,
      score: 0,
      label: "neutral" as const,
      confidence: 0,
    },
  }))

  return { mentions, citations }
}

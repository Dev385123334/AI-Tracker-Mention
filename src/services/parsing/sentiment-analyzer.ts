export interface SentimentData {
  brandName: string
  score: number
  label: "positive" | "negative" | "neutral"
  confidence: number
}

const POSITIVE_WORDS = new Set([
  "excellent", "outstanding", "exceptional", "great", "powerful", "comprehensive",
  "robust", "innovative", "strong", "best", "leading", "impressive", "superior",
  "remarkable", "effective", "reliable", "fantastic", "amazing", "brilliant",
  "top-notch", "seamless", "intuitive", "user-friendly", "high-quality", "feature-rich",
  "well-designed", "responsive", "efficient", "scalable", "versatile",
])

const NEGATIVE_WORDS = new Set([
  "limited", "poor", "underwhelming", "outdated", "disappointing", "below-average",
  "lacking", "inferior", "worst", "terrible", "bad", "mediocre", "subpar",
  "unreliable", "buggy", "slow", "clunky", "confusing", "frustrating",
  "inadequate", "overpriced", "difficult", "problems", "issues", "fails",
  "incomplete", "unresponsive", "outdated",
])

const INTENSIFIERS = new Set(["very", "extremely", "incredibly", "remarkably", "particularly"])

function normalizeBrandName(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
}

export function analyzeSentiment(
  text: string,
  brandName: string,
  allBrands: string[]
): SentimentData {
  const normalizedTarget = normalizeBrandName(brandName)

  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)

  const relevantSentences = sentences.filter((s) => {
    const lower = s.toLowerCase()
    if (lower.includes(normalizedTarget)) return true
    return allBrands.some((b) => {
      if (b === brandName) return false
      return lower.includes(normalizeBrandName(b))
    })
  })

  const targetSentences = sentences.filter((s) => {
    const lower = s.toLowerCase()
    return lower.includes(normalizedTarget) || lower.includes(brandName.toLowerCase())
  })

  const analyzeText = targetSentences.length > 0 ? targetSentences.join(" ") : relevantSentences.join(" ")
  const words = analyzeText.toLowerCase().split(/\s+/)

  let score = 0
  let matchedCount = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const isNegated = i > 0 && ["not", "no", "neither", "nor", "never"].includes(words[i - 1])
    const isIntensified = i > 0 && INTENSIFIERS.has(words[i - 1])
    const multiplier = isNegated ? -1 : isIntensified ? 1.5 : 1

    if (POSITIVE_WORDS.has(word)) {
      score += 1 * multiplier
      matchedCount++
    } else if (NEGATIVE_WORDS.has(word)) {
      score -= 1 * multiplier
      matchedCount++
    }
  }

  const maxScore = matchedCount * 2
  const normalizedScore = maxScore > 0 ? score / maxScore : 0
  const clippedScore = Math.max(-1, Math.min(1, normalizedScore))

  let label: "positive" | "negative" | "neutral"
  if (clippedScore > 0.15) label = "positive"
  else if (clippedScore < -0.15) label = "negative"
  else label = "neutral"

  const confidence = matchedCount > 0
    ? Math.min(1, matchedCount / (words.length * 0.1))
    : 0.3

  return {
    brandName,
    score: Math.round(clippedScore * 100) / 100,
    label,
    confidence: Math.round(confidence * 100) / 100,
  }
}

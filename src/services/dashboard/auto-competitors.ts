import { prisma } from "@/lib/prisma"
import { createCompetitor } from "@/repositories/competitor-repository"

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

const COMPETITOR_POOLS = [
  { name: "BrandPulse AI", domain: "brandpulse.ai" },
  { name: "VisibilityFirst", domain: "visibilityfirst.com" },
  { name: "SearchMonitor Pro", domain: "searchmonitor.io" },
  { name: "TrackGenius", domain: "trackgenius.com" },
  { name: "AIMetric Labs", domain: "aimetriclabs.com" },
  { name: "InsightFlow", domain: "insightflow.co" },
  { name: "DataVista", domain: "datavista.io" },
  { name: "RankTracker", domain: "ranktracker.com" },
  { name: "MentionMetrics", domain: "mentionmetrics.com" },
  { name: "ContentScope", domain: "contentscope.io" },
]

export interface CompetitorEntry {
  id: string
  name: string
  domain: string
  visibility: number
  sentiment: "positive" | "neutral" | "negative"
  position: number
  isUser: boolean
}

export async function ensureDashboardCompetitors(projectId: string, brandDomain: string): Promise<CompetitorEntry[]> {
  const h = hashString(brandDomain)
  const selected = []
  for (let i = 0; i < 5; i++) {
    const idx = (h + i * 7) % COMPETITOR_POOLS.length
    selected.push(COMPETITOR_POOLS[idx])
  }

  const existing = await prisma.competitor.findMany({ where: { projectId } })
  const existingDomains = new Set(existing.map((c) => c.domain))

  for (const comp of selected) {
    if (!existingDomains.has(comp.domain)) {
      try {
        await createCompetitor({
          name: comp.name,
          domain: comp.domain,
          projectId,
        })
      } catch {
        // unique constraint may already exist
      }
    }
  }

  const all = await prisma.competitor.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  })

  const selectedFromDb = all.slice(0, 4)
  const results: CompetitorEntry[] = []

  const userVis = Math.max(2, (h % 15) + 1)
  results.push({
    id: "user",
    name: "Your Brand",
    domain: brandDomain,
    visibility: userVis,
    sentiment: "neutral",
    position: 5,
    isUser: true,
  })

  selectedFromDb.forEach((comp, i) => {
    const seed = h + i * 13
    results.push({
      id: comp.id,
      name: comp.name,
      domain: comp.domain,
      visibility: Math.min(95, Math.max(5, (seed % 70) + 10)),
      sentiment: seed % 3 === 0 ? "negative" : seed % 3 === 1 ? "neutral" : "positive",
      position: i + 3,
      isUser: false,
    })
  })

  results.sort((a, b) => b.visibility - a.visibility)
  return results
}

import { prisma } from "@/lib/prisma"
import { upsertGeoScore } from "@/repositories/geo-score-repository"

const VISIBILITY_WEIGHT = 0.40
const POSITION_WEIGHT = 0.25
const CITATION_WEIGHT = 0.25
const SENTIMENT_WEIGHT = 0.10

export async function calculateGeoScore(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true },
  })
  if (!project) throw new Error(`Project ${projectId} not found`)

  const latestMetrics = await prisma.visibilityMetric.findMany({
    where: { projectId },
    orderBy: { periodStart: "desc" },
  })
  if (latestMetrics.length === 0) return null

  const latestPeriod = latestMetrics[0].periodStart
  const periodMetrics = latestMetrics.filter(
    (m) => m.periodStart.getTime() === latestPeriod.getTime()
  )

  const brandMetric = periodMetrics.find(
    (m) => m.brandName === project.brandName
  )

  const competitorMetrics = periodMetrics.filter(
    (m) => m.brandName !== project.brandName
  )

  if (!brandMetric) return null

  const visibilityScore = calculateVisibilityScore(
    brandMetric,
    competitorMetrics
  )

  const positionScore = calculatePositionScore(brandMetric)

  const citationScore = await calculateCitationScore(projectId, project.brandName)

  const sentimentScore = await calculateSentimentScore(projectId, project.brandName)

  const composite =
    visibilityScore * VISIBILITY_WEIGHT +
    positionScore * POSITION_WEIGHT +
    citationScore * CITATION_WEIGHT +
    sentimentScore * SENTIMENT_WEIGHT

  const finalScore = Math.round(Math.max(0, Math.min(100, composite)))

  const periodStart = new Date()
  periodStart.setHours(0, 0, 0, 0)
  const periodEnd = new Date()
  periodEnd.setHours(23, 59, 59, 999)

  await upsertGeoScore({
    score: finalScore,
    visibilityScore: Math.round(visibilityScore),
    positionScore: Math.round(positionScore),
    citationScore: Math.round(citationScore),
    sentimentScore: Math.round(sentimentScore),
    periodStart,
    periodEnd,
    projectId,
  })

  return {
    score: finalScore,
    visibilityScore: Math.round(visibilityScore),
    positionScore: Math.round(positionScore),
    citationScore: Math.round(citationScore),
    sentimentScore: Math.round(sentimentScore),
  }
}

function calculateVisibilityScore(
  brand: { mentionRate: number },
  competitors: { mentionRate: number }[]
): number {
  const allRates = [brand.mentionRate, ...competitors.map((c) => c.mentionRate)]
  const maxRate = Math.max(...allRates, 0.01)
  return (brand.mentionRate / maxRate) * 100
}

function calculatePositionScore(brand: { avgPosition: number | null }): number {
  if (brand.avgPosition === null || brand.avgPosition === 0) return 0
  const pos = Math.max(1, brand.avgPosition)
  if (pos <= 1) return 100
  if (pos <= 2) return 75
  if (pos <= 3) return 50
  if (pos <= 5) return 25
  return 10
}

async function calculateCitationScore(
  projectId: string,
  brandName: string
): Promise<number> {
  const totalCitations = await prisma.citation.count({
    where: { run: { job: { projectId } } },
  })
  if (totalCitations === 0) return 0

  const brandCitations = await prisma.citation.count({
    where: {
      run: { job: { projectId } },
      response: {
        mentions: { some: { brandName } },
      },
    },
  })

  return (brandCitations / totalCitations) * 100
}

async function calculateSentimentScore(
  projectId: string,
  brandName: string
): Promise<number> {
  const results = await prisma.sentimentResult.findMany({
    where: {
      run: { job: { projectId } },
      brandName,
    },
  })

  if (results.length === 0) return 50

  const avgScore =
    results.reduce((sum, r) => sum + r.score, 0) / results.length

  const mapped = (avgScore + 1) * 50
  return Math.max(0, Math.min(100, mapped))
}

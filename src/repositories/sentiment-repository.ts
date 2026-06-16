import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export async function createSentimentResult(data: {
  brandName: string
  score: number
  label: string
  confidence: number
  responseId: string
  runId: string
}) {
  return prisma.sentimentResult.create({ data })
}

export async function createManySentimentResults(data: {
  brandName: string
  score: number
  label: string
  confidence: number
  responseId: string
  runId: string
}[]) {
  if (data.length === 0) return { count: 0 }
  return prisma.sentimentResult.createMany({ data })
}

export async function avgScoreByBrand(projectId: string, days?: number) {
  const where: Prisma.SentimentResultWhereInput = {
    run: { job: { projectId } },
    ...(days ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } } : {}),
  }

  const results = await prisma.sentimentResult.findMany({
    where,
    select: { brandName: true, score: true, label: true },
  })

  const brandMap = new Map<string, { scores: number[]; labels: string[] }>()
  for (const r of results) {
    const entry = brandMap.get(r.brandName) ?? { scores: [], labels: [] }
    entry.scores.push(r.score)
    entry.labels.push(r.label)
    brandMap.set(r.brandName, entry)
  }

  return Array.from(brandMap.entries()).map(([brandName, data]) => ({
    brandName,
    avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
    dominantLabel: getDominantLabel(data.labels),
    sampleSize: data.scores.length,
  }))
}

function getDominantLabel(labels: string[]): string {
  const counts: Record<string, number> = {}
  for (const l of labels) counts[l] = (counts[l] ?? 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

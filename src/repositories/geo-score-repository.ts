import { prisma } from "@/lib/prisma"

export async function upsertGeoScore(data: {
  score: number
  visibilityScore: number
  positionScore: number
  citationScore: number
  sentimentScore: number
  periodStart: Date
  periodEnd: Date
  projectId: string
}) {
  const existing = await prisma.geoScore.findFirst({
    where: {
      projectId: data.projectId,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
    },
  })

  if (existing) {
    return prisma.geoScore.update({
      where: { id: existing.id },
      data,
    })
  }

  return prisma.geoScore.create({ data })
}

export async function findLatestGeoScore(projectId: string) {
  return prisma.geoScore.findFirst({
    where: { projectId },
    orderBy: { periodStart: "desc" },
  })
}

export async function findGeoScoreTrend(projectId: string, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return prisma.geoScore.findMany({
    where: { projectId, periodStart: { gte: since } },
    orderBy: { periodStart: "asc" },
  })
}

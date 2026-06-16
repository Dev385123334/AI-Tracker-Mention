import { prisma } from "@/lib/prisma"

export type MetricInput = {
  brandName: string
  mentionCount: number
  avgPosition: number | null
  mentionRate: number
  competitorName?: string | null
  periodStart: Date
  periodEnd: Date
  projectId: string
}

export async function upsertMetric(data: MetricInput) {
  const existing = await prisma.visibilityMetric.findFirst({
    where: {
      projectId: data.projectId,
      brandName: data.brandName,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
    },
  })

  if (existing) {
    return prisma.visibilityMetric.update({
      where: { id: existing.id },
      data: {
        mentionCount: data.mentionCount,
        avgPosition: data.avgPosition,
        mentionRate: data.mentionRate,
      },
    })
  }

  return prisma.visibilityMetric.create({ data })
}

export async function findMetricsByProject(projectId: string) {
  return prisma.visibilityMetric.findMany({
    where: { projectId },
    orderBy: { periodStart: "desc" },
  })
}

export async function findLatestMetricsByProject(projectId: string) {
  const latest = await prisma.visibilityMetric.findFirst({
    where: { projectId },
    orderBy: { periodStart: "desc" },
    select: { periodStart: true },
  })

  if (!latest) return []

  return prisma.visibilityMetric.findMany({
    where: { projectId, periodStart: latest.periodStart },
    orderBy: { mentionCount: "desc" },
  })
}

export async function findTrend(projectId: string, brandName: string, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  return prisma.visibilityMetric.findMany({
    where: {
      projectId,
      brandName,
      periodStart: { gte: since },
    },
    orderBy: { periodStart: "asc" },
  })
}

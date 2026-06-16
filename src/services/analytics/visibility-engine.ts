import { prisma } from "@/lib/prisma"
import { upsertMetric } from "@/repositories/visibility-repository"
import { countByDomain } from "@/repositories/citation-repository"

export async function calculateVisibilityMetrics(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true },
  })
  if (!project) throw new Error(`Project ${projectId} not found`)

  const totalResponses = await prisma.providerResponse.count({
    where: {
      run: { job: { projectId } },
      status: "success",
    },
  })

  if (totalResponses === 0) return { metricsCreated: 0 }

  const mentionCounts = await prisma.mention.groupBy({
    by: ["brandName"],
    where: { run: { job: { projectId } } },
    _count: { brandName: true },
    _avg: { position: true },
  })

  const allBrandNames = [project.brandName, ...project.competitors.map((c) => c.name)]
  const periodStart = new Date()
  periodStart.setHours(0, 0, 0, 0)
  const periodEnd = new Date()
  periodEnd.setHours(23, 59, 59, 999)

  let created = 0

  for (const brandName of allBrandNames) {
    const stats = mentionCounts.find((m) => m.brandName === brandName)
    const mentionCount = stats?._count.brandName ?? 0
    const avgPosition = stats?._avg.position ?? null
    const mentionRate = totalResponses > 0 ? mentionCount / totalResponses : 0

    const isCompetitor = project.competitors.find((c) => c.name === brandName)

    await upsertMetric({
      brandName,
      mentionCount,
      avgPosition: avgPosition ? Math.round(avgPosition * 100) / 100 : null,
      mentionRate: Math.round(mentionRate * 100) / 100,
      competitorName: isCompetitor?.name ?? null,
      periodStart,
      periodEnd,
      projectId,
    })

    created++
  }

  return { metricsCreated: created }
}

export async function getProjectVisibility(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true },
  })
  if (!project) return null

  const metrics = await prisma.visibilityMetric.findMany({
    where: { projectId },
    orderBy: { periodStart: "desc" },
  })

  const latestPeriod = metrics[0]?.periodStart
  const latest = latestPeriod
    ? metrics.filter((m) => m.periodStart.getTime() === latestPeriod.getTime())
    : []

  const brandMetric = latest.find((m) => m.brandName === project.brandName)

  const competitorMetrics = project.competitors.map((c) => {
    const m = latest.find((x) => x.brandName === c.name)
    return {
      name: c.name,
      domain: c.domain,
      mentionCount: m?.mentionCount ?? 0,
      avgPosition: m?.avgPosition ?? null,
      mentionRate: m?.mentionRate ?? 0,
    }
  })

  return {
    brandName: project.brandName,
    totalMentions: brandMetric?.mentionCount ?? 0,
    avgPosition: brandMetric?.avgPosition ?? null,
    mentionRate: brandMetric?.mentionRate ?? 0,
    competitors: competitorMetrics,
  }
}

export async function getCitationOverview(projectId: string) {
  const [total, byDomain] = await Promise.all([
    prisma.citation.count({
      where: { run: { job: { projectId } } },
    }),
    countByDomain(projectId),
  ])

  return { totalCitations: total, topDomains: byDomain.slice(0, 10) }
}

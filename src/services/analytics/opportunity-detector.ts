import { prisma } from "@/lib/prisma"

export interface GapItem {
  type: "competitor_gap" | "citation_gap" | "visibility_gap"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  metric: string
  value: number
}

export async function detectAllGaps(projectId: string) {
  const gaps: GapItem[] = []

  const competitorGaps = await detectCompetitorGaps(projectId)
  gaps.push(...competitorGaps)

  const citationGaps = await detectCitationGaps(projectId)
  gaps.push(...citationGaps)

  const visibilityGaps = await detectVisibilityGaps(projectId)
  gaps.push(...visibilityGaps)

  return gaps
}

async function detectCompetitorGaps(projectId: string) {
  const gaps: GapItem[] = []
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true },
  })
  if (!project || project.competitors.length === 0) return gaps

  const providerCoverage = await prisma.providerResponse.findMany({
    where: { run: { job: { projectId } }, status: "success" },
    select: { provider: true, mentions: { select: { brandName: true } } },
  })

  const allProviders = [...new Set(providerCoverage.map((r) => r.provider))]

  for (const competitor of project.competitors) {
    for (const provider of allProviders) {
      const providerResponses = providerCoverage.filter(
        (r) => r.provider === provider
      )
      const competitorInProvider = providerResponses.some((r) =>
        r.mentions.some((m) => m.brandName === competitor.name)
      )
      const brandInProvider = providerResponses.some((r) =>
        r.mentions.some((m) => m.brandName === project.brandName)
      )

      if (competitorInProvider && !brandInProvider) {
        gaps.push({
          type: "competitor_gap",
          severity: "high",
          title: `${competitor.name} visible on ${provider} but your brand is not`,
          description: `${competitor.name} appears in ${provider} responses but your brand does not. Optimize for this platform.`,
          metric: "provider_coverage",
          value: 0,
        })
      }
    }
  }

  return gaps
}

async function detectCitationGaps(projectId: string) {
  const gaps: GapItem[] = []
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true },
  })
  if (!project) return gaps

  const totalCitations = await prisma.citation.count({
    where: { run: { job: { projectId } } },
  })
  if (totalCitations === 0) return gaps

  const brandCitations = await prisma.citation.count({
    where: {
      run: { job: { projectId } },
      response: {
        mentions: { some: { brandName: project.brandName } },
      },
    },
  })

  for (const competitor of project.competitors) {
    const compCitations = await prisma.citation.count({
      where: {
        run: { job: { projectId } },
        response: {
          mentions: { some: { brandName: competitor.name } },
        },
      },
    })

    const gap = compCitations - brandCitations
    if (gap > 2) {
      gaps.push({
        type: "citation_gap",
        severity: "medium",
        title: `Citation gap with ${competitor.name}: ${gap} more citations`,
        description: `${competitor.name} has ${compCitations} brand citations vs your ${brandCitations}. Build authority backlinks to close the gap.`,
        metric: "citation_difference",
        value: gap,
      })
    }
  }

  return gaps
}

async function detectVisibilityGaps(projectId: string) {
  const gaps: GapItem[] = []
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { keywords: true },
  })
  if (!project) return gaps

  const mentionData = await prisma.mention.groupBy({
    by: ["brandName"],
    where: { run: { job: { projectId } } },
    _count: { brandName: true },
  })

  const brandMentions =
    mentionData.find((m) => m.brandName === project.brandName)?._count
      .brandName ?? 0

  const totalMentions = mentionData.reduce((s, m) => s + m._count.brandName, 0)

  if (totalMentions > 0 && brandMentions === 0) {
    gaps.push({
      type: "visibility_gap",
      severity: "high",
      title: "Brand has zero mentions despite competitors being mentioned",
      description: "Competitors are being mentioned in AI responses, but your brand is absent. Improve brand entity signals.",
      metric: "mention_count",
      value: 0,
    })
  }

  return gaps
}

export async function getOpportunityScore(projectId: string) {
  const gaps = await detectAllGaps(projectId)

  const highCount = gaps.filter((g) => g.severity === "high").length
  const mediumCount = gaps.filter((g) => g.severity === "medium").length

  const score = Math.max(0, 100 - highCount * 20 - mediumCount * 10)

  return {
    opportunityScore: score,
    gapsFound: gaps.length,
    highPriorityGaps: highCount,
    gaps,
  }
}

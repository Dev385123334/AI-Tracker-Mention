import { prisma } from "@/lib/prisma"
import type { ProjectContext } from "../types"
import { calculateCompetitorGapScore } from "../scoring-engine"

export async function analyzeCompetitors(
  project: ProjectContext,
  runId: string,
  projectId: string
): Promise<
  ({
    competitorName: string
    competitorDomain: string
    gapType: string
    gapSeverity: string
    description: string
    brandStrength: string
    competitorStrength: string
    actionItems: string[]
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  })[]
> {
  const results: {
    competitorName: string
    competitorDomain: string
    gapType: string
    gapSeverity: string
    description: string
    brandStrength: string
    competitorStrength: string
    actionItems: string[]
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  }[] = []

  const providerData = await prisma.providerResponse.findMany({
    where: { run: { job: { projectId } }, status: "success" },
    select: {
      provider: true,
      mentions: { select: { brandName: true } },
    },
  })

  const allProviders = [...new Set(providerData.map((r) => r.provider))]

  const mentionData = await prisma.mention.groupBy({
    by: ["brandName"],
    where: { run: { job: { projectId } } },
    _count: { brandName: true },
  })

  const citationData = await prisma.citation.findMany({
    where: { run: { job: { projectId } } },
    select: { domain: true, response: { select: { mentions: { select: { brandName: true } } } } },
  })

  const brandMentions = mentionData.find((m) => m.brandName === project.brandName)?._count.brandName ?? 0
  const brandDomains = new Set(
    citationData
      .filter((c) => c.response.mentions.some((m) => m.brandName === project.brandName))
      .map((c) => c.domain)
  )

  for (const competitor of project.competitors) {
    const compMentions = mentionData.find((m) => m.brandName === competitor.name)?._count.brandName ?? 0
    const compDomains = new Set(
      citationData
        .filter((c) => c.response.mentions.some((m) => m.brandName === competitor.name))
        .map((c) => c.domain)
    )

    const compProviders = new Set(
      providerData
        .filter((r) => r.mentions.some((m) => m.brandName === competitor.name))
        .map((r) => r.provider)
    )
    const brandProviders = new Set(
      providerData
        .filter((r) => r.mentions.some((m) => m.brandName === project.brandName))
        .map((r) => r.provider)
    )

    const missingProviders = allProviders.filter((p) => compProviders.has(p) && !brandProviders.has(p))
    const uniqueCitationDomains = [...compDomains].filter((d) => !brandDomains.has(d))
    const mentionGap = compMentions - brandMentions

    let gapType = "visibility"
    let gapSeverity = "low"
    const actionItems: string[] = []

    if (missingProviders.length > 0) {
      gapType = "visibility"
      gapSeverity = "critical"
      actionItems.push(
        `Optimize brand presence on ${missingProviders.join(", ")} — ${competitor.name} appears there but your brand doesn't`,
      )
    }

    if (mentionGap > 5) {
      gapSeverity = gapSeverity === "critical" ? "critical" : "high"
      actionItems.push(
        `Close ${mentionGap}-mention gap by creating targeted content for keywords where ${competitor.name} outranks you`,
      )
    }

    if (mentionGap > 2 && mentionGap <= 5) {
      if (gapSeverity === "low") gapSeverity = "medium"
      actionItems.push(`Create comparison content vs ${competitor.name} to capture lost mentions`)
    }

    if (uniqueCitationDomains.length > 0) {
      if (gapSeverity !== "critical") gapSeverity = gapSeverity === "high" ? "high" : "medium"
      gapType = "citation"
      actionItems.push(
        `Build citations on ${uniqueCitationDomains.slice(0, 3).join(", ")} where ${competitor.name} is cited but your brand isn't`,
      )
    }

    if (mentionGap <= 2 && missingProviders.length === 0 && uniqueCitationDomains.length === 0) {
      actionItems.push(
        `Monitor ${competitor.name}'s content strategy — they are competitive across all tracked dimensions`,
      )
    }

    const analysis = {
      competitorName: competitor.name,
      competitorDomain: competitor.domain,
      gapType,
      gapSeverity,
      description: `${competitor.name} leads by ${Math.max(mentionGap, 0)} mentions${missingProviders.length > 0 ? ` and appears on ${missingProviders.length} more AI platforms` : ""}${uniqueCitationDomains.length > 0 ? ` with citations on ${uniqueCitationDomains.length} exclusive domains` : ""}.`,
      brandStrength: mentionGap <= 2
        ? `Comparable mention volume to ${competitor.name}`
        : `Stronger domain authority than ${competitor.name}`,
      competitorStrength: mentionGap > 0
        ? `${mentionGap} more AI mentions${missingProviders.length > 0 ? ` and presence on ${missingProviders.join(", ")}` : ""}`
        : `Comparable visibility to your brand`,
      actionItems,
    }

    const { impactScore, difficultyScore } = calculateCompetitorGapScore(analysis)
    results.push({ ...analysis, impactScore, difficultyScore, runId, projectId })
  }

  if (project.competitors.length === 0) {
    results.push({
      competitorName: "Unknown competitors",
      competitorDomain: "",
      gapType: "visibility",
      gapSeverity: "medium",
      description: "No competitors tracked. Add competitors to enable competitive gap analysis and identify specific visibility opportunities.",
      brandStrength: "No benchmark data available",
      competitorStrength: "Unknown — add competitors to compare",
      actionItems: ["Add 3-5 key competitors to unlock competitive analysis", "Monitor competitor visibility across AI platforms"],
      impactScore: 60,
      difficultyScore: 15,
      runId,
      projectId,
    })
  }

  return results
}

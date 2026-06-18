import { prisma } from "@/lib/prisma"
import type { GeoAgentInput } from "./types"

export async function gatherProjectData(projectId: string): Promise<GeoAgentInput> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { keywords: true, competitors: true },
  })
  if (!project) throw new Error(`Project ${projectId} not found`)

  const [geoScore, mentions, citations, visibilityMetrics, providerResponses, recommendations] =
    await Promise.all([
      prisma.geoScore
        .findFirst({ where: { projectId }, orderBy: { periodStart: "desc" } })
        .catch(() => null),

      prisma.mention.findMany({
        where: { run: { job: { projectId } } },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { response: { select: { provider: true } } },
      }),

      prisma.citation.findMany({
        where: { run: { job: { projectId } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),

      prisma.visibilityMetric.findMany({
        where: { projectId },
        orderBy: { periodStart: "desc" },
        take: 50,
      }),

      prisma.providerResponse.findMany({
        where: { run: { job: { projectId } } },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { prompt: { select: { text: true } } },
      }),

      prisma.recommendation.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ])

  return {
    project: {
      id: project.id,
      name: project.name,
      brandName: project.brandName,
      domain: project.domain,
      description: project.description,
      targetCountries: project.targetCountries ?? [],
    },
    keywords: project.keywords.map((k) => ({ id: k.id, keyword: k.keyword })),
    competitors: project.competitors.map((c) => ({ id: c.id, name: c.name, domain: c.domain })),
    geoScore: geoScore
      ? {
          score: geoScore.score,
          visibilityScore: geoScore.visibilityScore,
          positionScore: geoScore.positionScore,
          citationScore: geoScore.citationScore,
          sentimentScore: geoScore.sentimentScore,
        }
      : null,
    mentions: mentions.map((m) => ({
      brandName: m.brandName,
      sentiment: m.sentiment,
      frequency: m.frequency,
      provider: m.response.provider,
    })),
    citations: citations.map((c) => ({
      domain: c.domain,
      title: c.title,
      url: c.url,
    })),
    visibilityMetrics: visibilityMetrics.map((v) => ({
      brandName: v.brandName,
      mentionCount: v.mentionCount,
      avgPosition: v.avgPosition,
      mentionRate: v.mentionRate,
      periodStart: v.periodStart,
    })),
    providerResponses: providerResponses.map((r) => ({
      provider: r.provider,
      prompt: r.prompt.text,
      responseText: r.responseText,
      createdAt: r.createdAt,
    })),
    recommendations: recommendations.map((r) => ({
      type: r.type,
      priority: r.priority,
      title: r.title,
      description: r.description,
      status: r.status,
    })),
  }
}

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export async function createMention(data: {
  brandName: string
  sentiment: string
  position?: number | null
  frequency?: number
  responseId: string
  runId: string
}) {
  return prisma.mention.create({ data })
}

export async function createManyMentions(data: {
  brandName: string
  sentiment: string
  position?: number | null
  frequency?: number
  responseId: string
  runId: string
}[]) {
  if (data.length === 0) return { count: 0 }
  return prisma.mention.createMany({ data })
}

export async function findMentionsByRun(runId: string) {
  return prisma.mention.findMany({
    where: { runId },
    orderBy: { createdAt: "asc" },
  })
}

export async function countMentionsByProject(projectId: string, days?: number) {
  const where: Prisma.MentionWhereInput = {
    run: { job: { projectId } },
    ...(days ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } } : {}),
  }
  return prisma.mention.count({ where })
}

export async function countByBrand(projectId: string, days?: number) {
  const where: Prisma.MentionWhereInput = {
    run: { job: { projectId } },
    ...(days ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } } : {}),
  }

  const mentions = await prisma.mention.findMany({
    where,
    select: { brandName: true, frequency: true, sentiment: true },
  })

  const brandMap = new Map<string, { count: number; sentiments: string[] }>()
  for (const m of mentions) {
    const entry = brandMap.get(m.brandName) ?? { count: 0, sentiments: [] }
    entry.count += m.frequency
    entry.sentiments.push(m.sentiment)
    brandMap.set(m.brandName, entry)
  }

  return Array.from(brandMap.entries()).map(([brandName, data]) => ({
    brandName,
    mentionCount: data.count,
    sentimentBreakdown: {
      positive: data.sentiments.filter((s) => s === "positive").length,
      negative: data.sentiments.filter((s) => s === "negative").length,
      neutral: data.sentiments.filter((s) => s === "neutral").length,
    },
  }))
}

export async function findMentionsByProject(projectId: string, limit = 50) {
  return prisma.mention.findMany({
    where: { run: { job: { projectId } } },
    include: {
      response: {
        select: { responseText: true, provider: true },
      },
      run: {
        select: { createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

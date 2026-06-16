import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export async function createCitation(data: {
  url: string
  domain: string
  title?: string | null
  responseId: string
  runId: string
}) {
  return prisma.citation.create({ data })
}

export async function createManyCitations(data: {
  url: string
  domain: string
  title?: string | null
  responseId: string
  runId: string
}[]) {
  if (data.length === 0) return { count: 0 }
  return prisma.citation.createMany({ data })
}

export async function findCitationsByRun(runId: string) {
  return prisma.citation.findMany({
    where: { runId },
    orderBy: { createdAt: "asc" },
  })
}

export async function countCitationsByProject(projectId: string, days?: number) {
  const where: Prisma.CitationWhereInput = {
    run: { job: { projectId } },
    ...(days ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } } : {}),
  }
  return prisma.citation.count({ where })
}

export async function countByDomain(projectId: string, days?: number) {
  const where: Prisma.CitationWhereInput = {
    run: { job: { projectId } },
    ...(days ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } } : {}),
  }

  const citations = await prisma.citation.findMany({
    where,
    select: { domain: true },
  })

  const domainMap = new Map<string, number>()
  for (const c of citations) {
    domainMap.set(c.domain, (domainMap.get(c.domain) ?? 0) + 1)
  }

  return Array.from(domainMap.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
}

export async function findCitationsByProject(projectId: string, limit = 50) {
  return prisma.citation.findMany({
    where: { run: { job: { projectId } } },
    include: {
      response: {
        select: { provider: true },
      },
      run: {
        select: { createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

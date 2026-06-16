import { prisma } from "@/lib/prisma"

export async function createCitationOpportunities(
  data: {
    domain: string
    domainAuthority?: string
    opportunityType: string
    relevance: string
    strategy: string
    competitorRef?: string
    contactMethod?: string
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.citationOpportunity.createMany({ data })
}

export async function findCitationOpportunitiesByProject(projectId: string) {
  return prisma.citationOpportunity.findMany({
    where: { projectId },
    orderBy: { impactScore: "desc" },
  })
}

export async function findCitationOpportunitiesByRun(runId: string) {
  return prisma.citationOpportunity.findMany({
    where: { runId },
    orderBy: { impactScore: "desc" },
  })
}

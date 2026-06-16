import { prisma } from "@/lib/prisma"

export async function createAgentRun(projectId: string) {
  return prisma.agentRun.create({
    data: { projectId, status: "running" },
  })
}

export async function completeAgentRun(
  id: string,
  summary: string,
  itemCount: number
) {
  return prisma.agentRun.update({
    where: { id },
    data: { status: "completed", completedAt: new Date(), summary, itemCount },
  })
}

export async function failAgentRun(id: string, error: string) {
  return prisma.agentRun.update({
    where: { id },
    data: { status: "failed", completedAt: new Date(), summary: error },
  })
}

export async function findLatestAgentRun(projectId: string) {
  return prisma.agentRun.findFirst({
    where: { projectId },
    orderBy: { startedAt: "desc" },
    include: {
      _count: {
        select: {
          contentIdeas: true,
          contentBriefs: true,
          competitorAnalyses: true,
          citationOpportunities: true,
          actionPlanItems: true,
          tasks: true,
        },
      },
    },
  })
}

export async function findAgentRunsByProject(projectId: string, limit = 10) {
  return prisma.agentRun.findMany({
    where: { projectId },
    orderBy: { startedAt: "desc" },
    take: limit,
  })
}

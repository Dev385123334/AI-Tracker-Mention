import { prisma } from "@/lib/prisma"

export async function createContentIdeas(
  data: {
    title: string
    description: string
    keyword: string
    contentType: string
    rationale: string
    targetAudience?: string
    impactScore: number
    difficultyScore: number
    priorityScore: number
    runId: string
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.contentIdea.createMany({ data })
}

export async function findContentIdeasByProject(projectId: string) {
  return prisma.contentIdea.findMany({
    where: { projectId },
    orderBy: { priorityScore: "desc" },
  })
}

export async function findContentIdeasByRun(runId: string) {
  return prisma.contentIdea.findMany({
    where: { runId },
    orderBy: { priorityScore: "desc" },
  })
}

export async function updateContentIdeaStatus(id: string, status: string) {
  return prisma.contentIdea.update({
    where: { id },
    data: { status },
  })
}

import { prisma } from "@/lib/prisma"

export async function createActionPlanItems(
  data: {
    title: string
    description: string
    category: string
    priority: string
    timeline: string
    estimatedEffort: string
    dependencies: string[]
    successMetric: string
    impactScore: number
    difficultyScore: number
    priorityScore: number
    runId: string
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.geoActionPlanItem.createMany({ data })
}

export async function findActionPlanByProject(projectId: string) {
  return prisma.geoActionPlanItem.findMany({
    where: { projectId },
    orderBy: { priorityScore: "desc" },
  })
}

export async function findActionPlanByRun(runId: string) {
  return prisma.geoActionPlanItem.findMany({
    where: { runId },
    orderBy: { priorityScore: "desc" },
  })
}

export async function updateActionPlanStatus(id: string, status: string) {
  return prisma.geoActionPlanItem.update({
    where: { id },
    data: { status },
  })
}

import { prisma } from "@/lib/prisma"

export async function createAgentTasks(
  data: {
    title: string
    description: string
    source: string
    sourceId: string
    assignee?: string
    dueDate?: Date
    runId: string
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.agentTask.createMany({ data })
}

export async function findTasksByProject(projectId: string) {
  return prisma.agentTask.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })
}

export async function findTasksByRun(runId: string) {
  return prisma.agentTask.findMany({
    where: { runId },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateTaskStatus(id: string, status: string) {
  return prisma.agentTask.update({
    where: { id },
    data: { status },
  })
}

export async function updateTaskAssignee(id: string, assignee: string) {
  return prisma.agentTask.update({
    where: { id },
    data: { assignee },
  })
}

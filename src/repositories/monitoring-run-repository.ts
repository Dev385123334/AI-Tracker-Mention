import { prisma } from "@/lib/prisma"

export async function findRunsByJob(jobId: string) {
  return prisma.monitoringRun.findMany({
    where: { jobId },
    include: {
      _count: { select: { responses: true, logs: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function findRunById(id: string) {
  return prisma.monitoringRun.findUnique({
    where: { id },
    include: {
      responses: {
        include: { prompt: { include: { keyword: { select: { keyword: true } } } } },
        orderBy: { createdAt: "asc" },
      },
      logs: { orderBy: { createdAt: "asc" } },
      mentions: { orderBy: { createdAt: "asc" } },
      citations: { orderBy: { createdAt: "asc" } },
      sentimentResults: { orderBy: { createdAt: "asc" } },
    },
  })
}

export async function createRun(data: { jobId: string }) {
  return prisma.monitoringRun.create({
    data: { ...data, status: "pending" },
  })
}

export async function updateRun(
  id: string,
  data: { status?: string; startedAt?: Date | null; completedAt?: Date | null; error?: string | null }
) {
  return prisma.monitoringRun.update({ where: { id }, data })
}

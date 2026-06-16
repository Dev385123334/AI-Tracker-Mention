import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export async function findLogsByRun(runId: string) {
  return prisma.jobLog.findMany({
    where: { runId },
    orderBy: { createdAt: "asc" },
  })
}

export async function createLog(data: {
  runId: string
  level: string
  message: string
  metadata?: Prisma.InputJsonValue
}) {
  return prisma.jobLog.create({ data })
}

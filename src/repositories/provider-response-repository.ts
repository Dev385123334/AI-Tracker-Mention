import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export async function findResponsesByRun(runId: string) {
  return prisma.providerResponse.findMany({
    where: { runId },
    include: { prompt: { include: { keyword: { select: { keyword: true } } } } },
    orderBy: { createdAt: "asc" },
  })
}

export async function createResponse(data: {
  runId: string
  promptId: string
  provider: string
  responseText: string
  rawResponse?: Prisma.InputJsonValue
  latencyMs?: number
  tokensUsed?: number
  status?: string
  errorMessage?: string
}) {
  return prisma.providerResponse.create({ data })
}

export async function createManyResponses(data: {
  runId: string
  promptId: string
  provider: string
  responseText: string
  rawResponse?: Prisma.InputJsonValue
  latencyMs?: number
  tokensUsed?: number
  status?: string
}[]) {
  return prisma.providerResponse.createMany({ data })
}

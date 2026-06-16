import { prisma } from "@/lib/prisma"

export async function createCompetitorAnalyses(
  data: {
    competitorName: string
    competitorDomain: string
    gapType: string
    gapSeverity: string
    description: string
    brandStrength: string
    competitorStrength: string
    actionItems: string[]
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.competitorGapAnalysis.createMany({ data })
}

export async function findCompetitorAnalysesByProject(projectId: string) {
  return prisma.competitorGapAnalysis.findMany({
    where: { projectId },
    orderBy: { impactScore: "desc" },
  })
}

export async function findCompetitorAnalysesByRun(runId: string) {
  return prisma.competitorGapAnalysis.findMany({
    where: { runId },
    orderBy: { impactScore: "desc" },
  })
}

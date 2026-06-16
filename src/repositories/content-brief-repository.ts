import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export async function createContentBriefs(
  data: {
    title: string
    targetKeyword: string
    wordCount: number
    structure: Record<string, unknown>
    keyPoints: string[]
    faqQuestions: string[]
    internalLinks: string[]
    targetAudience: string
    toneOfVoice: string
    seoNotes: string
    competitorRefs: string[]
    callToAction: string
    runId: string
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.contentBrief.createMany({
    data: data.map((d) => ({ ...d, structure: d.structure }) as Prisma.ContentBriefCreateManyInput),
  })
}

export async function findContentBriefsByProject(projectId: string) {
  return prisma.contentBrief.findMany({
    where: { projectId },
    orderBy: { wordCount: "desc" },
  })
}

export async function findContentBriefsByRun(runId: string) {
  return prisma.contentBrief.findMany({
    where: { runId },
    orderBy: { wordCount: "desc" },
  })
}

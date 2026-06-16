import { prisma } from "@/lib/prisma"

export async function findPromptsByKeyword(keywordId: string) {
  return prisma.prompt.findMany({
    where: { keywordId },
    orderBy: { createdAt: "desc" },
  })
}

export async function findPromptsByProject(projectId: string) {
  return prisma.prompt.findMany({
    where: { keyword: { projectId } },
    include: { keyword: { select: { keyword: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function createPrompt(data: { text: string; keywordId: string }) {
  return prisma.prompt.create({ data })
}

export async function createManyPrompts(data: { text: string; keywordId: string }[]) {
  return prisma.prompt.createMany({ data })
}

export async function deletePromptsByKeyword(keywordId: string) {
  return prisma.prompt.deleteMany({ where: { keywordId } })
}

export async function countPromptsByProject(projectId: string) {
  return prisma.prompt.count({
    where: { keyword: { projectId } },
  })
}

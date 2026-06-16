import { createManyPrompts, findPromptsByKeyword } from "@/repositories/prompt-repository"
import { prisma } from "@/lib/prisma"

const promptTemplates = [
  (kw: string) => `What are the best ${kw}?`,
  (kw: string) => `Top ${kw} in 2026`,
  (kw: string) => `Best ${kw} for agencies and enterprises`,
  (kw: string) => `Most trusted and recommended ${kw}`,
  (kw: string) => `How to choose the right ${kw} for your business`,
  (kw: string) => `Comprehensive guide to ${kw} in 2026`,
  (kw: string) => `Expert recommendations for ${kw}`,
  (kw: string) => `${kw} comparison and review`,
]

export async function generatePromptsForKeyword(keywordId: string): Promise<number> {
  const keyword = await prisma.keyword.findUnique({
    where: { id: keywordId },
    select: { keyword: true, projectId: true },
  })
  if (!keyword) throw new Error("Keyword not found")

  const existing = await findPromptsByKeyword(keywordId)
  if (existing.length > 0) return 0

  const prompts = promptTemplates.map((fn) => ({
    text: fn(keyword.keyword),
    keywordId,
  }))

  await createManyPrompts(prompts)
  return prompts.length
}

export async function generatePromptsForProject(projectId: string): Promise<number> {
  const keywords = await prisma.keyword.findMany({
    where: { projectId },
    select: { id: true, keyword: true },
  })

  let total = 0
  for (const keyword of keywords) {
    const existing = await findPromptsByKeyword(keyword.id)
    if (existing.length > 0) continue

    const prompts = promptTemplates.map((fn) => ({
      text: fn(keyword.keyword),
      keywordId: keyword.id,
    }))
    await createManyPrompts(prompts)
    total += prompts.length
  }

  return total
}

export async function regeneratePromptsForProject(projectId: string): Promise<number> {
  const keywords = await prisma.keyword.findMany({
    where: { projectId },
    select: { id: true, keyword: true },
  })

  let total = 0
  for (const keyword of keywords) {
    await prisma.prompt.deleteMany({ where: { keywordId: keyword.id } })

    const prompts = promptTemplates.map((fn) => ({
      text: fn(keyword.keyword),
      keywordId: keyword.id,
    }))
    await createManyPrompts(prompts)
    total += prompts.length
  }

  return total
}

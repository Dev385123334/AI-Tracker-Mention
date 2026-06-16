import { prisma } from "@/lib/prisma"

export async function findAllKeywordsByProject(projectId: string) {
  return prisma.keyword.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })
}

export async function findKeywordById(id: string) {
  return prisma.keyword.findUnique({ where: { id } })
}

export async function createKeyword(data: { keyword: string; projectId: string }) {
  return prisma.keyword.create({ data })
}

export async function createManyKeywords(data: { keyword: string; projectId: string }[]) {
  return prisma.keyword.createMany({
    data,
    skipDuplicates: true,
  })
}

export async function updateKeyword(id: string, data: { keyword?: string }) {
  return prisma.keyword.update({ where: { id }, data })
}

export async function deleteKeyword(id: string) {
  return prisma.keyword.delete({ where: { id } })
}

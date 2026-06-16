import { prisma } from "@/lib/prisma"

export async function findAllCompetitorsByProject(projectId: string) {
  return prisma.competitor.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })
}

export async function findCompetitorById(id: string) {
  return prisma.competitor.findUnique({ where: { id } })
}

export async function createCompetitor(data: { name: string; domain: string; projectId: string }) {
  return prisma.competitor.create({ data })
}

export async function updateCompetitor(id: string, data: { name?: string; domain?: string }) {
  return prisma.competitor.update({ where: { id }, data })
}

export async function deleteCompetitor(id: string) {
  return prisma.competitor.delete({ where: { id } })
}

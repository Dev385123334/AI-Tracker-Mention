import { prisma } from "@/lib/prisma"

export async function createRecommendation(data: {
  type: string
  priority: string
  title: string
  description: string
  category: string
  impact?: string | null
  projectId: string
}) {
  return prisma.recommendation.create({ data })
}

export async function createManyRecommendations(
  data: {
    type: string
    priority: string
    title: string
    description: string
    category: string
    impact?: string | null
    projectId: string
  }[]
) {
  if (data.length === 0) return { count: 0 }
  return prisma.recommendation.createMany({ data })
}

export async function findRecommendationsByProject(projectId: string) {
  return prisma.recommendation.findMany({
    where: { projectId },
    orderBy: [
      { priority: "asc" },
      { createdAt: "desc" },
    ],
  })
}

export async function findRecommendationsByStatus(
  projectId: string,
  status: string
) {
  return prisma.recommendation.findMany({
    where: { projectId, status },
    orderBy: { priority: "asc" },
  })
}

export async function updateRecommendationStatus(
  id: string,
  status: string
) {
  return prisma.recommendation.update({
    where: { id },
    data: { status },
  })
}

export async function deleteOldRecommendations(projectId: string) {
  return prisma.recommendation.deleteMany({
    where: { projectId, status: "dismissed" },
  })
}

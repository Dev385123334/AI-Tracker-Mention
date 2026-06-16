import { prisma } from "@/lib/prisma"

export async function findAllProjectsByUser(userId: string) {
  return prisma.project.findMany({
    where: {
      organization: {
        members: {
          some: { userId },
        },
      },
    },
    include: {
      organization: {
        select: { id: true, name: true },
      },
      _count: {
        select: { competitors: true, keywords: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function findProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      organization: {
        select: { id: true, name: true },
      },
      _count: {
        select: { competitors: true, keywords: true, monitoringJobs: true },
      },
    },
  })
}

export async function createProject(data: {
  name: string
  brandName: string
  domain: string
  description?: string
  organizationId: string
  userId: string
}) {
  return prisma.project.create({ data })
}

export async function updateProject(
  id: string,
  data: {
    name?: string
    brandName?: string
    domain?: string
    description?: string
  }
) {
  return prisma.project.update({ where: { id }, data })
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } })
}

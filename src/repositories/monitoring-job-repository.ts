import { prisma } from "@/lib/prisma"

export async function findJobsByProject(projectId: string) {
  return prisma.monitoringJob.findMany({
    where: { projectId },
    include: {
      _count: { select: { runs: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function findJobById(id: string) {
  return prisma.monitoringJob.findUnique({
    where: { id },
    include: {
      _count: { select: { runs: true } },
    },
  })
}

export async function createJob(data: {
  projectId: string
  type: string
  schedule?: string | null
}) {
  return prisma.monitoringJob.create({ data })
}

export async function updateJob(
  id: string,
  data: { type?: string; status?: string; schedule?: string | null }
) {
  return prisma.monitoringJob.update({ where: { id }, data })
}

export async function deleteJob(id: string) {
  return prisma.monitoringJob.delete({ where: { id } })
}

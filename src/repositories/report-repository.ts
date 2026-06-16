import { prisma } from "@/lib/prisma"

export async function createReport(data: {
  type: string
  title: string
  format: string
  periodStart: Date
  periodEnd: Date
  projectId: string
}) {
  return prisma.report.create({ data })
}

export async function updateReport(
  id: string,
  data: {
    status?: string
    fileUrl?: string
    fileSize?: number
    completedAt?: Date
  }
) {
  return prisma.report.update({ where: { id }, data })
}

export async function findReportsByProject(projectId: string) {
  return prisma.report.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })
}

export async function findReportsByType(projectId: string, type: string) {
  return prisma.report.findMany({
    where: { projectId, type },
    orderBy: { createdAt: "desc" },
  })
}

export async function findReportById(id: string) {
  return prisma.report.findUnique({ where: { id } })
}

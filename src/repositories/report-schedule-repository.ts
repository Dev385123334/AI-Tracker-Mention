import { prisma } from "@/lib/prisma"

export async function upsertReportSchedule(data: {
  type: string
  enabled: boolean
  dayOfWeek?: number | null
  dayOfMonth?: number | null
  hour: number
  nextRunAt?: Date | null
  projectId: string
}) {
  const existing = await prisma.reportSchedule.findFirst({
    where: { projectId: data.projectId, type: data.type },
  })

  if (existing) {
    return prisma.reportSchedule.update({
      where: { id: existing.id },
      data,
    })
  }

  return prisma.reportSchedule.create({ data })
}

export async function findSchedulesByProject(projectId: string) {
  return prisma.reportSchedule.findMany({
    where: { projectId },
    orderBy: { type: "asc" },
  })
}

export async function findDueSchedules() {
  return prisma.reportSchedule.findMany({
    where: {
      enabled: true,
      nextRunAt: { lte: new Date() },
    },
    include: { project: true },
  })
}

export async function updateNextRun(id: string, nextRunAt: Date) {
  return prisma.reportSchedule.update({
    where: { id },
    data: { nextRunAt },
  })
}

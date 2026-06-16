import { createJob, updateJob } from "@/repositories/monitoring-job-repository"

export const SCHEDULE_CONFIG = {
  daily: { cron: "0 6 * * *", label: "Daily at 6:00 AM" },
  weekly: { cron: "0 6 * * 1", label: "Weekly on Monday at 6:00 AM" },
  manual: { cron: null, label: "Manual trigger" },
} as const

function buildCronExpression(value: number, unit: "minutes" | "hours" | "days"): string {
  switch (unit) {
    case "minutes":
      if (value <= 0) return "0 * * * *"
      return `*/${value} * * * *`
    case "hours":
      if (value <= 0) return "0 * * * *"
      return `0 */${value} * * *`
    case "days":
      if (value <= 0) return "0 0 * * *"
      return `0 0 */${value} * *`
  }
}

export type MonitoringType = keyof typeof SCHEDULE_CONFIG | "custom"

export async function createMonitoringJob(
  projectId: string,
  type: MonitoringType,
  customSchedule?: { value: number; unit: "minutes" | "hours" | "days" }
) {
  if (type === "custom" && customSchedule) {
    const cron = buildCronExpression(customSchedule.value, customSchedule.unit)
    return createJob({
      projectId,
      type: "custom",
      schedule: cron,
    })
  }

  const config = SCHEDULE_CONFIG[type as keyof typeof SCHEDULE_CONFIG]
  return createJob({
    projectId,
    type,
    schedule: config.cron,
  })
}

export async function pauseMonitoringJob(jobId: string) {
  return updateJob(jobId, { status: "paused" })
}

export async function activateMonitoringJob(jobId: string) {
  return updateJob(jobId, { status: "active" })
}

export async function archiveMonitoringJob(jobId: string) {
  return updateJob(jobId, { status: "archived" })
}

export function getNextRunTime(type: MonitoringType, schedule?: string | null): Date | null {
  if (type === "manual") return null
  const config = SCHEDULE_CONFIG[type as keyof typeof SCHEDULE_CONFIG]
  const cron = schedule ?? config?.cron
  if (!cron) return null
  const next = new Date()
  const parts = cron.split(" ")
  if (parts.length < 2) return null
  const [minute, hour] = parts.map(Number)
  if (isNaN(minute) || isNaN(hour)) return null
  next.setHours(hour || 0, minute || 0, 0, 0)
  if (next <= new Date()) next.setDate(next.getDate() + 1)
  return next
}

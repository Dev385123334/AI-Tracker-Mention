import { prisma } from "@/lib/prisma"
import { addMonitoringJob, addAgentRunJob } from "@/queues"

interface CronFields {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

function parseCron(cron: string): CronFields | null {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return null
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  return { minute, hour, dayOfMonth, month, dayOfWeek }
}

function fieldMatches(pattern: string, value: number): boolean {
  if (pattern === "*") return true
  if (pattern.startsWith("*/")) {
    const step = parseInt(pattern.slice(2), 10)
    if (isNaN(step) || step <= 0) return false
    return value % step === 0
  }
  return parseInt(pattern, 10) === value
}

function cronMatches(fields: CronFields, date: Date): boolean {
  return (
    fieldMatches(fields.minute, date.getMinutes()) &&
    fieldMatches(fields.hour, date.getHours()) &&
    fieldMatches(fields.dayOfMonth, date.getDate()) &&
    fieldMatches(fields.month, date.getMonth() + 1) &&
    fieldMatches(fields.dayOfWeek, date.getDay())
  )
}

function getIntervalMs(fields: CronFields): number {
  if (fields.minute.startsWith("*/")) {
    const step = parseInt(fields.minute.slice(2), 10)
    return step * 60 * 1000
  }
  if (fields.hour.startsWith("*/")) {
    const step = parseInt(fields.hour.slice(2), 10)
    return step * 60 * 60 * 1000
  }
  if (fields.dayOfMonth.startsWith("*/")) {
    const step = parseInt(fields.dayOfMonth.slice(2), 10)
    return step * 24 * 60 * 60 * 1000
  }
  return 24 * 60 * 60 * 1000
}

export async function checkAndTriggerJobs(): Promise<number> {
  const jobs = await prisma.monitoringJob.findMany({
    where: { status: "active", schedule: { not: null } },
    include: {
      runs: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  })

  let triggered = 0
  const now = new Date()

  for (const job of jobs) {
    try {
      if (!job.schedule) continue

      const fields = parseCron(job.schedule)
      if (!fields) continue

      if (!cronMatches(fields, now)) continue

      const lastRun = job.runs[0]

      if (lastRun && (lastRun.status === "pending" || lastRun.status === "running")) continue

      if (lastRun && (now.getTime() - lastRun.createdAt.getTime()) < getIntervalMs(fields)) continue

      await addMonitoringJob(job.id)
      triggered++
    } catch (err) {
      console.error(`[scheduler] Error processing job ${job.id}:`, err)
    }
  }

  return triggered
}

export async function checkAndTriggerAgentRuns(): Promise<number> {
  const projects = await prisma.project.findMany({
    include: {
      agentRuns: { orderBy: { startedAt: "desc" }, take: 1 },
    },
  })

  let triggered = 0
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  for (const project of projects) {
    try {
      const lastRun = project.agentRuns[0]
      if (!lastRun || lastRun.startedAt < sevenDaysAgo) {
        await addAgentRunJob(project.id)
        triggered++
      }
    } catch (err) {
      console.error(`[scheduler] Error processing agent run for project ${project.id}:`, err)
    }
  }

  return triggered
}

const POLL_INTERVAL_MS = 30_000

export function startScheduler(): { stop: () => void } {
  let interval: ReturnType<typeof setInterval> | null = null
  let stopped = false

  async function tick() {
    if (stopped) return
    try {
      const count = await checkAndTriggerJobs()
      if (count > 0) {
        console.log(`[scheduler] Triggered ${count} monitoring job(s)`)
      }
      const agentCount = await checkAndTriggerAgentRuns()
      if (agentCount > 0) {
        console.log(`[scheduler] Triggered ${agentCount} agent run(s)`)
      }
    } catch (err) {
      console.error("[scheduler] Error:", err)
    }
  }

  tick()

  interval = setInterval(tick, POLL_INTERVAL_MS)

  return {
    stop: () => {
      stopped = true
      if (interval) clearInterval(interval)
    },
  }
}

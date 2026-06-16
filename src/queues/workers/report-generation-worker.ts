import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames } from "../index"
import { generateWeeklyReport, generateMonthlyReport } from "@/services/reports/report-generator"
import { findReportById } from "@/repositories/report-repository"

export function createReportGenerationWorker() {
  const worker = new Worker(
    queueNames.reportGeneration,
    async (job) => {
      const { reportId } = job.data as { reportId: string }
      const report = await findReportById(reportId)
      if (!report) throw new Error(`Report ${reportId} not found`)

      await (report.type === "weekly"
        ? generateWeeklyReport(report.projectId)
        : report.type === "monthly"
          ? generateMonthlyReport(report.projectId)
          : generateWeeklyReport(report.projectId))

      return { reportId, type: report.type }
    },
    { connection: redis }
  )

  worker.on("completed", (job) => {
    console.log(`[report_generation] Job ${job.id} completed: ${job.returnvalue?.type} report`)
  })

  worker.on("failed", (job, err) => {
    console.error(`[report_generation] Job ${job?.id} failed:`, err.message)
  })

  return worker
}

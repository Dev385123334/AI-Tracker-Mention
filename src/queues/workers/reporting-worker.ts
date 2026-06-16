import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames, addGeoScoreJob } from "../index"
import { calculateVisibilityMetrics } from "@/services/analytics/visibility-engine"
import { prisma } from "@/lib/prisma"

export function createReportingWorker() {
  const worker = new Worker(
    queueNames.reporting,
    async (job) => {
      const { runId } = job.data as { runId: string }

      const run = await prisma.monitoringRun.findUnique({
        where: { id: runId },
        include: { job: { select: { projectId: true } } },
      })
      if (!run) throw new Error(`Run ${runId} not found`)

      const result = await calculateVisibilityMetrics(run.job.projectId)
      await addGeoScoreJob(run.job.projectId)

      console.log(`[reporting] Run ${runId}: ${result.metricsCreated} visibility metrics updated`)

      return { runId, metricsCreated: result.metricsCreated }
    },
    { connection: redis }
  )

  worker.on("completed", (job) => {
    const ret = job.returnvalue as { runId: string; metricsCreated: number } | undefined
    if (ret) {
      console.log(`[reporting] Job ${job.id}: ${ret.metricsCreated} metrics for run ${ret.runId}`)
    }
  })

  worker.on("failed", (job, err) => {
    console.error(`[reporting] Job ${job?.id} failed:`, err.message)
  })

  return worker
}

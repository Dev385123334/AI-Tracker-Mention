import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames, addParsingJob } from "../index"
import { startMonitoringRun } from "@/services/monitoring-runner"

export function createMonitoringWorker() {
  const worker = new Worker(
    queueNames.monitoring,
    async (job) => {
      const { jobId } = job.data as { jobId: string }
      const runId = await startMonitoringRun(jobId)
      await addParsingJob(runId)
      return { runId }
    },
    { connection: redis }
  )

  worker.on("completed", (job) => {
    console.log(`[monitoring] Job ${job.id} completed for run ${job.returnvalue?.runId}`)
  })

  worker.on("failed", (job, err) => {
    console.error(`[monitoring] Job ${job?.id} failed:`, err.message)
  })

  return worker
}

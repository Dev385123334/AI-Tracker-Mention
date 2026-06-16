import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames } from "../index"
import { calculateGeoScore } from "@/services/analytics/geo-score"

export function createGeoScoreWorker() {
  const worker = new Worker(
    queueNames.geoScore,
    async (job) => {
      const { projectId } = job.data as { projectId: string }
      const result = await calculateGeoScore(projectId)
      return { projectId, score: result?.score ?? null }
    },
    { connection: redis }
  )

  worker.on("completed", (job) => {
    const ret = job.returnvalue as { projectId: string; score: number | null } | undefined
    if (ret) {
      console.log(`[geo_score] Job ${job.id}: project ${ret.projectId} score=${ret.score}`)
    }
  })

  worker.on("failed", (job, err) => {
    console.error(`[geo_score] Job ${job?.id} failed:`, err.message)
  })

  return worker
}

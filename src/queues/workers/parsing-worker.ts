import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames } from "../index"
import { runParsing } from "@/services/parsing/runner"

export function createParsingWorker() {
  const worker = new Worker(
    queueNames.parsing,
    async (job) => {
      const { runId } = job.data as { runId: string }
      const result = await runParsing(runId)
      return { runId, ...result }
    },
    { connection: redis }
  )

  worker.on("completed", (j) => {
    const ret = j.returnvalue as { runId: string; mentions: number; citations: number; sentiments: number } | undefined
    if (ret) {
      console.log(`[parsing] Job ${j.id} done: ${ret.mentions}m ${ret.citations}c ${ret.sentiments}s`)
    }
  })

  worker.on("failed", (j, err) => {
    console.error(`[parsing] Job ${j?.id} failed:`, err.message)
  })

  return worker
}

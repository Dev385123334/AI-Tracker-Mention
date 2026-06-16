import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames } from "../index"
import { generatePromptsForKeyword } from "@/services/prompt-generation-service"

export function createPromptGenerationWorker() {
  const worker = new Worker(
    queueNames.promptGeneration,
    async (job) => {
      const { keywordId } = job.data as { keywordId: string }
      const count = await generatePromptsForKeyword(keywordId)
      return { promptsGenerated: count }
    },
    { connection: redis }
  )

  worker.on("completed", (job) => {
    console.log(`[prompt_generation] Job ${job.id} completed: ${job.returnvalue?.promptsGenerated} prompts`)
  })

  worker.on("failed", (job, err) => {
    console.error(`[prompt_generation] Job ${job?.id} failed:`, err.message)
  })

  return worker
}

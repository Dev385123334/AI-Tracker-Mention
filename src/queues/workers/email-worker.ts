import { Worker } from "bullmq"
import { redis } from "../connection"
import { queueNames } from "../index"
import { sendEmail } from "@/services/email/email-service"

export function createEmailWorker() {
  const worker = new Worker(
    queueNames.email,
    async (job) => {
      const payload = job.data as {
        to: string
        subject: string
        html: string
        text?: string
      }
      const result = await sendEmail(payload)
      return { success: result.success, to: payload.to }
    },
    { connection: redis }
  )

  worker.on("completed", (job) => {
    console.log(`[email] Job ${job.id}: sent to ${job.returnvalue?.to}`)
  })

  worker.on("failed", (job, err) => {
    console.error(`[email] Job ${job?.id} failed:`, err.message)
  })

  return worker
}

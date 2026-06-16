import { Worker } from "bullmq"
import { redis } from "../connection"
import { runAgent } from "@/services/agent"

export function createAgentWorker() {
  const worker = new Worker(
    "agent",
    async (job) => {
      const { projectId } = (job.data ?? {}) as { projectId?: string }
      if (!projectId) throw new Error("Missing projectId in agent job data")
      return runAgent(projectId)
    },
    {
      connection: redis,
    }
  )
  return worker
}

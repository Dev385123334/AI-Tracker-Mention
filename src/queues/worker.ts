import { ensureConnected } from "./connection"
import { createPromptGenerationWorker } from "./workers/prompt-generation-worker"
import { createMonitoringWorker } from "./workers/monitoring-worker"
import { createParsingWorker } from "./workers/parsing-worker"
import { createReportingWorker } from "./workers/reporting-worker"
import { createGeoScoreWorker } from "./workers/geo-score-worker"
import { createReportGenerationWorker } from "./workers/report-generation-worker"
import { createEmailWorker } from "./workers/email-worker"
import { createAgentWorker } from "./workers/agent-worker"
import { startScheduler } from "@/services/monitoring-scheduler-loop"

async function start() {
  console.log("Starting BullMQ workers and scheduler...")
  await ensureConnected()
  console.log("Redis connection established (ioredis-mock)")

  const workers = [
    createPromptGenerationWorker(),
    createMonitoringWorker(),
    createParsingWorker(),
    createReportingWorker(),
    createGeoScoreWorker(),
    createReportGenerationWorker(),
    createEmailWorker(),
    createAgentWorker(),
  ]

  console.log(`Started ${workers.length} workers`)

  const scheduler = startScheduler()
  console.log("[scheduler] Started (polling every 30s)")

  process.on("SIGINT", async () => {
    console.log("\nShutting down...")
    scheduler.stop()
    await Promise.all(workers.map((w) => w.close()))
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    console.log("\nShutting down...")
    scheduler.stop()
    await Promise.all(workers.map((w) => w.close()))
    process.exit(0)
  })
}

start().catch((err) => {
  console.error("Failed to start workers:", err)
  process.exit(1)
})

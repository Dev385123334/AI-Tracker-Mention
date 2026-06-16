import { Queue } from "bullmq"
import { redis } from "./connection"

export const queueNames = {
  promptGeneration: "prompt_generation",
  monitoring: "monitoring",
  parsing: "parsing",
  reporting: "reporting",
  geoScore: "geo_score",
  reportGeneration: "report_generation",
  email: "email",
  agent: "agent",
} as const

function createQueue(name: string) {
  return new Queue(name, {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: { age: 3600 * 24 * 7 },
      removeOnFail: { age: 3600 * 24 * 30 },
    },
  })
}

export const promptGenerationQueue = createQueue(queueNames.promptGeneration)
export const monitoringQueue = createQueue(queueNames.monitoring)
export const parsingQueue = createQueue(queueNames.parsing)
export const reportingQueue = createQueue(queueNames.reporting)
export const geoScoreQueue = createQueue(queueNames.geoScore)
export const reportGenerationQueue = createQueue(queueNames.reportGeneration)
export const emailQueue = createQueue(queueNames.email)
export const agentQueue = createQueue(queueNames.agent)

export async function addPromptGenerationJob(keywordId: string) {
  await promptGenerationQueue.add("generate-prompts", { keywordId })
}

export async function addMonitoringJob(jobId: string) {
  await monitoringQueue.add("run-monitoring", { jobId })
}

export async function addParsingJob(runId: string) {
  await parsingQueue.add("parse-results", { runId })
}

export async function addReportingJob(runId: string) {
  await reportingQueue.add("generate-report", { runId })
}

export async function addGeoScoreJob(projectId: string) {
  await geoScoreQueue.add("calculate-geo-score", { projectId })
}

export async function addReportGenerationJob(reportId: string) {
  await reportGenerationQueue.add("generate-report", { reportId })
}

export async function addEmailJob(payload: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  await emailQueue.add("send-email", payload)
}

export async function addAgentRunJob(projectId: string) {
  await agentQueue.add("run-agent", { projectId })
}

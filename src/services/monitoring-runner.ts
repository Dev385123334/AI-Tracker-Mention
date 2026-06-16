import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"
import { createRun, updateRun, findRunById } from "@/repositories/monitoring-run-repository"
import { createResponse } from "@/repositories/provider-response-repository"
import { createLog } from "@/repositories/job-log-repository"
import { findPromptsByProject } from "@/repositories/prompt-repository"
import { getAllProviders } from "@/providers/factory"

export async function startMonitoringRun(jobId: string): Promise<string> {
  const run = await createRun({ jobId })
  const runId = run.id

  try {
    await createLog({ runId, level: "info", message: "Monitoring run started" })
    await updateRun(runId, { status: "running", startedAt: new Date() })

    const runRecord = await findRunById(runId)
    if (!runRecord) throw new Error("Run not found after creation")

    await createLog({ runId, level: "info", message: "Fetching prompts for run" })

    const job = await prisma.monitoringJob.findUnique({
      where: { id: jobId },
      select: { projectId: true },
    })
    if (!job) throw new Error("Job not found")

    const prompts = await findPromptsByProject(job.projectId)

    if (prompts.length === 0) {
      await createLog({ runId, level: "warn", message: "No prompts found for project" })
      await updateRun(runId, { status: "completed", completedAt: new Date() })
      await createLog({ runId, level: "info", message: "Monitoring run completed (no prompts)" })
      return runId
    }

    await createLog({ runId, level: "info", message: `Found ${prompts.length} prompts to process` })

    const providers = getAllProviders()
    let totalResponses = 0

    for (const prompt of prompts) {
      await createLog({ runId, level: "info", message: `Processing prompt: "${prompt.text.substring(0, 60)}..."` })

      for (const provider of providers) {
        await createLog({ runId, level: "info", message: `Sending to ${provider.name}...` })
        try {
          const result = await provider.sendPrompt(prompt.text)
          await createResponse({
            runId,
            promptId: prompt.id,
            provider: provider.name,
            responseText: result.responseText,
            rawResponse: result.rawResponse as Prisma.InputJsonValue,
            latencyMs: result.latencyMs,
            tokensUsed: result.tokensUsed,
            status: "success",
          })
          totalResponses++
        } catch (err) {
          await createResponse({
            runId,
            promptId: prompt.id,
            provider: provider.name,
            responseText: "",
            status: "error",
            errorMessage: (err as Error).message,
          })
          await createLog({ runId, level: "error", message: `Provider ${provider.name} failed: ${(err as Error).message}` })
        }
      }
    }

    await createLog({ runId, level: "info", message: `Run complete. ${totalResponses} responses collected.` })
    await updateRun(runId, { status: "completed", completedAt: new Date() })
  } catch (err) {
    await createLog({ runId, level: "error", message: `Run failed: ${(err as Error).message}` })
    await updateRun(runId, { status: "failed", error: (err as Error).message, completedAt: new Date() })
  }

  return runId
}

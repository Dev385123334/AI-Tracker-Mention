import { prisma } from "@/lib/prisma"
import { parseResponse } from "./index"
import { createManyMentions } from "@/repositories/mention-repository"
import { createManyCitations } from "@/repositories/citation-repository"
import { createManySentimentResults } from "@/repositories/sentiment-repository"
import { addReportingJob } from "@/queues"

export async function runParsing(runId: string): Promise<{ mentions: number; citations: number; sentiments: number }> {
  const run = await prisma.monitoringRun.findUnique({
    where: { id: runId },
    include: {
      job: { include: { project: { include: { competitors: true } } } },
      responses: { where: { status: "success" } },
    },
  })

  if (!run) throw new Error(`Run ${runId} not found`)

  const project = run.job.project
  const knownBrands = [
    project.brandName,
    ...project.competitors.map((c) => c.name),
  ]

  let totalMentions = 0
  let totalCitations = 0
  let totalSentiments = 0

  for (const response of run.responses) {
    if (!response.responseText) continue

    const parsed = parseResponse(response.responseText, knownBrands)

    if (parsed.mentions.length > 0) {
      const mentionData = parsed.mentions.map((m) => ({
        brandName: m.brandName,
        sentiment: m.sentiment.label,
        position: m.position ?? undefined,
        frequency: m.frequency,
        responseId: response.id,
        runId,
      }))
      const result = await createManyMentions(mentionData)
      totalMentions += result.count
    }

    if (parsed.citations.length > 0) {
      const citationData = parsed.citations.map((c) => ({
        url: c.url,
        domain: c.domain,
        title: c.title ?? undefined,
        responseId: response.id,
        runId,
      }))
      const result = await createManyCitations(citationData)
      totalCitations += result.count
    }

    if (parsed.mentions.length > 0) {
      const sentimentData = parsed.mentions.map((m) => ({
        brandName: m.brandName,
        score: m.sentiment.score,
        label: m.sentiment.label,
        confidence: m.sentiment.confidence,
        responseId: response.id,
        runId,
      }))
      const result = await createManySentimentResults(sentimentData)
      totalSentiments += result.count
    }
  }

  console.log(`[parsing] Run ${runId}: ${totalMentions} mentions, ${totalCitations} citations, ${totalSentiments} sentiments`)

  await addReportingJob(runId)

  return { mentions: totalMentions, citations: totalCitations, sentiments: totalSentiments }
}

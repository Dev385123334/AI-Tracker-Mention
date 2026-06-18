import { gatherProjectData } from "./data-gatherer"
import { buildGeoPrompt } from "./prompt-builder"
import { parseGeoResponse } from "./response-parser"
import { getProvider } from "@/providers/factory"
import { prisma } from "@/lib/prisma"
import type { GeoAgentOutput } from "./types"

export async function runGeoAgent(projectId: string): Promise<{
  output: GeoAgentOutput
  rawResponse: string
  tokensUsed: number
  latencyMs: number
}> {
  const data = await gatherProjectData(projectId)
  const prompt = buildGeoPrompt(data)

  const provider = getProvider("openai")
  const result = await provider.sendPrompt(prompt)

  const output = parseGeoResponse(result.responseText)

  return {
    output,
    rawResponse: result.responseText,
    tokensUsed: result.tokensUsed ?? 0,
    latencyMs: result.latencyMs ?? 0,
  }
}

export async function runGeoAgentAndSave(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  })
  if (!project) throw new Error(`Project ${projectId} not found`)

  const agentRun = await prisma.agentRun.create({
    data: { projectId, status: "running" },
  })

  try {
    const { output, rawResponse, tokensUsed, latencyMs } = await runGeoAgent(projectId)

    const totalItems =
      output.contentRecommendations.length +
      output.competitorGaps.length +
      output.citationOpportunities.length +
      output.scoredRecommendations.length

    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        summary: `GEO Agent analysis complete: ${totalItems} insights generated across ${Object.keys(output).length} sections`,
        itemCount: totalItems,
      },
    })

    return { agentRunId: agentRun.id, output, rawResponse, tokensUsed, latencyMs }
  } catch (err) {
    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: { status: "failed", completedAt: new Date(), summary: (err as Error).message },
    })
    throw err
  }
}

import type { Provider, ProviderResult, HealthStatus } from "./types"
import { getMockResponse } from "./mock-data"

export function createPerplexityProvider(): Provider {
  return {
    name: "perplexity",

    async sendPrompt(prompt: string): Promise<ProviderResult> {
      const start = Date.now()
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))
      const { responseText, rawResponse } = getMockResponse("perplexity", prompt)
      return {
        responseText,
        rawResponse,
        latencyMs: Date.now() - start,
        tokensUsed: (rawResponse.usage as Record<string, unknown>).total_tokens as number,
      }
    },

    async healthCheck(): Promise<HealthStatus> {
      const start = Date.now()
      await new Promise((r) => setTimeout(r, 70))
      return { healthy: true, latencyMs: Date.now() - start }
    },
  }
}

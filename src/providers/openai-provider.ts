import type { Provider, ProviderResult, HealthStatus } from "./types"
import { getMockResponse } from "./mock-data"

export function createOpenAIProvider(): Provider {
  return {
    name: "openai",

    async sendPrompt(prompt: string): Promise<ProviderResult> {
      const start = Date.now()
      await new Promise((r) => setTimeout(r, 100 + Math.random() * 200))
      const { responseText, rawResponse } = getMockResponse("openai", prompt)
      return {
        responseText,
        rawResponse,
        latencyMs: Date.now() - start,
        tokensUsed: (rawResponse.usage as Record<string, unknown>).total_tokens as number,
      }
    },

    async healthCheck(): Promise<HealthStatus> {
      const start = Date.now()
      await new Promise((r) => setTimeout(r, 50))
      return { healthy: true, latencyMs: Date.now() - start }
    },
  }
}

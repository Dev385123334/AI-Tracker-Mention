import type { Provider, ProviderResult, HealthStatus } from "./types"
import { getMockResponse } from "./mock-data"

export function createGeminiProvider(): Provider {
  return {
    name: "gemini",

    async sendPrompt(prompt: string): Promise<ProviderResult> {
      const start = Date.now()
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 250))
      const { responseText, rawResponse } = getMockResponse("gemini", prompt)
      return {
        responseText,
        rawResponse,
        latencyMs: Date.now() - start,
        tokensUsed: (rawResponse.usage as Record<string, unknown>).total_tokens as number,
      }
    },

    async healthCheck(): Promise<HealthStatus> {
      const start = Date.now()
      await new Promise((r) => setTimeout(r, 60))
      return { healthy: true, latencyMs: Date.now() - start }
    },
  }
}

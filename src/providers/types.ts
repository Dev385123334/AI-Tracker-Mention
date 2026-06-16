export interface ProviderResult {
  responseText: string
  rawResponse: Record<string, unknown>
  latencyMs: number
  tokensUsed: number
}

export interface HealthStatus {
  healthy: boolean
  latencyMs: number
  error?: string
}

export interface Provider {
  name: string
  sendPrompt(prompt: string): Promise<ProviderResult>
  healthCheck(): Promise<HealthStatus>
}

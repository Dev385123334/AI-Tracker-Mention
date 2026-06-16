import type { Provider } from "./types"
import { createOpenAIProvider } from "./openai-provider"
import { createGeminiProvider } from "./gemini-provider"
import { createPerplexityProvider } from "./perplexity-provider"

const providers = new Map<string, Provider>()

export function getProvider(name: string): Provider {
  let provider = providers.get(name)
  if (provider) return provider

  switch (name) {
    case "openai":
      provider = createOpenAIProvider()
      break
    case "gemini":
      provider = createGeminiProvider()
      break
    case "perplexity":
      provider = createPerplexityProvider()
      break
    default:
      throw new Error(`Unknown provider: ${name}`)
  }

  providers.set(name, provider)
  return provider
}

export function getAllProviders(): Provider[] {
  return ["openai", "gemini", "perplexity"].map(getProvider)
}

export function getProviderNames(): string[] {
  return ["openai", "gemini", "perplexity"]
}

import { LRUCache } from "lru-cache"

type RateLimitOptions = {
  interval: number
  maxRequests: number
}

const rateLimitStore = new LRUCache<string, number[]>({
  max: 500,
  ttl: 60_000,
})

export function rateLimit(options: RateLimitOptions) {
  const { interval, maxRequests } = options

  return {
    check: (key: string): { allowed: boolean; remaining: number } => {
      const now = Date.now()
      const timestamps = rateLimitStore.get(key) ?? []
      const withinWindow = timestamps.filter((t) => now - t < interval)

      if (withinWindow.length >= maxRequests) {
        return { allowed: false, remaining: 0 }
      }

      withinWindow.push(now)
      rateLimitStore.set(key, withinWindow)
      return { allowed: true, remaining: maxRequests - withinWindow.length }
    },
  }
}

export const apiRateLimit = rateLimit({
  interval: 60_000,
  maxRequests: 30,
})

import { NextResponse } from "next/server"
import { apiRateLimit } from "./rate-limit"

export function handleApiError(error: unknown, context?: string) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred"
  console.error(`[API Error]${context ? ` ${context}` : ""}:`, message)
  return NextResponse.json({ error: message }, { status: 500 })
}

export function checkRateLimit(key: string): NextResponse | null {
  const result = apiRateLimit.check(key)
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }
  return null
}

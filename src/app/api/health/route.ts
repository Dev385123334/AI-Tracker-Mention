import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const checks: Record<string, string> = {}
  let dbOk = false

  try {
    await prisma.$queryRaw`SELECT 1`
    dbOk = true
    checks.database = "ok"
  } catch {
    checks.database = "error"
  }

  checks.redis = process.env.REDIS_URL ? "configured" : "mock (dev)"

  const statusCode = dbOk ? 200 : 503

  return NextResponse.json(
    {
      status: dbOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    },
    { status: statusCode }
  )
}

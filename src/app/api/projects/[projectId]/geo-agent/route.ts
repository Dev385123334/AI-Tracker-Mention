import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { runGeoAgentAndSave, runGeoAgent } from "@/services/geo-agent"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const result = await runGeoAgentAndSave(projectId)
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "GEO agent failed"
    console.error("[GEO Agent]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const url = new URL(_request.url)
    const preview = url.searchParams.get("preview")

    if (preview === "true") {
      const result = await runGeoAgent(projectId)
      return NextResponse.json({ data: { ...result, saved: false } })
    }

    const { prisma } = await import("@/lib/prisma")
    const latestRun = await prisma.agentRun.findFirst({
      where: { projectId, status: "completed" },
      orderBy: { startedAt: "desc" },
    })
    return NextResponse.json({ data: latestRun })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findLatestAgentRun, findAgentRunsByProject } from "@/repositories/agent-run-repository"
import { runAgent } from "@/services/agent"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const url = new URL(_request.url)
  const all = url.searchParams.get("all")

  try {
    if (all === "true") {
      const runs = await findAgentRunsByProject(projectId)
      return NextResponse.json({ data: runs })
    }
    const latest = await findLatestAgentRun(projectId)
    return NextResponse.json({ data: latest })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const result = await runAgent(projectId)
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findContentIdeasByProject, updateContentIdeaStatus } from "@/repositories/content-idea-repository"
import { findProjectById } from "@/repositories/project-repository"

const ALLOWED_STATUSES = ["active", "pending", "accepted", "dismissed"]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const ideas = await findContentIdeasByProject(projectId)
    return NextResponse.json({ data: ideas })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  let body: { id?: string; status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 })
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` }, { status: 400 })
  }

  try {
    const project = await findProjectById(projectId)
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })
    const updated = await updateContentIdeaStatus(id, status)
    return NextResponse.json({ data: updated })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

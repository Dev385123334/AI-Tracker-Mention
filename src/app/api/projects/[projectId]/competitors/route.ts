import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  findAllCompetitorsByProject,
  createCompetitor,
} from "@/repositories/competitor-repository"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const competitors = await findAllCompetitorsByProject(projectId)
  return NextResponse.json({ data: competitors })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const body = await request.json()

  if (!body.name || !body.domain) {
    return NextResponse.json({ error: "Name and domain are required" }, { status: 400 })
  }

  try {
    const competitor = await createCompetitor({
      name: body.name,
      domain: body.domain,
      projectId,
    })
    return NextResponse.json({ data: competitor })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 409 })
  }
}

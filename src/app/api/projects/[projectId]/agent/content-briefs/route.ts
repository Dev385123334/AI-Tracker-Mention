import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findContentBriefsByProject } from "@/repositories/content-brief-repository"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const briefs = await findContentBriefsByProject(projectId)
    return NextResponse.json({ data: briefs })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

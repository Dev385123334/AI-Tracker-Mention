import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findCitationOpportunitiesByProject } from "@/repositories/citation-opportunity-repository"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const opportunities = await findCitationOpportunitiesByProject(projectId)
    return NextResponse.json({ data: opportunities })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

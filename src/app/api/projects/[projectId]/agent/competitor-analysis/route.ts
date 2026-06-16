import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findCompetitorAnalysesByProject } from "@/repositories/competitor-analysis-repository"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const analyses = await findCompetitorAnalysesByProject(projectId)
    return NextResponse.json({ data: analyses })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

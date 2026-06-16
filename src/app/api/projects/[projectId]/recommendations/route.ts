import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findRecommendationsByProject } from "@/repositories/recommendation-repository"
import { generateRecommendations } from "@/services/recommendations/recommendation-engine"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const recommendations = await findRecommendationsByProject(projectId)
    return NextResponse.json({ data: recommendations })
  } catch {
    return NextResponse.json({ data: [] })
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
    const count = await generateRecommendations(projectId)
    return NextResponse.json({ data: { recommendationsGenerated: count } })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

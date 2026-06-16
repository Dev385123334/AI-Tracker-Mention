import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findLatestGeoScore, findGeoScoreTrend } from "@/repositories/geo-score-repository"
import { calculateGeoScore } from "@/services/analytics/geo-score"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const url = new URL(_request.url)
  const days = url.searchParams.get("days") ? parseInt(url.searchParams.get("days")!) : 30

  try {
    const [latest, trend] = await Promise.all([
      findLatestGeoScore(projectId),
      findGeoScoreTrend(projectId, days),
    ])

    return NextResponse.json({
      latest,
      trend: trend.map((s) => ({
        date: s.periodStart,
        score: s.score,
        visibilityScore: s.visibilityScore,
        positionScore: s.positionScore,
        citationScore: s.citationScore,
        sentimentScore: s.sentimentScore,
      })),
    })
  } catch {
    return NextResponse.json({ latest: null, trend: [] })
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
    const result = await calculateGeoScore(projectId)
    if (!result) {
      return NextResponse.json({ error: "No data to calculate score" }, { status: 400 })
    }
    return NextResponse.json({ data: result })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

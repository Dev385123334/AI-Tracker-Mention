import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { countMentionsByProject, countByBrand, findMentionsByProject } from "@/repositories/mention-repository"
import { avgScoreByBrand } from "@/repositories/sentiment-repository"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const url = new URL(_request.url)
  const days = url.searchParams.get("days") ? parseInt(url.searchParams.get("days")!) : undefined

  const [total, byBrand, recent, sentiments] = await Promise.all([
    countMentionsByProject(projectId, days),
    countByBrand(projectId, days),
    findMentionsByProject(projectId, 20),
    avgScoreByBrand(projectId, days),
  ])

  const sentimentBreakdown = sentiments.reduce(
    (acc, s) => {
      acc[s.brandName] = { avgScore: s.avgScore, label: s.dominantLabel }
      return acc
    },
    {} as Record<string, { avgScore: number; label: string }>
  )

  return NextResponse.json({
    total,
    byBrand,
    sentimentBreakdown,
    recent: recent.map((m) => ({
      id: m.id,
      brandName: m.brandName,
      sentiment: m.sentiment,
      position: m.position,
      frequency: m.frequency,
      provider: m.response?.provider ?? null,
      preview: m.response?.responseText?.substring(0, 100) ?? null,
      createdAt: m.createdAt,
    })),
  })
}

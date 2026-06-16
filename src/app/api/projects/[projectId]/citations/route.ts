import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { countCitationsByProject, countByDomain, findCitationsByProject } from "@/repositories/citation-repository"

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

  const [total, byDomain, recent] = await Promise.all([
    countCitationsByProject(projectId, days),
    countByDomain(projectId, days),
    findCitationsByProject(projectId, 20),
  ])

  return NextResponse.json({
    total,
    byDomain,
    recent: recent.map((c) => ({
      id: c.id,
      url: c.url,
      domain: c.domain,
      title: c.title,
      provider: c.response?.provider ?? null,
      createdAt: c.createdAt,
    })),
  })
}

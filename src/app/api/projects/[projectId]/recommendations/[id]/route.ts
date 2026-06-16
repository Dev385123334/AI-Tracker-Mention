import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateRecommendationStatus } from "@/repositories/recommendation-repository"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!status || !["open", "acknowledged", "implemented", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const recommendation = await updateRecommendationStatus(id, status)
    return NextResponse.json({ data: recommendation })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

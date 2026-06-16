import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateCompetitor, deleteCompetitor } from "@/repositories/competitor-repository"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; competitorId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { competitorId } = await params
  const body = await request.json()

  const competitor = await updateCompetitor(competitorId, body)
  return NextResponse.json({ data: competitor })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string; competitorId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { competitorId } = await params
  await deleteCompetitor(competitorId)
  return NextResponse.json({ data: { success: true } })
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateKeyword, deleteKeyword } from "@/repositories/keyword-repository"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; keywordId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { keywordId } = await params
  const body = await request.json()

  const keyword = await updateKeyword(keywordId, body)
  return NextResponse.json({ data: keyword })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string; keywordId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { keywordId } = await params
  await deleteKeyword(keywordId)
  return NextResponse.json({ data: { success: true } })
}

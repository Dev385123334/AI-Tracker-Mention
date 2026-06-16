import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createManyKeywords } from "@/repositories/keyword-repository"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const body = await request.json()

  if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
    return NextResponse.json({ error: "Keywords array is required" }, { status: 400 })
  }

  const data = body.keywords.map((k: string) => ({ keyword: k.trim(), projectId })).filter((k: { keyword: string }) => k.keyword)

  const result = await createManyKeywords(data)
  return NextResponse.json({ data: { count: result.count } })
}

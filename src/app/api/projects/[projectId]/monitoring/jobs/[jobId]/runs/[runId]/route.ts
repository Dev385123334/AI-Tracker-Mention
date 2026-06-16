import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findRunById } from "@/repositories/monitoring-run-repository"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string; jobId: string; runId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { runId } = await params
  const run = await findRunById(runId)
  if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 })

  return NextResponse.json({ data: run })
}

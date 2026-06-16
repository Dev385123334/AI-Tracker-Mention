import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findRunsByJob } from "@/repositories/monitoring-run-repository"
import { startMonitoringRun } from "@/services/monitoring-runner"
import { runParsing } from "@/services/parsing/runner"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string; jobId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await params
  const runs = await findRunsByJob(jobId)
  return NextResponse.json({ data: runs })
}

export async function POST(_request: NextRequest, { params }: { params: Promise<{ projectId: string; jobId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await params

  try {
    const runId = await startMonitoringRun(jobId)
    const result = await runParsing(runId)
    return NextResponse.json({ data: { runId, ...result } }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

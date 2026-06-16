import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findJobById, updateJob, deleteJob } from "@/repositories/monitoring-job-repository"
import { activateMonitoringJob, pauseMonitoringJob, archiveMonitoringJob } from "@/services/monitoring-scheduler"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string; jobId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await params
  const job = await findJobById(jobId)
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  return NextResponse.json({ data: job })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ projectId: string; jobId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await params
  const body = await request.json()
  const { status } = body

  if (status && !["active", "paused", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    let job
    switch (status) {
      case "paused":
        job = await pauseMonitoringJob(jobId)
        break
      case "active":
        job = await activateMonitoringJob(jobId)
        break
      case "archived":
        job = await archiveMonitoringJob(jobId)
        break
      default:
        job = await updateJob(jobId, body)
    }
    return NextResponse.json({ data: job })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ projectId: string; jobId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await params
  await deleteJob(jobId)
  return NextResponse.json({ success: true })
}

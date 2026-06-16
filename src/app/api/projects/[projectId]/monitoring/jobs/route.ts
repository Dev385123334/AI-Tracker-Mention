import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findJobsByProject } from "@/repositories/monitoring-job-repository"
import { createMonitoringJob } from "@/services/monitoring-scheduler"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const jobs = await findJobsByProject(projectId)
  return NextResponse.json({ data: jobs })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const body = await request.json()
  const { type, schedule } = body

  if (type === "custom") {
    if (!schedule || !schedule.value || !schedule.unit) {
      return NextResponse.json({ error: "Custom schedule requires value and unit" }, { status: 400 })
    }
    if (!["minutes", "hours", "days"].includes(schedule.unit)) {
      return NextResponse.json({ error: "Invalid unit. Must be minutes, hours, or days" }, { status: 400 })
    }
    if (typeof schedule.value !== "number" || schedule.value < 1) {
      return NextResponse.json({ error: "Value must be a positive number" }, { status: 400 })
    }
  } else if (!type || !["daily", "weekly", "manual"].includes(type)) {
    return NextResponse.json({ error: "Invalid type. Must be daily, weekly, manual, or custom" }, { status: 400 })
  }

  try {
    const job = type === "custom"
      ? await createMonitoringJob(projectId, "custom", schedule)
      : await createMonitoringJob(projectId, type as "daily" | "weekly" | "manual")
    return NextResponse.json({ data: job }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

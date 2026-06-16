import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findReportsByProject } from "@/repositories/report-repository"
import { generateWeeklyReport, generateMonthlyReport, generateExecutiveReport } from "@/services/reports/report-generator"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  try {
    const reports = await findReportsByProject(projectId)
    return NextResponse.json({ data: reports })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const body = await request.json().catch(() => ({}))
  const type = body.type ?? "weekly"

  if (!["weekly", "monthly", "executive"].includes(type)) {
    return NextResponse.json({ error: "Invalid report type. Must be weekly, monthly, or executive" }, { status: 400 })
  }

  try {
    let result
    if (type === "weekly") {
      result = await generateWeeklyReport(projectId)
    } else if (type === "monthly") {
      result = await generateMonthlyReport(projectId)
    } else {
      const project = await (await import("@/lib/prisma")).prisma.project.findUnique({
        where: { id: projectId },
        select: { organizationId: true },
      })
      result = await generateExecutiveReport(project?.organizationId ?? "")
    }
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

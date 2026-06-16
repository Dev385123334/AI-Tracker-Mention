import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findReportById } from "@/repositories/report-repository"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string; id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const report = await findReportById(id)
    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })
    return NextResponse.json({ data: report })
  } catch {
    return NextResponse.json({ error: "Report not found" }, { status: 404 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string; id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const { prisma } = await import("@/lib/prisma")
    await prisma.report.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Report not found" }, { status: 404 })
  }
}

import { prisma } from "@/lib/prisma"
import { createReport, updateReport } from "@/repositories/report-repository"
import { findLatestGeoScore, findGeoScoreTrend } from "@/repositories/geo-score-repository"

interface ReportContent {
  title: string
  summary: Record<string, unknown>
  sections: ReportSection[]
}

interface ReportSection {
  heading: string
  type: "metrics" | "chart_data" | "table" | "text"
  data: unknown
}

export async function generateWeeklyReport(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) throw new Error("Project not found")

  const now = new Date()
  const periodEnd = new Date(now)
  periodEnd.setHours(23, 59, 59, 999)
  const periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  periodStart.setHours(0, 0, 0, 0)

  const report = await createReport({
    type: "weekly",
    title: `Weekly Report - ${project.name}`,
    format: "json",
    periodStart,
    periodEnd,
    projectId,
  })

  try {
    const content = await buildReportContent(projectId, periodStart, periodEnd)

    await updateReport(report.id, {
      status: "completed",
      completedAt: new Date(),
    })

    return { ...report, content }
  } catch {
    await updateReport(report.id, { status: "failed" })
    throw new Error("Report generation failed")
  }
}

export async function generateMonthlyReport(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) throw new Error("Project not found")

  const now = new Date()
  const periodEnd = new Date(now)
  periodEnd.setHours(23, 59, 59, 999)
  const periodStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  )
  periodStart.setHours(0, 0, 0, 0)

  const report = await createReport({
    type: "monthly",
    title: `Monthly Report - ${project.name}`,
    format: "json",
    periodStart,
    periodEnd,
    projectId,
  })

  try {
    const content = await buildReportContent(projectId, periodStart, periodEnd)

    await updateReport(report.id, {
      status: "completed",
      completedAt: new Date(),
    })

    return { ...report, content }
  } catch {
    await updateReport(report.id, { status: "failed" })
    throw new Error("Report generation failed")
  }
}

export async function generateExecutiveReport(organizationId: string) {
  const projects = await prisma.project.findMany({
    where: { organizationId },
  })

  const projectReports = await Promise.all(
    projects.map(async (p) => {
      const content = await buildReportContent(
        p.id,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      )
      return { projectName: p.name, brandName: p.brandName, content }
    })
  )

  return {
    title: "Executive Summary",
    generatedAt: new Date(),
    projects: projectReports,
  }
}

async function buildReportContent(
  projectId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<ReportContent> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true },
  })

  const mentionCount = await prisma.mention.count({
    where: {
      run: { job: { projectId } },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
  })

  const citationCount = await prisma.citation.count({
    where: {
      run: { job: { projectId } },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
  })

  const runCount = await prisma.monitoringRun.count({
    where: {
      job: { projectId },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
  })

  const geoScore = await findLatestGeoScore(projectId)
  const scoreTrend = await findGeoScoreTrend(projectId, 30)

  const brandsByMentions = await prisma.mention.groupBy({
    by: ["brandName"],
    where: {
      run: { job: { projectId } },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    _count: { brandName: true },
    orderBy: { _count: { brandName: "desc" } },
  })

  const topDomains = await prisma.citation.groupBy({
    by: ["domain"],
    where: {
      run: { job: { projectId } },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    _count: { domain: true },
    orderBy: { _count: { domain: "desc" } },
    take: 5,
  })

  const sentimentData = await prisma.sentimentResult.findMany({
    where: {
      run: { job: { projectId } },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    select: { label: true },
  })

  const sentimentCounts = {
    positive: sentimentData.filter((s) => s.label === "positive").length,
    negative: sentimentData.filter((s) => s.label === "negative").length,
    neutral: sentimentData.filter((s) => s.label === "neutral").length,
  }

  return {
    title: project?.name ?? "Unknown Project",
    summary: {
      totalMentions: mentionCount,
      totalCitations: citationCount,
      totalRuns: runCount,
      overallScore: geoScore?.score ?? 0,
      sentimentBreakdown: sentimentCounts,
    },
    sections: [
      {
        heading: "Geo Score",
        type: "metrics",
        data: geoScore
          ? {
              overall: geoScore.score,
              visibility: geoScore.visibilityScore,
              position: geoScore.positionScore,
              citation: geoScore.citationScore,
              sentiment: geoScore.sentimentScore,
              trend: scoreTrend.map((s) => ({
                date: s.periodStart,
                score: s.score,
              })),
            }
          : { overall: 0 },
      },
      {
        heading: "Brand Mentions",
        type: "table",
        data: brandsByMentions.map((b) => ({
          brand: b.brandName,
          mentions: b._count.brandName,
        })),
      },
      {
        heading: "Top Cited Domains",
        type: "table",
        data: topDomains.map((d) => ({
          domain: d.domain,
          citations: d._count.domain,
        })),
      },
      {
        heading: "Sentiment Analysis",
        type: "metrics",
        data: sentimentCounts,
      },
    ],
  }
}

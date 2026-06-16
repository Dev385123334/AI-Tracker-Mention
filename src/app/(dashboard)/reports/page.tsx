import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileText, TrendingUp, Activity, Download } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getRecentReports() {
  try {
    return await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { project: { select: { name: true } } },
    })
  } catch {
    return []
  }
}

export default async function ReportsPage() {
  const [completedRuns, totalResponses, totalJobs, recentRuns, recentReports] = await Promise.all([
    prisma.monitoringRun.count({ where: { status: "completed" } }),
    prisma.providerResponse.count(),
    prisma.monitoringJob.count({ where: { status: "active" } }),
    prisma.monitoringRun.findMany({
      where: { status: "completed" },
      include: {
        job: { select: { projectId: true, project: { select: { name: true } } } },
        _count: { select: { responses: true } },
      },
      orderBy: { completedAt: "desc" },
      take: 10,
    }),
    getRecentReports(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View monitoring reports and GEO analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRuns}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Responses Collected</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentReports.length}</div>
          </CardContent>
        </Card>
      </div>

      {recentReports.length > 0 && (
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Generated Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{report.title}</p>
                      <Badge variant="secondary" className="capitalize text-xs">{report.type}</Badge>
                      <Badge
                        variant={
                          report.status === "completed" ? "default"
                          : report.status === "failed" ? "destructive"
                          : "outline"
                        }
                        className="text-xs"
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {report.project.name} &middot;{" "}
                      {new Date(report.createdAt).toLocaleDateString()} &middot;{" "}
                      {report.format.toUpperCase()}
                      {report.fileSize && ` &middot; ${(report.fileSize / 1024).toFixed(0)} KB`}
                    </p>
                  </div>
                  {report.status === "completed" && report.fileUrl && (
                    <a
                      href={report.fileUrl}
                      download
                      className="inline-flex items-center justify-center rounded-md border border-border/40 px-3 py-1.5 text-xs font-medium hover:bg-muted/60 transition-colors"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recent Monitoring Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentRuns.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No completed monitoring runs yet. Run monitoring to generate reports.
            </p>
          ) : (
            <div className="space-y-3">
              {recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{run.job.project.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{run._count.responses} responses</span>
                      <span>&middot;</span>
                      <span>
                        {run.completedAt
                          ? new Date(run.completedAt).toLocaleDateString()
                          : "In progress"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/projects/${run.job.projectId}/monitoring/runs/${run.id}`}
                  >
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

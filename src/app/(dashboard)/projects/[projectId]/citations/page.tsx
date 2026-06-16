import { redirect } from "next/navigation"
import { findProjectById } from "@/repositories/project-repository"
import { countCitationsByProject, countByDomain, findCitationsByProject } from "@/repositories/citation-repository"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Link2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CitationBarChart } from "@/components/charts/citation-bar-chart"
import { CitationLineChart } from "@/components/charts/citation-line-chart"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

export default async function CitationsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = await findProjectById(projectId)
  if (!project) redirect("/projects")

  const [total, byDomain, recent, rawCitations] = await Promise.all([
    countCitationsByProject(projectId),
    countByDomain(projectId),
    findCitationsByProject(projectId, 50),
    prisma.citation.findMany({
      where: { run: { job: { projectId } } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const dailyMap = new Map<string, number>()
  for (const c of rawCitations) {
    const day = c.createdAt.toISOString().slice(0, 10)
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1)
  }
  const trendLabels = Array.from(dailyMap.keys()).sort()
  const trendData = trendLabels.map((d) => dailyMap.get(d) ?? 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Citations</h1>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Citations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Unique Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{byDomain.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-sm">Top Cited Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <CitationBarChart data={byDomain} />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-sm">Citation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CitationLineChart labels={trendLabels} data={trendData} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Link2 className="h-4 w-4" />
            Recent Citations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No citations yet. Run monitoring to generate data.</p>
          ) : (
            <div className="space-y-2">
              {recent.slice(0, 20).map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border/20 p-3 text-sm">
                  <Badge variant="outline" className="shrink-0">{c.domain}</Badge>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate flex-1"
                  >
                    {c.url}
                  </a>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

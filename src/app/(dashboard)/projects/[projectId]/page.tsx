import { redirect } from "next/navigation"
import Link from "next/link"
import { findProjectById } from "@/repositories/project-repository"
import { findLatestGeoScore, findGeoScoreTrend } from "@/repositories/geo-score-repository"
import { findRecommendationsByProject } from "@/repositories/recommendation-repository"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteProjectButton } from "@/components/projects/delete-project-button"
import { GeoScoreGauge } from "@/components/charts/geo-score-gauge"
import { GeoScoreLineChart } from "@/components/charts/geo-score-line-chart"
import { RecommendationList } from "@/components/recommendations/recommendation-list"
import { AgentSection } from "@/components/agent/agent-section"
import { Activity, BarChart3, Tag, Users, Hash, Link2, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = await findProjectById(projectId)

  if (!project) redirect("/projects")

  const [mentionCount, citationCount] = await Promise.all([
    prisma.mention.count({ where: { run: { job: { projectId } } } }),
    prisma.citation.count({ where: { run: { job: { projectId } } } }),
  ])

  const latestMetric = await prisma.visibilityMetric.findFirst({
    where: { projectId, brandName: project.brandName },
    orderBy: { periodStart: "desc" },
  })

  let geoScore = null
  let geoScoreTrend: { score: number; periodStart: Date }[] = []
  let recommendations: Awaited<ReturnType<typeof findRecommendationsByProject>> = []
  try {
    ;[geoScore, geoScoreTrend, recommendations] = await Promise.all([
      findLatestGeoScore(projectId),
      findGeoScoreTrend(projectId, 30),
      findRecommendationsByProject(projectId),
    ])
  } catch {
    // Tables may not exist yet — show empty state
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary">
              Projects
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <p className="text-muted-foreground">{project.brandName} &middot; {project.domain}</p>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      {project.description && (
        <Card className="bg-white shadow-sm border-border/40">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Link href={`/projects/${project.id}/competitors`}>
          <Card className="transition-all bg-white shadow-sm border-border/40 hover:border-primary/30 hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-medium">Competitors</CardTitle>
                <p className="text-2xl font-bold">{project._count.competitors}</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/projects/${project.id}/keywords`}>
          <Card className="transition-all bg-white shadow-sm border-border/40 hover:border-primary/30 hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                <p className="text-2xl font-bold">{project._count.keywords}</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/projects/${project.id}/monitoring`}>
          <Card className="transition-all bg-white shadow-sm border-border/40 hover:border-primary/30 hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
                <p className="text-2xl font-bold">{project._count.monitoringJobs}</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/projects/${project.id}/mentions`}>
          <Card className="transition-all bg-white shadow-sm border-border/40 hover:border-primary/30 hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-medium">Mentions</CardTitle>
                <p className="text-2xl font-bold">{mentionCount}</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/projects/${project.id}/citations`}>
          <Card className="transition-all bg-white shadow-sm border-border/40 hover:border-primary/30 hover:bg-muted/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-medium">Citations</CardTitle>
                <p className="text-2xl font-bold">{citationCount}</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center gap-4">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-medium">Visibility Score</CardTitle>
              <p className="text-2xl font-bold">{latestMetric?.mentionCount ?? 0}</p>
              {latestMetric && (
                <p className="text-xs text-muted-foreground mt-1">
                  {latestMetric.mentionRate > 0
                    ? `${(latestMetric.mentionRate * 100).toFixed(0)}% mention rate`
                    : "No data yet"}
                </p>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      {geoScore && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white shadow-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-sm">GEO Score</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <GeoScoreGauge
                score={geoScore.score}
                subScores={{
                  visibility: geoScore.visibilityScore,
                  position: geoScore.positionScore,
                  citation: geoScore.citationScore,
                  sentiment: geoScore.sentimentScore,
                }}
                size="md"
              />
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-sm">Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <GeoScoreLineChart
                data={geoScoreTrend.map((s) => ({
                  date: s.periodStart.toISOString(),
                  score: s.score,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <RecommendationList
        projectId={projectId}
        recommendations={recommendations.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />

      <AgentSection projectId={projectId} />

      <div className="flex flex-wrap gap-2">
        <Link href={`/projects/${project.id}/competitors`}>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Competitors
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/keywords`}>
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            Keywords
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/monitoring`}>
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Monitoring
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/mentions`}>
          <Button variant="outline">
            <Hash className="mr-2 h-4 w-4" />
            Mentions
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/citations`}>
          <Button variant="outline">
            <Link2 className="mr-2 h-4 w-4" />
            Citations
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/monitoring`}>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </Link>
      </div>
    </div>
  )
}

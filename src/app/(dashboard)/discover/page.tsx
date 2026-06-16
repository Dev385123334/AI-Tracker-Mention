import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Globe, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function getProjectOpportunities() {
  const projects = await prisma.project.findMany({
    include: { competitors: true },
    take: 10,
  })

  const results = await Promise.all(
    projects.map(async (project) => {
      const totalMentions = await prisma.mention.count({
        where: { run: { job: { projectId: project.id } } },
      })
      const totalCitations = await prisma.citation.count({
        where: { run: { job: { projectId: project.id } } },
      })
      let geoScore = null
      let recommendations = 0
      try {
        geoScore = await prisma.geoScore.findFirst({
          where: { projectId: project.id },
          orderBy: { periodStart: "desc" },
        })
        recommendations = await prisma.recommendation.count({
          where: { projectId: project.id, status: "open" },
        })
      } catch {
        // Tables may not exist yet - skip GEO score and recommendations
      }

      return {
        id: project.id,
        name: project.name,
        brandName: project.brandName,
        competitorCount: project.competitors.length,
        totalMentions,
        totalCitations,
        geoScore: geoScore?.score ?? null,
        openRecs: recommendations,
      }
    })
  )

  return results
}

export default async function DiscoverPage() {
  const recentResponses = await prisma.providerResponse.findMany({
    where: { status: "success" },
    include: {
      prompt: {
        include: { keyword: { select: { keyword: true, projectId: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const projects = await getProjectOpportunities()
  const totalOpenRecs = projects.reduce((s, p) => s + p.openRecs, 0)
  const projectsWithScores = projects.filter((p) => p.geoScore !== null)
  const avgScore = projectsWithScores.length > 0
    ? Math.round(projectsWithScores.reduce((s, p) => s + (p.geoScore ?? 0), 0) / projectsWithScores.length)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
        <p className="text-muted-foreground">AI-powered insights and opportunity detection across your projects</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects Analyzed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg GEO Score</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore ?? "N/A"}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Recommendations</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpenRecs}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((s, p) => s + p.totalMentions, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No projects yet. Create a project to start tracking AI visibility.
              </p>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-lg bg-muted/30 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{p.name}</span>
                      <div className="flex gap-1">
                        {p.geoScore !== null && (
                          <Badge variant={p.geoScore >= 70 ? "default" : p.geoScore >= 40 ? "secondary" : "destructive"}>
                            GEO {p.geoScore}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{p.totalMentions} mentions</span>
                      <span>{p.totalCitations} citations</span>
                      <span>{p.competitorCount} competitors</span>
                      {p.openRecs > 0 && (
                        <span className="text-primary">{p.openRecs} open recommendations</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Provider Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <span className="text-sm font-medium">OpenAI (ChatGPT)</span>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <span className="text-sm font-medium">Google (Gemini)</span>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <span className="text-sm font-medium">Perplexity</span>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <span className="text-sm font-medium">Claude (Anthropic)</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-border/40 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Recent AI Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentResponses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No AI responses collected yet. Run monitoring to start gathering data.
              </p>
            ) : (
              <div className="space-y-3">
                {recentResponses.map((resp) => (
                  <div key={resp.id} className="rounded-lg bg-muted/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">{resp.provider}</Badge>
                      <Badge variant="outline">{resp.prompt.keyword.keyword}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(resp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{resp.responseText}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

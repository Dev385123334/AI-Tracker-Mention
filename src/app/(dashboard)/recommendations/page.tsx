import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Globe, Lightbulb, TrendingUp, ArrowRight, MapPin, CheckCircle2, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function RecommendationsPage() {
  const projects = await prisma.project.findMany({
    include: { competitors: true },
    take: 10,
  })

  const allSuggestions = await Promise.all(
    projects.map(async (project) => {
      let geoScore = null
      let recommendations = 0
      try {
        geoScore = await prisma.geoScore.findFirst({
          where: { projectId: project.id },
          orderBy: { periodStart: "desc" },
        })
        recommendations = await prisma.recommendation.count({
          where: { projectId: project.id },
        })
      } catch {
        // Tables may not exist yet
      }
      return {
        id: project.id,
        name: project.name,
        brandName: project.brandName,
        domain: project.domain,
        geoScore: geoScore?.score ?? null,
        recommendations,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
        <p className="text-muted-foreground">AI-powered GEO recommendations and local visibility insights</p>
      </div>

      {/* GEO Score Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects Tracked</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSuggestions.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg GEO Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allSuggestions.length > 0
                ? Math.round(allSuggestions.reduce((s, p) => s + (p.geoScore ?? 0), 0) / allSuggestions.length)
                : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Recommendations</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSuggestions.reduce((s, p) => s + p.recommendations, 0)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GEO Agent Status</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Active
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* GEO Agent Section */}
        <Card className="bg-white shadow-sm border-border/40 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#7C3AED]" />
              GEO Agent — Local Visibility Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gradient-to-br from-[#7C3AED]/5 to-[#EC4899]/5 p-5 border border-[#7C3AED]/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Local Rankings</span>
                    <span className="block text-xs text-muted-foreground">Geo-specific performance</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Analyze how your brand appears in AI-generated responses across different geographic regions and languages.
                </p>
                <Link href="/discover">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Actionable Insights</span>
                    <span className="block text-xs text-muted-foreground">Improvement suggestions</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get personalized recommendations to improve your brand&apos;s visibility in AI-powered search results.
                </p>
                <Button variant="outline" size="sm" className="text-xs gap-1" disabled>
                  Coming Soon <Clock className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects with GEO Scores */}
        {allSuggestions.map((project) => (
          <Card key={project.id} className="bg-white shadow-sm border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-base">{project.name}</span>
                {project.geoScore !== null && (
                  <Badge variant={project.geoScore >= 70 ? "default" : project.geoScore >= 40 ? "secondary" : "destructive"}>
                    GEO {project.geoScore}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {project.domain ?? "No domain set"}
                </div>
                {project.recommendations > 0 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{project.recommendations} recommendation{project.recommendations > 1 ? "s" : ""} available</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recommendations yet. Run GEO analysis to generate insights.</p>
                )}
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                    View Project <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

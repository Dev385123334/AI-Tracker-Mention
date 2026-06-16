import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Building2, Plus, BarChart3, ExternalLink } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CompetitorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const projects = await prisma.project.findMany({
    include: { competitors: true },
    take: 10,
  })

  const allCompetitors = projects.flatMap((p) => p.competitors)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitors</h1>
          <p className="text-muted-foreground">Track and analyze your competitive landscape</p>
        </div>
        <Link href="/projects">
          <Button className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-sm hover:opacity-90 gap-1.5">
            <Plus className="h-4 w-4" />
            Add Competitor
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Competitors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allCompetitors.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Competitors/Project</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.length > 0 ? (allCompetitors.length / projects.length).toFixed(1) : "0"}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects w/ Competitors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.competitors.length > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allCompetitors.slice(0, 5).map((competitor) => (
          <Card key={competitor.id} className="bg-white shadow-sm border-border/40 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{competitor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitor.domain && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="truncate">{competitor.domain}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Added {new Date(competitor.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add More Card */}
        <Link href="/projects">
          <Card className="bg-white shadow-sm border-2 border-dashed border-border/60 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center h-full py-10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-[#7C3AED]" />
              </div>
              <span className="text-sm font-medium text-[#6B7280]">Add Competitor</span>
              <span className="text-xs text-muted-foreground mt-1">Manually add a new competitor</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Project Breakdown */}
      {projects.length > 0 && (
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Competitors by Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge variant="outline">{project.competitors.length} competitors</Badge>
                  </div>
                  {project.competitors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.competitors.map((c) => (
                        <Badge key={c.id} variant="secondary" className="text-xs">
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No competitors added yet.</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

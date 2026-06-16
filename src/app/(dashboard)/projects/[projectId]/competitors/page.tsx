import { redirect } from "next/navigation"
import { findProjectById } from "@/repositories/project-repository"
import { findAllCompetitorsByProject } from "@/repositories/competitor-repository"
import { CompetitorList } from "@/components/competitors/competitor-list"
import { getProjectVisibility } from "@/services/analytics/visibility-engine"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisibilityComparisonChart } from "@/components/charts/visibility-comparison-chart"

function PositionBadge({ position }: { position: number | null }) {
  if (position === null) return <span className="text-muted-foreground">—</span>
  const color = position <= 3 ? "text-green-400" : position <= 5 ? "text-yellow-400" : "text-muted-foreground"
  return <span className={`font-bold ${color}`}>#{position}</span>
}

function RateBar({ rate }: { rate: number }) {
  const pct = Math.min(rate * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted/30 overflow-hidden">
        <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{(rate * 100).toFixed(0)}%</span>
    </div>
  )
}

export default async function CompetitorsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const [project, competitors, visibility] = await Promise.all([
    findProjectById(projectId),
    findAllCompetitorsByProject(projectId),
    getProjectVisibility(projectId),
  ])

  if (!project) redirect("/projects")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Competitors</h1>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
      </div>

      <CompetitorList projectId={projectId} competitors={competitors} />

      {visibility && (
        <>
          <Card className="bg-white shadow-sm border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Visibility Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VisibilityComparisonChart
                brandName={visibility.brandName}
                brandMentions={visibility.totalMentions}
                competitors={visibility.competitors}
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-sm">Competitor Mention Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20">
                      <th className="text-left p-3 text-muted-foreground font-medium">Competitor</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Domain</th>
                      <th className="text-center p-3 text-muted-foreground font-medium">Mentions</th>
                      <th className="text-center p-3 text-muted-foreground font-medium">Avg Position</th>
                      <th className="text-center p-3 text-muted-foreground font-medium">Mention Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/20 bg-primary/5">
                      <td className="p-3 font-medium">{visibility.brandName}</td>
                      <td className="p-3 text-muted-foreground">(your brand)</td>
                      <td className="p-3 text-center font-bold">{visibility.totalMentions}</td>
                      <td className="p-3 text-center"><PositionBadge position={visibility.avgPosition} /></td>
                      <td className="p-3 text-center"><RateBar rate={visibility.mentionRate} /></td>
                    </tr>
                    {visibility.competitors.map((c) => (
                      <tr key={c.name} className="border-b border-border/20 last:border-0">
                        <td className="p-3 font-medium">{c.name}</td>
                        <td className="p-3 text-muted-foreground">{c.domain}</td>
                        <td className="p-3 text-center">{c.mentionCount}</td>
                        <td className="p-3 text-center"><PositionBadge position={c.avgPosition} /></td>
                        <td className="p-3 text-center"><RateBar rate={c.mentionRate} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

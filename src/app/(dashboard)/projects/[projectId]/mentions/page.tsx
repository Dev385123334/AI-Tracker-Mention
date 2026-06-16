import { redirect } from "next/navigation"
import { findProjectById } from "@/repositories/project-repository"
import { countMentionsByProject, countByBrand, findMentionsByProject } from "@/repositories/mention-repository"
import { avgScoreByBrand } from "@/repositories/sentiment-repository"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MentionsLineChart } from "@/components/charts/mentions-line-chart"
import { SentimentPieChart } from "@/components/charts/sentiment-pie-chart"
import { BrandBarChart } from "@/components/charts/brand-bar-chart"
import { prisma } from "@/lib/prisma"

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const variant = sentiment === "positive" ? "default"
    : sentiment === "negative" ? "destructive"
    : "secondary"
  return <Badge variant={variant}>{sentiment}</Badge>
}

export default async function MentionsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = await findProjectById(projectId)
  if (!project) redirect("/projects")

  const [total, byBrand, recent, sentiments, rawMentions] = await Promise.all([
    countMentionsByProject(projectId),
    countByBrand(projectId),
    findMentionsByProject(projectId, 50),
    avgScoreByBrand(projectId),
    prisma.mention.findMany({
      where: { run: { job: { projectId } } },
      select: { sentiment: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const sentimentCounts = rawMentions.reduce(
    (acc, m) => {
      if (m.sentiment === "positive") acc.positive++
      else if (m.sentiment === "negative") acc.negative++
      else acc.neutral++
      return acc
    },
    { positive: 0, negative: 0, neutral: 0 }
  )

  const dailyMap = new Map<string, Record<string, number>>()
  for (const m of rawMentions) {
    const day = m.createdAt.toISOString().slice(0, 10)
    const entry = dailyMap.get(day) ?? {}
    entry["mentions"] = (entry["mentions"] ?? 0) + 1
    dailyMap.set(day, entry)
  }
  const trendLabels = Array.from(dailyMap.keys()).sort()
  const trendData = trendLabels.map((d) => dailyMap.get(d)?.["mentions"] ?? 0)

  const avgSentiment = sentiments.length > 0
    ? sentiments.reduce((a, s) => a + s.avgScore, 0) / sentiments.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Mentions</h1>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Unique Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{byBrand.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Avg Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgSentiment.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Sentiment Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{rawMentions.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-sm">Mention Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <MentionsLineChart
              labels={trendLabels}
              series={[{ name: "mentions", data: trendData }]}
            />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-sm">Sentiment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentPieChart
              positive={sentimentCounts.positive}
              negative={sentimentCounts.negative}
              neutral={sentimentCounts.neutral}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="text-sm">Top Brands by Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandBarChart data={byBrand} />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4" />
            Recent Mentions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No mentions yet. Run monitoring to generate data.</p>
          ) : (
            <div className="space-y-2">
              {recent.slice(0, 20).map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border/20 p-3 text-sm">
                  <span className="font-medium min-w-[100px]">{m.brandName}</span>
                  <SentimentBadge sentiment={m.sentiment} />
                  {m.position && <Badge variant="outline">#{m.position}</Badge>}
                  <span className="text-muted-foreground text-xs truncate flex-1">{m.response?.responseText?.substring(0, 80)}</span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {new Date(m.createdAt).toLocaleDateString()}
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

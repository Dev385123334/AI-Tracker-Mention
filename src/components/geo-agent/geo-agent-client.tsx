"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, AlertCircle, CheckCircle2, Clock, ArrowRight, BarChart3, Globe, Lightbulb, Target, FileText, BookOpen, Link, Search, Zap, TrendingUp, ListChecks } from "lucide-react"
import type { GeoAgentOutput } from "@/services/geo-agent/types"

type SectionKey = keyof GeoAgentOutput

const SECTION_LABELS: Record<SectionKey, { label: string; icon: React.ElementType }> = {
  executiveSummary: { label: "Executive Summary", icon: BarChart3 },
  aiVisibilityAnalysis: { label: "AI Visibility Analysis", icon: Globe },
  competitorGaps: { label: "Competitor Gap Analysis", icon: Target },
  promptOpportunities: { label: "Prompt Opportunities", icon: Lightbulb },
  contentGaps: { label: "Content Gap Analysis", icon: FileText },
  entityCoverage: { label: "Entity Coverage", icon: BookOpen },
  citationAnalysis: { label: "Citation Analysis", icon: Link },
  citationOpportunities: { label: "Citation Opportunities", icon: Link },
  contentRecommendations: { label: "Content Recommendations", icon: FileText },
  comparisonPages: { label: "Comparison Pages", icon: ArrowRight },
  faqRecommendations: { label: "FAQ Recommendations", icon: Search },
  authorityBuildingPlan: { label: "Authority Building Plan", icon: TrendingUp },
  aiSearchChecklist: { label: "AI Search Checklist", icon: ListChecks },
  scoredRecommendations: { label: "Scored Recommendations", icon: Zap },
  weekPlan: { label: "30-Day Action Plan", icon: Clock },
  quickWins: { label: "Quick Wins", icon: Zap },
  highImpactOpportunities: { label: "High Impact Opportunities", icon: TrendingUp },
  executiveRoadmap: { label: "Executive Roadmap", icon: BarChart3 },
}

export function GeoAgentClient({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeoAgentOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runAnalysis() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/projects/${projectId}/geo-agent?preview=true`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "GEO Agent request failed")
      }
      const json = await res.json()
      setResult(json.data.output)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GEO Agent</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis for {projectName}
          </p>
        </div>
        <Button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-sm hover:opacity-90 gap-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Run GEO Analysis
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {result && <GeoAgentResults output={result} />}
    </div>
  )
}

function GeoAgentResults({ output }: { output: GeoAgentOutput }) {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <GeoExecutiveSummaryCard summary={output.executiveSummary} />

      {/* All sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {(Object.keys(SECTION_LABELS) as SectionKey[]).filter((k) => k !== "executiveSummary").map((key) => {
          const section = SECTION_LABELS[key]
          const data = output[key]
          const Icon = section.icon

          if (!data || (Array.isArray(data) && data.length === 0)) return null

          return (
            <Card key={key} className="bg-white shadow-sm border-border/40 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-[#7C3AED]" />
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GeoSectionRenderer sectionKey={key} data={data} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function GeoExecutiveSummaryCard({ summary }: { summary: GeoAgentOutput["executiveSummary"] }) {
  return (
    <Card className="bg-gradient-to-br from-[#7C3AED]/5 to-[#EC4899]/5 border-[#7C3AED]/10 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#7C3AED]" />
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white/80 p-4 text-center">
            <span className="text-2xl font-bold text-[#7C3AED]">{summary.currentGeoScore}</span>
            <p className="text-xs text-muted-foreground mt-1">GEO Score</p>
          </div>
          <div className="rounded-lg bg-white/80 p-4">
            <p className="text-xs text-muted-foreground">Trend</p>
            <p className="text-sm font-medium">{summary.visibilityTrend}</p>
          </div>
          <div className="rounded-lg bg-white/80 p-4">
            <p className="text-xs text-muted-foreground">Biggest Opportunity</p>
            <p className="text-sm font-medium">{summary.biggestOpportunity}</p>
          </div>
          <div className="rounded-lg bg-white/80 p-4">
            <p className="text-xs text-muted-foreground">Biggest Threat</p>
            <p className="text-sm font-medium">{summary.biggestThreat}</p>
          </div>
          <div className="rounded-lg bg-white/80 p-4">
            <p className="text-xs text-muted-foreground">Quick Wins</p>
            <ul className="text-xs mt-1 space-y-0.5">
              {summary.quickWins.map((w, i) => (
                <li key={i} className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GeoSectionRenderer({ sectionKey, data }: { sectionKey: SectionKey; data: unknown }) {
  if (!data) return null

  if (Array.isArray(data)) {
    if (data.length === 0) return <p className="text-sm text-muted-foreground">No data available</p>

    return (
      <div className="space-y-2">
        {data.map((item, i) => (
          <GeoItemCard key={i} item={item} sectionKey={sectionKey} />
        ))}
      </div>
    )
  }

  return <p className="text-sm text-muted-foreground">Unexpected data format</p>
}

function GeoItemCard({ item, sectionKey }: { item: Record<string, unknown>; sectionKey: SectionKey }) {
  const w = (v: unknown, fallback = ""): string => (v ?? fallback) as string
  const n = (v: unknown, fallback = 0): number => Number(v ?? fallback)

  if (sectionKey === "weekPlan") {
    const week = w(item.week)
    const tasks = Array.isArray(item.tasks) ? (item.tasks as string[]) : []
    return (
      <div className="rounded-lg border border-border/40 p-4">
        <span className="text-sm font-semibold text-[#7C3AED]">Week {week}</span>
        {tasks.length > 0 && (
          <ul className="mt-2 space-y-1">
            {tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#6B7280]">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#7C3AED] shrink-0" />
                {task}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (sectionKey === "scoredRecommendations") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
        <div className="flex-1">
          <span className="text-sm font-medium">{w(item.title)}</span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">Impact: {w(item.impactScore)}</span>
            <span className="text-xs text-muted-foreground">Difficulty: {w(item.difficulty)}</span>
            <span className="text-xs text-muted-foreground">Priority: {w(item.priority)}</span>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">{w(item.expectedVisibilityGain)}</Badge>
      </div>
    )
  }

  if (sectionKey === "executiveRoadmap") {
    const phase = w(item.phase)
    const items = Array.isArray(item.items) ? (item.items as string[]) : []
    return (
      <div className="rounded-lg border border-border/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={phase === "Now" ? "default" : phase === "Next" ? "secondary" : "outline"}>
            {phase}
          </Badge>
          <span className="text-xs text-muted-foreground">{w(item.expectedGain)}</span>
        </div>
        {items.length > 0 && (
          <ul className="space-y-1">
            {items.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#6B7280]">
                <ArrowRight className="h-3.5 w-3.5 text-[#7C3AED] mt-0.5 shrink-0" />
                {task}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (sectionKey === "aiVisibilityAnalysis") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
        <div>
          <span className="text-sm font-medium capitalize">{w(item.provider)}</span>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{n(item.mentionFrequency)} mentions</span>
            <span>Avg pos: {w(item.avgPosition)}</span>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"} className="text-xs">
            {w(item.trend)}
          </Badge>
          <p className="text-[10px] text-muted-foreground mt-1">{w(item.improvementPotential)}</p>
        </div>
      </div>
    )
  }

  if (sectionKey === "quickWins" || sectionKey === "highImpactOpportunities") {
    const label = sectionKey === "quickWins" ? "action" : "opportunity"
    const gainLabel = sectionKey === "quickWins" ? "timeframe" : "projectedGain"
    return (
      <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
        <span className="text-sm">{w(item[label] ?? item.opportunity ?? item.action)}</span>
        <Badge variant="secondary" className="text-xs shrink-0">{w(item[gainLabel])}</Badge>
      </div>
    )
  }

  if (sectionKey === "comparisonPages") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
        <div>
          <span className="text-sm font-medium">{item.title as string}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{item.whyImportant as string}</p>
        </div>
        <Badge className="text-xs shrink-0">Impact: {item.impactScore as number}</Badge>
      </div>
    )
  }

  if (sectionKey === "promptOpportunities") {
    return (
      <div className="rounded-lg border border-border/40 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={item.priority === "high" ? "default" : item.priority === "medium" ? "secondary" : "outline"} className="text-xs capitalize">
            {item.priority as string}
          </Badge>
        </div>
        <p className="text-sm">{item.prompt as string}</p>
        <p className="text-xs text-muted-foreground mt-1">{item.reason as string}</p>
      </div>
    )
  }

  if (sectionKey === "competitorGaps") {
    return (
      <div className="rounded-lg border border-border/40 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">{item.competitorName as string}</Badge>
        </div>
        <p className="text-xs text-muted-foreground"><strong>Prompt:</strong> {item.prompt as string}</p>
        <p className="text-xs text-muted-foreground mt-1"><strong>Why competitor appeared:</strong> {item.reasonCompetitorAppeared as string}</p>
        <p className="text-xs text-muted-foreground"><strong>Why brand didn&apos;t:</strong> {item.whyBrandDidNotAppear as string}</p>
        <p className="text-xs text-[#7C3AED] mt-1"><strong>Fix:</strong> {item.recommendedFix as string}</p>
      </div>
    )
  }

  // Generic card for all others
  return (
    <div className="rounded-lg border border-border/40 p-3">
      {Object.entries(item).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null
        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
        return (
          <div key={key} className="text-sm">
            {typeof value === "string" ? (
              <p className="text-[#6B7280]"><span className="text-muted-foreground">{label}:</span> {value}</p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AgentTabs } from "./agent-tabs"
import { ContentIdeasList } from "./content-ideas-list"
import { ContentBriefView } from "./content-brief-view"
import { CompetitorAnalysisPanel } from "./competitor-analysis-panel"
import { CitationOpportunityList } from "./citation-opportunity-list"
import { GeoActionPlan } from "./geo-action-plan"
import { AgentTaskList } from "./agent-task-list"
import { ImpactForecastChart } from "./impact-forecast-chart"
import { Bot, RefreshCw, ChevronDown, ChevronRight } from "lucide-react"

interface AgentSectionProps {
  projectId: string
  collapsed?: boolean
}

export function AgentSection({ projectId, collapsed = false }: AgentSectionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(!collapsed)
  const [activeTab, setActiveTab] = useState("ideas")
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [data, setData] = useState<{
    ideas: unknown[]
    briefs: unknown[]
    competitors: unknown[]
    citations: unknown[]
    actionPlan: unknown[]
    tasks: unknown[]
    agentRun: { id: string; status: string; summary: string | null; itemsCreated: number | null; createdAt: string } | null
  }>({
    ideas: [], briefs: [], competitors: [], citations: [], actionPlan: [], tasks: [],
    agentRun: null,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [agentRes, ideasRes, briefsRes, competitorsRes, citationsRes, actionPlanRes, tasksRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/agent`),
        fetch(`/api/projects/${projectId}/agent/content-ideas`),
        fetch(`/api/projects/${projectId}/agent/content-briefs`),
        fetch(`/api/projects/${projectId}/agent/competitor-analysis`),
        fetch(`/api/projects/${projectId}/agent/citation-opportunities`),
        fetch(`/api/projects/${projectId}/agent/action-plan`),
        fetch(`/api/projects/${projectId}/agent/tasks`),
      ])
      const [agent, ideas, briefs, competitors, citations, actionPlan, tasks] = await Promise.all([
        agentRes.json(), ideasRes.json(), briefsRes.json(), competitorsRes.json(),
        citationsRes.json(), actionPlanRes.json(), tasksRes.json(),
      ])
      setData({
        agentRun: Array.isArray(agent.data) ? (agent.data[0] ?? null) : (agent.data ?? null),
        ideas: ideas.data ?? [],
        briefs: briefs.data ?? [],
        competitors: competitors.data ?? [],
        citations: citations.data ?? [],
        actionPlan: actionPlan.data ?? [],
        tasks: tasks.data ?? [],
      })
    } catch {
      // silently fail
    }
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  const runAgent = async () => {
    setRunning(true)
    await fetch(`/api/projects/${projectId}/agent`, { method: "POST" })
    setRunning(false)
    await fetchData()
    router.refresh()
  }

  const updateActionPlanStatus = async (id: string, status: string) => {
    await fetch(`/api/projects/${projectId}/agent/action-plan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    await fetchData()
    router.refresh()
  }

  const updateTaskStatus = async (id: string, status: string) => {
    await fetch(`/api/projects/${projectId}/agent/tasks`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    await fetchData()
    router.refresh()
  }

  const hasData = data.ideas.length > 0 || data.briefs.length > 0 || data.competitors.length > 0 ||
    data.citations.length > 0 || data.actionPlan.length > 0 || data.tasks.length > 0

  const counts = {
    ideas: data.ideas.length,
    briefs: data.briefs.length,
    competitors: data.competitors.length,
    citations: data.citations.length,
    actionPlan: data.actionPlan.length,
    tasks: (data.tasks as { status: string }[]).filter((t) => t.status !== "completed").length,
  }

  return (
    <Card className="bg-white shadow-sm border-border/40">
      <CardHeader className="cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-primary" />
            GEO Agent
            {data.agentRun && (
              <Badge variant={data.agentRun.status === "completed" ? "secondary" : data.agentRun.status === "running" ? "default" : "outline"} className="text-xs">
                {data.agentRun.status}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {data.agentRun?.summary && (
              <span className="text-xs text-muted-foreground hidden sm:block max-w-xs truncate">
                {data.agentRun.summary}
              </span>
            )}
            <Button size="sm" variant="outline" disabled={running}
              onClick={(e) => { e.stopPropagation(); runAgent() }}
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${running ? "animate-spin" : ""}`} />
              {running ? "Running..." : "Run Agent"}
            </Button>
            {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !hasData ? (
            <div className="text-center py-8">
              <Bot className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No agent data yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Run the GEO agent to generate content ideas, competitor analysis, and more.
              </p>
            </div>
          ) : (
            <>
              <ImpactForecastChart
                data={[
                  ...(data.ideas as { impactScore: number; difficultyScore: number; priorityScore: number; title: string }[]).map((i) => ({
                    name: i.title.length > 20 ? i.title.slice(0, 20) + "…" : i.title,
                    impact: i.impactScore,
                    difficulty: i.difficultyScore,
                    priority: i.priorityScore,
                  })),
                  ...(data.citations as { impactScore: number; difficultyScore: number; domain: string }[]).map((c) => ({
                    name: c.domain,
                    impact: c.impactScore,
                    difficulty: c.difficultyScore,
                    priority: Math.round(c.impactScore * 0.6 + (100 - c.difficultyScore) * 0.4),
                  })),
                ].slice(0, 10)}
              />

              <div className="mt-4">
                <AgentTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts}>
                  {activeTab === "ideas" && (
                    <ContentIdeasList projectId={projectId} ideas={data.ideas as Parameters<typeof ContentIdeasList>[0]["ideas"]} />
                  )}
                  {activeTab === "briefs" && (
                    <div className="space-y-3">
                      {(data.briefs as Parameters<typeof ContentBriefView>[0]["brief"][]).length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No content briefs yet.</p>
                      ) : (
                        (data.briefs as Parameters<typeof ContentBriefView>[0]["brief"][]).map((brief) => (
                          <ContentBriefView key={brief.id} brief={brief} />
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === "competitors" && (
                    <CompetitorAnalysisPanel analyses={data.competitors as Parameters<typeof CompetitorAnalysisPanel>[0]["analyses"]} />
                  )}
                  {activeTab === "citations" && (
                    <CitationOpportunityList opportunities={data.citations as Parameters<typeof CitationOpportunityList>[0]["opportunities"]} />
                  )}
                  {activeTab === "action-plan" && (
                    <GeoActionPlan items={data.actionPlan as Parameters<typeof GeoActionPlan>[0]["items"]} onUpdateStatus={updateActionPlanStatus} />
                  )}
                  {activeTab === "tasks" && (
                    <AgentTaskList tasks={data.tasks as Parameters<typeof AgentTaskList>[0]["tasks"]} onUpdateStatus={updateTaskStatus} />
                  )}
                </AgentTabs>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}

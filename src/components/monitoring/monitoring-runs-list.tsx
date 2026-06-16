"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, ExternalLink } from "lucide-react"
import Link from "next/link"

interface RunItem {
  id: string
  status: string
  startedAt: Date | null
  completedAt: Date | null
  createdAt: Date
  jobType: string
  _count: { responses: number; logs: number }
}

interface MonitoringRunsListProps {
  projectId: string
  runs: RunItem[]
}

function RunStatusBadge({ status }: { status: string }) {
  const variant =
    status === "completed" ? "default" as const
    : status === "running" ? "secondary" as const
    : status === "failed" ? "destructive" as const
    : "outline" as const

  return <Badge variant={variant}>{status}</Badge>
}

export function MonitoringRunsList({ projectId, runs }: MonitoringRunsListProps) {
  if (runs.length === 0) return null

  return (
    <Card className="bg-white shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Recent Runs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between rounded-lg border border-border/40 p-3"
            >
              <div className="flex items-center gap-3">
                <RunStatusBadge status={run.status} />
                <Badge variant="outline">{run.jobType}</Badge>
                <span className="text-xs text-muted-foreground">
                  {run._count.responses} responses
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(run.createdAt).toLocaleString()}
                </span>
              </div>
              <Link href={`/projects/${projectId}/monitoring/runs/${run.id}`}>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

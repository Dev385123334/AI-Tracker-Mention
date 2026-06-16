"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, CheckCircle2, XCircle, Sparkles, RefreshCw } from "lucide-react"

interface Recommendation {
  id: string
  type: string
  priority: string
  title: string
  description: string
  category: string
  status: string
  impact: string | null
  createdAt: string
}

interface RecommendationListProps {
  projectId: string
  recommendations: Recommendation[]
}

const typeIcons: Record<string, string> = {
  content_gap: "📝",
  citation_gap: "🔗",
  visibility_gap: "👁️",
  sentiment: "💬",
  keyword: "🔑",
}

const priorityColors: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
  critical: "destructive",
  high: "destructive",
  medium: "default",
  low: "secondary",
}

export function RecommendationList({ projectId, recommendations }: RecommendationListProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const openRecs = recommendations.filter((r) => r.status === "open")
  const otherRecs = recommendations.filter((r) => r.status !== "open")

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    await fetch(`/api/projects/${projectId}/recommendations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setUpdatingId(null)
    router.refresh()
  }

  const generateRecs = async () => {
    setGenerating(true)
    await fetch(`/api/projects/${projectId}/recommendations`, {
      method: "POST",
    })
    setGenerating(false)
    router.refresh()
  }

  const renderCard = (rec: Recommendation) => (
    <div
      key={rec.id}
      className="flex items-start gap-3 rounded-lg border border-border/40 p-4"
    >
      <span className="text-lg mt-0.5">{typeIcons[rec.type] ?? "💡"}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={priorityColors[rec.priority] ?? "secondary"} className="capitalize">
            {rec.priority}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {rec.category}
          </Badge>
          <Badge variant="secondary" className="capitalize text-xs">
            {rec.type.replace(/_/g, " ")}
          </Badge>
        </div>
        <p className="text-sm font-medium">{rec.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
        {rec.impact && (
          <p className="text-xs text-primary mt-1">Impact: {rec.impact}</p>
        )}
      </div>
      {rec.status === "open" && (
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={updatingId === rec.id}
            onClick={() => updateStatus(rec.id, "acknowledged")}
            title="Acknowledge"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={updatingId === rec.id}
            onClick={() => updateStatus(rec.id, "dismissed")}
            title="Dismiss"
          >
            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      )}
      {rec.status === "acknowledged" && (
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={updatingId === rec.id}
            onClick={() => updateStatus(rec.id, "implemented")}
            title="Mark implemented"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={updatingId === rec.id}
            onClick={() => updateStatus(rec.id, "dismissed")}
            title="Dismiss"
          >
            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      )}
      {rec.status === "implemented" && (
        <Badge variant="outline" className="shrink-0">Done</Badge>
      )}
      {rec.status === "dismissed" && (
        <Badge variant="outline" className="shrink-0 text-muted-foreground">Dismissed</Badge>
      )}
    </div>
  )

  return (
    <Card className="bg-white shadow-sm border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recommendations
            {recommendations.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({openRecs.length} open)
              </span>
            )}
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            disabled={generating}
            onClick={generateRecs}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recommendations yet. Generate recommendations based on your monitoring data.
          </p>
        ) : (
          <div className="space-y-3">
            {openRecs.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Open
                </p>
                {openRecs.map(renderCard)}
              </div>
            )}
            {otherRecs.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  History
                </p>
                <div className="space-y-2 opacity-60">
                  {otherRecs.map(renderCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

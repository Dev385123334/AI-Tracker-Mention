interface ActionPlanItem {
  id: string
  title: string
  description: string
  category: string
  priority: string
  timeline: string
  estimatedEffort: string
  dependencies: string[]
  successMetric: string
  impactScore: number
  difficultyScore: number
  priorityScore: number
  status: string | null
}

interface GeoActionPlanProps {
  items: ActionPlanItem[]
  onUpdateStatus?: (id: string, status: string) => void
}

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    immediate: "Now",
    this_week: "This Week",
    this_month: "This Month",
    this_quarter: "This Quarter",
  }
  return labels[timeline] ?? timeline
}

const timelineOrder = ["immediate", "this_week", "this_month", "this_quarter"]

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical": return "text-red-500"
    case "high": return "text-orange-500"
    case "medium": return "text-yellow-500"
    default: return "text-green-500"
  }
}

export function GeoActionPlan({ items, onUpdateStatus }: GeoActionPlanProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No action plan items yet.</p>
  }

  const grouped = timelineOrder
    .map((tl) => ({ timeline: tl, items: items.filter((i) => i.timeline === tl) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4">
      {grouped.map((group) => (
        <div key={group.timeline}>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            {getTimelineLabel(group.timeline)}
          </p>
          <div className="space-y-2">
            {group.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-border/40 bg-muted/10 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Effort: {item.estimatedEffort}</span>
                      {item.successMetric && <span>Success: {item.successMetric}</span>}
                      <span>Priority: {Math.round(item.priorityScore)}</span>
                    </div>
                    {item.dependencies.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-muted-foreground/50">Depends on: {item.dependencies.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  {item.status === "completed" ? (
                    <span className="text-xs text-green-500 shrink-0">✓ Done</span>
                  ) : item.status === "in_progress" ? (
                    <span className="text-xs text-blue-500 shrink-0">In progress</span>
                  ) : onUpdateStatus ? (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => onUpdateStatus(item.id, "in_progress")}
                        className="h-6 px-2 rounded text-xs bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => onUpdateStatus(item.id, "completed")}
                        className="h-6 px-2 rounded text-xs bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20"
                      >
                        Done
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

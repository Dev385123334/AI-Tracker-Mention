interface AgentTask {
  id: string
  title: string
  description: string
  source: string
  status: string
  assignee: string | null
  dueDate: string | null
  createdAt: string
}

interface AgentTaskListProps {
  tasks: AgentTask[]
  onUpdateStatus?: (id: string, status: string) => void
}

export function AgentTaskList({ tasks, onUpdateStatus }: AgentTaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No tasks yet.</p>
  }

  const pending = tasks.filter((t) => t.status === "pending")
  const inProgress = tasks.filter((t) => t.status === "in_progress")
  const completed = tasks.filter((t) => t.status === "completed")

  return (
    <div className="space-y-3">
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Pending</p>
          <div className="space-y-2">
            {pending.map((t) => (
              <div key={t.id} className="rounded-lg border border-border/40 bg-muted/10 p-3 flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="bg-muted/40 px-1.5 py-0.5 rounded">{t.source}</span>
                    {t.assignee && <span>Assignee: {t.assignee}</span>}
                    {t.dueDate && <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                {onUpdateStatus && (
                  <button
                    onClick={() => onUpdateStatus(t.id, "in_progress")}
                    className="h-7 px-2 rounded text-xs bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20 shrink-0"
                  >
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {inProgress.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">In Progress</p>
          <div className="space-y-2">
            {inProgress.map((t) => (
              <div key={t.id} className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="bg-muted/40 px-1.5 py-0.5 rounded">{t.source}</span>
                    {t.assignee && <span>Assignee: {t.assignee}</span>}
                  </div>
                </div>
                {onUpdateStatus && (
                  <button
                    onClick={() => onUpdateStatus(t.id, "completed")}
                    className="h-7 px-2 rounded text-xs bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20 shrink-0"
                  >
                    Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Completed</p>
          <div className="space-y-1 opacity-50">
            {completed.map((t) => (
              <div key={t.id} className="rounded-lg border border-border/40 bg-muted/10 p-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs line-through text-muted-foreground">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

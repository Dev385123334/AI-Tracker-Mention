interface ContentIdea {
  id: string
  title: string
  description: string
  keyword: string
  contentType: string
  rationale: string
  targetAudience: string | null
  impactScore: number
  difficultyScore: number
  priorityScore: number
  status: string
}

interface ContentIdeaCardProps {
  idea: ContentIdea
  onAccept?: (id: string) => void
  onDismiss?: (id: string) => void
}

function getContentTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    blog_post: "📝",
    guide: "📘",
    landing_page: "📄",
    comparison: "⚖️",
    case_study: "📊",
  }
  return icons[type] ?? "💡"
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  if (score >= 40) return "text-orange-500"
  return "text-red-500"
}

export function ContentIdeaCard({ idea, onAccept, onDismiss }: ContentIdeaCardProps) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 p-4 space-y-2">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{getContentTypeIcon(idea.contentType)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{idea.title}</span>
            <span className="text-xs text-muted-foreground capitalize px-1.5 py-0.5 rounded bg-muted/40">
              {idea.contentType.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-muted-foreground">Keyword: {idea.keyword}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className={getScoreColor(idea.impactScore)}>Impact: {idea.impactScore}</span>
            <span className={getScoreColor(100 - idea.difficultyScore)}>Difficulty: {idea.difficultyScore}</span>
            <span className={`font-medium ${getScoreColor(idea.priorityScore)}`}>
              Priority: {Math.round(idea.priorityScore)}
            </span>
          </div>
          {idea.rationale && (
            <p className="text-xs text-muted-foreground/70 mt-1 italic">{idea.rationale}</p>
          )}
          {idea.targetAudience && (
            <p className="text-xs text-muted-foreground/50 mt-0.5">Audience: {idea.targetAudience}</p>
          )}
        </div>
        {(idea.status === "pending" || idea.status === "active") && (
          <div className="flex gap-1 shrink-0">
            {onAccept && (
              <button
                onClick={() => onAccept(idea.id)}
                className="h-7 px-2 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/30 hover:bg-green-500/20"
              >
                Accept
              </button>
            )}
            {onDismiss && (
              <button
                onClick={() => onDismiss(idea.id)}
                className="h-7 px-2 rounded text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
        {idea.status === "accepted" && (
          <span className="text-xs text-green-500 shrink-0">✓ Accepted</span>
        )}
        {idea.status === "dismissed" && (
          <span className="text-xs text-muted-foreground shrink-0">Dismissed</span>
        )}
      </div>
    </div>
  )
}

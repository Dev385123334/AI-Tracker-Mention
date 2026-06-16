interface ScoringBadgeProps {
  score: number
  label?: string
  size?: "sm" | "md"
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500 border-green-500/30 bg-green-500/10"
  if (score >= 60) return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
  if (score >= 40) return "text-orange-500 border-orange-500/30 bg-orange-500/10"
  return "text-red-500 border-red-500/30 bg-red-500/10"
}

function getPriorityLabel(score: number): string {
  if (score >= 80) return "Critical"
  if (score >= 60) return "High"
  if (score >= 40) return "Medium"
  return "Low"
}

export function ScoringBadge({ score, label, size = "sm" }: ScoringBadgeProps) {
  const color = getScoreColor(score)
  const textSize = size === "sm" ? "text-xs" : "text-sm"
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${color} ${textSize}`}>
      {label ?? getPriorityLabel(score)}
      <span className="tabular-nums">({Math.round(score)})</span>
    </span>
  )
}

interface CompetitorAnalysis {
  id: string
  competitorName: string
  competitorDomain: string
  gapType: string
  gapSeverity: string
  description: string
  brandStrength: string
  competitorStrength: string
  actionItems: string[]
  impactScore: number
  difficultyScore: number
}

interface CompetitorAnalysisPanelProps {
  analyses: CompetitorAnalysis[]
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "text-red-500 border-red-500/30 bg-red-500/10"
    case "high": return "text-orange-500 border-orange-500/30 bg-orange-500/10"
    case "medium": return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
    default: return "text-green-500 border-green-500/30 bg-green-500/10"
  }
}

function getGapTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    content: "📝",
    citation: "🔗",
    visibility: "👁️",
    positioning: "🎯",
  }
  return icons[type] ?? "📊"
}

export function CompetitorAnalysisPanel({ analyses }: CompetitorAnalysisPanelProps) {
  if (analyses.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No competitor analyses yet.</p>
  }

  return (
    <div className="space-y-3">
      {analyses.map((a) => (
        <div key={a.id} className="rounded-lg border border-border/40 bg-muted/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">{getGapTypeIcon(a.gapType)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{a.competitorName}</span>
                <span className="text-xs text-muted-foreground">{a.competitorDomain}</span>
                <span className={`text-xs rounded-md px-1.5 py-0.5 border font-medium ${getSeverityColor(a.gapSeverity)}`}>
                  {a.gapSeverity}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{a.gapType} gap</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="bg-green-500/5 border border-green-500/10 rounded p-2">
                  <span className="text-green-500 font-medium">Our strength</span>
                  <p className="text-muted-foreground mt-0.5">{a.brandStrength}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded p-2">
                  <span className="text-red-500 font-medium">Their strength</span>
                  <p className="text-muted-foreground mt-0.5">{a.competitorStrength}</p>
                </div>
              </div>
              {a.actionItems.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Action Items</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {a.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span>Impact: {a.impactScore}</span>
                <span>Difficulty: {a.difficultyScore}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface CitationOpportunity {
  id: string
  domain: string
  domainAuthority: string | null
  opportunityType: string
  relevance: string
  strategy: string
  competitorRef: string | null
  contactMethod: string | null
  impactScore: number
  difficultyScore: number
}

interface CitationOpportunityListProps {
  opportunities: CitationOpportunity[]
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    directory: "📋",
    resource: "📚",
    haro: "🎤",
    guest_post: "✍️",
    broken_link: "🔗",
  }
  return icons[type] ?? "🔗"
}

export function CitationOpportunityList({ opportunities }: CitationOpportunityListProps) {
  if (opportunities.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No citation opportunities yet.</p>
  }

  return (
    <div className="space-y-2">
      {opportunities.map((o) => (
        <div
          key={o.id}
          className="rounded-lg border border-border/40 bg-muted/10 p-3 flex items-start gap-3"
        >
          <span className="text-lg mt-0.5">{getTypeIcon(o.opportunityType)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{o.domain}</span>
              {o.domainAuthority && (
                <span className="text-xs text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                  DA: {o.domainAuthority}
                </span>
              )}
              <span className="text-xs text-muted-foreground capitalize">{o.opportunityType.replace(/_/g, " ")}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{o.strategy}</p>
            {o.competitorRef && (
              <p className="text-xs text-muted-foreground/50 mt-0.5">Competitor: {o.competitorRef}</p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>Relevance: {o.relevance}</span>
              {o.contactMethod && <span>Contact: {o.contactMethod}</span>}
              <span>Impact: {o.impactScore}</span>
              <span>Difficulty: {o.difficultyScore}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface ContentBrief {
  id: string
  title: string
  targetKeyword: string
  wordCount: number
  structure: Record<string, unknown>
  keyPoints: string[]
  faqQuestions: string[]
  internalLinks: string[]
  targetAudience: string
  toneOfVoice: string
  seoNotes: string
  competitorRefs: string[]
  callToAction: string
}

interface ContentBriefViewProps {
  brief: ContentBrief
}

export function ContentBriefView({ brief }: ContentBriefViewProps) {
  const rawSections: unknown[] = (brief.structure as { sections?: unknown[] })?.sections ?? []

  const sections = rawSections.map((s) => {
    const sec = s as { heading?: string; type?: string; wordCount?: number }
    return { heading: sec.heading ?? "", type: sec.type ?? "", wordCount: sec.wordCount ?? 0 }
  })

  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 p-4 space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{brief.title}</span>
          <span className="text-xs text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">{brief.targetKeyword}</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
          <span>{brief.wordCount} words</span>
          <span>Tone: {brief.toneOfVoice}</span>
          <span>Audience: {brief.targetAudience}</span>
        </div>
      </div>

      {sections.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Outline</p>
          <div className="space-y-2">
            {sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{section.heading}</span>
                  <span className="text-[10px] text-muted-foreground capitalize bg-muted/40 px-1.5 py-0.5 rounded">
                    {section.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">~{section.wordCount} words</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {brief.keyPoints.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Key Points</p>
          <ul className="list-disc list-inside text-xs text-muted-foreground">
            {brief.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      {brief.faqQuestions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">FAQ Questions</p>
          <ul className="list-disc list-inside text-xs text-muted-foreground">
            {brief.faqQuestions.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}

      {brief.internalLinks.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Internal Links</p>
          <div className="flex flex-wrap gap-1">
            {brief.internalLinks.map((link, i) => (
              <span key={i} className="text-xs bg-muted/40 px-1.5 py-0.5 rounded">{link}</span>
            ))}
          </div>
        </div>
      )}

      {brief.seoNotes && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">SEO Notes</p>
          <p className="text-xs text-muted-foreground">{brief.seoNotes}</p>
        </div>
      )}

      {brief.callToAction && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">CTA</p>
          <p className="text-xs text-muted-foreground">{brief.callToAction}</p>
        </div>
      )}
    </div>
  )
}

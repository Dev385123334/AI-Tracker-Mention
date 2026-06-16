export interface ScoredItem {
  impactScore: number
  difficultyScore: number
  priorityScore: number
}

export interface ContentIdeaInput {
  title: string
  description: string
  keyword: string
  contentType: string
  rationale: string
  targetAudience?: string
}

export interface ContentBriefInput {
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

export interface CompetitorAnalysisInput {
  competitorName: string
  competitorDomain: string
  gapType: string
  gapSeverity: string
  description: string
  brandStrength: string
  competitorStrength: string
  actionItems: string[]
}

export interface CitationOpportunityInput {
  domain: string
  domainAuthority?: string
  opportunityType: string
  relevance: string
  strategy: string
  competitorRef?: string
  contactMethod?: string
}

export interface ActionPlanInput {
  title: string
  description: string
  category: string
  priority: string
  timeline: string
  estimatedEffort: string
  dependencies: string[]
  successMetric: string
}

export interface AgentTaskInput {
  title: string
  description: string
  source: string
  sourceId: string
  assignee?: string
  dueDate?: Date
}

export interface ProjectContext {
  id: string
  brandName: string
  domain: string
  competitors: { name: string; domain: string }[]
  keywords: { id: string; keyword: string }[]
}

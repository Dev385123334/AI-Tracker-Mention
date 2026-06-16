export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface OrganizationMember {
  id: string
  role: "owner" | "admin" | "member"
  invitedEmail: string | null
  joinedAt: Date | null
  createdAt: Date
  userId: string | null
  organizationId: string
}

export interface Project {
  id: string
  name: string
  brandName: string
  domain: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  organizationId: string
  userId: string
}

export interface Competitor {
  id: string
  name: string
  domain: string
  createdAt: Date
  updatedAt: Date
  projectId: string
}

export interface Keyword {
  id: string
  keyword: string
  createdAt: Date
  updatedAt: Date
  projectId: string
}

export interface Prompt {
  id: string
  text: string
  active: boolean
  createdAt: Date
  updatedAt: Date
  keywordId: string
}

export interface MonitoringJob {
  id: string
  type: string
  status: string
  schedule: string | null
  createdAt: Date
  updatedAt: Date
  projectId: string
}

export interface MonitoringRun {
  id: string
  status: string
  startedAt: Date | null
  completedAt: Date | null
  error: string | null
  createdAt: Date
  updatedAt: Date
  jobId: string
}

export interface ProviderResponse {
  id: string
  provider: string
  responseText: string
  rawResponse: Record<string, unknown> | null
  latencyMs: number | null
  tokensUsed: number | null
  status: string
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
  runId: string
  promptId: string
}

export interface JobLog {
  id: string
  level: string
  message: string
  metadata: Record<string, unknown> | null
  createdAt: Date
  runId: string
}

export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
  userId: string
  projectId: string | null
  organizationId: string | null
}

export interface GeoScore {
  id: string
  score: number
  visibilityScore: number
  positionScore: number
  citationScore: number
  sentimentScore: number
  periodStart: Date
  periodEnd: Date
  createdAt: Date
  projectId: string
}

export interface Recommendation {
  id: string
  type: string
  priority: string
  title: string
  description: string
  category: string
  status: string
  impact: string | null
  createdAt: Date
  updatedAt: Date
  projectId: string
}

export interface Report {
  id: string
  type: string
  title: string
  status: string
  format: string
  fileUrl: string | null
  fileSize: number | null
  periodStart: Date
  periodEnd: Date
  createdAt: Date
  completedAt: Date | null
  projectId: string
}

export interface ReportSchedule {
  id: string
  type: string
  enabled: boolean
  dayOfWeek: number | null
  dayOfMonth: number | null
  hour: number
  nextRunAt: Date | null
  createdAt: Date
  updatedAt: Date
  projectId: string
}

export interface EmailNotification {
  id: string
  type: string
  enabled: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  projectId: string | null
}

export interface AgentRun {
  id: string
  status: string
  summary: string | null
  itemCount: number
  startedAt: Date
  completedAt: Date | null
  projectId: string
}

export interface ContentIdea {
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
  createdAt: Date
  runId: string
  projectId: string
}

export interface ContentBrief {
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
  runId: string
  projectId: string
}

export interface CompetitorGapAnalysis {
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
  runId: string
  projectId: string
}

export interface CitationOpportunity {
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
  runId: string
  projectId: string
}

export interface GeoActionPlanItem {
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
  status: string
  runId: string
  projectId: string
}

export interface AgentTask {
  id: string
  title: string
  description: string
  source: string
  sourceId: string
  assignee: string | null
  dueDate: Date | null
  status: string
  createdAt: Date
  runId: string
  projectId: string
}

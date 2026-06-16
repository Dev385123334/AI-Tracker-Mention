import type { ContentIdeaInput, CompetitorAnalysisInput, CitationOpportunityInput } from "./types"

export function calculateContentIdeaScore(idea: ContentIdeaInput, context: {
  brandAbsent: boolean
  competitorDominates: boolean
  mentionGap: number
}): { impactScore: number; difficultyScore: number } {
  let impact = 20

  if (context.brandAbsent) impact += 40
  if (context.competitorDominates) impact += 30
  if (context.mentionGap > 5) impact += 20
  else if (context.mentionGap > 2) impact += 10

  const difficultyMap: Record<string, number> = {
    blog_post: 25,
    landing_page: 35,
    comparison: 40,
    guide: 50,
    case_study: 55,
  }
  const difficulty = difficultyMap[idea.contentType] ?? 35

  return { impactScore: Math.min(100, impact), difficultyScore: difficulty }
}

export function calculateCitationScore(opp: CitationOpportunityInput, context: {
  highAuthorityDomain: boolean
  competitorCited: boolean
  multipleCompetitors: boolean
}): { impactScore: number; difficultyScore: number } {
  let impact = 15

  if (context.highAuthorityDomain) impact += 35
  if (context.competitorCited) impact += 25
  if (context.multipleCompetitors) impact += 20

  const difficultyMap: Record<string, number> = {
    directory: 15,
    resource_page: 35,
    haro: 30,
    guest_post: 45,
    broken_link: 40,
  }
  const difficulty = difficultyMap[opp.opportunityType] ?? 35

  return { impactScore: Math.min(100, impact), difficultyScore: difficulty }
}

export function calculateCompetitorGapScore(analysis: CompetitorAnalysisInput): {
  impactScore: number
  difficultyScore: number
} {
  let impact = 20

  if (analysis.gapSeverity === "critical") impact += 40
  else if (analysis.gapSeverity === "high") impact += 30
  else if (analysis.gapSeverity === "medium") impact += 15

  const difficultyMap: Record<string, number> = {
    content: 40,
    citation: 45,
    visibility: 35,
    positioning: 50,
  }
  const difficulty = difficultyMap[analysis.gapType] ?? 40

  return { impactScore: Math.min(100, impact), difficultyScore: difficulty }
}

export function calculatePriority(impactScore: number, difficultyScore: number): number {
  return Math.round(impactScore * 0.6 + (100 - difficultyScore) * 0.4)
}

export function priorityLabel(priorityScore: number): string {
  if (priorityScore >= 80) return "critical"
  if (priorityScore >= 60) return "high"
  if (priorityScore >= 40) return "medium"
  return "low"
}

export function timelineFromPriority(priorityScore: number): string {
  if (priorityScore >= 80) return "immediate"
  if (priorityScore >= 60) return "this_week"
  if (priorityScore >= 40) return "this_month"
  return "this_quarter"
}

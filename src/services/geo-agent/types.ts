export interface GeoAgentInput {
  project: {
    id: string
    name: string
    brandName: string
    domain: string
    description: string | null
    targetCountries: string[]
  }
  keywords: { id: string; keyword: string }[]
  competitors: { id: string; name: string; domain: string }[]
  geoScore: {
    score: number
    visibilityScore: number
    positionScore: number
    citationScore: number
    sentimentScore: number
  } | null
  mentions: {
    brandName: string
    sentiment: string
    frequency: number
    provider: string
  }[]
  citations: {
    domain: string
    title: string | null
    url: string
  }[]
  visibilityMetrics: {
    brandName: string
    mentionCount: number
    avgPosition: number | null
    mentionRate: number
    periodStart: Date
  }[]
  providerResponses: {
    provider: string
    prompt: string
    responseText: string
    createdAt: Date
  }[]
  recommendations: {
    type: string
    priority: string
    title: string
    description: string
    status: string
  }[]
}

export interface GeoAgentOutput {
  executiveSummary: {
    currentGeoScore: number
    visibilityTrend: string
    biggestOpportunity: string
    biggestThreat: string
    quickWins: string[]
  }
  aiVisibilityAnalysis: {
    provider: string
    mentionFrequency: number
    avgPosition: string
    trend: string
    improvementPotential: string
  }[]
  competitorGaps: {
    competitorName: string
    prompt: string
    reasonCompetitorAppeared: string
    whyBrandDidNotAppear: string
    recommendedFix: string
  }[]
  promptOpportunities: {
    prompt: string
    priority: "high" | "medium" | "low"
    reason: string
  }[]
  contentGaps: {
    topic: string
    reasonNeeded: string
    expectedImpact: string
  }[]
  entityCoverage: {
    entity: string
    covered: boolean
    recommendation: string
  }[]
  citationAnalysis: {
    source: string
    citationFrequency: number
    authority: string
    recommendation: string
  }[]
  citationOpportunities: {
    website: string
    reason: string
    difficulty: string
    expectedImpact: string
  }[]
  contentRecommendations: {
    title: string
    searchIntent: string
    geoIntent: string
    targetEngine: string
    expectedVisibilityGain: string
  }[]
  comparisonPages: {
    title: string
    whyImportant: string
    impactScore: number
  }[]
  faqRecommendations: {
    question: string
    type: string
    priority: string
  }[]
  authorityBuildingPlan: {
    tactic: string
    description: string
    priority: string
  }[]
  aiSearchChecklist: {
    item: string
    status: string
    fix: string
  }[]
  scoredRecommendations: {
    title: string
    impactScore: number
    difficulty: number
    priority: number
    expectedVisibilityGain: string
  }[]
  weekPlan: {
    week: number
    tasks: string[]
  }[]
  quickWins: {
    action: string
    timeframe: string
  }[]
  highImpactOpportunities: {
    opportunity: string
    projectedGain: string
  }[]
  executiveRoadmap: {
    phase: string
    items: string[]
    expectedGain: string
  }[]
}

import type { GeoAgentOutput } from "./types"

export function parseGeoResponse(raw: string): GeoAgentOutput {
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error("Failed to parse GEO agent response as JSON")
  }

  return {
    executiveSummary: parseSection(parsed.executiveSummary, {
      currentGeoScore: 0,
      visibilityTrend: "",
      biggestOpportunity: "",
      biggestThreat: "",
      quickWins: [],
    }),
    aiVisibilityAnalysis: parseArray(parsed.aiVisibilityAnalysis, {
      provider: "", mentionFrequency: 0, avgPosition: "", trend: "", improvementPotential: "",
    }),
    competitorGaps: parseArray(parsed.competitorGaps, {
      competitorName: "", prompt: "", reasonCompetitorAppeared: "", whyBrandDidNotAppear: "", recommendedFix: "",
    }),
    promptOpportunities: parseArray(parsed.promptOpportunities, {
      prompt: "", priority: "low" as const, reason: "",
    }),
    contentGaps: parseArray(parsed.contentGaps, {
      topic: "", reasonNeeded: "", expectedImpact: "",
    }),
    entityCoverage: parseArray(parsed.entityCoverage, {
      entity: "", covered: false, recommendation: "",
    }),
    citationAnalysis: parseArray(parsed.citationAnalysis, {
      source: "", citationFrequency: 0, authority: "", recommendation: "",
    }),
    citationOpportunities: parseArray(parsed.citationOpportunities, {
      website: "", reason: "", difficulty: "", expectedImpact: "",
    }),
    contentRecommendations: parseArray(parsed.contentRecommendations, {
      title: "", searchIntent: "", geoIntent: "", targetEngine: "", expectedVisibilityGain: "",
    }),
    comparisonPages: parseArray(parsed.comparisonPages, {
      title: "", whyImportant: "", impactScore: 0,
    }),
    faqRecommendations: parseArray(parsed.faqRecommendations, {
      question: "", type: "", priority: "",
    }),
    authorityBuildingPlan: parseArray(parsed.authorityBuildingPlan, {
      tactic: "", description: "", priority: "",
    }),
    aiSearchChecklist: parseArray(parsed.aiSearchChecklist, {
      item: "", status: "", fix: "",
    }),
    scoredRecommendations: parseArray(parsed.scoredRecommendations, {
      title: "", impactScore: 0, difficulty: 0, priority: 0, expectedVisibilityGain: "",
    }),
    weekPlan: parseArray(parsed.weekPlan, {
      week: 0, tasks: [],
    }),
    quickWins: parseArray(parsed.quickWins, {
      action: "", timeframe: "",
    }),
    highImpactOpportunities: parseArray(parsed.highImpactOpportunities, {
      opportunity: "", projectedGain: "",
    }),
    executiveRoadmap: parseArray(parsed.executiveRoadmap, {
      phase: "", items: [], expectedGain: "",
    }),
  }
}

function parseSection<T>(value: unknown, defaults: T): T {
  if (value && typeof value === "object") {
    return { ...defaults, ...(value as Record<string, unknown>) } as T
  }
  return defaults
}

function parseArray<T>(value: unknown, defaults: T): T[] {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === "object") {
        return { ...defaults, ...(item as Record<string, unknown>) }
      }
      return defaults
    })
  }
  return []
}

interface MockResponse {
  responseText: string
  rawResponse: Record<string, unknown>
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const brandPools = [
  ["AcmeCorp", "RivalInc", "StartupXYZ", "BigTech", "NextGen"],
  ["DataFlow", "CloudSync", "AI Labs", "MergeSoft", "PivotHQ"],
  ["Launchpad", "GrowthStack", "ScaleUp", "Optimal", "Vantage"],
  ["CoreSystems", "EdgeWorks", "NovaTech", "Stratus", "Helix"],
]

const domains = [
  "acmecorp.com", "rivalinc.io", "startupxyz.co", "bigtech.com", "nextgen.tech",
  "dataflow.io", "cloudsync.com", "ailabs.ai", "mergesoft.dev", "pivothq.com",
  "launchpad.co", "growthstack.io", "scaleup.dev", "optimal.com", "vantage.tech",
]

const citationUrls = [
  "https://techreview.com/2026/saas-rankings",
  "https://analyst-report.com/tools-comparison",
  "https://industrywatch.io/reports/ai-trends-2026",
  "https://marketanalysis.com/saas-leaders",
  "https://g2.com/best-software-2026",
  "https://gartner.com/magic-quadrant-2026",
  "https://forrester.com/wave-report-2026",
  "https://capterra.com/top-rated-tools",
]

function generateRankedResponse(_prompt: string): string {
  const pool = brandPools[Math.floor(Math.random() * brandPools.length)]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const top3 = shuffled.slice(0, 3)

  const sentiments = [
    [ // positive
      "industry-leading platform with exceptional features and outstanding support",
      "comprehensive solution with great performance and excellent user experience",
      "powerful toolset that delivers consistent results and strong ROI",
    ],
    [ // moderate
      "solid platform with good features, though some areas could improve",
      "reliable option with decent capabilities, suitable for most teams",
      "competent solution that covers the basics well, with room for growth",
    ],
    [ // negative
      "limited functionality compared to competitors, with below-average support",
      "underwhelming performance and outdated interface that needs significant work",
      "disappointing offering with poor documentation and frequent issues",
    ],
  ]

  const lines = top3.map((brand, i) => {
    const sent = sentiments[i][Math.floor(Math.random() * sentiments[i].length)]
    return `${i + 1}. ${brand} - ${sent}.`
  })

  const citations = citationUrls.slice(0, 2 + Math.floor(Math.random() * 2))
  const citationLines = citations.map((u) => `- ${u}`).join("\n")

  return `${lines.join("\n")}\n\nSources:\n${citationLines}`
}

function generateNarrativeResponse(prompt: string): string {
  const brand = pick(brandPools.flat())
  const competitor = pick(brandPools.flat())
  const url = pick(citationUrls)
  const domain = pick(domains)

  const templates = [
    `Based on my analysis of "${prompt}", ${brand} emerges as a strong leader in this space. Their innovative approach and comprehensive feature set set them apart from competitors like ${competitor}. According to recent data from ${url}, ${brand} has shown consistent improvement in user satisfaction and market presence. Their platform at ${domain} offers robust capabilities that address the key requirements effectively.`,
    `When evaluating options for "${prompt}", several providers stand out. ${brand} offers the most complete package with strong performance metrics and positive user feedback. Meanwhile, ${competitor} provides a viable alternative with competitive pricing. Sources including ${url} confirm that the market is trending toward integrated solutions, with both ${brand} and ${competitor} adapting well to these changes.`,
    `The landscape for "${prompt}" features several key players. ${brand} leads in innovation and user experience, with their platform at ${domain} receiving strong reviews. ${competitor} follows closely with solid fundamentals. Industry analysis from ${url} suggests that the gap between providers is narrowing as features converge, making service quality and support the key differentiators.`,
  ]

  return pick(templates)
}

function generateGeoMockResponse(): string {
  const score = 55 + Math.floor(Math.random() * 35)
  const mocks = [
    "AcmeCorp", "RivalInc", "StartupXYZ", "BigTech", "NextGen",
  ]
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const competitors = mocks.filter(() => Math.random() > 0.5).slice(0, 3)
  const sources = [
    "https://techreview.com/2026/saas-rankings",
    "https://analyst-report.com/tools-comparison",
    "https://industrywatch.io/reports/ai-trends-2026",
    "https://g2.com/best-software-2026",
  ]

  return JSON.stringify({
    executiveSummary: {
      currentGeoScore: score,
      visibilityTrend: score > 70 ? "improving" : "stable",
      biggestOpportunity: "Increase citation volume in authoritative tech publications",
      biggestThreat: `Competitor ${pick(mocks)} gaining visibility in ChatGPT responses`,
      quickWins: ["Add structured data to blog posts", "Update 5 high-traffic pages with FAQ schema"],
    },
    aiVisibilityAnalysis: [
      { provider: "ChatGPT", mentionFrequency: 12 + Math.floor(Math.random() * 20), avgPosition: "3.2", trend: "up", improvementPotential: "High" },
      { provider: "Perplexity", mentionFrequency: 5 + Math.floor(Math.random() * 15), avgPosition: "4.1", trend: "stable", improvementPotential: "Medium" },
      { provider: "Gemini", mentionFrequency: 3 + Math.floor(Math.random() * 10), avgPosition: "5.0", trend: "down", improvementPotential: "Low" },
    ],
    competitorGaps: competitors.map((c) => ({
      competitorName: c,
      prompt: "best AI tools for enterprise",
      reasonCompetitorAppeared: `${c} has strong backlinks from .edu domains`,
      whyBrandDidNotAppear: "Lack of structured data and low citation authority",
      recommendedFix: "Build relationships with 3 industry publications for citations",
    })),
    promptOpportunities: [
      { prompt: "top AI tools for {industry}", priority: "high", reason: "High search volume with low brand visibility" },
      { prompt: "{brand} vs {competitor}", priority: "high", reason: "Comparison queries drive 40% of competitor traffic" },
      { prompt: "how to {use_case} with AI", priority: "medium", reason: "Growing long-tail opportunity" },
    ],
    contentGaps: [
      { topic: "Enterprise AI integration guide", reasonNeeded: "No existing content targeting IT decision makers", expectedImpact: "High" },
      { topic: "AI ROI calculator case study", reasonNeeded: "Competitors dominate comparison content", expectedImpact: "Medium" },
    ],
    entityCoverage: [
      { entity: "Brand name", covered: true, recommendation: "Maintain current coverage" },
      { entity: "Founder/CEO", covered: false, recommendation: "Create Wikipedia entry and LinkedIn optimization" },
      { entity: "Key product features", covered: true, recommendation: "Add more specific feature pages" },
    ],
    citationAnalysis: [
      { source: sources[0], citationFrequency: 3, authority: "Medium", recommendation: "Contribute guest posts to increase citations" },
      { source: sources[1], citationFrequency: 1, authority: "High", recommendation: "Pursue product review opportunity" },
    ],
    citationOpportunities: [
      { website: sources[2], reason: "Publishes annual industry reports", difficulty: "Medium", expectedImpact: "High" },
      { website: sources[3], reason: "Top review platform for SaaS", difficulty: "Low", expectedImpact: "Medium" },
    ],
    contentRecommendations: [
      { title: "The Ultimate Guide to AI-Powered {use_case}", searchIntent: "Informational", geoIntent: "AI tool comparison", targetEngine: "ChatGPT", expectedVisibilityGain: "+25%" },
      { title: "{brand} vs Competitors: 2026 Comparison", searchIntent: "Commercial", geoIntent: "Brand vs competitor queries", targetEngine: "All", expectedVisibilityGain: "+40%" },
    ],
    comparisonPages: [
      { title: "{brand} vs {competitor}", whyImportant: "Users frequently compare these two tools", impactScore: 85 },
    ],
    faqRecommendations: [
      { question: "How does {brand} compare to {competitor}?", type: "Comparison", priority: "High" },
      { question: "What is the pricing for {brand}?", type: "Transactional", priority: "Medium" },
    ],
    authorityBuildingPlan: [
      { tactic: "Publish original research on AI industry trends", description: "Original data gets cited by AI engines", priority: "High" },
      { tactic: "Get listed in 5 industry-specific directories", description: "Builds citation authority", priority: "Medium" },
    ],
    aiSearchChecklist: [
      { item: "Structured data implementation", status: "In Progress", fix: "Complete JSON-LD for all product pages" },
      { item: "FAQ schema on key pages", status: "Not Started", fix: "Add FAQ schema to top 10 landing pages" },
    ],
    scoredRecommendations: [
      { title: "Implement FAQ Schema", impactScore: 90, difficulty: 20, priority: 95, expectedVisibilityGain: "+30%" },
      { title: "Create competitor comparison pages", impactScore: 85, difficulty: 40, priority: 80, expectedVisibilityGain: "+25%" },
      { title: "Build citation backlinks", impactScore: 75, difficulty: 60, priority: 60, expectedVisibilityGain: "+20%" },
    ],
    weekPlan: [
      { week: 1, tasks: ["Add FAQ schema to top 5 pages", "Create comparison page outline", "Identify 3 citation opportunities"] },
      { week: 2, tasks: ["Publish comparison page", "Reach out to 3 publishers", "Implement structured data fixes"] },
      { week: 3, tasks: ["Create industry report draft", "Update entity coverage", "Monitor AI visibility changes"] },
      { week: 4, tasks: ["Publish industry report", "Review and adjust strategy", "Plan next month priorities"] },
    ],
    quickWins: [
      { action: "Add FAQ schema to pricing page", timeframe: "2 hours" },
      { action: "Fix missing meta descriptions on blog", timeframe: "1 hour" },
      { action: "Update LinkedIn company page", timeframe: "30 min" },
    ],
    highImpactOpportunities: [
      { opportunity: "Publish original research report", projectedGain: "+50% citation growth" },
      { opportunity: "Create interactive comparison tool", projectedGain: "+35% engagement" },
    ],
    executiveRoadmap: [
      { phase: "Now", items: ["Implement quick wins", "Fix structured data gaps"], expectedGain: "+15% in 30 days" },
      { phase: "Next", items: ["Publish comparison pages", "Build citation relationships"], expectedGain: "+30% in 60 days" },
      { phase: "Future", items: ["Launch industry report", "Scale content program"], expectedGain: "+50% in 90 days" },
    ],
  })
}

export function getMockResponse(provider: string, prompt: string): MockResponse {
  if (prompt.includes("GEO (Generative Engine Optimization) Consultant")) {
    const text = generateGeoMockResponse()
    return {
      responseText: text,
      rawResponse: {
        provider,
        model: (provider === "openai" ? "gpt-4o"
          : provider === "gemini" ? "gemini-2.0-flash"
          : "sonar-pro") as string,
        object: "chat.completion",
        choices: [{ message: { role: "assistant", content: text } }],
        usage: { prompt_tokens: 1200, completion_tokens: 800, total_tokens: 2000 },
      },
    }
  }
  const useRanked = Math.random() > 0.4
  const text = useRanked ? generateRankedResponse(prompt) : generateNarrativeResponse(prompt)

  return {
    responseText: text,
    rawResponse: {
      provider,
      model: (provider === "openai" ? "gpt-4o"
        : provider === "gemini" ? "gemini-2.0-flash"
        : "sonar-pro") as string,
      object: "chat.completion",
      choices: [{ message: { role: "assistant", content: text } }],
      usage: {
        prompt_tokens: 45 + prompt.length / 4,
        completion_tokens: text.split(" ").length,
        total_tokens: 45 + prompt.length / 4 + text.split(" ").length,
      },
    },
  }
}

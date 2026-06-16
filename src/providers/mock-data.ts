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

export function getMockResponse(provider: string, prompt: string): MockResponse {
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

import { prisma } from "@/lib/prisma"
import { createManyRecommendations } from "@/repositories/recommendation-repository"
import { findLatestGeoScore, findGeoScoreTrend } from "@/repositories/geo-score-repository"

interface RecInput {
  type: string
  priority: string
  title: string
  description: string
  category: string
  impact: string
  projectId: string
}

interface ProjectInfo {
  id: string
  brandName: string
  competitors: { name: string; domain: string }[]
  keywords: { id: string; keyword: string }[]
}

export async function generateRecommendations(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true, keywords: true },
  })
  if (!project) throw new Error(`Project ${projectId} not found`)

  const recommendations: RecInput[] = []

  const contentGaps = await detectContentGaps(project)
  recommendations.push(...contentGaps)

  const citationGaps = await detectCitationGaps(project)
  recommendations.push(...citationGaps)

  const visibilityGaps = await detectVisibilityGaps(project)
  recommendations.push(...visibilityGaps)

  const sentimentIssues = await detectSentimentIssues(project)
  recommendations.push(...sentimentIssues)

  const geoScoreRecs = await detectGeoScoreGaps(project)
  recommendations.push(...geoScoreRecs)

  if (recommendations.length > 0) {
    await createManyRecommendations(recommendations)
  }

  return recommendations.length
}

async function detectContentGaps(project: ProjectInfo) {
  const recs: RecInput[] = []

  const mentionData = await prisma.mention.groupBy({
    by: ["brandName"],
    where: { run: { job: { projectId: project.id } } },
    _count: { brandName: true },
  })

  const brandMentions = mentionData.find((m) => m.brandName === project.brandName)?._count.brandName ?? 0

  const compMentionMap = new Map<string, number>()
  for (const comp of project.competitors) {
    const count = mentionData.find((m) => m.brandName === comp.name)?._count.brandName ?? 0
    if (count > 0) compMentionMap.set(comp.name, count)
  }

  for (const [compName, compMentions] of compMentionMap) {
    const gap = compMentions - brandMentions

    if (gap > 2) {
      recs.push({
        type: "content_gap",
        priority: "high",
        title: `Create comparison and "vs" content against ${compName}`,
        description:
          `${compName} is mentioned ${compMentions}x vs your brand's ${brandMentions}x in AI responses — a gap of ${gap} mentions. Build a dedicated landing page comparing your solution to ${compName} with feature tables, pricing, use cases, and testimonials. Publish as a "YourBrand vs ${compName}" page with FAQ schema targeting long-tail comparison queries like "${project.brandName} alternative", "${project.brandName} versus ${compName}". Promote via LinkedIn, relevant subreddits, and industry Slack communities.`,
        category: "content",
        impact: `Could capture ${Math.round(gap * 1.5)}+ additional mentions by ranking for comparison queries`,
        projectId: project.id,
      })
    }

    if (gap > 5) {
      recs.push({
        type: "content_gap",
        priority: "high",
        title: `Write targeted blog content for keywords where ${compName} dominates`,
        description:
          `${compName} leads by ${gap} mentions. Analyze overlapping keywords from your tracking list and create pillar pages for each cluster. Each pillar should include: a definitive guide (2000+ words), embedded FAQ schema, expert quotes or case study callouts, internal links to product pages, and a content upgrade (PDF download). Target featured snippets by including direct answers in H2 sections.`,
        category: "content",
        impact: "Targets 3-5 keyword clusters to close the content gap",
        projectId: project.id,
      })
    }
  }

  const responseKeywordData = await prisma.providerResponse.findMany({
    where: { run: { job: { projectId: project.id } }, status: "success" },
    select: {
      prompt: { select: { keyword: { select: { keyword: true } } } },
      mentions: { select: { brandName: true } },
    },
  })

  const keywordBrandSet = new Map<string, Set<string>>()
  for (const r of responseKeywordData) {
    const kw = r.prompt.keyword.keyword
    for (const m of r.mentions) {
      if (!keywordBrandSet.has(kw)) keywordBrandSet.set(kw, new Set())
      keywordBrandSet.get(kw)!.add(m.brandName)
    }
  }

  const missingKeywords = project.keywords.filter((k) => {
    const brands = keywordBrandSet.get(k.keyword)
    return !brands?.has(project.brandName)
  })

  if (missingKeywords.length > 0) {
    const topKeywords = missingKeywords.slice(0, 5)
    recs.push({
      type: "content_gap",
      priority: "high",
      title: `Create content for ${missingKeywords.length} keywords where your brand is absent`,
      description:
        `Your brand is not mentioned for ${missingKeywords.length} out of ${project.keywords.length} tracked keywords (${Math.round((missingKeywords.length / project.keywords.length) * 100)}% miss rate). Prioritize: "${topKeywords.map((k) => k.keyword).join('", "')}". For each keyword, create: a dedicated blog post or landing page with the keyword in the H1, a clear definition or explanation in the first 100 words, structured data (FAQPage or HowTo schema), internal links from your highest-authority page, and external backlinks from guest posts or resource pages using the keyword as anchor text.`,
      category: "content",
      impact: `Targeting these could improve visibility score by ${Math.round((missingKeywords.length / project.keywords.length) * 40)}%`,
      projectId: project.id,
    })
  }

  if (project.keywords.length < 10) {
    recs.push({
      type: "content_gap",
      priority: "medium",
      title: "Expand keyword coverage to 20+ terms",
      description:
        `Only ${project.keywords.length} keywords tracked. Building a broader keyword set (20-50 terms across your domain) lets you identify more content opportunities. Group keywords into topic clusters: core product terms (5-10), industry/comparison terms (5-10), long-tail question terms (5-15), and emerging trend terms (5-15). Use tools like Ahrefs, Semrush, or Google Search Console to find terms where competitors rank but you don't.`,
      category: "content",
      impact: "Broader tracking enables more content gap detections and higher overall visibility",
      projectId: project.id,
    })
  }

  const promptCount = await prisma.prompt.count({
    where: { keyword: { projectId: project.id } },
  })

  if (project.keywords.length > 0 && promptCount === 0) {
    recs.push({
      type: "content_gap",
      priority: "high",
      title: "Generate prompts for your keywords",
      description:
        `${project.keywords.length} keywords are added but no prompts exist — the monitoring system cannot check visibility yet. Open the Monitoring page and click "Generate Prompts" to create AI queries for each keyword. Each keyword generates prompts for each configured AI provider (OpenAI, Gemini, Perplexity). Without prompts, all visibility metrics and GEO scoring will show zero data.`,
      category: "content",
      impact: "Required — without prompts, visibility tracking does not function",
      projectId: project.id,
    })
  }

  return recs
}

async function detectCitationGaps(project: ProjectInfo) {
  const recs: RecInput[] = []

  const citationData = await prisma.citation.findMany({
    where: { run: { job: { projectId: project.id } } },
    select: { domain: true, response: { select: { mentions: { select: { brandName: true } } } } },
  })

  const brandDomains = new Set(
    citationData
      .filter((c) => c.response.mentions.some((m) => m.brandName === project.brandName))
      .map((c) => c.domain)
  )

  const competitorDomains = new Map<string, Set<string>>()
  for (const comp of project.competitors) {
    const domains = citationData
      .filter((c) => c.response.mentions.some((m) => m.brandName === comp.name))
      .map((c) => c.domain)
    if (domains.length > 0) competitorDomains.set(comp.name, new Set(domains))
  }

  for (const [compName, domains] of competitorDomains) {
    const uniqueDomains = [...domains].filter((d) => !brandDomains.has(d))
    if (uniqueDomains.length >= 1) {
      const topDomains = uniqueDomains.slice(0, 5)
      recs.push({
        type: "citation_gap",
        priority: "medium",
        title: `Earn citations from ${uniqueDomains.length} sites linking to ${compName}`,
        description:
          `Competitor ${compName} is cited on ${uniqueDomains.length} domains where your brand has zero presence. Target domains: ${topDomains.join(", ")}. Action plan: 1) Reach out to each site with a guest post or resource page suggestion. 2) For .edu or .gov domains, offer expert quotes or data contributions. 3) For industry blogs, propose a comparison or thought leadership piece featuring your brand. 4) Track progress with follow-up emails at day 3, day 10, and day 30.`,
        category: "citations",
        impact: `Each new domain citation improves citation score by 3-8 points`,
        projectId: project.id,
      })
    }
  }

  const totalCitations = citationData.length

  if (totalCitations < 5) {
    recs.push({
      type: "citation_gap",
      priority: "high",
      title: "Build a backlink acquisition strategy (only ${totalCitations} citations found)",
      description:
        `Only ${totalCitations} citation domains detected — this is very low for competitive visibility. Immediate steps: 1) Claim and verify listings on Google Business Profile, Crunchbase, G2, Capterra, and product hunt. 2) Publish 2-3 authoritative guest posts on industry blogs (Smashing Magazine, CSS-Tricks, industry-specific publications). 3) Submit to relevant startup directories and "best of" lists. 4) Create a "resources" or "tools" page on your site that others naturally link to. 5) Monitor HARO/Connectively for journalist queries in your space.`,
      category: "citations",
      impact: "Directly raises citation sub-score — critical for GEO Score improvement",
      projectId: project.id,
    })
  }

  if (totalCitations >= 5 && totalCitations < 20) {
    recs.push({
      type: "citation_gap",
      priority: "medium",
      title: "Scale citation building from ${totalCitations} to 50+ domains",
      description:
        `${totalCitations} citation domains is a decent start. To reach 50+: 1) Create 3-5 piece of data-backed original research (surveys, industry reports, benchmarks) that journalists will cite. 2) Build relationships with 10+ journalists on HARO/Connectively and PitchWell. 3) Syndicate blog posts to Medium, Dev.to, and LinkedIn Articles with canonical tags. 4) Convert your best content into PDF guides and distribute to educational sites. 5) Sponsor an open-source project or community event for a .org backlink.`,
      category: "citations",
      impact: "Moving from 20 to 50+ citations could double the citation sub-score",
      projectId: project.id,
    })
  }

  const allDomains = citationData.map((c) => c.domain)
  const domainCounts = new Map<string, number>()
  for (const d of allDomains) {
    domainCounts.set(d, (domainCounts.get(d) ?? 0) + 1)
  }
  const lowAuthorityDomains = [...domainCounts.entries()].filter(([, count]) => count < 3)

  if (lowAuthorityDomains.length > 0 && totalCitations > 5) {
    recs.push({
      type: "citation_gap",
      priority: "low",
      title: "Diversify citation sources beyond current ${lowAuthorityDomains.length} low-frequency domains",
      description:
        `${lowAuthorityDomains.length} of your citation domains appear only 1-2 times. While any citation helps, AI models weigh sustained signals from authoritative domains more heavily. Prioritize getting multiple citations from top-tier domains. Action: identify your 5 highest-authority customers and create detailed case studies with their logos on your site; they're more likely to link to you naturally.`,
      category: "citations",
      impact: "Builds citation depth and authority trust signals",
      projectId: project.id,
    })
  }

  return recs
}

async function detectVisibilityGaps(project: ProjectInfo) {
  const recs: RecInput[] = []

  const providerData = await prisma.providerResponse.findMany({
    where: { run: { job: { projectId: project.id } }, status: "success" },
    select: { provider: true, mentions: { select: { brandName: true } } },
  })

  const providersWithBrand = new Set(
    providerData
      .filter((r) => r.mentions.some((m) => m.brandName === project.brandName))
      .map((r) => r.provider)
  )

  const allProviders = [...new Set(providerData.map((r) => r.provider))]

  const providerPrescriptions: Record<string, { steps: string; reason: string }> = {
    openai: {
      steps: "1) Add JSON-LD structured data (Organization, Product, FAQPage, Article schemas) to your site. 2) Create a Wikipedia or Wikidata entry for your brand. 3) Get mentioned on high-authority publisher sites (TechCrunch, Forbes, industry publications). 4) Ensure your Crunchbase, G2, and Capterra profiles are complete and verified. 5) Publish content that answers common questions clearly — ChatGPT training data heavily weights clear, direct answers.",
      reason: "OpenAI relies heavily on structured data, Wikipedia presence, and authoritative publisher citations for entity recognition.",
    },
    gemini: {
      steps: "1) Optimize for Google's Knowledge Graph by claiming your Google Knowledge Panel. 2) Ensure your Google Business Profile is fully filled out with categories, products, services, and posts. 3) Build topical authority through Google-friendly content clusters with clear internal linking. 4) Get .edu and .gov backlinks — Gemini gives them higher weight. 5) Use descriptive, schema-rich image alt text and captions for brand mentions.",
      reason: "Gemini is deeply connected to Google's ecosystem — Knowledge Graph presence and strong traditional SEO signals drive visibility.",
    },
    perplexity: {
      steps: "1) Get cited in academic papers, research reports, and well-cited blog posts. 2) Create a comprehensive FAQ page that directly answers questions in your domain. 3) Publish original data and research — Perplexity prioritizes cited sources with original data. 4) Be active on Reddit and Quora providing helpful answers that link to your content. 5) Ensure Wikipedia mentions since Perplexity frequently cites Wikipedia as a grounding source.",
      reason: "Perplexity focuses on cited, verifiable sources — academic citations, original research, and Wikipedia carry the most weight.",
    },
  }

  for (const provider of allProviders) {
    if (!providersWithBrand.has(provider)) {
      const p = providerPrescriptions[provider] ?? {
        steps: "Build brand authority through guest posting, PR coverage, and structured data implementation across your site.",
        reason: "General best practices for AI model visibility.",
      }
      recs.push({
        type: "visibility_gap",
        priority: "critical",
        title: `Your brand is invisible on ${provider.charAt(0).toUpperCase() + provider.slice(1)} — zero mentions detected`,
        description:
          `Your brand was not mentioned in any ${provider} responses despite tracking ${project.keywords.length} keywords. ${p.reason} Recommended actions: ${p.steps}`,
        category: "seo",
        impact: `Unlocks visibility across all keywords on ${provider} — the highest-impact single action you can take`,
        projectId: project.id,
      })
    }
  }

  const presentProviders = allProviders.filter((p) => providersWithBrand.has(p))
  if (presentProviders.length > 0 && presentProviders.length < allProviders.length) {
    const missing = allProviders.filter((p) => !providersWithBrand.has(p))
    recs.push({
      type: "visibility_gap",
      priority: "high",
      title: `Bridge visibility gap: present on ${presentProviders.length}/${allProviders.length} AI platforms`,
      description:
        `Your brand appears on ${presentProviders.join(", ")} but is missing from ${missing.join(", ")}. Multi-platform presence compounds visibility — appearing on 3+ platforms creates an "omnipresence" signal that AI models reinforce. Prioritize ${missing[0]} first using the platform-specific strategy outlined in our recommendations. After establishing presence on ${missing[0]}, monitor for 2-3 scan cycles before moving to the next platform.`,
      category: "seo",
      impact: "Omnipresence across AI platforms can compound GEO Score gains by up to 30%",
      projectId: project.id,
    })
  }

  const metrics = await prisma.visibilityMetric.findMany({
    where: { projectId: project.id },
    orderBy: { periodStart: "desc" },
    take: 20,
  })

  const latestPeriod = metrics[0]?.periodStart
  if (latestPeriod) {
    const periodMetrics = metrics.filter(
      (m) => m.periodStart.getTime() === latestPeriod.getTime()
    )

    for (const comp of project.competitors) {
      const compMetric = periodMetrics.find((m) => m.brandName === comp.name)
      const brandMetric = periodMetrics.find((m) => m.brandName === project.brandName)

      if (compMetric && brandMetric && compMetric.mentionRate > brandMetric.mentionRate * 1.5) {
        recs.push({
          type: "visibility_gap",
          priority: "high",
          title: `Close ${comp.name}'s ${Math.round((compMetric.mentionRate - brandMetric.mentionRate) * 100)}% visibility advantage`,
          description:
            `${comp.name} has a ${(compMetric.mentionRate * 100).toFixed(0)}% mention rate vs your ${(brandMetric.mentionRate * 100).toFixed(0)}% — a ${Math.round((compMetric.mentionRate - brandMetric.mentionRate) * 100)} percentage point gap. Action plan: 1) Identify the 3-5 keywords where ${comp.name} appears most frequently vs your brand. 2) For each keyword, create a better, more comprehensive page with video embeds, data visualizations, and expert quotes. 3) Reach out to 5-10 sites that link to ${comp.name}'s content and suggest your resource as an alternative or supplement. 4) Add internal links from your highest-traffic pages to these new pages.`,
          category: "positioning",
          impact: `Could close the mention rate gap and improve GEO Score by 5-10 points`,
          projectId: project.id,
        })
      }
    }

    if (project.competitors.length === 0) {
      recs.push({
        type: "visibility_gap",
        priority: "medium",
        title: "Add competitors to unlock competitive benchmarking",
        description:
          "No competitors are tracked for this project. Adding 3-5 key competitors unlocks: comparative visibility analysis, citation gap detection (finding domains that cite competitors but not you), competitive keyword gap analysis, and relative GEO Score positioning. Start by adding your most direct market competitors. Good candidates: companies that rank for the same keywords, appear in the same comparison articles, or have similar product offerings.",
        category: "positioning",
        impact: "Essential for meaningful gap analysis — enables most other recommendation types",
        projectId: project.id,
      })
    }

    if (project.competitors.length > 0 && project.keywords.length > 5) {
      recs.push({
        type: "visibility_gap",
        priority: "low",
        title: "Set up share-of-voice tracking for weekly competitive monitoring",
        description:
          "Consider establishing a weekly share-of-voice report comparing your brand's mention count and sentiment against each competitor across all tracked keywords. This lets you spot trends early — if a competitor's mention rate jumps 20% in a week, investigate what content or PR move drove the change and adapt your strategy. Track: mention count, average position, sentiment score, and citation domain count for each brand per period.",
        category: "positioning",
        impact: "Proactive monitoring prevents unexpected visibility losses",
        projectId: project.id,
      })
    }
  }

  return recs
}

async function detectSentimentIssues(project: ProjectInfo) {
  const recs: RecInput[] = []

  const sentimentData = await prisma.sentimentResult.findMany({
    where: { run: { job: { projectId: project.id } }, brandName: project.brandName },
    include: { response: { select: { prompt: { select: { keyword: { select: { keyword: true } } } } } } },
  })

  if (sentimentData.length === 0) {
    recs.push({
      type: "sentiment",
      priority: "medium",
      title: "Collect sentiment data to enable brand perception tracking",
      description:
        "No sentiment data has been collected yet. Run a monitoring scan to gather AI provider responses, then run parsing to extract mentions and sentiment. At least 10-15 sentiment data points are needed for meaningful analysis. Once collected, this recommendation engine will detect negative sentiment patterns and suggest remediation actions.",
      category: "positioning",
      impact: "Enables sentiment-based recommendations and improves GEO Score accuracy",
      projectId: project.id,
    })
    return recs
  }

  const negativeEntries = sentimentData.filter((s) => s.label === "negative")
  const negativeCount = negativeEntries.length
  const negativeRatio = negativeCount / sentimentData.length

  if (negativeRatio > 0.25) {
    const negativeKeywords = [...new Set(negativeEntries.map((s) => s.response.prompt.keyword.keyword))]
    recs.push({
      type: "sentiment",
      priority: "critical",
      title: "Critical: ${negativeCount} negative sentiment signals detected (${Math.round(negativeRatio * 100)}%)",
      description:
        `${negativeCount} out of ${sentimentData.length} AI responses mention your brand negatively (${(negativeRatio * 100).toFixed(0)}%). Keywords driving negative sentiment: "${negativeKeywords.slice(0, 5).join('", "')}". Immediate actions: 1) For each negative keyword, audit the AI responses to understand the criticism theme. 2) Create content that directly addresses the criticism — e.g., if negative mentions cite poor customer support, publish a "24/7 support" case study or support SLA page. 3) Add FAQ schema answering the criticism directly (e.g., "Is X secure?" with a detailed security response). 4) Build positive brand mentions on authoritative sites through PR and guest posts. 5) Monitor sentiment changes after each content publish — improvements should appear within 2-3 scan cycles.`,
      category: "positioning",
      impact: "Reducing negative sentiment from ${Math.round(negativeRatio * 100)}% to under 10% could improve sentiment sub-score by 20-30 points",
      projectId: project.id,
    })
  }

  const labelCounts = {
    positive: sentimentData.filter((s) => s.label === "positive").length,
    neutral: sentimentData.filter((s) => s.label === "neutral").length,
    negative: negativeCount,
  }

  if (labelCounts.neutral > labelCounts.positive && labelCounts.neutral > labelCounts.negative && sentimentData.length > 5) {
    recs.push({
      type: "sentiment",
      priority: "medium",
      title: "Shift neutral sentiment to positive with testimonial and case study pages",
      description:
        `Neutral sentiment dominates (${labelCounts.neutral} of ${sentimentData.length} responses). AI models often default to neutral when they lack strong positive signals. Actions: 1) Create a dedicated testimonials page with 10+ customer quotes, each tagged to specific keywords. 2) Build in-depth case study pages (600+ words each) with measurable results — "Client X achieved Y% improvement using our solution". 3) Add review schema (Review markup) to testimonial pages. 4) Submit to G2, Capterra, and TrustRadius to generate structured review data that AI models can reference. 5) Publish "year in review" or "customer success" annual reports.`,
      category: "content",
      impact: "Converting neutral to positive mentions can add 10-15 points to the sentiment sub-score",
      projectId: project.id,
    })
  }

  const avgScore = sentimentData.reduce((s, r) => s + r.score, 0) / sentimentData.length

  if (avgScore < -0.1 && sentimentData.length > 3) {
    recs.push({
      type: "sentiment",
      priority: "critical",
      title: "Overall brand sentiment is negative — urgent remediation needed",
      description:
        `The average sentiment score is ${avgScore.toFixed(2)} on a -1 to +1 scale, indicating predominantly negative brand perception in AI responses. This is the most critical metric to improve. Create a 90-day remediation plan: Month 1 — Audit all negative mentions and categorize issues (product, support, pricing, etc.). Publish direct response content for each category. Month 2 — Launch a PR campaign with 3-5 authoritative placements emphasizing your strengths. Month 3 — Re-run full monitoring scan and measure sentiment improvement. Target: move average score above +0.2 within 90 days.`,
      category: "positioning",
      impact: "Critical — negative overall sentiment undermines all other GEO Score components",
      projectId: project.id,
    })
  }

  if (labelCounts.positive > labelCounts.negative * 3 && labelCounts.positive > 5) {
    recs.push({
      type: "sentiment",
      priority: "low",
      title: "Leverage positive brand sentiment with social proof content",
      description:
        `Your brand has predominantly positive sentiment (${labelCounts.positive} positive, ${labelCounts.neutral} neutral, ${labelCounts.negative} negative). Supercharge this advantage: 1) Create a "press and mentions" page aggregating all positive citations. 2) Add "as featured on" badges to your homepage and product pages. 3) Use positive AI snippets in your marketing materials (with attribution). 4) Build a "why choose us" landing page that quotes positive AI responses alongside customer reviews. 5) Monitor for any sentiment shifts monthly — positive momentum can reverse quickly.`,
      category: "content",
      impact: "Compounds existing positive sentiment into marketing assets and further brand authority",
      projectId: project.id,
    })
  }

  return recs
}

async function detectGeoScoreGaps(project: ProjectInfo) {
  const recs: RecInput[] = []

  const geoScore = await findLatestGeoScore(project.id)
  if (!geoScore) {
    recs.push({
      type: "visibility_gap",
      priority: "high",
      title: "Generate your first GEO Score by running a monitoring scan",
      description:
        "No GEO Score has been calculated yet. Go to the Monitoring page and run a scan for this project. The GEO Score is calculated after visibility metrics are collected — it requires mention data, citation data, and sentiment data from at least one completed scan cycle. After the scan completes, the score will appear on the project detail page along with sub-scores for visibility, position, citation, and sentiment.",
      category: "positioning",
      impact: "GEO Score is the central KPI for your AI visibility — required for all other scoring-based recommendations",
      projectId: project.id,
    })
    return recs
  }

  const subScores = [
    { name: "Visibility", score: geoScore.visibilityScore, weight: 40, description: "Measures how often your brand is mentioned relative to the maximum observed mention rate" },
    { name: "Position", score: geoScore.positionScore, weight: 25, description: "Measures the average ranking position of your brand in AI responses" },
    { name: "Citation", score: geoScore.citationScore, weight: 25, description: "Measures the breadth and authority of domains that cite your brand" },
    { name: "Sentiment", score: geoScore.sentimentScore, weight: 10, description: "Measures the positivity/negativity of AI responses mentioning your brand" },
  ]

  const totalScore = geoScore.score
  const sortedByScore = [...subScores].sort((a, b) => a.score - b.score)

  if (totalScore < 40) {
    recs.push({
      type: "visibility_gap",
      priority: "critical",
      title: "GEO Score critical (${totalScore}/100) — prioritize all sub-scores for a 90-day recovery",
      description:
        `Your overall GEO Score is ${totalScore}/100, placing you in the critical zone. Sub-score breakdown: ${sortedByScore.map((s) => `${s.name}: ${s.score}/100 (${s.weight}% weight)`).join(", ")}. ${sortedByScore[0].name} is your weakest area at ${sortedByScore[0].score}/100. 90-day plan: Days 1-30 — focus exclusively on the lowest sub-score. Days 31-60 — address the second-lowest sub-score while maintaining gains. Days 61-90 — optimize all sub-scores together. Each sub-score improved by 20 points would raise your overall GEO Score by ${sortedByScore.map((s) => Math.round(20 * s.weight / 100)).join("+")} points respectively.`,
      category: "positioning",
      impact: "Moving from critical (<40) to acceptable (40-70) doubles your AI visibility potential",
      projectId: project.id,
    })
  } else if (totalScore < 70) {
    recs.push({
      type: "visibility_gap",
      priority: "high",
      title: "GEO Score is ${totalScore}/100 (moderate) — focus on ${sortedByScore[0].name} for the fastest gains",
      description:
        `Your GEO Score of ${totalScore}/100 is in the moderate range (40-70). ${sortedByScore[0].name} is dragging it down at ${sortedByScore[0].score}/100 (weight: ${sortedByScore[0].weight}%). Improving ${sortedByScore[0].name} by 15 points would add ~${Math.round(15 * sortedByScore[0].weight / 100)} points to your overall score. Quarter plan: Q1 focus — ${sortedByScore[0].name} improvement through targeted actions. Q2 focus — ${sortedByScore[1].name} improvement while maintaining ${sortedByScore[0].name} gains. End-of-quarter target: reach 70+ overall GEO Score.`,
      category: "positioning",
      impact: "Each 10-point improvement in the lowest sub-score raises overall GEO Score by ${(sortedByScore[0].weight / 10).toFixed(1)} points",
      projectId: project.id,
    })
  } else {
    recs.push({
      type: "visibility_gap",
      priority: "low",
      title: "GEO Score ${totalScore}/100 — maintain and defend your strong position",
      description:
        `Your GEO Score of ${totalScore}/100 is in the strong range (>70). Sustaining this requires: 1) Weekly monitoring scans to catch any sudden drops. 2) Monthly competitive re-assessment — competitors may close the gap. 3) Continuous content expansion into new keyword areas. 4) Proactive citation building from new authority domains. 5) Sentiment monitoring to catch negative shifts early. Consider setting up automated email alerts for any sub-score drop of more than 5 points between scan cycles.`,
      category: "positioning",
      impact: "Defending a strong GEO Score is easier than recovering a declining one — vigilance is key",
      projectId: project.id,
    })
  }

  for (const sub of sortedByScore) {
    if (sub.score >= 70) continue
    const priority = sub.score < 40 ? "critical" : sub.score < 60 ? "high" : "medium"

    const subActions: Record<string, string> = {
      Visibility:
        `Your Visibility sub-score is ${sub.score}/100 (weight: ${sub.weight}%). To improve: 1) Create content for keywords where your brand is absent (check content gap recommendations above). 2) Increase content volume for tracked keywords — aim for 2-3 pieces per keyword cluster. 3) Build topical authority by interlinking related content. 4) Get mentioned on higher-authority domains — target sites your competitors are cited on. 5) Add structured data (Organization, WebSite, Article schema) to every page.`,
      Position:
        `Your Position sub-score is ${sub.score}/100 (weight: ${sub.weight}%). AI position is determined by citation authority and content comprehensiveness. To improve: 1) Target featured snippets for key queries — write concise, directly-answerable content under H2 headings. 2) Build more .edu and .gov citations — AI models weight these heavily. 3) Improve page load speed and Core Web Vitals — faster pages tend to rank better in AI responses. 4) Create Wikipedia-style definitive pages for your core topics. 5) Ensure your brand appears in reputable "best of" and comparison roundups.`,
      Citation:
        `Your Citation sub-score is ${sub.score}/100 (weight: ${sub.weight}%). Citations are the strongest trust signal for AI models. To improve: 1) Focus on the citation gap recommendations above — specifically targeting domains where competitors are cited but you aren't. 2) Create linkable assets: original research, free tools, comprehensive guides. 3) Guest post on 5-10 industry blogs with authoritative backlinks. 4) Get listed in relevant "best X tools" articles on sites like G2, Capterra, and product hunt. 5) Monitor newly published industry reports and offer to contribute data or quotes.`,
      Sentiment:
        `Your Sentiment sub-score is ${sub.score}/100 (weight: ${sub.weight}%). While sentiment has the lowest weight, it can disproportionately affect overall perception. To improve: 1) Address any negative mention themes directly (see sentiment recommendations above). 2) Publish customer success stories and case studies. 3) Get positive reviews on G2, Capterra, and TrustRadius. 4) Create an "about us" page that clearly communicates your mission, values, and team expertise. 5) Engage with community discussions (Reddit, Hacker News, LinkedIn) to build positive brand associations.`,
    }

    recs.push({
      type: "visibility_gap",
      priority,
      title: `Boost ${sub.name} sub-score from ${sub.score}/100 — targeted action plan`,
      description: `Lowest GEO sub-score: ${sub.name} at ${sub.score}/100 (weight: ${sub.weight}%). ${subActions[sub.name] ?? sub.description}`,
      category: sub.name === "Visibility" ? "content" : sub.name === "Citation" ? "citations" : "positioning",
      impact: `Raising ${sub.name} to 60+ could increase overall GEO Score by ${Math.round(Math.max(5, (60 - sub.score) * sub.weight / 100))}+ points`,
      projectId: project.id,
    })
  }

  const trend = await findGeoScoreTrend(project.id, 60)
  if (trend.length >= 3) {
    const recent = trend.slice(-3)
    const declining = recent.every((s, i) => i === 0 || s.score <= recent[i - 1].score)

    if (declining && recent.length === 3) {
      const drop = recent[0].score - recent[recent.length - 1].score
      recs.push({
        type: "visibility_gap",
        priority: "critical",
        title: `GEO Score declining — dropped ${drop.toFixed(1)} points over ${trend.length} periods`,
        description:
          `Your GEO Score has declined ${drop.toFixed(1)} points over the last ${trend.length} scan periods${trend.length > 5 ? ` (from ${trend[0].score.toFixed(0)} to ${recent[recent.length - 1].score.toFixed(0)})` : ""}. Common causes: 1) A competitor launched new content or PR campaigns. 2) Your brand lost citations from key domains. 3) New negative sentiment emerged. Urgent actions: 1) Review what changed between the peak and current period — check monitoring results for new competitor mentions. 2) Re-publish and update your best-performing content. 3) Launch a mini-PR push (2-3 guest posts or press mentions) this week. 4) Increase monitoring frequency to daily for the next 7 days to catch the trend in real-time.`,
        category: "positioning",
        impact: "Each period of decline compounds — act within 2 scan cycles to reverse the trend",
        projectId: project.id,
      })
    }

    if (trend.length >= 5) {
      const firstHalf = trend.slice(0, Math.floor(trend.length / 2))
      const secondHalf = trend.slice(Math.floor(trend.length / 2))
      const firstAvg = firstHalf.reduce((s, x) => s + x.score, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((s, x) => s + x.score, 0) / secondHalf.length
      const improvement = secondAvg - firstAvg

      if (improvement > 5) {
        recs.push({
          type: "visibility_gap",
          priority: "low",
          title: `GEO Score trending up (+${improvement.toFixed(1)} points) — double down on what works`,
          description:
            `Your GEO Score has improved by ${improvement.toFixed(1)} points on average (from ${firstAvg.toFixed(0)} to ${secondAvg.toFixed(0)}). Analyze which actions drove this improvement — was it new content, acquired citations, or PR coverage? Replicate the winning strategy across other keywords and competitors. Consider increasing investment in the channels that moved the needle. Also check if competitors have responded — they may try to counter-campaign.`,
          category: "positioning",
          impact: "Amplify winning strategies to accelerate growth further",
          projectId: project.id,
        })
      }
    }
  }

  const keywordPosData = await prisma.providerResponse.findMany({
    where: { run: { job: { projectId: project.id } }, status: "success" },
    select: {
      prompt: { select: { keyword: { select: { keyword: true } } } },
      mentions: { select: { brandName: true, position: true } },
    },
  })

  const brandKeywordPositions = new Map<string, number[]>()
  for (const r of keywordPosData) {
    const kw = r.prompt.keyword.keyword
    for (const m of r.mentions) {
      if (m.brandName === project.brandName && m.position != null) {
        const arr = brandKeywordPositions.get(kw) ?? []
        arr.push(m.position)
        brandKeywordPositions.set(kw, arr)
      }
    }
  }

  const lowRankingKeywords = [...brandKeywordPositions.entries()]
    .map(([k, positions]) => ({ keyword: k, avgPos: positions.reduce((a, b) => a + b, 0) / positions.length }))
    .filter((x) => x.avgPos > 8)
    .sort((a, b) => b.avgPos - a.avgPos)
    .slice(0, 5)

  if (lowRankingKeywords.length > 0) {
    recs.push({
      type: "content_gap",
      priority: "high",
      title: `Improve AI ranking position for ${lowRankingKeywords.length} low-performing keywords`,
      description:
        `Your brand appears but ranks poorly (position ${lowRankingKeywords.map((k) => `${k.keyword} avg #${Math.round(k.avgPos)}`).join(", ")}). Top-3 positions get ~70% of AI visibility. Action plan for each keyword: 1) Rewrite the target page to place the answer within the first 150 words. 2) Add FAQ schema with 5+ questions related to the keyword. 3) Include statistics, dates, and expert quotes — AI models prefer citeable, data-backed content. 4) Build 2-3 internal links from high-authority pages on your site. 5) Get 1-2 external backlinks using the keyword as anchor text.`,
      category: "content",
      impact: "Moving from position 8+ to top 3 can multiply keyword-level visibility by 5x",
      projectId: project.id,
    })
  }

  return recs
}

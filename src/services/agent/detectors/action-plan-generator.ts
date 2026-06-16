import type { ActionPlanInput, ProjectContext } from "../types"
import { calculatePriority } from "../scoring-engine"

export async function generateActionPlan(
  project: ProjectContext,
  runId: string,
  projectId: string
): Promise<
  (ActionPlanInput & {
    priorityScore: number
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  })[]
> {
  const items: (ActionPlanInput & {
    priorityScore: number
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  })[] = []

  items.push({
    title: "Generate prompts and run initial monitoring scan",
    description: "Ensure all keywords have prompts generated. Run a monitoring scan across all AI providers to establish baseline visibility data.",
    category: "visibility",
    priority: "critical",
    timeline: "immediate",
    estimatedEffort: "15 minutes",
    dependencies: [],
    successMetric: "All prompts generated and first scan completes successfully",
    impactScore: 90,
    difficultyScore: 10,
    priorityScore: calculatePriority(90, 10),
    runId,
    projectId,
  })

  items.push({
    title: "Add schema markup to core pages",
    description: "Add Organization, Product, FAQPage, and Article JSON-LD structured data to your website's core pages. AI models use this to understand and cite your brand.",
    category: "visibility",
    priority: "critical",
    timeline: "immediate",
    estimatedEffort: "2-4 hours",
    dependencies: ["Access to website CMS or codebase"],
    successMetric: "Schema markup validated with Google Rich Results Test",
    impactScore: 85,
    difficultyScore: 25,
    priorityScore: calculatePriority(85, 25),
    runId,
    projectId,
  })

  if (project.competitors.length > 0) {
    items.push({
      title: "Create competitor comparison pages",
      description: `Build dedicated landing pages comparing ${project.brandName} against ${project.competitors.map((c) => c.name).join(", ")}. Include feature tables, pricing comparisons, and customer testimonials.`,
      category: "content",
      priority: "high",
      timeline: "this_week",
      estimatedEffort: "1-2 weeks",
      dependencies: ["Competitor research completed"],
      successMetric: "Comparison pages indexed and appearing in AI responses for comparison queries",
      impactScore: 75,
      difficultyScore: 40,
      priorityScore: calculatePriority(75, 40),
      runId,
      projectId,
    })
  }

  items.push({
    title: "Build citations on top 5 authority domains",
    description: "Research and pursue citations from at least 5 high-authority domains in your industry. Prioritize .edu, .gov, and established industry publications.",
    category: "citation",
    priority: "high",
    timeline: "this_month",
    estimatedEffort: "2-4 weeks",
    dependencies: ["Citation opportunity list from agent analysis"],
    successMetric: "5 new citation domains linking to your brand",
    impactScore: 80,
    difficultyScore: 50,
    priorityScore: calculatePriority(80, 50),
    runId,
    projectId,
  })

  items.push({
    title: "Expand keyword coverage to 20+ terms",
    description: `Currently tracking ${project.keywords.length} keywords. Expand to 20+ terms across your domain to identify more content and visibility opportunities.`,
    category: "visibility",
    priority: "high",
    timeline: "this_week",
    estimatedEffort: "1-2 hours",
    dependencies: [],
    successMetric: "20+ keywords tracked across all main product/service categories",
    impactScore: 65,
    difficultyScore: 20,
    priorityScore: calculatePriority(65, 20),
    runId,
    projectId,
  })

  if (project.keywords.length >= 5) {
    items.push({
      title: "Publish weekly blog content targeting tracked keywords",
      description: `Create a content calendar publishing 1-2 pieces per week targeting your highest-priority keywords. Each piece should include FAQ schema, internal links, and a clear CTA.`,
      category: "content",
      priority: "high",
      timeline: "this_week",
      estimatedEffort: "Ongoing — 4-8 hours/week",
      dependencies: ["Content ideas from agent analysis"],
      successMetric: "8+ pieces published over 2 months, each ranking in AI responses",
      impactScore: 70,
      difficultyScore: 35,
      priorityScore: calculatePriority(70, 35),
      runId,
      projectId,
    })
  }

  items.push({
    title: "Set up recurring GEO Score monitoring",
    description: "Configure weekly automated monitoring scans to track GEO Score changes over time. Set up email notifications for score drops or improvements.",
    category: "positioning",
    priority: "medium",
    timeline: "this_month",
    estimatedEffort: "30 minutes",
    dependencies: ["At least one successful monitoring run"],
    successMetric: "Weekly GEO Score reports being generated automatically",
    impactScore: 55,
    difficultyScore: 15,
    priorityScore: calculatePriority(55, 15),
    runId,
    projectId,
  })

  items.push({
    title: "Optimize existing content for AI featured snippets",
    description: "Audit existing content for tracked keywords. Rewrite introductions to directly answer questions within the first 100 words. Add FAQ schema with 5+ questions per page.",
    category: "position",
    priority: "medium",
    timeline: "this_month",
    estimatedEffort: "1-2 days",
    dependencies: ["Content audit completed"],
    successMetric: "Average position improves by 2+ spots across tracked keywords",
    impactScore: 60,
    difficultyScore: 30,
    priorityScore: calculatePriority(60, 30),
    runId,
    projectId,
  })

  if (project.competitors.length >= 2) {
    items.push({
      title: "Conduct quarterly competitive content audit",
      description: "Every quarter, review competitors' content output, new citations, and AI visibility changes. Adjust your strategy based on what's working for them.",
      category: "positioning",
      priority: "low",
      timeline: "this_quarter",
      estimatedEffort: "1 day per quarter",
      dependencies: ["Competitor tracking set up"],
      successMetric: "Quarterly report showing competitive landscape changes",
      impactScore: 45,
      difficultyScore: 25,
      priorityScore: calculatePriority(45, 25),
      runId,
      projectId,
    })
  }

  return items
}

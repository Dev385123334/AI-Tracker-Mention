import { prisma } from "@/lib/prisma"
import type { ContentIdeaInput, ProjectContext } from "../types"
import { calculateContentIdeaScore, calculatePriority } from "../scoring-engine"

export async function detectContentIdeas(
  project: ProjectContext,
  runId: string,
  projectId: string
): Promise<
  (ContentIdeaInput & {
    impactScore: number
    difficultyScore: number
    priorityScore: number
    runId: string
    projectId: string
  })[]
> {
  const results: (ContentIdeaInput & {
    impactScore: number
    difficultyScore: number
    priorityScore: number
    runId: string
    projectId: string
  })[] = []

  const mentionData = await prisma.mention.groupBy({
    by: ["brandName"],
    where: { run: { job: { projectId } } },
    _count: { brandName: true },
  })

  const brandMentions = mentionData.find((m) => m.brandName === project.brandName)?._count.brandName ?? 0

  const responseData = await prisma.providerResponse.findMany({
    where: { run: { job: { projectId } }, status: "success" },
    select: {
      prompt: { select: { keyword: { select: { keyword: true } } } },
      mentions: { select: { brandName: true } },
    },
  })

  if (responseData.length === 0) {
    return results
  }

  const keywordBrandSet = new Map<string, Set<string>>()
  for (const r of responseData) {
    const kw = r.prompt.keyword.keyword
    if (!keywordBrandSet.has(kw)) keywordBrandSet.set(kw, new Set())
    for (const m of r.mentions) keywordBrandSet.get(kw)!.add(m.brandName)
  }

  const keywordMentionCount = new Map<string, number>()
  for (const r of responseData) {
    const kw = r.prompt.keyword.keyword
    keywordMentionCount.set(kw, (keywordMentionCount.get(kw) ?? 0) + r.mentions.length)
  }

  for (const keyword of project.keywords) {
    const brands = keywordBrandSet.get(keyword.keyword)
    const brandAbsent = !brands?.has(project.brandName)
    const totalMentions = keywordMentionCount.get(keyword.keyword) ?? 0
    const competitorDominate = brands && brands.size > 1 && !brands.has(project.brandName)

    if (brandAbsent || competitorDominate) {
      const compNames = brands ? [...brands].filter((b) => b !== project.brandName).join(", ") : "competitors"

      const contentType = totalMentions > 5 ? "guide" : totalMentions > 2 ? "blog_post" : "landing_page"

      const compMention = project.competitors.length > 0
        ? mentionData.find((m) => m.brandName === project.competitors[0].name)?._count.brandName ?? 0
        : 0
      const mentionGap = compMention - brandMentions

      const idea: ContentIdeaInput = {
        title: `Create content targeting "${keyword.keyword}"`,
        description: brandAbsent
          ? `Your brand has zero visibility for "${keyword.keyword}" in AI responses. Competitors appearing include ${compNames}. Create optimized content to fill this gap and capture ${totalMentions > 0 ? `${totalMentions}+` : "new"} mentions.`
          : `Competitor brands (${compNames}) are dominating "${keyword.keyword}" with ${totalMentions} total mentions. Strengthen your position with comprehensive, authoritative content.`,
        keyword: keyword.keyword,
        contentType,
        rationale: brandAbsent
          ? `Brand is completely absent from AI responses for this tracked keyword. Immediate content creation is needed to establish visibility.`
          : `Competitor brands dominate this keyword. Targeted content can capture a share of ${totalMentions} AI mentions.`,
        targetAudience: "Decision-makers searching for " + keyword.keyword,
      }

      const { impactScore, difficultyScore } = calculateContentIdeaScore(idea, {
        brandAbsent,
        competitorDominates: !!competitorDominate,
        mentionGap,
      })
      const priorityScore = calculatePriority(impactScore, difficultyScore)

      results.push({ ...idea, impactScore, difficultyScore, priorityScore, runId, projectId })
    }
  }

  const totalMissing = results.length
  if (totalMissing === 0 && project.keywords.length > 0) {
    results.push({
      title: "Create pillar page for your core offering",
      description: `All ${project.keywords.length} tracked keywords show your brand presence. Maintain leadership by creating a definitive pillar page covering your product category comprehensively with FAQ schema, comparison tables, and expert insights.`,
      keyword: project.keywords[0]?.keyword ?? project.brandName,
      contentType: "guide",
      rationale: "Brand has baseline presence. A comprehensive pillar page consolidates authority and defends against competitor inroads.",
      targetAudience: "Prospective buyers researching " + project.brandName,
      impactScore: 50,
      difficultyScore: 50,
      priorityScore: calculatePriority(50, 50),
      runId,
      projectId,
    })
  }

  return results
}

import {
  createAgentRun,
  completeAgentRun,
  failAgentRun,
} from "@/repositories/agent-run-repository"
import { createContentIdeas } from "@/repositories/content-idea-repository"
import { createContentBriefs } from "@/repositories/content-brief-repository"
import { createCompetitorAnalyses } from "@/repositories/competitor-analysis-repository"
import { createCitationOpportunities } from "@/repositories/citation-opportunity-repository"
import { createActionPlanItems } from "@/repositories/action-plan-repository"
import { createAgentTasks } from "@/repositories/agent-task-repository"
import { prisma } from "@/lib/prisma"
import { detectContentIdeas } from "./detectors/content-idea-detector"
import { generateContentBriefs } from "./detectors/content-brief-generator"
import { analyzeCompetitors } from "./detectors/competitor-analyzer"
import { findCitationOpportunities } from "./detectors/citation-finder"
import { generateActionPlan } from "./detectors/action-plan-generator"
import type { ProjectContext } from "./types"

export async function runAgent(projectId: string): Promise<{ itemsCreated: number }> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true, keywords: true },
  })
  if (!project) throw new Error(`Project ${projectId} not found`)

  const agentRun = await createAgentRun(projectId)
  const runId = agentRun.id

  try {
    const ctx: ProjectContext = {
      id: project.id,
      brandName: project.brandName,
      domain: project.domain,
      competitors: project.competitors.map((c) => ({ name: c.name, domain: c.domain })),
      keywords: project.keywords.map((k) => ({ id: k.id, keyword: k.keyword })),
    }

    const [ideas, analyses, citations, planItems] = await Promise.all([
      detectContentIdeas(ctx, runId, projectId),
      analyzeCompetitors(ctx, runId, projectId),
      findCitationOpportunities(ctx, runId, projectId),
      generateActionPlan(ctx, runId, projectId),
    ])

    const ideaResult = await createContentIdeas(
      ideas.map((i) => ({
        title: i.title,
        description: i.description,
        keyword: i.keyword,
        contentType: i.contentType,
        rationale: i.rationale,
        targetAudience: i.targetAudience,
        impactScore: i.impactScore,
        difficultyScore: i.difficultyScore,
        priorityScore: i.priorityScore,
        runId: i.runId,
        projectId: i.projectId,
      }))
    )

    const competitorResult = await createCompetitorAnalyses(
      analyses.map((a) => ({
        competitorName: a.competitorName,
        competitorDomain: a.competitorDomain,
        gapType: a.gapType,
        gapSeverity: a.gapSeverity,
        description: a.description,
        brandStrength: a.brandStrength,
        competitorStrength: a.competitorStrength,
        actionItems: a.actionItems,
        impactScore: a.impactScore,
        difficultyScore: a.difficultyScore,
        runId: a.runId,
        projectId: a.projectId,
      }))
    )

    const citationResult = await createCitationOpportunities(
      citations.map((c) => ({
        domain: c.domain,
        domainAuthority: c.domainAuthority,
        opportunityType: c.opportunityType,
        relevance: c.relevance,
        strategy: c.strategy,
        competitorRef: c.competitorRef,
        contactMethod: c.contactMethod,
        impactScore: c.impactScore,
        difficultyScore: c.difficultyScore,
        runId: c.runId,
        projectId: c.projectId,
      }))
    )

    const planResult = await createActionPlanItems(
      planItems.map((p) => ({
        title: p.title,
        description: p.description,
        category: p.category,
        priority: p.priority,
        timeline: p.timeline,
        estimatedEffort: p.estimatedEffort,
        dependencies: p.dependencies,
        successMetric: p.successMetric,
        impactScore: p.impactScore,
        difficultyScore: p.difficultyScore,
        priorityScore: p.priorityScore,
        runId: p.runId,
        projectId: p.projectId,
      }))
    )

    const totalItems =
      (ideaResult.count ?? 0) +
      (competitorResult.count ?? 0) +
      (citationResult.count ?? 0) +
      (planResult.count ?? 0)

    const acceptedIdeas = ideas
      .filter((i) => i.priorityScore >= 60)
      .map((i) => ({ keyword: i.keyword, title: i.title, contentType: i.contentType }))

    if (acceptedIdeas.length > 0) {
      const briefs = await generateContentBriefs(ctx, acceptedIdeas, runId, projectId)
      await createContentBriefs(
        briefs.map((b) => ({
          title: b.title,
          targetKeyword: b.targetKeyword,
          wordCount: b.wordCount,
          structure: b.structure,
          keyPoints: b.keyPoints,
          faqQuestions: b.faqQuestions,
          internalLinks: b.internalLinks,
          targetAudience: b.targetAudience,
          toneOfVoice: b.toneOfVoice,
          seoNotes: b.seoNotes,
          competitorRefs: b.competitorRefs,
          callToAction: b.callToAction,
          runId: b.runId,
          projectId: b.projectId,
        }))
      )
    }

    const tasks = planItems.map((p) => ({
      title: p.title,
      description: p.description,
      source: "action_plan",
      sourceId: "",
      runId,
      projectId,
    }))
    await createAgentTasks(tasks)

    const summary = `Generated ${totalItems} items: ${ideaResult.count ?? 0} content ideas, ${competitorResult.count ?? 0} competitor analyses, ${citationResult.count ?? 0} citation opportunities, ${planResult.count ?? 0} action plan items`

    await completeAgentRun(runId, summary, totalItems)

    return { itemsCreated: totalItems }
  } catch (err) {
    try { await failAgentRun(runId, (err as Error).message) } catch { /* ignore */ }
    throw err
  }
}

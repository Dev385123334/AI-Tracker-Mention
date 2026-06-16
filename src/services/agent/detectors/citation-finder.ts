import { prisma } from "@/lib/prisma"
import type { CitationOpportunityInput, ProjectContext } from "../types"
import { calculateCitationScore } from "../scoring-engine"

export async function findCitationOpportunities(
  project: ProjectContext,
  runId: string,
  projectId: string
): Promise<
  (CitationOpportunityInput & {
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  })[]
> {
  const results: (CitationOpportunityInput & {
    impactScore: number
    difficultyScore: number
    runId: string
    projectId: string
  })[] = []

  const citationData = await prisma.citation.findMany({
    where: { run: { job: { projectId } } },
    select: {
      domain: true,
      response: { select: { mentions: { select: { brandName: true } } } },
    },
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

  const allOppDomains = new Map<string, { competitors: Set<string>; count: number }>()
  for (const [compName, domains] of competitorDomains) {
    for (const domain of domains) {
      if (!brandDomains.has(domain)) {
        if (!allOppDomains.has(domain)) allOppDomains.set(domain, { competitors: new Set(), count: 0 })
        allOppDomains.get(domain)!.competitors.add(compName)
        allOppDomains.get(domain)!.count++
      }
    }
  }

  for (const [domain, info] of allOppDomains) {
    const isHighAuthority = domain.endsWith(".edu") || domain.endsWith(".gov") || domain.includes("wikipedia")
    const multipleCompetitors = info.competitors.size > 1
    const firstComp = [...info.competitors][0]

    const oppType = isHighAuthority ? "guest_post" : info.count > 2 ? "resource_page" : "haro"

    const opp: CitationOpportunityInput = {
      domain,
      domainAuthority: isHighAuthority ? "high" : info.count > 2 ? "medium" : "low",
      opportunityType: oppType,
      relevance: `${info.competitors.size} competitor(s) cited here: ${[...info.competitors].join(", ")}`,
      strategy: isHighAuthority
        ? `Pitch a guest post or expert contribution to ${domain}. Highlight your unique expertise to earn a high-authority citation.`
        : oppType === "resource_page"
          ? `Suggest adding your brand as a resource on ${domain}'s existing resource or tools page.`
          : `Monitor ${domain} for HARO/connectively requests in your space and respond with relevant expertise.`,
      competitorRef: firstComp,
      contactMethod: isHighAuthority
        ? `Find contributor guidelines on ${domain}/write-for-us or contact via editorial team`
        : `Look for "Suggest a resource" or "Contact us" page on ${domain}`,
    }

    const { impactScore, difficultyScore } = calculateCitationScore(opp, {
      highAuthorityDomain: isHighAuthority,
      competitorCited: true,
      multipleCompetitors,
    })

    results.push({ ...opp, impactScore, difficultyScore, runId, projectId })
  }

  if (results.length === 0) {
    return results
  }

  return results
}

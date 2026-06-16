import type { ContentBriefInput, ProjectContext } from "../types"

export async function generateContentBriefs(
  project: ProjectContext,
  acceptedIdeas: { keyword: string; title: string; contentType: string }[],
  runId: string,
  projectId: string
): Promise<
  (ContentBriefInput & { runId: string; projectId: string })[]
> {
  if (acceptedIdeas.length === 0) return []

  return acceptedIdeas.map((idea) => {
    const wordCount =
      idea.contentType === "guide" ? 2500
      : idea.contentType === "case_study" ? 1500
      : idea.contentType === "comparison" ? 1800
      : idea.contentType === "landing_page" ? 800
      : 1200

    const tone =
      idea.contentType === "case_study" ? "Professional and data-driven"
      : idea.contentType === "comparison" ? "Objective and balanced"
      : "Informative and authoritative"

    const sections = buildSections(idea.contentType, idea.keyword, project.brandName)

    return {
      title: idea.title,
      targetKeyword: idea.keyword,
      wordCount,
      structure: { sections },
      keyPoints: [
        `Define what ${idea.keyword} means and why it matters`,
        `Explain how ${project.brandName} addresses ${idea.keyword}`,
        `Include specific data, statistics, or case studies`,
        `Compare with alternative approaches or tools`,
        `Provide actionable takeaways for readers`,
      ],
      faqQuestions: [
        `What is ${idea.keyword}?`,
        `How does ${project.brandName} help with ${idea.keyword}?`,
        `What are the benefits of ${idea.keyword}?`,
        `How does ${idea.keyword} compare to alternatives?`,
        `What should I look for when choosing a ${idea.keyword} solution?`,
      ],
      internalLinks: [
        `/products`,
        `/about`,
        `/blog`,
      ],
      targetAudience: `Professionals researching ${idea.keyword} solutions`,
      toneOfVoice: tone,
      seoNotes: `Include ${idea.keyword} in H1, first 100 words, and meta description. Add FAQPage schema with the listed questions. Target 2-3 related long-tail variations in H2 headings.`,
      competitorRefs: ["Top competing brands in this space"],
      callToAction: getCTA(idea.contentType, project.brandName),
      runId,
      projectId,
    }
  })
}

function buildSections(
  contentType: string,
  keyword: string,
  brandName: string
): { heading: string; type: string; wordCount: number }[] {
  const common = [
    { heading: `What is ${keyword}?`, type: "definition", wordCount: 200 },
    { heading: `Why ${keyword} matters`, type: "explanation", wordCount: 250 },
    { heading: `Key features of ${keyword}`, type: "list", wordCount: 300 },
  ]

  const comparison = [
    { heading: `${brandName} vs alternatives`, type: "comparison", wordCount: 400 },
    { heading: "Feature comparison table", type: "table", wordCount: 200 },
  ]

  const guide = [
    { heading: "Getting started", type: "steps", wordCount: 400 },
    { heading: "Best practices", type: "list", wordCount: 300 },
    { heading: "Common pitfalls to avoid", type: "warning", wordCount: 250 },
  ]

  const caseStudy = [
    { heading: "The challenge", type: "story", wordCount: 300 },
    { heading: "The solution", type: "story", wordCount: 300 },
    { heading: "Results", type: "metrics", wordCount: 200 },
  ]

  if (contentType === "comparison") return [...common, ...comparison, { heading: "Final verdict", type: "conclusion", wordCount: 150 }]
  if (contentType === "guide") return [...common, ...guide, { heading: "Conclusion", type: "conclusion", wordCount: 150 }]
  if (contentType === "case_study") return caseStudy
  if (contentType === "landing_page") return common.slice(0, 2)

  return [...common, { heading: "Conclusion", type: "conclusion", wordCount: 100 }]
}

function getCTA(contentType: string, brandName: string): string {
  if (contentType === "comparison") return `Try ${brandName} free — see how we compare`
  if (contentType === "case_study") return `Ready to achieve similar results? Get started with ${brandName}`
  if (contentType === "guide") return `Download our complete ${brandName} guide`
  return `Learn more about ${brandName}`
}

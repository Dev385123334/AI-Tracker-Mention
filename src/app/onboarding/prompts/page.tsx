import { getOnboardingState } from "@/modules/onboarding/state"
import { redirect } from "next/navigation"
import { PromptsForm } from "@/components/onboarding/prompts-form"

const promptTemplates = [
  (kw: string) => `What are the best ${kw}?`,
  (kw: string) => `Top ${kw} in 2026`,
  (kw: string) => `Best ${kw} for agencies and enterprises`,
  (kw: string) => `Most trusted and recommended ${kw}`,
  (kw: string) => `How to choose the right ${kw} for your business`,
  (kw: string) => `Comprehensive guide to ${kw} in 2026`,
  (kw: string) => `Expert recommendations for ${kw}`,
  (kw: string) => `${kw} comparison and review`,
]

export default async function PromptsPage() {
  const state = await getOnboardingState()
  if (!state || !state.keywords || state.keywords.length < 3) {
    redirect("/onboarding/keywords")
  }

  const keywordPrompts = state.keywords.map((kw) => ({
    keyword: kw,
    prompts: promptTemplates.map((fn) => fn(kw)),
  }))

  return <PromptsForm keywordPrompts={keywordPrompts} brandName={state.brandName} />
}

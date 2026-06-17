"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createProject } from "@/repositories/project-repository"
import { createManyKeywords } from "@/repositories/keyword-repository"
import { createManyPrompts } from "@/repositories/prompt-repository"
import { CreateProjectSchema } from "@/modules/projects/validations"
import { setOnboardingState, getOnboardingState, clearOnboardingState } from "./state"

export async function saveBrandInfo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const brandName = formData.get("brandName") as string
  const domain = formData.get("domain") as string
  const description = (formData.get("description") as string) || ""

  if (!brandName?.trim() || !domain?.trim()) {
    return { error: "Brand name and domain are required" }
  }

  const projectName = `${brandName} Tracker`

  await setOnboardingState({
    brandName,
    domain,
    projectName,
    description,
  })

  redirect("/onboarding/keywords")
}

export async function saveKeywords(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const raw = formData.get("keywords") as string
  if (!raw) return { error: "No keywords provided" }

  const keywords: string[] = JSON.parse(raw)

  if (!Array.isArray(keywords) || keywords.length < 1) {
    return { error: "Please add at least one keyword" }
  }
  if (keywords.some((k) => !k.trim())) {
    return { error: "Keywords cannot be empty" }
  }

  await setOnboardingState({ keywords })

  redirect("/onboarding/countries")
}

export async function saveCountries(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const raw = formData.get("countries") as string
  if (!raw) return { error: "No countries selected" }

  const countries: string[] = JSON.parse(raw)

  if (!Array.isArray(countries) || countries.length === 0) {
    return { error: "Please select at least one country" }
  }

  await setOnboardingState({ countries })

  redirect("/onboarding/prompts")
}

export async function finalizeProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const state = await getOnboardingState()
  if (!state) throw new Error("Onboarding state not found")

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) throw new Error("User not found")

  const org = await prisma.organization.findFirst({
    where: { members: { some: { userId: dbUser.id } } },
  })
  if (!org) throw new Error("No organization found")

  const parsed = CreateProjectSchema.safeParse({
    name: state.projectName,
    brandName: state.brandName,
    domain: state.domain,
    description: state.description || undefined,
    organizationId: org.id,
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const project = await createProject({
    ...parsed.data,
    description: parsed.data.description ?? undefined,
    userId: dbUser.id,
    targetCountries: state.countries ?? [],
  })

  const selectedRaw = formData.get("selectedPrompts") as string
  const selected: { keyword: string; texts: string[] }[] = selectedRaw
    ? JSON.parse(selectedRaw)
    : []

  if (state.keywords && state.keywords.length > 0) {
    const keywordData = state.keywords.map((kw) => ({
      keyword: kw,
      projectId: project.id,
    }))
    await createManyKeywords(keywordData)

    const createdKeywords = await prisma.keyword.findMany({
      where: { projectId: project.id },
    })

    const keywordMap = new Map(createdKeywords.map((k) => [k.keyword, k.id]))

    if (selected.length > 0) {
      for (const entry of selected) {
        const keywordId = keywordMap.get(entry.keyword)
        if (keywordId && entry.texts.length > 0) {
          const prompts = entry.texts.map((text) => ({
            text,
            keywordId,
          }))
          await createManyPrompts(prompts)
        }
      }
    }
  }

  await clearOnboardingState()
  redirect("/dashboard")
}

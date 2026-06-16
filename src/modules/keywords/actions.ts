"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createKeyword, createManyKeywords, deleteKeyword } from "@/repositories/keyword-repository"
import { AddKeywordSchema, BulkImportSchema } from "./validations"
import { generatePromptsForKeyword, generatePromptsForProject } from "@/services/prompt-generation-service"

export async function addKeywordAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const parsed = AddKeywordSchema.safeParse({
    keyword: formData.get("keyword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  try {
    const keyword = await createKeyword({ keyword: parsed.data.keyword, projectId })
    await generatePromptsForKeyword(keyword.id)
    revalidatePath(`/projects/${projectId}/keywords`)
    return { success: true }
  } catch (err) {
    return { error: { form: [(err as Error).message] } }
  }
}

export async function bulkImportAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const parsed = BulkImportSchema.safeParse({
    keywords: formData.get("keywords"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data.keywords.map((keyword) => ({ keyword, projectId }))

  try {
    await createManyKeywords(data)
    await generatePromptsForProject(projectId)
    revalidatePath(`/projects/${projectId}/keywords`)
    return { success: true, count: data.length }
  } catch (err) {
    return { error: { form: [(err as Error).message] } }
  }
}

export async function deleteKeywordAction(projectId: string, keywordId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await deleteKeyword(keywordId)
  revalidatePath(`/projects/${projectId}/keywords`)
}

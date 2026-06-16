"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  createCompetitor,
  deleteCompetitor,
} from "@/repositories/competitor-repository"
import { AddCompetitorSchema } from "./validations"

export async function addCompetitorAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const parsed = AddCompetitorSchema.safeParse({
    name: formData.get("name"),
    domain: formData.get("domain"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  try {
    await createCompetitor({ ...parsed.data, projectId })
    revalidatePath(`/projects/${projectId}/competitors`)
    return { success: true }
  } catch (err) {
    return { error: { form: [(err as Error).message] } }
  }
}

export async function deleteCompetitorAction(projectId: string, competitorId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await deleteCompetitor(competitorId)
  revalidatePath(`/projects/${projectId}/competitors`)
}

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createProject, updateProject, deleteProject } from "@/repositories/project-repository"
import { CreateProjectSchema, UpdateProjectSchema } from "./validations"

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) throw new Error("User not found")

  const parsed = CreateProjectSchema.safeParse({
    name: formData.get("name"),
    brandName: formData.get("brandName"),
    domain: formData.get("domain"),
    description: formData.get("description") || undefined,
    organizationId: formData.get("organizationId"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await createProject({
    ...parsed.data,
    description: parsed.data.description ?? undefined,
    userId: dbUser.id,
  })

  revalidatePath("/projects")
  redirect("/projects")
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const parsed = UpdateProjectSchema.safeParse({
    name: formData.get("name") || undefined,
    brandName: formData.get("brandName") || undefined,
    domain: formData.get("domain") || undefined,
    description: formData.get("description") || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await updateProject(projectId, parsed.data)
  revalidatePath(`/projects/${projectId}`)
  redirect(`/projects/${projectId}`)
}

export async function deleteProjectAction(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await deleteProject(projectId)
  revalidatePath("/projects")
  redirect("/projects")
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findPromptsByProject } from "@/repositories/prompt-repository"
import { generatePromptsForProject, regeneratePromptsForProject } from "@/services/prompt-generation-service"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const prompts = await findPromptsByProject(projectId)
  return NextResponse.json({ data: prompts })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const body = await request.json().catch(() => ({}))
  const regenerate = body.regenerate === true

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true, userId: true } })
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  try {
    const count = regenerate
      ? await regeneratePromptsForProject(projectId)
      : await generatePromptsForProject(projectId)
    return NextResponse.json({ data: { promptsGenerated: count } })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

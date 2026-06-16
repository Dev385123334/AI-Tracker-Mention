import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  findAllProjectsByUser,
  createProject,
} from "@/repositories/project-repository"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const projects = await findAllProjectsByUser(dbUser.id)
  return NextResponse.json({ data: projects })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await request.json()
  const { name, brandName, domain, description, organizationId } = body

  if (!name || !brandName || !domain || !organizationId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const project = await createProject({
    name,
    brandName,
    domain,
    description: description ?? null,
    organizationId,
    userId: dbUser.id,
  })

  return NextResponse.json({ data: project })
}

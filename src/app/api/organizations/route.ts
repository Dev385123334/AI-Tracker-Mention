import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findOrganizationsByUserId, createOrganization } from "@/repositories/organization-repository"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const organizations = await findOrganizationsByUserId(dbUser.id)
  return NextResponse.json({ data: organizations })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await request.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + dbUser.id.slice(0, 6)

  const org = await createOrganization({ name, slug, ownerId: dbUser.id })
  return NextResponse.json({ data: org })
}

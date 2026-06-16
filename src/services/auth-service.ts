import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function syncUser() {
  const supabaseUser = await getCurrentUser()
  if (!supabaseUser) return null

  const email = supabaseUser.email!
  const name = supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? email.split("@")[0]
  const avatarUrl = supabaseUser.user_metadata?.avatar_url ?? supabaseUser.user_metadata?.picture ?? null

  let dbUser = await prisma.user.findUnique({ where: { email } })

  if (dbUser) {
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { name, avatarUrl },
    })
    return dbUser
  }

  dbUser = await prisma.user.create({
    data: { email, name, avatarUrl },
  })

  const orgSlug = `personal-${dbUser.id.slice(0, 8)}`

  const org = await prisma.organization.create({
    data: {
      name: `${name}'s Organization`,
      slug: orgSlug,
    },
  })

  await prisma.organizationMember.create({
    data: {
      userId: dbUser.id,
      organizationId: org.id,
      role: "owner",
      joinedAt: new Date(),
    },
  })

  return dbUser
}

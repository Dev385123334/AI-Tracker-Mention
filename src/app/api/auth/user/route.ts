import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null }, { status: 401 })
  }

  const { prisma } = await import("@/lib/prisma")

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  })

  return NextResponse.json({ data: dbUser })
}

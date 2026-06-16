import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ensureDashboardCompetitors } from "@/services/dashboard/auto-competitors"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) redirect("/login")

  const latestProject = await prisma.project.findFirst({
    where: { organization: { members: { some: { userId: dbUser.id } } } },
    orderBy: { createdAt: "desc" },
  })

  if (!latestProject) {
    return <DashboardClient data={null} />
  }

  const competitors = await ensureDashboardCompetitors(latestProject.id, latestProject.domain)

  return <DashboardClient data={{ project: latestProject, competitors }} />
}

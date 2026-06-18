import { GeoAgentClient } from "@/components/geo-agent/geo-agent-client"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function GeoAgentPage() {
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
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Create a project first to run the GEO Agent.</p>
      </div>
    )
  }

  return <GeoAgentClient projectId={latestProject.id} projectName={latestProject.name} />
}

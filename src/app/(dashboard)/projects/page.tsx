import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { findAllProjectsByUser } from "@/repositories/project-repository"
import { ProjectList } from "@/components/projects/project-list"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { findOrganizationsByUserId } from "@/repositories/organization-repository"

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) redirect("/login")

  const [projects, organizations] = await Promise.all([
    findAllProjectsByUser(dbUser.id),
    findOrganizationsByUserId(dbUser.id),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your brand visibility projects</p>
        </div>
        <CreateProjectDialog organizations={organizations} />
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects yet. Create your first project to get started.</p>
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  )
}

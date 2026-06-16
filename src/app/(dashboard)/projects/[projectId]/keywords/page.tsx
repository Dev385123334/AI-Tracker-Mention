import { redirect } from "next/navigation"
import { findProjectById } from "@/repositories/project-repository"
import { findAllKeywordsByProject } from "@/repositories/keyword-repository"
import { KeywordList } from "@/components/keywords/keyword-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function KeywordsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const [project, keywords] = await Promise.all([
    findProjectById(projectId),
    findAllKeywordsByProject(projectId),
  ])

  if (!project) redirect("/projects")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Keywords</h1>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
      </div>
      <KeywordList projectId={projectId} keywords={keywords} />
    </div>
  )
}

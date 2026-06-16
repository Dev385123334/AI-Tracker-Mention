import { redirect } from "next/navigation"
import { findProjectById } from "@/repositories/project-repository"
import { findPromptsByProject } from "@/repositories/prompt-repository"
import { findJobsByProject } from "@/repositories/monitoring-job-repository"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { MonitoringJobsList } from "@/components/monitoring/monitoring-jobs-list"
import { PromptsList } from "@/components/monitoring/prompts-list"
import { MonitoringRunsList } from "@/components/monitoring/monitoring-runs-list"

export default async function MonitoringPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { prisma } = await import("@/lib/prisma")
  const [project, prompts, jobs, jobIds] = await Promise.all([
    findProjectById(projectId),
    findPromptsByProject(projectId),
    findJobsByProject(projectId),
    prisma.monitoringJob.findMany({ where: { projectId }, select: { id: true, type: true } }),
  ])

  if (!project) redirect("/projects")

  const runs = jobIds.length > 0
    ? await prisma.monitoringRun.findMany({
        where: { jobId: { in: jobIds.map((j) => j.id) } },
        include: { _count: { select: { responses: true, logs: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    : []

  const runsWithJobType = runs.map((r) => ({
    ...r,
    jobType: jobIds.find((j) => j.id === r.jobId)?.type ?? "unknown",
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Monitoring</h1>
          <p className="text-sm text-muted-foreground">{project.name}</p>
        </div>
      </div>

      <MonitoringJobsList projectId={projectId} jobs={jobs} />
      <MonitoringRunsList projectId={projectId} runs={runsWithJobType} />
      <PromptsList projectId={projectId} prompts={prompts} />
    </div>
  )
}

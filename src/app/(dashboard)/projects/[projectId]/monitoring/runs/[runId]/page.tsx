import { redirect } from "next/navigation"
import { findRunById } from "@/repositories/monitoring-run-repository"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { RunDetail } from "@/components/monitoring/run-detail"

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; runId: string }>
}) {
  const { projectId, runId } = await params
  const run = await findRunById(runId)
  if (!run) redirect(`/projects/${projectId}/monitoring`)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}/monitoring`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Run Details</h1>
          <p className="text-sm text-muted-foreground">
            {run.status} &middot; Started {run.startedAt?.toLocaleString() ?? "Not started"}
          </p>
        </div>
      </div>
      <RunDetail run={run} />
    </div>
  )
}

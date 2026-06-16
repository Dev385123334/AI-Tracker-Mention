"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Play, Pause, Archive, Activity } from "lucide-react"

interface Job {
  id: string
  type: string
  status: string
  schedule: string | null
  createdAt: Date
  _count: { runs: number }
}

interface MonitoringJobsListProps {
  projectId: string
  jobs: Job[]
}

function CreateJobDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [jobType, setJobType] = useState("daily")
  const [customValue, setCustomValue] = useState(5)
  const [customUnit, setCustomUnit] = useState<"minutes" | "hours" | "days">("minutes")
  const router = useRouter()

  const [, formAction, pending] = useActionState(
     async (_prev: unknown, _formData: FormData) => {
       const body: Record<string, unknown> = { type: jobType }
      if (jobType === "custom") {
        body.schedule = { value: customValue, unit: customUnit }
      }
      const res = await fetch(`/api/projects/${projectId}/monitoring/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setOpen(false)
        router.refresh()
      }
      return undefined
    },
    undefined
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-2 h-4 w-4" />
        New Job
      </DialogTrigger>
      <DialogContent className="bg-white shadow-lg border-border/40">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create Monitoring Job</DialogTitle>
            <DialogDescription>Schedule automated monitoring for this project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 cursor-pointer hover:bg-muted/30 has-checked:border-primary/50">
              <input type="radio" name="type" value="daily" checked={jobType === "daily"} onChange={() => setJobType("daily")} className="accent-primary" />
              <div>
                <p className="text-sm font-medium">Daily</p>
                <p className="text-xs text-muted-foreground">Run every day at 6:00 AM</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 cursor-pointer hover:bg-muted/30 has-checked:border-primary/50">
              <input type="radio" name="type" value="weekly" checked={jobType === "weekly"} onChange={() => setJobType("weekly")} className="accent-primary" />
              <div>
                <p className="text-sm font-medium">Weekly</p>
                <p className="text-xs text-muted-foreground">Run every Monday at 6:00 AM</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/40 p-4 cursor-pointer hover:bg-muted/30 has-checked:border-primary/50">
              <input type="radio" name="type" value="custom" checked={jobType === "custom"} onChange={() => setJobType("custom")} className="accent-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Custom Interval</p>
                <p className="text-xs text-muted-foreground mb-2">Run on a custom schedule</p>
                {jobType === "custom" && (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      min={1}
                      value={customValue}
                      onChange={(e) => setCustomValue(Number(e.target.value))}
                      className="h-8 w-20"
                      placeholder="5"
                    />
                    <Select value={customUnit} onValueChange={(v) => setCustomUnit(v as typeof customUnit)}>
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TriggerRunButton({ jobId, projectId }: { jobId: string; projectId: string }) {
  const router = useRouter()
  const [running, setRunning] = useState(false)

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={running}
      onClick={async () => {
        setRunning(true)
        await fetch(`/api/projects/${projectId}/monitoring/jobs/${jobId}/runs`, { method: "POST" })
        setRunning(false)
        router.refresh()
      }}
    >
      <Play className="mr-1 h-3 w-3" />
      {running ? "Running..." : "Run Now"}
    </Button>
  )
}

function JobActions({ job, projectId }: { job: Job; projectId: string }) {
  const router = useRouter()

  const updateStatus = async (status: string) => {
    await fetch(`/api/projects/${projectId}/monitoring/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
  }

  if (job.status === "archived") return null

  return (
    <div className="flex gap-1">
      {job.status === "active" ? (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateStatus("paused")}>
          <Pause className="h-3 w-3" />
        </Button>
      ) : job.status === "paused" ? (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateStatus("active")}>
          <Play className="h-3 w-3" />
        </Button>
      ) : null}
      {job.status !== "archived" && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateStatus("archived")}>
          <Archive className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

function JobTypeBadge({ type, schedule }: { type: string; schedule: string | null }) {
  if (type === "custom" && schedule) {
    const parts = schedule.split(" ")
    if (parts[0]?.startsWith("*/")) {
      const val = parts[0].slice(2)
      if (parts[1] === "*") return <Badge variant="secondary">Every {val} min</Badge>
    }
    if (parts[1]?.startsWith("*/")) {
      const val = parts[1].slice(2)
      if (parts[0] === "0") return <Badge variant="secondary">Every {val} hrs</Badge>
    }
    if (parts[2]?.startsWith("*/")) {
      const val = parts[2].slice(2)
      if (parts[0] === "0" && parts[1] === "0") return <Badge variant="secondary">Every {val} days</Badge>
    }
    return <Badge variant="secondary">Custom</Badge>
  }
  return <Badge variant={type === "daily" ? "default" : "secondary"}>{type}</Badge>
}

export function MonitoringJobsList({ projectId, jobs }: MonitoringJobsListProps) {
  const activeJobs = jobs.filter((j) => j.status !== "archived")

  return (
    <Card className="bg-white shadow-sm border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring Jobs
          </CardTitle>
          <CreateJobDialog projectId={projectId} />
        </div>
      </CardHeader>
      <CardContent>
        {activeJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No monitoring jobs yet. Create one to schedule automated monitoring.
          </p>
        ) : (
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-lg border border-border/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <JobTypeBadge type={job.type} schedule={job.schedule} />
                  <Badge
                    variant={job.status === "active" ? "default" : "outline"}
                  >
                    {job.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {job._count.runs} runs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TriggerRunButton jobId={job.id} projectId={projectId} />
                  <JobActions job={job} projectId={projectId} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

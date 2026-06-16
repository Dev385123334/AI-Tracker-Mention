"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { addCompetitorAction, deleteCompetitorAction } from "@/modules/competitors/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface Competitor {
  id: string
  name: string
  domain: string
}

interface CompetitorListProps {
  projectId: string
  competitors: Competitor[]
}

function AddCompetitorDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [, formAction, pending] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await addCompetitorAction(projectId, formData)
    if (result?.success) setOpen(false)
    return result
  }, undefined)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Competitor
      </DialogTrigger>
      <DialogContent className="bg-white shadow-lg border-border/40">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add Competitor</DialogTitle>
            <DialogDescription>Add a competitor to track against your brand.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Competitor Inc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" name="domain" placeholder="competitor.com" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding..." : "Add Competitor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CompetitorList({ projectId, competitors }: CompetitorListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Competitors ({competitors.length})</h2>
        <AddCompetitorDialog projectId={projectId} />
      </div>
      {competitors.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No competitors added yet. Add your first competitor to start tracking.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((competitor) => (
            <Card key={competitor.id} className="bg-white shadow-sm border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{competitor.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{competitor.domain}</span>
                <form
                  action={async () => {
                    await deleteCompetitorAction(projectId, competitor.id)
                  }}
                >
                  <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

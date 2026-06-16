"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createProjectAction } from "@/modules/projects/actions"
import { useState } from "react"

interface CreateProjectDialogProps {
  organizations: { id: string; name: string }[]
}

export function CreateProjectDialog({ organizations }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [orgId, setOrgId] = useState(organizations[0]?.id ?? "")
  const [, formAction, pending] = useActionState(async (_prev: unknown, formData: FormData) => {
    formData.set("organizationId", orgId)
    const result = await createProjectAction(formData)
    if (!result) setOpen(false)
    return result
  }, undefined)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </DialogTrigger>
      <DialogContent className="bg-white shadow-lg border-border/40">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>Track brand visibility for a new project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" placeholder="My Brand Tracker" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input id="brandName" name="brandName" placeholder="Acme Inc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" name="domain" placeholder="acme.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" name="description" placeholder="What is this project about?" />
            </div>
            <div className="space-y-2">
              <Label>Organization</Label>
              <Select value={orgId} onValueChange={(val) => val && setOrgId(val)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending || !orgId}>
              {pending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

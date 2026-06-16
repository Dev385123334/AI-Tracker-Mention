"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteProjectAction } from "@/modules/projects/actions"
import { Trash2 } from "lucide-react"

interface DeleteProjectButtonProps {
  projectId: string
}

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter()
  const [, formAction, pending] = useActionState(async () => {
    await deleteProjectAction(projectId)
    router.push("/projects")
  }, undefined)

  return (
    <form action={formAction}>
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        <Trash2 className="mr-2 h-4 w-4" />
        {pending ? "Deleting..." : "Delete Project"}
      </Button>
    </form>
  )
}

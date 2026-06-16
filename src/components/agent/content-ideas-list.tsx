"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ContentIdeaCard } from "./content-idea-card"

interface ContentIdea {
  id: string
  title: string
  description: string
  keyword: string
  contentType: string
  rationale: string
  targetAudience: string | null
  impactScore: number
  difficultyScore: number
  priorityScore: number
  status: string
}

interface ContentIdeasListProps {
  projectId: string
  ideas: ContentIdea[]
}

export function ContentIdeasList({ projectId, ideas }: ContentIdeasListProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    await fetch(`/api/projects/${projectId}/agent/content-ideas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    setUpdatingId(null)
    router.refresh()
  }

  if (ideas.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No content ideas yet.</p>
  }

  const pending = ideas.filter((i) => i.status === "pending" || i.status === "active")
  const accepted = ideas.filter((i) => i.status === "accepted")
  const dismissed = ideas.filter((i) => i.status === "dismissed")

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Pending Review</p>
          <div className="space-y-2">
            {pending.map((idea) => (
              <div key={idea.id} className={updatingId === idea.id ? "opacity-50" : ""}>
                <ContentIdeaCard
                  idea={idea}
                  onAccept={(id) => updateStatus(id, "accepted")}
                  onDismiss={(id) => updateStatus(id, "dismissed")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {accepted.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Accepted</p>
          <div className="space-y-2 opacity-70">
            {accepted.map((idea) => (
              <ContentIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}
      {dismissed.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Dismissed</p>
          <div className="space-y-2 opacity-50">
            {dismissed.map((idea) => (
              <ContentIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

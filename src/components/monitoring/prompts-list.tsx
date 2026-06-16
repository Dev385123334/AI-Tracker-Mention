"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, RefreshCw, Sparkles } from "lucide-react"

interface Prompt {
  id: string
  text: string
  active: boolean
  keyword: { keyword: string }
}

interface PromptsListProps {
  projectId: string
  prompts: Prompt[]
}

export function PromptsList({ projectId, prompts }: PromptsListProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)

  const grouped = prompts.reduce<Record<string, Prompt[]>>((acc, p) => {
    const keyword = p.keyword.keyword
    if (!acc[keyword]) acc[keyword] = []
    acc[keyword].push(p)
    return acc
  }, {})

  const keywordCount = Object.keys(grouped).length

  return (
    <Card className="bg-white shadow-sm border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generated Prompts
            {prompts.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({prompts.length} prompts from {keywordCount} keywords)
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={generating}
              onClick={async () => {
                setGenerating(true)
                await fetch(`/api/projects/${projectId}/prompts`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({}),
                })
                setGenerating(false)
                router.refresh()
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? "Generating..." : "Generate Prompts"}
            </Button>
            {prompts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                disabled={generating}
                onClick={async () => {
                  setGenerating(true)
                  await fetch(`/api/projects/${projectId}/prompts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ regenerate: true }),
                  })
                  setGenerating(false)
                  router.refresh()
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No prompts generated yet. Click Generate Prompts to create prompt variants from your keywords.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([keyword, pts]) => (
              <div key={keyword}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{keyword}</Badge>
                  <span className="text-xs text-muted-foreground">{pts.length} prompts</span>
                </div>
                <div className="space-y-1">
                  {pts.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-md bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
                    >
                      {p.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

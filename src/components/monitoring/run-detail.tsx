"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, Database, Hash, Link2, Brain } from "lucide-react"

interface PromptKeyword {
  keyword: string
}

interface Prompt {
  id: string
  text: string
  keyword: PromptKeyword
}

interface Response {
  id: string
  provider: string
  responseText: string
  status: string
  latencyMs: number | null
  tokensUsed: number | null
  errorMessage: string | null
  prompt: Prompt
  createdAt: Date
}

interface Mention {
  id: string
  brandName: string
  sentiment: string
  position: number | null
  frequency: number
  createdAt: Date
}

interface Citation {
  id: string
  url: string
  domain: string
  title: string | null
  createdAt: Date
}

interface SentimentResult {
  id: string
  brandName: string
  score: number
  label: string
  confidence: number
  createdAt: Date
}

interface Log {
  id: string
  level: string
  message: string
  createdAt: Date
}

interface Run {
  id: string
  status: string
  startedAt: Date | null
  completedAt: Date | null
  error: string | null
  responses: Response[]
  logs: Log[]
  mentions?: Mention[]
  citations?: Citation[]
  sentimentResults?: SentimentResult[]
}

interface RunDetailProps {
  run: Run
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />
  }
}

export function RunDetail({ run }: RunDetailProps) {
  const successCount = run.responses.filter((r) => r.status === "success").length
  const errorCount = run.responses.filter((r) => r.status === "error").length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                run.status === "completed" ? "default"
                : run.status === "running" ? "secondary"
                : run.status === "failed" ? "destructive"
                : "outline"
              }
              className="text-sm"
            >
              {run.status}
            </Badge>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{run.responses.length}</p>
            <p className="text-xs text-muted-foreground">
              {successCount} success, {errorCount} error
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {run.startedAt ? new Date(run.startedAt).toLocaleString() : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {run.startedAt && run.completedAt
                ? `${Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000)}s`
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {run.error && (
        <Card className="bg-white shadow-sm border-red-500/30">
          <CardContent className="pt-4">
            <p className="text-sm text-red-400">{run.error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Provider Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {run.responses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No responses yet.</p>
          ) : (
            <div className="rounded-md border border-border/40">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {run.responses.map((resp) => (
                    <TableRow key={resp.id}>
                      <TableCell>
                        <StatusIcon status={resp.status} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{resp.provider}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{resp.prompt.keyword.keyword}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{resp.prompt.text}</TableCell>
                      <TableCell className="text-xs max-w-[300px]">
                        <details>
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            {resp.responseText.substring(0, 60)}...
                          </summary>
                          <p className="mt-1 whitespace-pre-wrap">{resp.responseText}</p>
                        </details>
                      </TableCell>
                      <TableCell className="text-xs">{resp.latencyMs ? `${resp.latencyMs}ms` : "—"}</TableCell>
                      <TableCell className="text-xs">{resp.tokensUsed ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {run.mentions && run.mentions.length > 0 && (
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4" />
              Parsed Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Mentions ({run.mentions.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {run.mentions.map((m) => (
                  <Badge
                    key={m.id}
                    variant={m.sentiment === "positive" ? "default" : m.sentiment === "negative" ? "destructive" : "secondary"}
                    className="gap-1"
                  >
                    {m.brandName}
                    {m.position && <span className="text-[10px] opacity-70">#{m.position}</span>}
                    <span className="text-[10px] opacity-70">×{m.frequency}</span>
                  </Badge>
                ))}
              </div>
            </div>
            {run.citations && run.citations.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  Citations ({run.citations.length})
                </p>
                <div className="space-y-1">
                  {run.citations.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="shrink-0 text-[10px]">{c.domain}</Badge>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {c.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {run.sentimentResults && run.sentimentResults.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Sentiment Scores</p>
                <div className="flex flex-wrap gap-3">
                  {Array.from(new Set(run.sentimentResults.map((s) => s.brandName))).map((brand) => {
                    const scores = run.sentimentResults!.filter((s) => s.brandName === brand)
                    const avg = scores.reduce((a, s) => a + s.score, 0) / scores.length
                    return (
                      <div key={brand} className="flex items-center gap-1 text-xs">
                        <span className="font-medium">{brand}:</span>
                        <span className={avg > 0.15 ? "text-green-400" : avg < -0.15 ? "text-red-400" : "text-muted-foreground"}>
                          {avg.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Execution Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {run.logs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No logs.</p>
          ) : (
            <div className="space-y-1">
              {run.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 rounded-md bg-muted/20 px-3 py-1.5 text-xs">
                  <Badge
                    variant={
                      log.level === "error" ? "destructive"
                      : log.level === "warn" ? "secondary"
                      : "outline"
                    }
                    className="shrink-0"
                  >
                    {log.level}
                  </Badge>
                  <span className="text-muted-foreground shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

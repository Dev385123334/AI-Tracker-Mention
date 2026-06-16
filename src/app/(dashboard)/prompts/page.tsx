import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { MessageSquare, Plus, Sparkles, Hash, FileText, ArrowRight, Copy } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PromptsPage() {
  const keywords = await prisma.keyword.findMany({
    include: {
      project: { select: { name: true } },
      prompts: {
        include: { _count: { select: { responses: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const totalKeywords = await prisma.keyword.count()
  const totalPrompts = await prisma.prompt.count()
  const totalResponses = await prisma.providerResponse.count()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground">Manage keywords and AI prompt templates for monitoring</p>
        </div>
        <Link href="/projects">
          <Button className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-sm hover:opacity-90 gap-1.5">
            <Plus className="h-4 w-4" />
            New Keyword
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Keywords</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeywords}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prompt Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrompts}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Responses Collected</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(keywords.map((k) => k.projectId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Keyword Generation */}
        <Card className="bg-white shadow-sm border-border/40 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#7C3AED]" />
              AI Keyword Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gradient-to-br from-[#7C3AED]/5 to-[#EC4899]/5 p-5 border border-[#7C3AED]/10">
              <p className="text-sm text-muted-foreground mb-4">
                Generate relevant keywords for your industry using AI. Our system analyzes your brand, competitors, and industry trends to suggest high-impact keywords.
              </p>
              <Link href="/projects">
                <Button className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-sm hover:opacity-90 gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Generate Keywords
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Keywords List */}
        <Card className="bg-white shadow-sm border-border/40 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-[#7C3AED]" />
              Recent Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keywords.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No keywords yet. Create a project and add keywords to start monitoring.
              </p>
            ) : (
              <div className="space-y-2">
                {keywords.map((keyword) => (
                  <div
                    key={keyword.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs font-mono">
                        {keyword.keyword}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {keyword.project.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {keyword.prompts.length} prompt{keyword.prompts.length > 1 ? "s" : ""}
                      </span>
                      <Link href={`/projects/${keyword.projectId}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompt Templates Section */}
        <Card className="bg-white shadow-sm border-border/40 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#7C3AED]" />
              Prompt Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Brand Mention</span>
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-mono bg-muted/30 p-2 rounded">
                  &quot;Tell me about [brand] in the context of [keyword]&quot;
                </p>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <div className="rounded-lg border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Competitor Comparison</span>
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-mono bg-muted/30 p-2 rounded">
                  &quot;Compare [brand] vs [competitor] for [keyword]&quot;
                </p>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <div className="rounded-lg border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Industry Overview</span>
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-mono bg-muted/30 p-2 rounded">
                  &quot;What are the top companies in [industry] for [keyword]?&quot;
                </p>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <div className="rounded-lg border border-border/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Custom Prompt</span>
                  <Badge variant="outline" className="text-xs">Custom</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Create your own custom prompt template for specific monitoring needs.
                </p>
                <Link href="/projects">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Plus className="h-3 w-3" /> Create
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

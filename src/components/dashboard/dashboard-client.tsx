"use client"

import { ArrowRight, BarChart3, Globe, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CompetitorTable } from "@/components/dashboard/competitor-table"
import { VisibilityChart } from "@/components/dashboard/visibility-chart"
import { SourceTypeChart } from "@/components/dashboard/source-type-chart"
import { TopDomainsCard } from "@/components/dashboard/top-domains-card"
import { RecentChats } from "@/components/dashboard/recent-chats"
import Link from "next/link"

interface DashboardData {
  project: {
    id: string
    name: string
    brandName: string
    domain: string
    description: string | null
    targetCountries: string[]
  }
  competitors: {
    id: string
    name: string
    domain: string
    visibility: number
    sentiment: "positive" | "neutral" | "negative"
    position: number
    isUser: boolean
  }[]
}

export function DashboardClient({ data }: { data: DashboardData | null }) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold tracking-tight">No projects yet</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Create your first brand tracker to start monitoring your AI visibility.
          </p>
        </div>
        <Link
          href="/onboarding/welcome"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Create your first project
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{data.project.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data.project.domain}</p>
        </div>
        {data.project.targetCountries?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-w-[300px] justify-end">
            {data.project.targetCountries.slice(0, 3).map((country) => (
              <Badge key={country} variant="secondary" className="text-xs gap-1">
                <Globe className="h-3 w-3" />
                {country}
              </Badge>
            ))}
            {data.project.targetCountries.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{data.project.targetCountries.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* 50/50 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompetitorTable data={data.competitors} />
        <VisibilityChart data={data.competitors} />
      </div>

      {/* Source Type + Top Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceTypeChart domain={data.project.domain} />
        <TopDomainsCard domain={data.project.domain} />
      </div>

      {/* Recent AI Chats */}
      <RecentChats domain={data.project.domain} brandName={data.project.brandName} />
    </div>
  )
}

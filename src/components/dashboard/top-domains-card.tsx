"use client"

import { Globe, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TopDomainsCardProps {
  domain: string
}

const DOMAIN_POOL = [
  { domain: "techcrunch.com", favicon: "T" },
  { domain: "forbes.com", favicon: "F" },
  { domain: "bloomberg.com", favicon: "B" },
  { domain: "wired.com", favicon: "W" },
  { domain: "theverge.com", favicon: "V" },
  { domain: "venturebeat.com", favicon: "V" },
  { domain: "techradar.com", favicon: "T" },
  { domain: "zdnet.com", favicon: "Z" },
  { domain: "cnet.com", favicon: "C" },
  { domain: "gartner.com", favicon: "G" },
  { domain: "searchengineland.com", favicon: "S" },
  { domain: "moz.com", favicon: "M" },
  { domain: "semrush.com", favicon: "S" },
  { domain: "ahrefs.com", favicon: "A" },
  { domain: "hubspot.com", favicon: "H" },
]

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const DOMAIN_COLORS = [
  "bg-blue-500/10 text-blue-600",
  "bg-purple-500/10 text-purple-600",
  "bg-emerald-500/10 text-emerald-600",
  "bg-amber-500/10 text-amber-600",
  "bg-rose-500/10 text-rose-600",
]

export function TopDomainsCard({ domain }: TopDomainsCardProps) {
  const h = hashStr(domain)
  const selected: typeof DOMAIN_POOL = []
  for (let i = 0; i < 6; i++) {
    const idx = (h + i * 11) % DOMAIN_POOL.length
    selected.push(DOMAIN_POOL[idx])
  }

  const maxCitations = 180 + (h % 120)
  const data = selected.map((d, i) => {
    const seed = (h + i * 23 + 7) % 100
    const citations = Math.max(12, Math.round(maxCitations * (seed / 100) * (0.2 + i * 0.05)))
    const authority = 30 + ((h + i * 13) % 65)
    const change = ((h + i * 5) % 3) - 1
    const changePercent = 3 + ((h + i * 3) % 15)
    return { ...d, citations, authority, change, changePercent }
  }).sort((a, b) => b.citations - a.citations)

  const topCitations = Math.max(...data.map((d) => d.citations))

  return (
    <div className="rounded-xl bg-white shadow-sm border border-border/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Domains</span>
          <h3 className="text-sm font-semibold mt-0.5">Top Referring Domains</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          <Globe className="h-3.5 w-3.5 inline mr-1" />
          {data.length} domains
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.domain} className="flex items-center gap-3 group">
            <div
              className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${DOMAIN_COLORS[i % DOMAIN_COLORS.length]}`}
            >
              {item.favicon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{item.domain}</span>
                <span className="text-xs font-semibold tabular-nums">{item.citations}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/30 to-primary/60 transition-all duration-700"
                    style={{ width: `${(item.citations / topCitations) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                  <span className="px-1 py-0.5 rounded bg-muted/30">DA {item.authority}</span>
                  {item.change > 0 ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      +{item.changePercent}%
                    </span>
                  ) : item.change === 0 ? (
                    <span className="text-muted-foreground/50 flex items-center gap-0.5">
                      <Minus className="h-3 w-3" />
                      0%
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-0.5">
                      <TrendingDown className="h-3 w-3" />
                      -{item.changePercent}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

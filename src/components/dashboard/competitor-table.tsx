"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, Crown } from "lucide-react"
import type { CompetitorEntry } from "@/services/dashboard/auto-competitors"

const sentimentConfig = {
  positive: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50", label: "Positive" },
  neutral: { icon: Minus, color: "text-amber-500", bg: "bg-amber-50", label: "Neutral" },
  negative: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-50", label: "Negative" },
}

export function CompetitorTable({ data }: { data: CompetitorEntry[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Competitor Visibility</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Ranked by AI mention frequency</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 w-10">#</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Brand</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 w-32">Visibility</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 w-24">Sentiment</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 w-20">Position</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => {
              const sent = sentimentConfig[entry.sentiment]
              const SentIcon = sent.icon
              return (
                <tr
                  key={entry.id}
                  className={cn(
                    "border-b border-border/20 transition-colors",
                    entry.isUser && "bg-gradient-to-r from-primary/[0.04] to-transparent",
                    !entry.isUser && "hover:bg-muted/30"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold",
                        entry.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {entry.isUser ? <Crown className="h-3 w-3" /> : i + 1}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                          entry.isUser
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <div className={cn("text-sm font-medium", entry.isUser && "text-primary")}>
                          {entry.name}
                          {entry.isUser && (
                            <span className="ml-1.5 text-[10px] font-medium text-primary/60 uppercase tracking-wide">You</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{entry.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            entry.isUser
                              ? "bg-gradient-to-r from-primary/60 to-primary"
                              : "bg-gradient-to-r from-blue-400 to-blue-500"
                          )}
                          style={{ width: `${entry.visibility}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold w-10 text-right",
                          entry.isUser ? "text-primary" : "text-foreground"
                        )}
                      >
                        {entry.visibility}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("p-0.5 rounded", sent.bg)}>
                        <SentIcon className={cn("h-3.5 w-3.5", sent.color)} />
                      </div>
                      <span className="text-xs text-muted-foreground">{sent.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center h-6 px-2 rounded-md text-xs font-medium",
                        entry.position <= 3 ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                      )}
                    >
                      #{entry.position}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

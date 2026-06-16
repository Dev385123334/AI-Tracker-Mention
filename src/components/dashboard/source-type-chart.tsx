"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Globe, Bot, Sparkles, Search, Brain } from "lucide-react"

interface SourceTypeChartProps {
  domain: string
}

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const SOURCES = [
  { key: "chatgpt", label: "ChatGPT", icon: Sparkles, gradientId: "srcChatGPT" },
  { key: "gemini", label: "Gemini", icon: Bot, gradientId: "srcGemini" },
  { key: "perplexity", label: "Perplexity", icon: Search, gradientId: "srcPerplexity" },
  { key: "claude", label: "Claude", icon: Brain, gradientId: "srcClaude" },
  { key: "google_ai", label: "Google AI", icon: Globe, gradientId: "srcGoogle" },
]

const COLORS = [
  { start: "#6366f1", end: "#8b5cf6" },
  { start: "#06b6d4", end: "#3b82f6" },
  { start: "#f59e0b", end: "#ef4444" },
  { start: "#10b981", end: "#059669" },
  { start: "#a855f7", end: "#d946ef" },
]

export function SourceTypeChart({ domain }: SourceTypeChartProps) {
  const h = hashStr(domain)
  const total = 140 + (h % 60)
  const data = SOURCES.map((s, i) => {
    const seed = (h + i * 17) % 100
    const value = Math.max(8, Math.round(total * (seed / 100) * (0.15 + (i * 0.04))))
    return { ...s, value }
  })

  const chartTotal = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl bg-white shadow-sm border border-border/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Source Type</span>
          <h3 className="text-sm font-semibold mt-0.5">Citation Sources</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
          Live
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="0" height="0">
            <defs>
              {COLORS.map((c, i) => (
                <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={c.start} />
                  <stop offset="100%" stopColor={c.end} />
                </linearGradient>
              ))}
            </defs>
          </svg>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                animationBegin={100}
                animationDuration={1200}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.key} fill={`url(#grad-${i})`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  padding: "8px 12px",
                }}
                formatter={(value) => `${value} citations`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xl font-bold tracking-tight">{chartTotal}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {data.map((source, i) => {
            const percentage = Math.round((source.value / chartTotal) * 100)
            return (
              <div key={source.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <source.icon className="h-3.5 w-3.5" style={{ color: COLORS[i].start }} />
                    <span className="font-medium">{source.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{source.value}</span>
                    <span className="w-8 text-right">{percentage}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${COLORS[i].start}, ${COLORS[i].end})`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

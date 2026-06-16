"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { CompetitorEntry } from "@/services/dashboard/auto-competitors"

const GRADIENT_COLORS = [
  { from: "#6366f1", to: "#818cf8" },
  { from: "#3b82f6", to: "#60a5fa" },
  { from: "#06b6d4", to: "#22d3ee" },
  { from: "#10b981", to: "#34d399" },
  { from: "#f59e0b", to: "#fbbf24" },
]

export function VisibilityChart({ data }: { data: CompetitorEntry[] }) {
  const chartData = data.map((entry, i) => ({
    name: entry.name,
    visibility: entry.visibility,
    isUser: entry.isUser,
    index: i,
  }))

  return (
    <div className="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Visibility Overview</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Brand mention rate across AI platforms
        </p>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
            <defs>
              {GRADIENT_COLORS.map((g, i) => (
                <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={g.from} />
                  <stop offset="100%" stopColor={g.to} />
                </linearGradient>
              ))}
              <linearGradient id="gradient-user" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={140}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`${String(value)}%`, "Visibility"]}
              labelFormatter={(label) => String(label)}
            />
            <Bar dataKey="visibility" radius={[0, 4, 4, 0]} barSize={28}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.index}
                  fill={entry.isUser ? "url(#gradient-user)" : `url(#gradient-${entry.index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-indigo-500 to-indigo-400" />
            <span>Competitors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-violet-500 to-violet-400" />
            <span>Your Brand</span>
          </div>
        </div>
      </div>
    </div>
  )
}

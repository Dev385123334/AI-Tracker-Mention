"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface GeoScoreTrendPoint {
  date: string
  score: number
}

interface GeoScoreLineChartProps {
  data: GeoScoreTrendPoint[]
}

export function GeoScoreLineChart({ data }: GeoScoreLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No trend data available yet
      </div>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          stroke="rgba(0,0,0,0.08)"
          tickMargin={8}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          stroke="rgba(0,0,0,0.08)"
          tickMargin={8}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "10px",
            fontSize: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 3, fill: "hsl(var(--primary))" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

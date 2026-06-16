"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SentimentPieChartProps {
  positive?: number
  negative?: number
  neutral?: number
  height?: number
}

const COLORS = {
  positive: "#34d399",
  negative: "#f87171",
  neutral: "#9ca3af",
}

export function SentimentPieChart({ positive = 0, negative = 0, neutral = 0, height = 250 }: SentimentPieChartProps) {
  const data = [
    { name: "Positive", value: positive, color: COLORS.positive },
    { name: "Negative", value: negative, color: COLORS.negative },
    { name: "Neutral", value: neutral, color: COLORS.neutral },
  ].filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-muted-foreground">No sentiment data</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "10px",
            fontSize: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

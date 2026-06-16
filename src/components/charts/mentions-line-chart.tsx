"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface MentionsLineChartProps {
  labels: string[]
  series: { name: string; data: number[] }[]
  height?: number
}

const COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a78bfa"]

export function MentionsLineChart({ labels, series, height = 300 }: MentionsLineChartProps) {
  const data = labels.map((label, i) => {
    const point: Record<string, string | number> = { date: label }
    series.forEach((s) => {
      point[s.name] = s.data[i] ?? 0
    })
    return point
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="rgba(0,0,0,0.08)" />
        <YAxis tick={{ fontSize: 11 }} stroke="rgba(0,0,0,0.08)" />
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
        {series.map((s, i) => (
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

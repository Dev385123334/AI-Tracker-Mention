"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface CitationBarChartProps {
  data: { domain: string; count: number }[]
  height?: number
}

const COLORS = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#fb923c"]

export function CitationBarChart({ data, height = 300 }: CitationBarChartProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 10)

  const chartData = sorted.map((d) => ({
    name: d.domain.length > 20 ? d.domain.slice(0, 20) + "..." : d.domain,
    citations: d.count,
    fullName: d.domain,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="rgba(0,0,0,0.08)" />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          stroke="rgba(0,0,0,0.08)"
          width={140}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "10px",
            fontSize: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
          formatter={(value, _name, props) => {
            const p = props as { payload: { fullName: string } }
            return [`${value}`, p.payload.fullName]
          }}
        />
        <Bar dataKey="citations" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

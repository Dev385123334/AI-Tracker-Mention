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

interface BrandBarChartProps {
  data: { brandName: string; mentionCount: number; sentimentBreakdown?: { positive: number; negative: number; neutral: number } }[]
  height?: number
}

const COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24", "#60a5fa", "#a78bfa", "#fb923c"]

export function BrandBarChart({ data, height = 300 }: BrandBarChartProps) {
  const sorted = [...data].sort((a, b) => b.mentionCount - a.mentionCount).slice(0, 10)

  const chartData = sorted.map((d) => ({
    name: d.brandName.length > 12 ? d.brandName.slice(0, 12) + "..." : d.brandName,
    mentions: d.mentionCount,
    fullName: d.brandName,
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
          width={120}
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
        <Bar dataKey="mentions" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

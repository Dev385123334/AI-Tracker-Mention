"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface VisibilityComparisonChartProps {
  brandName: string
  brandMentions: number
  competitors: { name: string; mentionCount: number; avgPosition: number | null; mentionRate: number }[]
  metric?: "mentions" | "position" | "rate"
  height?: number
}

export function VisibilityComparisonChart({
  brandName,
  brandMentions,
  competitors,
  metric = "mentions",
  height = 300,
}: VisibilityComparisonChartProps) {
  const data = [
    {
      name: brandName.length > 12 ? brandName.slice(0, 12) + "..." : brandName,
      value: metric === "mentions" ? brandMentions : metric === "rate" ? 0 : 0,
      fullName: brandName,
    },
    ...competitors.map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
      value: metric === "mentions"
        ? c.mentionCount
        : metric === "position"
          ? c.avgPosition ?? 0
          : Math.round(c.mentionRate * 100),
      fullName: c.name,
    })),
  ]

  const label = metric === "mentions" ? "Mentions" : metric === "position" ? "Avg Position" : "Mention Rate (%)"

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgba(0,0,0,0.08)" />
        <YAxis tick={{ fontSize: 11 }} stroke="rgba(0,0,0,0.08)" />
        <Tooltip
          contentStyle={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "10px",
            fontSize: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
          formatter={(value) => [`${value}`, label]}
        />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
        <Bar dataKey="value" name={label} fill="#818cf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

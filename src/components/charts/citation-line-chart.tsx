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

interface CitationLineChartProps {
  labels: string[]
  data: number[]
  height?: number
}

export function CitationLineChart({ labels, data, height = 250 }: CitationLineChartProps) {
  const chartData = labels.map((label, i) => ({
    date: label,
    citations: data[i] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
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
        <Line
          type="monotone"
          dataKey="citations"
          stroke="#34d399"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

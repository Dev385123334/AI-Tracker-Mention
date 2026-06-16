"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

interface ImpactForecastChartProps {
  data: { name: string; impact: number; difficulty: number; priority: number }[]
}

function getBarColor(priority: number): string {
  if (priority >= 80) return "#22c55e"
  if (priority >= 60) return "#eab308"
  if (priority >= 40) return "#f97316"
  return "#ef4444"
}

export function ImpactForecastChart({ data }: ImpactForecastChartProps) {
  if (data.length === 0) return null
  return (
    <Card className="bg-white shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          Impact vs. Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "white", border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "10px", fontSize: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
              />
              <Bar dataKey="impact" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="difficulty" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="priority" radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.priority)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

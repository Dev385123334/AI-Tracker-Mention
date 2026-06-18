"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Minus, Crown } from "lucide-react"

const visibilityData = [
  { name: "Your Brand", visibility: 86, fill: "url(#brandGrad)" },
  { name: "Competitor A", visibility: 72, fill: "#3B82F6" },
  { name: "Competitor B", visibility: 58, fill: "#F59E0B" },
  { name: "Competitor C", visibility: 45, fill: "#10B981" },
  { name: "Competitor D", visibility: 31, fill: "#8B5CF6" },
]

const trendData = [
  { month: "Jan", brand: 45, market: 38 },
  { month: "Feb", brand: 52, market: 40 },
  { month: "Mar", brand: 58, market: 42 },
  { month: "Apr", brand: 63, market: 45 },
  { month: "May", brand: 72, market: 48 },
  { month: "Jun", brand: 86, market: 52 },
]

const competitorRows = [
  { rank: 1, name: "Your Brand", visibility: 86, sentiment: "positive", position: 1, isUser: true },
  { rank: 2, name: "Competitor A", visibility: 72, sentiment: "positive", position: 2, isUser: false },
  { rank: 3, name: "Competitor B", visibility: 58, sentiment: "neutral", position: 3, isUser: false },
  { rank: 4, name: "Competitor C", visibility: 45, sentiment: "positive", position: 4, isUser: false },
  { rank: 5, name: "Competitor D", visibility: 31, sentiment: "negative", position: 5, isUser: false },
]

const geoScoreData = {
  score: 68,
  visibilityScore: 72,
  positionScore: 65,
  citationScore: 55,
  sentimentScore: 80,
}

const citationData = [
  { domain: "techcrunch.com", count: 12, authority: "High" },
  { domain: "forbes.com", count: 8, authority: "High" },
  { domain: "businessinsider.com", count: 5, authority: "Medium" },
  { domain: "venturebeat.com", count: 4, authority: "Medium" },
  { domain: "g2.com", count: 3, authority: "High" },
]

const slides = [
  {
    id: "visibility",
    title: "Visibility Overview",
    subtitle: "Brand mention rate across AI platforms",
    gradient: "from-[#7C3AED]/5 to-[#EC4899]/5",
  },
  {
    id: "trends",
    title: "Visibility Trends",
    subtitle: "6-month growth trajectory",
    gradient: "from-blue-500/5 to-[#7C3AED]/5",
  },
  {
    id: "competitors",
    title: "Competitor Rankings",
    subtitle: "Ranked by AI mention frequency",
    gradient: "from-amber-500/5 to-rose-500/5",
  },
  {
    id: "geo-score",
    title: "GEO Score Breakdown",
    subtitle: "Multi-dimensional visibility analysis",
    gradient: "from-emerald-500/5 to-[#7C3AED]/5",
  },
  {
    id: "citations",
    title: "Top Citation Sources",
    subtitle: "Domains that mention your brand most",
    gradient: "from-violet-500/5 to-blue-500/5",
  },
]

interface DashboardCarouselProps {
  defaultSlide?: number
  autoRotate?: boolean
}

export function DashboardCarousel({ defaultSlide = 0, autoRotate = true }: DashboardCarouselProps) {
  const [active, setActive] = useState(defaultSlide)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((a) => (a + 1) % slides.length)
  }, [])

  useEffect(() => {
    if (!autoRotate || paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [autoRotate, paused, next])

  const slide = slides[active]

  return (
    <div className="relative">
      <div
        className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl shadow-[#7C3AED]/5 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAFAFA] border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs text-[#6B7280] font-medium ml-1">Dashboard — {slide.title}</span>
          </div>
          <div className="flex items-center gap-1">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-[#7C3AED]" : "w-1.5 bg-[#E5E7EB] hover:bg-[#D1D5DB]"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className={`bg-gradient-to-br ${slide.gradient}`}
          >
            <div className="p-5">
              {slide.id === "visibility" && <VisibilityView />}
              {slide.id === "trends" && <TrendsView />}
              {slide.id === "competitors" && <CompetitorsView />}
              {slide.id === "geo-score" && <GeoScoreView />}
              {slide.id === "citations" && <CitationsView />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-[#E5E7EB]/40 -z-10" />
    </div>
  )
}

function VisibilityView() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {[
          { label: "Overall Score", value: "86", change: "+12%", color: "from-[#7C3AED] to-[#EC4899]" },
          { label: "Total Mentions", value: "2,847", change: "+18.3%", color: "from-emerald-500 to-emerald-400" },
          { label: "Platforms Active", value: "5/5", change: "All connected", color: "from-blue-500 to-blue-400" },
          { label: "Avg. Sentiment", value: "7.4", change: "+0.6", color: "from-amber-500 to-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[#E5E7EB] bg-white p-3">
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${stat.color}`} />
              <span className="text-[10px] text-[#6B7280] font-medium">{stat.label}</span>
            </div>
            <div className="text-lg font-bold text-[#111827] mt-1">{stat.value}</div>
            <span className="text-[10px] font-medium text-emerald-600">{stat.change}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
        <span className="text-[10px] font-medium text-[#6B7280]">Visibility by Platform</span>
        <div className="h-40 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visibilityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey="visibility" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function TrendsView() {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-[#6B7280]">Visibility Growth</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[#7C3AED]" />
            <span className="text-[9px] text-[#6B7280]">Your Brand</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[#9CA3AF]" />
            <span className="text-[9px] text-[#6B7280]">Market Avg</span>
          </div>
        </div>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="brandArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
            />
            <Area type="monotone" dataKey="brand" stroke="#7C3AED" strokeWidth={2} fill="url(#brandArea)" dot={{ fill: "#7C3AED", r: 3 }} />
            <Area type="monotone" dataKey="market" stroke="#9CA3AF" strokeWidth={1.5} fill="none" strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CompetitorsView() {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
            <th className="text-left font-medium text-[#6B7280] px-3 py-2.5">#</th>
            <th className="text-left font-medium text-[#6B7280] px-3 py-2.5">Brand</th>
            <th className="text-left font-medium text-[#6B7280] px-3 py-2.5">Visibility</th>
            <th className="text-left font-medium text-[#6B7280] px-3 py-2.5">Sentiment</th>
            <th className="text-left font-medium text-[#6B7280] px-3 py-2.5">Position</th>
          </tr>
        </thead>
        <tbody>
          {competitorRows.map((row) => (
            <tr
              key={row.name}
              className={`border-b border-[#E5E7EB]/50 last:border-0 ${row.isUser ? "bg-[#7C3AED]/[0.02]" : ""}`}
            >
              <td className="px-3 py-2.5">
                <div className={`h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold ${row.isUser ? "bg-[#7C3AED] text-white" : "bg-[#F7F8FC] text-[#6B7280]"}`}>
                  {row.isUser ? <Crown className="h-2.5 w-2.5" /> : row.rank}
                </div>
              </td>
              <td className="px-3 py-2.5">
                <span className={`font-medium ${row.isUser ? "text-[#7C3AED]" : "text-[#111827]"}`}>
                  {row.name}
                  {row.isUser && <span className="ml-1 text-[9px] text-[#7C3AED]/60 uppercase">You</span>}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 rounded-full bg-[#F7F8FC] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.isUser ? "bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" : "bg-blue-400"}`}
                      style={{ width: `${row.visibility}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#111827]">{row.visibility}%</span>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1">
                  {row.sentiment === "positive" ? <TrendingUp className="h-3 w-3 text-emerald-500" /> :
                   row.sentiment === "neutral" ? <Minus className="h-3 w-3 text-amber-500" /> :
                   <TrendingDown className="h-3 w-3 text-red-500" />}
                  <span className="text-[10px] text-[#6B7280] capitalize">{row.sentiment}</span>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                  #{row.position}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GeoScoreView() {
  const items = [
    { label: "Overall GEO Score", value: geoScoreData.score, max: 100, color: "from-[#7C3AED] to-[#EC4899]" },
    { label: "Visibility Score", value: geoScoreData.visibilityScore, max: 100, color: "from-blue-500 to-blue-400" },
    { label: "Position Score", value: geoScoreData.positionScore, max: 100, color: "from-amber-500 to-amber-400" },
    { label: "Citation Score", value: geoScoreData.citationScore, max: 100, color: "from-emerald-500 to-emerald-400" },
    { label: "Sentiment Score", value: geoScoreData.sentimentScore, max: 100, color: "from-violet-500 to-violet-400" },
  ]

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
      <span className="text-[10px] font-medium text-[#6B7280]">Score Breakdown</span>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#111827] font-medium">{item.label}</span>
              <span className="text-[11px] font-bold text-[#111827]">{item.value}/{item.max}</span>
            </div>
            <div className="h-2 rounded-full bg-[#F7F8FC] overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CitationsView() {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5">
      <span className="text-[10px] font-medium text-[#6B7280]">Top Referring Domains</span>
      <div className="mt-3 space-y-2">
        {citationData.map((item) => (
          <div key={item.domain} className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/50 last:border-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#F7F8FC] flex items-center justify-center text-[10px] font-bold text-[#6B7280]">
                {item.domain[0].toUpperCase()}
              </div>
              <div>
                <div className="text-[11px] font-medium text-[#111827]">{item.domain}</div>
                <div className="text-[9px] text-[#6B7280]">Authority: {item.authority}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#111827]">{item.count}</div>
              <div className="text-[9px] text-[#6B7280]">citations</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

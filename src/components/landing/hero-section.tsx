"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BarChart3, Bell, ChevronDown, Globe, LayoutDashboard, LineChart, Search, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const ease = [0.25, 0.1, 0.25, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease } },
})

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F8FC] via-white to-white pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#7C3AED]/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 pt-28 pb-24 lg:pt-36 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div {...fadeUp(0)} className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/10 text-xs font-medium text-[#7C3AED] tracking-wide uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              AI Marketing Intelligence Platform
            </div>

            <h1 className="text-[42px] leading-[1.08] lg:text-[56px] font-bold tracking-[-0.03em] text-[#111827]">
              Track, Monitor & Grow Your Brand Across AI Search
            </h1>

            <p className="mt-6 text-[17px] leading-relaxed text-[#6B7280] max-w-lg">
              Understand how ChatGPT, Gemini, Claude, Perplexity, and other AI platforms mention your brand. Monitor visibility, citations, sentiment, competitors, and opportunities from one unified dashboard.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="h-13 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 border-0 transition-all duration-300"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/book-demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 text-[15px] font-medium gap-2 rounded-xl border-[#E5E7EB] text-[#111827] hover:bg-[#F7F8FC]"
                >
                  Book Demo
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                14-day free trial
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl shadow-[#7C3AED]/5 overflow-hidden">
              <DashboardMockup />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-[#E5E7EB]/40 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Search, label: "Brand Visibility", active: false },
    { icon: TrendingUp, label: "AI Mentions", active: false },
    { icon: Users, label: "Competitors", active: false },
    { icon: BarChart3, label: "Prompt Tracking", active: false },
    { icon: LineChart, label: "Reports", active: false },
    { icon: Globe, label: "Analytics", active: false },
    { icon: Bell, label: "Alerts", active: false },
  ]

  const statCards = [
    { label: "AI Visibility Score", value: "86", change: "+12%", color: "from-[#7C3AED] to-[#EC4899]" },
    { label: "Mention Growth", value: "247", change: "+18.3%", color: "from-emerald-500 to-emerald-400" },
    { label: "Sentiment Score", value: "74", change: "+5.2%", color: "from-blue-500 to-blue-400" },
    { label: "Citation Count", value: "1,342", change: "+8.7%", color: "from-amber-500 to-amber-400" },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">AV</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] bg-[#F7F8FC] rounded-lg px-2.5 py-1.5">
            Workspace
            <ChevronDown className="h-3 w-3" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input type="text" placeholder="Search..." className="w-40 h-8 rounded-lg bg-[#F7F8FC] border border-[#E5E7EB] pl-8 pr-3 text-xs outline-none focus:border-[#7C3AED]/30" />
          </div>
          <Bell className="h-4 w-4 text-[#6B7280]" />
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-[9px] font-bold text-white">JD</div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-44 border-r border-[#E5E7EB] bg-[#FAFAFA] p-2.5 space-y-0.5 shrink-0">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                item.active ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]" : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
              }`}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 space-y-4 bg-white">
          <div className="grid grid-cols-4 gap-3">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
                <div className="text-[10px] text-[#6B7280] font-medium">{card.label}</div>
                <div className="flex items-end justify-between mt-1.5">
                  <span className="text-lg font-bold text-[#111827] tracking-tight">{card.value}</span>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{card.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium text-[#6B7280]">Visibility Over Time</span>
                <div className="flex items-center gap-1.5">
                  {["ChatGPT", "Gemini", "Claude", "Perplexity"].map((p) => (
                    <span key={p} className="text-[8px] text-[#6B7280] px-1">{p}</span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 280 80" className="w-full h-16">
                <defs>
                  <linearGradient id="line1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <path d="M0 70 Q 35 65, 70 55 T 140 40 T 210 30 T 280 25" fill="none" stroke="url(#line1)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M0 75 Q 35 70, 70 60 T 140 50 T 210 45 T 280 40" fill="none" stroke="#34d399" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
                <path d="M0 65 Q 35 60, 70 50 T 140 45 T 210 35 T 280 20" fill="none" stroke="#60a5fa" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
                <path d="M0 72 Q 35 68, 70 58 T 140 48 T 210 38 T 280 30" fill="none" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
              </svg>
            </div>

            <div className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium text-[#6B7280]">Share of AI Voice</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Your Brand", value: 34, color: "from-[#7C3AED] to-[#EC4899]" },
                  { label: "Competitor A", value: 28, color: "from-blue-500 to-blue-400" },
                  { label: "Competitor B", value: 22, color: "from-amber-500 to-amber-400" },
                  { label: "Competitor C", value: 16, color: "from-emerald-500 to-emerald-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[9px] text-[#6B7280] w-20 shrink-0">{item.label}</span>
                    <div className="flex-1 h-3 rounded-full bg-[#F7F8FC] overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                    <span className="text-[9px] font-medium text-[#111827] w-6 text-right">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-[#6B7280]">Prompt Tracking</span>
              <span className="text-[8px] text-[#7C3AED] font-medium">View all →</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-[8px] text-[#6B7280] font-medium pb-1.5 border-b border-[#E5E7EB]">
              <span>Prompt</span>
              <span>Platform</span>
              <span>Rank</span>
              <span>Visibility</span>
              <span>Sentiment</span>
            </div>
            {[
              { prompt: "best marketing tools", platform: "ChatGPT", rank: "2", vis: "High", sent: "Positive" },
              { prompt: "AI analytics platform", platform: "Gemini", rank: "4", vis: "Medium", sent: "Neutral" },
              { prompt: "brand tracking software", platform: "Perplexity", rank: "1", vis: "High", sent: "Positive" },
              { prompt: "competitor analysis AI", platform: "Claude", rank: "3", vis: "Medium", sent: "Positive" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 text-[9px] text-[#111827] py-1.5 border-b border-[#E5E7EB]/50 last:border-0">
                <span className="truncate">{row.prompt}</span>
                <span>{row.platform}</span>
                <span className="font-medium">{row.rank}</span>
                <span className={row.vis === "High" ? "text-emerald-600" : "text-amber-600"}>{row.vis}</span>
                <span className={row.sent === "Positive" ? "text-emerald-600" : "text-amber-600"}>{row.sent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

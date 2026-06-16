"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/landing/hero-section"
import { ArrowRight, BarChart3, Bell, Check, ChevronDown, FileText, Globe, Menu, MessageSquare, Monitor, PieChart, Search, Sliders, Sparkles, Target, TrendingUp, Users, X } from "lucide-react"

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB]/50">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold text-white">AV</span>
          </div>
          <span className="font-semibold text-sm text-[#111827]">AI Visibility</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[#6B7280]">
          <Link href="#features" className="hover:text-[#111827] transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-[#111827] transition-colors">How it Works</Link>
          <Link href="#integrations" className="hover:text-[#111827] transition-colors">Integrations</Link>
          <Link href="#pricing" className="hover:text-[#111827] transition-colors">Pricing</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-sm text-[#6B7280]">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-sm shadow-[#7C3AED]/20 hover:shadow-md hover:shadow-[#7C3AED]/30 border-0 text-sm font-medium">
              Start Free Trial
            </Button>
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          {open ? <X className="h-5 w-5 text-[#111827]" /> : <Menu className="h-5 w-5 text-[#111827]" />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-[#E5E7EB]/50 bg-white px-6 py-4 space-y-3">
          <Link href="#features" className="block text-sm text-[#6B7280] py-1.5" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#how-it-works" className="block text-sm text-[#6B7280] py-1.5" onClick={() => setOpen(false)}>How it Works</Link>
          <Link href="#integrations" className="block text-sm text-[#6B7280] py-1.5" onClick={() => setOpen(false)}>Integrations</Link>
          <Link href="/login" onClick={() => setOpen(false)}><Button variant="ghost" size="sm" className="w-full text-sm">Sign in</Button></Link>
          <Link href="/signup" onClick={() => setOpen(false)}><Button size="sm" className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white border-0">Start Free Trial</Button></Link>
        </motion.div>
      )}
    </header>
  )
}

function SectionTitle({ label, title, description }: { label?: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center max-w-2xl mx-auto mb-16"
    >
      {label && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/10 text-xs font-medium text-[#7C3AED] tracking-wide uppercase mb-5">
          <span className="w-1 h-1 rounded-full bg-[#7C3AED]" />
          {label}
        </span>
      )}
      <h2 className="text-[32px] lg:text-[40px] font-bold tracking-[-0.03em] text-[#111827] leading-[1.15]">{title}</h2>
      <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed">{description}</p>
    </motion.div>
  )
}

const ease = [0.25, 0.1, 0.25, 1] as const

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease },
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { staggerChildren: 0.08 },
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease },
}

const logos = [
  "HubSpot", "Salesforce", "Notion", "Intercom", "Slack", "Stripe",
  "Vercel", "Linear", "Figma", "Loom", "Calendly", "Webflow",
  "Airtable", "Zapier", "Superhuman", "Retool",
]

function TrustSection() {
  return (
    <section className="py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]/40">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.p {...fadeInUp} className="text-center text-xs font-medium text-[#6B7280] tracking-widest uppercase mb-10">
          Trusted by Modern Marketing Teams
        </motion.p>
        <motion.div {...staggerContainer} className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <motion.div key={name} {...staggerItem} className="flex items-center justify-center">
              <span className="text-sm font-semibold text-[#9CA3AF] tracking-tight">{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const steps = [
  {
    step: "01",
    title: "Choose Keywords & Prompts",
    description: "Track the prompts your customers use across ChatGPT, Gemini, Claude, Perplexity, and more. Define the terms that matter most to your brand.",
    features: ["Unlimited keyword tracking", "AI-powered suggestions", "Prompt category management"],
    illustration: "🔍",
  },
  {
    step: "02",
    title: "Monitor Brand Visibility",
    description: "See exactly how often AI models mention your brand in responses. Track visibility trends, share of voice, and ranking positions across platforms.",
    features: ["Cross-platform visibility scores", "Trend analysis", "Share of AI voice metrics"],
    illustration: "📊",
  },
  {
    step: "03",
    title: "Analyze Competitors",
    description: "Compare your AI visibility against competitors. Understand who's winning in AI search and where you need to improve.",
    features: ["Competitor benchmarking", "Gap analysis", "Market intelligence reports"],
    illustration: "🎯",
  },
  {
    step: "04",
    title: "Optimize AI Search Presence",
    description: "Get actionable recommendations to improve your AI visibility. Track progress with automated reports and real-time alerts.",
    features: ["AI-powered recommendations", "Automated reports", "Real-time alerts"],
    illustration: "⚡",
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle label="Process" title="How It Works" description="Four simple steps to take control of your brand's AI presence." />
        <div className="space-y-16 lg:space-y-24">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <span className="text-[12px] font-bold text-[#7C3AED] tracking-widest">{s.step}</span>
                <h3 className="text-[28px] lg:text-[32px] font-bold tracking-[-0.02em] text-[#111827] mt-3 leading-[1.2]">{s.title}</h3>
                <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed">{s.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#6B7280]">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-8 lg:p-10 shadow-sm">
                  <div className="text-4xl mb-4">{s.illustration}</div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-[#6B7280] ml-1">Dashboard Preview</span>
                    </div>
                    <div className="h-32 rounded-lg bg-gradient-to-br from-[#7C3AED]/[0.04] via-[#EC4899]/[0.02] to-transparent border border-[#E5E7EB] flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-3 w-full px-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-12 rounded-lg bg-white border border-[#E5E7EB] p-2 flex flex-col justify-center">
                            <div className="h-1.5 w-8 rounded-full bg-[#E5E7EB]" />
                            <div className="h-3 w-12 rounded bg-gradient-to-r from-[#7C3AED]/30 to-[#EC4899]/30 mt-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    icon: Search,
    title: "Prompt Tracking",
    description: "Track how your brand appears in AI responses for every prompt and keyword across all major platforms.",
    preview: "🔍",
  },
  {
    icon: BarChart3,
    title: "AI Visibility Score",
    description: "Get a unified visibility score that measures your brand's presence across every AI search engine.",
    preview: "📈",
  },
  {
    icon: Users,
    title: "Competitor Monitoring",
    description: "Monitor competitor visibility and benchmark your performance against industry peers.",
    preview: "👥",
  },
  {
    icon: Globe,
    title: "Citation Tracking",
    description: "See exactly which sources AI models cite when mentioning your brand in their responses.",
    preview: "🌐",
  },
  {
    icon: MessageSquare,
    title: "Brand Sentiment Analysis",
    description: "Understand the sentiment of AI mentions — positive, negative, or neutral — across all platforms.",
    preview: "💬",
  },
  {
    icon: FileText,
    title: "Automated Reports",
    description: "Generate beautiful, shareable reports on your AI visibility with one click. Export to PDF or share via link.",
    preview: "📄",
  },
]

function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle label="Features" title="Everything You Need To Track AI Visibility" description="Monitor performance, analyze competitors, and uncover growth opportunities from one unified workspace." />
        <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                {...staggerItem}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 hover:shadow-lg hover:shadow-[#7C3AED]/5 transition-all duration-300 hover:border-[#7C3AED]/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <span className="text-xl">{feature.preview}</span>
                </div>
                <h3 className="font-semibold text-[#111827] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function ProductShowcase() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-[32px] lg:text-[44px] font-bold tracking-[-0.03em] text-[#111827] leading-[1.15]">
            Everything You Need To Understand AI Search
          </h2>
          <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed">
            Monitor performance, analyze competitors, and uncover growth opportunities from one unified workspace.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl shadow-[#7C3AED]/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E7EB]">
              <div className="h-3 w-3 rounded-full bg-destructive/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-[#6B7280] ml-2 font-medium">Dashboard — AI Visibility Overview</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: "Overall Score", value: "86", change: "+12%", gradient: "from-[#7C3AED] to-[#EC4899]" },
                  { label: "Total Mentions", value: "2,847", change: "+18.3%", gradient: "from-emerald-500 to-emerald-400" },
                  { label: "Platforms Active", value: "5/5", change: "All connected", gradient: "from-blue-500 to-blue-400" },
                  { label: "Avg. Sentiment", value: "7.4", change: "+0.6", gradient: "from-amber-500 to-amber-400" },
                  { label: "Competitors", value: "12", change: "Tracked", gradient: "from-violet-500 to-violet-400" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${stat.gradient}`} />
                      <span className="text-[10px] text-[#6B7280] font-medium">{stat.label}</span>
                    </div>
                    <div className="text-lg font-bold text-[#111827] mt-1">{stat.value}</div>
                    <span className="text-[10px] font-medium text-emerald-600">{stat.change}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
                  <span className="text-[10px] font-medium text-[#6B7280]">Visibility by Platform</span>
                  <div className="mt-3 space-y-2">
                    {[
                      { p: "ChatGPT", v: 92 },
                      { p: "Gemini", v: 78 },
                      { p: "Claude", v: 65 },
                      { p: "Perplexity", v: 71 },
                      { p: "Copilot", v: 44 },
                    ].map((item) => (
                      <div key={item.p} className="flex items-center gap-2">
                        <span className="text-[9px] text-[#6B7280] w-16">{item.p}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#F7F8FC] overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" style={{ width: `${item.v}%` }} />
                        </div>
                        <span className="text-[9px] font-medium text-[#111827] w-6 text-right">{item.v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] p-3 bg-white">
                  <span className="text-[10px] font-medium text-[#6B7280]">Recent Citations</span>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { src: "techcrunch.com", mention: "AI platform ranked #2", platform: "ChatGPT" },
                      { src: "forbes.com", mention: "Visibility growing 40%", platform: "Gemini" },
                      { src: "businessinsider.com", mention: "Top marketing AI tool", platform: "Claude" },
                      { src: "venturebeat.com", mention: "Strong competitor", platform: "Perplexity" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-[#E5E7EB]/50 last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] text-[#6B7280] truncate max-w-[120px]">{c.src}</span>
                          <span className="text-[9px] text-[#111827] truncate max-w-[120px]">{c.mention}</span>
                        </div>
                        <span className="text-[8px] text-[#7C3AED] font-medium shrink-0">{c.platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-white rounded-xl border border-[#E5E7EB] shadow-lg px-4 py-2.5 hidden lg:block">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              +18.3% mention growth
            </div>
          </div>
          <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 bg-white rounded-xl border border-[#E5E7EB] shadow-lg px-4 py-2.5 hidden lg:block">
            <div className="flex items-center gap-2 text-xs font-medium text-[#7C3AED]">
              <Sparkles className="h-3 w-3" />
              86 AI Visibility Score
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AnalyticsSection() {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/10 text-xs font-medium text-[#7C3AED] tracking-wide uppercase mb-5">
              <span className="w-1 h-1 rounded-full bg-[#7C3AED]" />
              Analytics
            </span>
            <h2 className="text-[32px] lg:text-[40px] font-bold tracking-[-0.03em] text-[#111827] leading-[1.15]">Deep Analytics & Insights</h2>
            <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed">
              Track visibility trends, analyze prompt performance, monitor market share, and uncover growth opportunities with powerful analytics.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: TrendingUp, label: "Visibility Trends", desc: "Track changes over time" },
                { icon: Sliders, label: "Prompt Analytics", desc: "See what drives AI mentions" },
                { icon: PieChart, label: "Market Share", desc: "Compare against competitors" },
                { icon: Target, label: "Citation Sources", desc: "Discover where AI cites you" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#111827]">{item.label}</div>
                      <div className="text-xs text-[#6B7280] mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-[#6B7280]">Analytics Overview</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#6B7280] px-2 py-0.5 rounded bg-[#F7F8FC]">7D</span>
                  <span className="text-[9px] text-[#7C3AED] font-medium px-2 py-0.5 rounded bg-[#7C3AED]/5">30D</span>
                  <span className="text-[9px] text-[#6B7280] px-2 py-0.5 rounded bg-[#F7F8FC]">90D</span>
                </div>
              </div>
              <svg viewBox="0 0 300 100" className="w-full h-24">
                <defs>
                  <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analyticsLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <path d="M0 80 Q 30 75, 50 70 T 100 55 T 150 50 T 200 40 T 250 35 T 300 30" fill="none" stroke="url(#analyticsLine)" strokeWidth="2" />
                <path d="M0 80 Q 30 75, 50 70 T 100 55 T 150 50 T 200 40 T 250 35 T 300 30 L 300 100 L 0 100 Z" fill="url(#area1)" />
                <path d="M0 85 Q 30 82, 50 78 T 100 70 T 150 65 T 200 60 T 250 58 T 300 55" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />
              </svg>
              <div className="flex items-center justify-between mt-2 text-[9px] text-[#6B7280]">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ReportingSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:order-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/10 text-xs font-medium text-[#7C3AED] tracking-wide uppercase mb-5">
              <span className="w-1 h-1 rounded-full bg-[#7C3AED]" />
              Reporting
            </span>
            <h2 className="text-[32px] lg:text-[40px] font-bold tracking-[-0.03em] text-[#111827] leading-[1.15]">Create Beautiful AI Visibility Reports</h2>
            <p className="mt-4 text-[16px] text-[#6B7280] leading-relaxed">
              Generate professional reports with one click. Export to PDF, schedule automated deliveries, share with your team, and keep stakeholders informed.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: FileText, label: "Export to PDF", desc: "One-click report generation" },
                { icon: Bell, label: "Scheduled Reports", desc: "Automated weekly or monthly" },
                { icon: Users, label: "Team Sharing", desc: "Collaborate with your team" },
                { icon: Monitor, label: "Executive Dashboards", desc: "High-level overview for leadership" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#111827]">{item.label}</div>
                      <div className="text-xs text-[#6B7280] mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:order-1"
          >
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E7EB]">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-[#6B7280] ml-2 font-medium">Report Builder</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 h-8 rounded-lg border border-[#E5E7EB] flex items-center px-3 text-[#6B7280]">Monthly AI Visibility Report</div>
                  <Button size="sm" className="h-8 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white border-0 text-xs font-medium">
                    Generate
                  </Button>
                </div>
                <div className="space-y-1">
                  {[
                    { label: "Executive Summary", checked: true },
                    { label: "Visibility Trends", checked: true },
                    { label: "Competitor Analysis", checked: true },
                    { label: "Citation Sources", checked: false },
                    { label: "Recommendations", checked: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 py-1">
                      <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${item.checked ? "bg-[#7C3AED] border-[#7C3AED]" : "border-[#E5E7EB]"}`}>
                        {item.checked && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <span className="text-[11px] text-[#111827]">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#6B7280] pt-1 border-t border-[#E5E7EB]">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> PDF</span>
                  <span className="flex items-center gap-1"><Bell className="h-3 w-3" /> Schedule</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Share</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    quote: "AI Visibility Tracker completely changed how we approach our brand presence. We discovered our brand was being mentioned in ways we never expected across ChatGPT and Gemini.",
    name: "Sarah Chen",
    role: "VP of Marketing",
    company: "ScaleFlow",
  },
  {
    quote: "The competitor analysis is incredible. We can see exactly where we stand against our competitors across every AI platform. This is becoming essential for any marketing team.",
    name: "Marcus Rodriguez",
    role: "Director of Brand Strategy",
    company: "NexGen Solutions",
  },
  {
    quote: "We were able to increase our AI visibility by 40% in the first month using the platform's recommendations. The automated reports save our team hours every week.",
    name: "Emily Park",
    role: "Head of Digital Marketing",
    company: "Brightfield Co.",
  },
]

function Testimonials() {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle title="Trusted by Industry Leaders" description="See what marketing professionals are saying about AI Visibility Tracker." />
        <motion.div {...staggerContainer} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              {...staggerItem}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:shadow-lg hover:shadow-[#7C3AED]/5 transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-6">&ldquo;{t.quote.replace(/'/g, "&apos;")}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-xs font-bold text-white">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#111827]">{t.name}</div>
                  <div className="text-xs text-[#6B7280]">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const integrations = [
  { name: "ChatGPT", category: "AI Platform", gradient: "from-emerald-500 to-emerald-400" },
  { name: "Claude", category: "AI Platform", gradient: "from-amber-600 to-amber-500" },
  { name: "Gemini", category: "AI Platform", gradient: "from-blue-500 to-blue-400" },
  { name: "Perplexity", category: "AI Platform", gradient: "from-violet-500 to-violet-400" },
  { name: "OpenAI", category: "Provider", gradient: "from-emerald-600 to-emerald-500" },
  { name: "Anthropic", category: "Provider", gradient: "from-amber-700 to-amber-600" },
  { name: "Google", category: "Provider", gradient: "from-blue-600 to-blue-500" },
  { name: "Microsoft", category: "Provider", gradient: "from-sky-600 to-sky-500" },
  { name: "Slack", category: "Notification", gradient: "from-rose-500 to-rose-400" },
  { name: "Notion", category: "Documentation", gradient: "from-stone-600 to-stone-500" },
  { name: "HubSpot", category: "CRM", gradient: "from-orange-500 to-orange-400" },
  { name: "Zapier", category: "Automation", gradient: "from-orange-600 to-amber-500" },
]

function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle label="Integrations" title="Seamless Platform Integration" description="AI Visibility Tracker integrates with every major AI platform and your favorite tools." />
        <motion.div {...staggerContainer} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {integrations.map((item) => (
            <motion.div
              key={item.name}
              {...staggerItem}
              className="group rounded-xl border border-[#E5E7EB] bg-white p-4 text-center hover:shadow-md hover:border-[#7C3AED]/20 transition-all duration-300"
            >
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${item.gradient} bg-opacity-10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <span className="text-[10px] font-bold text-white">{item.name[0]}</span>
              </div>
              <div className="text-xs font-medium text-[#111827]">{item.name}</div>
              <div className="text-[9px] text-[#6B7280] mt-0.5">{item.category}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#111827] py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/[0.08] to-[#EC4899]/[0.08] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#7C3AED]/[0.06] to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative max-w-[1280px] mx-auto px-6 text-center"
      >
        <h2 className="text-[32px] lg:text-[44px] font-bold tracking-[-0.03em] text-white leading-[1.15] max-w-3xl mx-auto">
          Discover What AI Says About Your Brand
        </h2>
        <p className="mt-4 text-[16px] text-[#9CA3AF] leading-relaxed max-w-xl mx-auto">
          Start monitoring your visibility across AI search platforms today. No credit card required.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-13 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/30 hover:shadow-xl hover:shadow-[#7C3AED]/40 border-0"
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
              className="h-13 px-8 text-[15px] font-medium gap-2 rounded-xl border-[#374151] text-[#D1D5DB] hover:bg-white/5 hover:text-white"
            >
              Schedule Demo
            </Button>
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#6B7280]">
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
    </section>
  )
}

const faqs = [
  { q: "What is AI Visibility Tracker?", a: "AI Visibility Tracker is a marketing intelligence platform that monitors how your brand appears across AI search platforms like ChatGPT, Gemini, Claude, Perplexity, and Copilot. We track mentions, analyze sentiment, monitor competitors, and provide actionable recommendations." },
  { q: "How does the AI visibility tracking work?", a: "Our platform continuously scans AI model responses for your specified keywords and brand names. We analyze where your brand appears, in what context, the sentiment of mentions, and how your visibility compares to competitors across different AI platforms." },
  { q: "Which AI platforms do you support?", a: "We currently support ChatGPT, Gemini, Claude, Perplexity, and Copilot. We're continuously adding new AI platforms as they emerge in the market." },
  { q: "How is the AI Visibility Score calculated?", a: "The AI Visibility Score is a proprietary metric that combines mention frequency, ranking position, sentiment, share of voice, and trend data across all tracked AI platforms. Scores range from 0-100, with higher scores indicating stronger AI presence." },
  { q: "Can I track my competitors?", a: "Yes, you can add unlimited competitors to track. Our platform will show you how your brand's AI visibility compares, highlight gaps, and identify opportunities where competitors are outperforming you." },
  { q: "What kind of reports can I generate?", a: "You can generate comprehensive reports including executive summaries, visibility trends, competitor analysis, citation sources, and recommendations. Reports can be exported as PDF, scheduled for automatic delivery, or shared via link." },
  { q: "Is there a free trial available?", a: "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start. You can cancel anytime during the trial period." },
  { q: "How do you handle data privacy and security?", a: "We take data security seriously. All data is encrypted in transit and at rest. We are SOC 2 compliant and follow industry best practices for data protection. Your brand data is never used to train AI models." },
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionTitle label="FAQ" title="Frequently Asked Questions" description="Everything you need to know about AI Visibility Tracker." />
        <motion.div {...staggerContainer} className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              {...staggerItem}
              className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden hover:shadow-sm transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-[#111827] pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#6B7280] shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-sm text-[#6B7280] leading-relaxed">{faq.a}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FooterSection() {
  const footerLinks = {
    Product: ["Features", "Pricing", "Integrations", "Changelog"],
    Resources: ["Documentation", "API Reference", "Blog", "Community"],
    Company: ["About", "Careers", "Contact", "Privacy", "Terms"],
  }

  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center">
                <span className="text-[11px] font-bold text-white">AV</span>
              </div>
              <span className="font-semibold text-sm text-[#111827]">AI Visibility Tracker</span>
            </Link>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm">
              Monitor, track, and improve your brand&apos;s visibility across AI search platforms. The essential tool for modern marketing teams.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="/" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>&copy; {new Date().getFullYear()} AI Visibility Tracker. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#111827] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#111827] transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-[#111827] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <HowItWorks />
        <FeaturesGrid />
        <ProductShowcase />
        <AnalyticsSection />
        <ReportingSection />
        <Testimonials />
        <Integrations />
        <FinalCTA />
        <FAQSection />
        <FooterSection />
      </main>
    </div>
  )
}

"use client"

import { Sparkles, Bot, Search, Brain, Clock, CheckCheck } from "lucide-react"

interface RecentChatsProps {
  domain: string
  brandName: string
}

function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const PROVIDERS = [
  { key: "chatgpt", label: "ChatGPT", icon: Sparkles, color: "#8b5cf6", gradient: "from-purple-500/10 to-purple-500/5" },
  { key: "gemini", label: "Gemini", icon: Bot, color: "#3b82f6", gradient: "from-blue-500/10 to-blue-500/5" },
  { key: "perplexity", label: "Perplexity", icon: Search, color: "#f59e0b", gradient: "from-amber-500/10 to-amber-500/5" },
  { key: "claude", label: "Claude", icon: Brain, color: "#10b981", gradient: "from-emerald-500/10 to-emerald-500/5" },
]

const QUESTIONS = [
  (brand: string) => `What are the top alternatives to ${brand} in 2026?`,
  (brand: string) => `How does ${brand} compare to its competitors?`,
  (brand: string) => `Best ${brand} review and pricing analysis`,
  (brand: string) => `Is ${brand} worth the investment for enterprises?`,
  (brand: string) => `${brand} vs competitors: a comprehensive comparison`,
  (brand: string) => `What experts say about ${brand} in 2026`,
  (brand: string) => `${brand} market share and growth trends`,
  (brand: string) => `Top features of ${brand} you should know`,
]

const RESPONSES = [
  (brand: string) =>
    `Based on my analysis, ${brand} shows strong performance in market visibility. Key competitors include BrandPulse AI and VisibilityFirst, with ${brand} maintaining a competitive edge in customer satisfaction scores. The overall market trend suggests continued growth across all major players.`,

  (brand: string) =>
    `${brand} has been gaining significant traction in the AI visibility space. Our data indicates a 23% increase in brand mentions across major platforms this quarter. The brand's positioning strategy appears to be resonating well with enterprise customers, particularly in the North American market.`,

  (brand: string) =>
    `When evaluating ${brand}, several factors stand out: 1) Strong domain authority growth, 2) Increasing citation volume from authoritative sources, 3) Positive sentiment shift from neutral to favorable over the past 90 days. The brand's content strategy is clearly driving measurable improvements in AI search visibility.`,

  (brand: string) =>
    `Recent monitoring data for ${brand} reveals interesting patterns. The brand appears most frequently in ChatGPT responses for queries related to "enterprise solutions" and "AI monitoring." Competitor analysis shows ${brand} outperforming similar services in citation frequency by approximately 18%.`,

  (brand: string) =>
    `${brand} continues to demonstrate strong performance across key visibility metrics. Our GEO score analysis shows a consistent upward trajectory, with particular strength in citation-based visibility. The brand's domain authority has improved by 12 points over the last monitoring period.`,

  (brand: string) =>
    `Looking at the latest data for ${brand}, we're seeing encouraging signs of AI search optimization success. The brand appears in 73% of relevant AI-generated responses, up from 61% last quarter. Key drivers include improved content depth and increased citation velocity from trusted sources.`,

  (brand: string) =>
    `${brand}'s visibility strategy is delivering measurable results. Analysis across four major AI platforms shows the brand maintaining a top-5 position in 3 out of 4 platforms. The most significant gains have been observed in Gemini and Perplexity responses, where brand mentions increased by 31% and 27% respectively.`,

  (brand: string) =>
    `Our comprehensive analysis of ${brand} reveals a well-executed AI visibility strategy. The brand's content is being cited across diverse domains, with particularly strong representation in industry publications. The sentiment analysis shows 84% positive mentions, significantly above the industry average of 67%.`,
]

export function RecentChats({ domain, brandName }: RecentChatsProps) {
  const h = hashStr(domain + brandName)

  const chats = PROVIDERS.map((provider, i) => {
    const seed = (h + i * 31) % QUESTIONS.length
    const question = QUESTIONS[seed](brandName)
    const response = RESPONSES[seed](brandName)
    const hoursAgo = 1 + ((h + i * 7) % 48)
    return { ...provider, question, response, hoursAgo }
  })

  return (
    <div className="rounded-xl bg-white shadow-sm border border-border/40 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Conversations</span>
          <h3 className="text-sm font-semibold mt-0.5">Recent AI Responses</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All systems active
        </div>
      </div>

      <div className="space-y-4">
        {chats.map((chat, i) => {
          const Icon = chat.icon
          return (
            <div
              key={chat.key}
              className="group rounded-xl border border-border/30 bg-gradient-to-br from-background to-white p-4 transition-all duration-300 hover:border-primary/15 hover:shadow-sm"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ring-1 ring-border/20"
                  style={{ backgroundColor: `${chat.color}12` }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: chat.color }} />
                </div>
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{chat.label}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                      <span className="text-[11px] text-muted-foreground">Active</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {chat.hoursAgo}h ago
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 rounded-lg bg-muted/30 px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Query</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{chat.question}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: `${chat.color}06` }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon className="h-3 w-3" style={{ color: chat.color }} />
                        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: chat.color }}>
                          Response
                        </span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <CheckCheck className="h-3 w-3 text-emerald-500" />
                          <span className="text-[10px] text-emerald-600">Delivered</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{chat.response}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

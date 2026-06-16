import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-[#111827] p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/[0.12] via-transparent to-[#EC4899]/[0.08] pointer-events-none" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
            <span className="text-xs font-bold text-white">AV</span>
          </div>
          <span className="font-semibold text-sm text-white/90">AI Visibility</span>
        </Link>

        <div className="relative space-y-6 max-w-md">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white leading-[1.15]">
            Track your brand across every AI platform
          </h2>
          <p className="text-[15px] text-white/60 leading-relaxed">
            Monitor how ChatGPT, Gemini, Claude, Perplexity, and other AI models mention your brand. Get real-time visibility insights, competitor benchmarks, and actionable improvements.
          </p>
          <div className="space-y-3">
            {[
              "Real-time AI mention tracking across 5+ platforms",
              "Competitor benchmarking and gap analysis",
              "AI-powered recommendations to improve visibility",
              "Automated reports and team collaboration",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/70">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4 text-sm text-white/40">
          <span>&copy; {new Date().getFullYear()} AI Visibility Tracker</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>All rights reserved</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden mb-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">AV</span>
            </div>
            <span className="font-semibold text-sm text-[#111827]">AI Visibility</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}

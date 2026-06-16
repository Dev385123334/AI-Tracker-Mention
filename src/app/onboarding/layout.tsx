import Link from "next/link"
import { OnboardingStepIndicator } from "@/components/onboarding/onboarding-step-indicator"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#EC4899]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col min-h-screen">
        <header className="pt-6 pb-2 px-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-[10px] font-bold text-white">AV</span>
              </div>
              <span className="text-sm font-semibold text-[#6B7280]">AI Visibility</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center px-4 pb-16 pt-6">
          <div className="w-full max-w-2xl mx-auto space-y-10">
            <OnboardingStepIndicator />
            <div className="bg-white rounded-2xl border border-[#E5E7EB]/80 shadow-sm p-8 md:p-10">
              {children}
            </div>
          </div>
        </main>

        <footer className="pb-6 px-4">
          <p className="text-center text-xs text-[#9CA3AF]">
            Need help? <span className="text-[#7C3AED] font-medium">Contact support</span>
          </p>
        </footer>
      </div>
    </div>
  )
}

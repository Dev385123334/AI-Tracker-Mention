"use client"

import { usePathname } from "next/navigation"

const STEPS = [
  { path: "/onboarding/welcome", number: 1, label: "Welcome", shortLabel: "Hi" },
  { path: "/onboarding/brand", number: 2, label: "Brand", shortLabel: "Brand" },
  { path: "/onboarding/keywords", number: 3, label: "Keywords", shortLabel: "Keywords" },
  { path: "/onboarding/prompts", number: 4, label: "Prompts", shortLabel: "Prompts" },
  { path: "/projects", number: 5, label: "Dashboard", shortLabel: "Done" },
]

export function OnboardingStepIndicator() {
  const pathname = usePathname()
  const currentStep = STEPS.find((s) => pathname.startsWith(s.path))?.number ?? 1

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isActive = step.number === currentStep
          const isCompleted = step.number < currentStep

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 relative">
                <div
                  className={`relative w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/25 scale-110"
                      : isCompleted
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-[#F7F8FC] border-2 border-[#E5E7EB] text-[#9CA3AF]"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium transition-all duration-300 hidden sm:block ${
                    isActive
                      ? "text-[#7C3AED]"
                      : isCompleted
                      ? "text-emerald-600"
                      : "text-[#9CA3AF]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="relative h-[2px] rounded-full overflow-hidden bg-[#E5E7EB]">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                        isCompleted
                          ? "bg-emerald-400 w-full"
                          : "bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
                      }`}
                      style={{ width: isCompleted ? "100%" : isActive ? "50%" : "0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

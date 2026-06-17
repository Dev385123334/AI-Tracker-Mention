"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function OnboardingWelcomeForm({ name }: { name: string }) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center text-center gap-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#7C3AED]/15 to-[#EC4899]/15 border border-[#7C3AED]/10 flex items-center justify-center shadow-lg shadow-[#7C3AED]/5">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="space-y-3 max-w-md"
      >
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">
          Welcome, {name}
        </h1>
        <p className="text-[15px] text-[#6B7280] leading-relaxed">
          I&apos;ll help you set up your first brand tracker. Tell me about your brand, and I&apos;ll take care of the rest.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <Button
          size="lg"
          className="h-13 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 border-0 transition-all duration-300"
          onClick={() => router.push("/onboarding/brand")}
        >
          Tell me about your brand
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-xs text-[#9CA3AF]">Takes less than 2 minutes</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-4 gap-4 w-full max-w-lg"
      >
        {[
          { label: "Brand Setup", desc: "Add your brand details" },
          { label: "Keywords", desc: "Define tracking terms" },
          { label: "Countries", desc: "Select target regions" },
          { label: "Prompts", desc: "Review AI prompts" },
        ].map((item) => (
          <div key={item.label} className="text-center p-2.5 rounded-xl bg-[#F7F8FC] border border-[#E5E7EB]/60">
            <div className="text-[11px] font-semibold text-[#111827]">{item.label}</div>
            <div className="text-[9px] text-[#9CA3AF] mt-0.5">{item.desc}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

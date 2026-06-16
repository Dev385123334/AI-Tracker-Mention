"use client"

import { useActionState, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Sparkles, Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { finalizeProject } from "@/modules/onboarding/actions"

interface KeywordPrompts {
  keyword: string
  prompts: string[]
}

export function PromptsForm({
  keywordPrompts,
  brandName,
}: {
  keywordPrompts: KeywordPrompts[]
  brandName: string
}) {
  const [selected, setSelected] = useState<Record<string, Set<number>>>(() => {
    const initial: Record<string, Set<number>> = {}
    for (const kp of keywordPrompts) {
      initial[kp.keyword] = new Set(kp.prompts.map((_, i) => i))
    }
    return initial
  })

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    keywordPrompts.forEach((kp, i) => {
      initial[kp.keyword] = i === 0
    })
    return initial
  })

  const togglePrompt = useCallback((keyword: string, index: number) => {
    setSelected((prev) => {
      const next = new Set(prev[keyword])
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return { ...prev, [keyword]: next }
    })
  }, [])

  const toggleAll = useCallback((keyword: string, checked: boolean) => {
    setSelected((prev) => {
      const kp = keywordPrompts.find((k) => k.keyword === keyword)
      if (!kp) return prev
      const next = checked ? new Set(kp.prompts.map((_, i) => i)) : new Set<number>()
      return { ...prev, [keyword]: next }
    })
  }, [keywordPrompts])

  const toggleExpand = useCallback((keyword: string) => {
    setExpanded((prev) => ({ ...prev, [keyword]: !prev[keyword] }))
  }, [])

  const wrappedAction = async (_prev: string | undefined, _formData: FormData): Promise<string | undefined> => {
    const formData = new FormData()
    const selectedPrompts = keywordPrompts.map((kp) => ({
      keyword: kp.keyword,
      texts: kp.prompts.filter((_, i) => selected[kp.keyword]?.has(i)),
    }))
    formData.set("selectedPrompts", JSON.stringify(selectedPrompts))
    const result = await finalizeProject(formData)
    if (result && typeof result === "object" && "error" in result) {
      return "Validation failed. Please check your inputs."
    }
    return undefined
  }

  const [state, formAction, pending] = useActionState(wrappedAction, undefined)

  const totalSelected = Object.values(selected).reduce((sum, s) => sum + s.size, 0)
  const totalAvailable = keywordPrompts.reduce((sum, kp) => sum + kp.prompts.length, 0)

  return (
    <form action={formAction} className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-3"
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/10 flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="h-4 w-4 text-[#7C3AED]" />
        </div>
        <div className="bg-gradient-to-br from-[#F7F8FC] to-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <p className="text-sm text-[#111827]">
            Here are the search prompts I&apos;ll use to track <strong>{brandName}</strong>.
            Each prompt will be sent to AI platforms to check for your brand.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between ml-12"
      >
        <span className="text-xs font-medium text-[#6B7280]">
          {totalSelected} of {totalAvailable} prompts selected
        </span>
        <div className="h-1.5 w-24 rounded-full bg-[#E5E7EB] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-500"
            style={{ width: `${(totalSelected / totalAvailable) * 100}%` }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="ml-12 space-y-3"
      >
        {keywordPrompts.map((kp, idx) => {
          const isExpanded = expanded[kp.keyword]
          const selCount = selected[kp.keyword]?.size ?? 0
          const total = kp.prompts.length

          return (
            <motion.div
              key={kp.keyword}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden hover:shadow-sm transition-shadow"
            >
              <button
                type="button"
                onClick={() => toggleExpand(kp.keyword)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#F7F8FC] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300",
                      selCount === total
                        ? "bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-sm"
                        : selCount > 0
                        ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                        : "bg-[#F7F8FC] text-[#9CA3AF]"
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#111827]">{kp.keyword}</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">
                      {selCount}/{total} selected
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 w-12 rounded-full bg-[#E5E7EB] overflow-hidden hidden sm:block",
                    )}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-500"
                      style={{ width: `${(selCount / total) * 100}%` }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#9CA3AF]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="border-t border-[#E5E7EB]/60 px-5 py-3 space-y-1"
                >
                  <div className="flex items-center gap-2 pb-2">
                    <button
                      type="button"
                      onClick={() => toggleAll(kp.keyword, selCount !== total)}
                      className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] transition-colors"
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                          selCount === total
                            ? "bg-gradient-to-br from-[#7C3AED] to-[#EC4899] border-transparent"
                            : selCount > 0
                            ? "bg-[#7C3AED]/20 border-[#7C3AED]/40"
                            : "border-[#D1D5DB]"
                        )}
                      >
                        {selCount === total && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      {selCount === total ? "Deselect all" : "Select all"}
                    </button>
                  </div>
                  {kp.prompts.map((prompt, pi) => (
                    <button
                      type="button"
                      key={pi}
                      onClick={() => togglePrompt(kp.keyword, pi)}
                      className="w-full flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[#F7F8FC] transition-colors text-left group"
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200",
                          selected[kp.keyword]?.has(pi)
                            ? "bg-gradient-to-br from-[#7C3AED] to-[#EC4899] border-transparent shadow-sm"
                            : "border-[#D1D5DB] group-hover:border-[#7C3AED]/30"
                        )}
                      >
                        {selected[kp.keyword]?.has(pi) && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm leading-relaxed transition-colors",
                          selected[kp.keyword]?.has(pi)
                            ? "text-[#111827] font-medium"
                            : "text-[#6B7280]"
                        )}
                      >
                        {prompt}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {state && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="ml-12 p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-xs text-destructive"
        >
          {state}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center pt-2"
      >
        <Button
          type="submit"
          size="lg"
          className="h-12 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 border-0 transition-all duration-300"
          disabled={totalSelected === 0 || pending}
        >
          {pending ? "Creating your project..." : `Create project with ${totalSelected} prompts`}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  )
}

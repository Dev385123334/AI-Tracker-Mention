"use client"

import { useActionState, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, ArrowRight, Sparkles } from "lucide-react"
import { saveKeywords } from "@/modules/onboarding/actions"

export function KeywordsForm() {
  const [keywords, setKeywords] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const wrappedAction = async (_prev: string | undefined, _formData: FormData): Promise<string | undefined> => {
    const fd = new FormData()
    fd.set("keywords", JSON.stringify(keywords))
    const result = await saveKeywords(fd)
    if (result && typeof result === "object" && "error" in result) {
      return result.error as string
    }
    return undefined
  }

  const [state, formAction, pending] = useActionState(wrappedAction, undefined)

  function addKeyword() {
    const trimmed = inputValue.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed])
    }
    setInputValue("")
  }

  function removeKeyword(index: number) {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

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
        <div className="bg-gradient-to-br from-[#F7F8FC] to-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-lg">
          <p className="text-sm text-[#111827]">
            Great! Now tell me the keywords you want to track. These are the terms people search for that should mention your brand.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="ml-12 flex gap-2"
      >
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a keyword and press Enter..."
            className="h-12 text-sm rounded-xl border-[#E5E7EB] bg-white placeholder:text-[#9CA3AF] focus:border-[#7C3AED]/30 focus:ring-[#7C3AED]/10 transition-all pr-12"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-4 shrink-0 rounded-xl border-[#E5E7EB] hover:bg-[#F7F8FC] hover:border-[#7C3AED]/20"
          onClick={addKeyword}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </motion.div>

      {keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="ml-12 flex flex-wrap gap-2"
        >
          {keywords.map((kw, i) => (
            <motion.div
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/15 text-sm font-medium text-[#7C3AED] hover:shadow-sm transition-all"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => removeKeyword(i)}
                className="h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-destructive/15 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="ml-12"
      >
        {keywords.length === 0 && (
          <p className="text-xs text-[#9CA3AF]">
            Add at least one keyword to continue
          </p>
        )}
        {keywords.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            {keywords.length} keyword{keywords.length === 1 ? "" : "s"} ready
          </div>
        )}
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
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex justify-center pt-2"
      >
        <Button
          type="submit"
          size="lg"
          className="h-12 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 border-0 transition-all duration-300"
          disabled={keywords.length < 1 || pending}
        >
          {pending ? "Saving..." : `Continue with ${keywords.length} keywords`}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  )
}

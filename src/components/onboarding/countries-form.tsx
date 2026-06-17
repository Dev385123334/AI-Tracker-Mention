"use client"

import { useActionState, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Globe, Search, X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { COUNTRIES } from "@/lib/countries"
import { saveCountries } from "@/modules/onboarding/actions"

export function CountriesForm() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (country: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(country)) next.delete(country)
      else next.add(country)
      return next
    })
  }

  const wrappedAction = async (_prev: string | undefined, _formData: FormData): Promise<string | undefined> => {
    const fd = new FormData()
    fd.set("countries", JSON.stringify([...selected]))
    const result = await saveCountries(fd)
    if (result && typeof result === "object" && "error" in result) {
      return result.error as string
    }
    return undefined
  }

  const [state, formAction, pending] = useActionState(wrappedAction, undefined)

  return (
    <form action={formAction} className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-3"
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/10 flex items-center justify-center shrink-0 shadow-sm">
          <Globe className="h-4 w-4 text-[#7C3AED]" />
        </div>
        <div className="bg-gradient-to-br from-[#F7F8FC] to-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-lg">
          <p className="text-sm text-[#111827]">
            Which countries do you want to target? Select all that apply — we&apos;ll tailor the monitoring results to these regions.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="ml-12"
      >
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries..."
            className="h-11 pl-10 text-sm rounded-xl border-[#E5E7EB] bg-white placeholder:text-[#9CA3AF] focus:border-[#7C3AED]/30 focus:ring-[#7C3AED]/10 transition-all"
          />
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {[...selected].map((country) => (
              <span
                key={country}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/15 text-xs font-medium text-[#7C3AED]"
              >
                {country}
                <button type="button" onClick={() => toggle(country)} className="hover:bg-[#7C3AED]/10 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {filtered.map((country) => {
            const isSelected = selected.has(country)
            return (
              <button
                key={country}
                type="button"
                onClick={() => toggle(country)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all text-left",
                  isSelected
                    ? "bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 border-[#7C3AED]/20 text-[#7C3AED] font-medium"
                    : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#7C3AED]/20 hover:bg-[#F7F8FC]"
                )}
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-all",
                    isSelected
                      ? "bg-gradient-to-br from-[#7C3AED] to-[#EC4899] border-transparent"
                      : "border-[#D1D5DB]"
                  )}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className="truncate">{country}</span>
              </button>
            )
          })}
        </div>
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
        className="flex flex-col items-center gap-3 pt-2"
      >
        <Button
          type="submit"
          size="lg"
          className="h-12 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 border-0 transition-all duration-300"
          disabled={selected.size === 0 || pending}
        >
          {pending ? "Saving..." : `Continue with ${selected.size} countr${selected.size === 1 ? "y" : "ies"}`}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <button
          type="submit"
          onClick={() => {
            if (selected.size === 0) {
              const fd = new FormData()
              fd.set("countries", JSON.stringify([]))
              saveCountries(fd)
            }
          }}
          className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </form>
  )
}

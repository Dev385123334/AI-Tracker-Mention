"use client"

import { useActionState, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Sparkles } from "lucide-react"
import { saveBrandInfo } from "@/modules/onboarding/actions"

export function BrandForm() {
  const [brandName, setBrandName] = useState("")
  const [domain, setDomain] = useState("")
  const [description, setDescription] = useState("")
  const projectName = brandName ? `${brandName} Tracker` : ""

  const wrappedAction = async (_prev: string | undefined, formData: FormData): Promise<string | undefined> => {
    formData.set("brandName", brandName)
    formData.set("domain", domain)
    formData.set("projectName", projectName)
    formData.set("description", description)
    const result = await saveBrandInfo(formData)
    if (result && typeof result === "object" && "error" in result) {
      return result.error as string
    }
    return undefined
  }

  const [state, formAction, pending] = useActionState(wrappedAction, undefined)

  const canSubmit = brandName.trim().length > 0 && domain.trim().length > 0

  const questions = [
    {
      key: "brandName",
      label: "What&apos;s your brand called?",
      placeholder: "e.g. Acme Inc.",
      value: brandName,
      setter: setBrandName,
      input: true,
    },
    {
      key: "domain",
      label: "What&apos;s your website?",
      placeholder: "e.g. acme.com",
      value: domain,
      setter: setDomain,
      input: true,
    },
    {
      key: "projectName",
      label: `I&apos;ll call this project &ldquo;${projectName || "—"}&rdquo;. That work?`,
      placeholder: projectName,
      value: projectName,
      readonly: true,
      input: true,
      hint: "Auto-generated from your brand name",
    },
    {
      key: "description",
      label: "Anything else I should know about your brand?",
      placeholder: "Tell me about your products, industry, or goals...",
      value: description,
      setter: setDescription,
      input: false,
      optional: true,
    },
  ]

  return (
    <form action={formAction} className="space-y-10">
      {questions.map((q, i) => (
        <motion.div
          key={q.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#EC4899]/10 border border-[#7C3AED]/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#7C3AED]" />
            </div>
            <div className="bg-gradient-to-br from-[#F7F8FC] to-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-lg">
              <p
                className="text-sm text-[#111827]"
                dangerouslySetInnerHTML={{ __html: q.label }}
              />
              {q.optional && (
                <span className="text-xs text-[#9CA3AF] ml-1">(optional)</span>
              )}
            </div>
          </div>
          <div className="ml-12 space-y-1.5">
            {q.input ? (
              <Input
                value={q.value}
                onChange={q.setter ? (e) => q.setter?.(e.target.value) : undefined}
                placeholder={q.placeholder}
                readOnly={q.readonly}
                required={!q.optional}
                className={`h-12 text-sm rounded-xl border-[#E5E7EB] bg-white placeholder:text-[#9CA3AF] focus:border-[#7C3AED]/30 focus:ring-[#7C3AED]/10 transition-all ${
                  q.readonly ? "bg-[#F7F8FC] text-[#6B7280] cursor-default" : ""
                }`}
              />
            ) : (
              <Textarea
                value={q.value}
                onChange={(e) => q.setter?.(e.target.value)}
                placeholder={q.placeholder}
                className="min-h-[80px] text-sm rounded-xl border-[#E5E7EB] bg-white placeholder:text-[#9CA3AF] focus:border-[#7C3AED]/30 focus:ring-[#7C3AED]/10 transition-all"
              />
            )}
            {q.hint && (
              <p className="text-xs text-[#9CA3AF] ml-1">{q.hint}</p>
            )}
          </div>
        </motion.div>
      ))}

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
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex justify-center pt-2"
      >
        <Button
          type="submit"
          size="lg"
          className="h-12 px-8 text-[15px] font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 border-0 transition-all duration-300"
          disabled={!canSubmit || pending}
        >
          {pending ? "Saving..." : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  )
}

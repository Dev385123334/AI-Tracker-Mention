"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { forgotPasswordAction } from "@/modules/auth/actions"

type ForgotPasswordState = {
  error?: { email?: string[]; form?: string[] }
  success?: boolean
}

export function ForgotPasswordForm() {
  const wrappedAction = async (_prev: ForgotPasswordState | undefined, formData: FormData): Promise<ForgotPasswordState | undefined> =>
    forgotPasswordAction(formData)
  const [state, formAction, pending] = useActionState(wrappedAction, undefined)

  if (state?.success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#111827]">Check your email</h1>
          <p className="text-sm text-[#6B7280]">If an account exists, we&apos;ve sent a password reset link.</p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="h-11 rounded-xl border-[#E5E7EB] text-[#111827] hover:bg-[#F7F8FC]">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#7C3AED] hover:text-[#6D28D9] font-medium mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#111827]">Forgot password</h1>
        <p className="text-sm text-[#6B7280]">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-[#111827]">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-11 rounded-xl border-[#E5E7EB] bg-white text-sm placeholder:text-[#9CA3AF] focus:border-[#7C3AED]/30 focus:ring-[#7C3AED]/10 transition-all"
          />
          {state?.error?.email && (
            <p className="text-xs text-destructive mt-1">{state.error.email[0]}</p>
          )}
        </div>

        {state?.error?.form && (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-xs text-destructive">
            {state.error.form[0]}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-lg shadow-[#7C3AED]/15 hover:shadow-xl hover:shadow-[#7C3AED]/25 border-0 text-sm font-semibold transition-all duration-300"
          disabled={pending}
        >
          {pending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </div>
  )
}

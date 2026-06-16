"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { syncUser } from "@/services/auth-service"
import { LoginSchema, SignupSchema, ForgotPasswordSchema } from "./validations"

export async function signupAction(formData: FormData) {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: { form: [error.message] } }
  }

  await syncUser()
  revalidatePath("/", "layout")
  redirect("/onboarding/welcome")
}

export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: { form: [error.message] } }
  }

  await syncUser()
  revalidatePath("/", "layout")
  redirect("/projects")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/account/reset-password`,
  })

  if (error) {
    return { error: { form: [error.message] } }
  }

  return { success: true }
}

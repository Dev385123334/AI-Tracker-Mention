"use server"

import { cookies } from "next/headers"

export interface OnboardingState {
  brandName: string
  domain: string
  projectName: string
  description?: string
  keywords: string[]
  countries: string[]
}

const COOKIE_NAME = "ob_state"

export async function getOnboardingState(): Promise<OnboardingState | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function setOnboardingState(data: Partial<OnboardingState>) {
  const cookieStore = await cookies()
  const current = (await getOnboardingState()) ?? ({} as OnboardingState)
  const merged = { ...current, ...data }
  cookieStore.set(COOKIE_NAME, JSON.stringify(merged), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30,
    path: "/onboarding",
  })
}

export async function clearOnboardingState() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

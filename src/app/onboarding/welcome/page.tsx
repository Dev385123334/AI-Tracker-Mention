import { createClient } from "@/lib/supabase/server"
import { OnboardingWelcomeForm } from "@/components/onboarding/onboarding-welcome-form"

export default async function WelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "there"

  return <OnboardingWelcomeForm name={name} />
}

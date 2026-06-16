import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email" | "signup" | "recovery" | "invite" | "magiclink",
    })
    if (!error) {
      return NextResponse.redirect(`${origin}/projects`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}

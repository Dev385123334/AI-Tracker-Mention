import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsProfile } from "@/components/settings/settings-profile"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { prisma } = await import("@/lib/prisma")
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      <SettingsProfile
        email={user.email!}
        name={user.user_metadata?.name ?? user.user_metadata?.full_name ?? null}
        dbUser={dbUser ? { id: dbUser.id, name: dbUser.name } : null}
      />
    </div>
  )
}

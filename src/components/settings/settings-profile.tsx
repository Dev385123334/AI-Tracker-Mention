"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { User, Mail, Palette, LogOut, Shield } from "lucide-react"
import { logoutAction } from "@/modules/auth/actions"
import { useTransition } from "react"

interface SettingsProfileProps {
  email: string
  name: string | null
  dbUser: { id: string; name: string | null } | null
}

export function SettingsProfile({ email, name, dbUser }: SettingsProfileProps) {
  const [isPending, startTransition] = useTransition()
  const initials = (name ?? email).slice(0, 2).toUpperCase()

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 pt-2">
            <p className="font-medium">{name ?? "Unnamed User"}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </div>
            {dbUser?.id && (
              <p className="text-xs text-muted-foreground">ID: {dbUser.id.slice(0, 8)}...</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Toggle dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => startTransition(async () => { await logoutAction() })}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

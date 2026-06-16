"use client"

import { useEffect, useState } from "react"
import { UserMenu } from "./user-menu"
import { MobileSidebar } from "./app-sidebar"
import { createClient } from "@/lib/supabase/client"

export function TopNavbar() {
  const [user, setUser] = useState<{ email?: string; name?: string | null } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          email: u.email,
          name: u.user_metadata?.name ?? u.user_metadata?.full_name,
        })
      }
    })
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border">
      <div className="flex h-14 items-center px-4 gap-4">
        <MobileSidebar />
        <div className="flex-1" />
        <UserMenu
          email={user?.email}
          name={user?.name}
        />
      </div>
    </header>
  )
}

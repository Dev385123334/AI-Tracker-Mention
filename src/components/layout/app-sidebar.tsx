"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Telescope,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ProjectSwitcher } from "./project-switcher"

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: BarChart3 },
]

const analyticsNav = [
  { label: "Discover", href: "/discover", icon: Telescope },
  { label: "GEO Agent", href: "/geo-agent", icon: Sparkles },
  { label: "Competitors", href: "/competitors", icon: Users },
  { label: "Recommendations", href: "/recommendations", icon: Lightbulb },
  { label: "Prompts", href: "/prompts", icon: MessageSquare },
]

const reportsNav = [
  { label: "Reports", href: "/reports", icon: FileText },
]

function SidebarNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname === href || pathname.startsWith(href + "/")
  }

  const renderNavItem = (item: { label: string; href: string; icon: React.ElementType }) => {
    const Icon = item.icon
    const active = isActive(item.href)

    return (
      <Link key={item.href} href={item.href} className="block">
        <div
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            active
              ? "bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 text-[#7C3AED] shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC]"
          )}
        >
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#EC4899]" />
          )}
          <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#7C3AED]" : "text-[#9CA3AF] group-hover:text-[#6B7280]")} />
          <span>{item.label}</span>
        </div>
      </Link>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-[10px] font-bold text-white">AV</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#111827]">AI Visibility</span>
            <span className="block text-[10px] text-[#9CA3AF] font-medium -mt-0.5">Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Project Switcher */}
      <div className="px-3 pb-3">
        <ProjectSwitcher />
      </div>

      {/* Main Section */}
      <div className="px-3 pb-1">
        <div className="px-3 py-1.5">
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Main</span>
        </div>
        <nav className="space-y-0.5">
          {mainNav.map(renderNavItem)}
        </nav>
      </div>

      {/* Analytics Section */}
      <div className="px-3 pb-1">
        <div className="px-3 py-1.5">
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Analytics</span>
        </div>
        <nav className="space-y-0.5">
          {analyticsNav.map(renderNavItem)}
        </nav>
      </div>

      {/* Reports Section */}
      <div className="px-3 pb-1">
        <div className="px-3 py-1.5">
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Reports</span>
        </div>
        <nav className="space-y-0.5">
          {reportsNav.map(renderNavItem)}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile / Bottom */}
      <div className="border-t border-[#E5E7EB]/60 mx-3 pt-2 pb-3">
        <Link href="/settings">
          <div
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive("/settings")
                ? "bg-gradient-to-r from-[#7C3AED]/10 to-[#EC4899]/10 text-[#7C3AED] shadow-sm"
                : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC]"
            )}
          >
            <User className="h-4 w-4 shrink-0 text-[#9CA3AF] group-hover:text-[#6B7280]" />
            <span>Profile</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC] transition-all duration-200 group">
            <Settings className="h-4 w-4 shrink-0 text-[#9CA3AF] group-hover:text-[#6B7280]" />
            <span>Settings</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <aside className={cn(
      "hidden lg:flex lg:w-60 lg:flex-col shrink-0",
      "bg-white border-r border-[#E5E7EB]/80",
      className
    )}>
      <SidebarNav />
    </aside>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden text-[#6B7280] hover:text-[#111827]" />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0 bg-white border-r border-[#E5E7EB]/80">
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}

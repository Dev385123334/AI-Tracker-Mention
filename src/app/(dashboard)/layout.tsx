import { AppSidebar } from "@/components/layout/app-sidebar"
import { TopNavbar } from "@/components/layout/top-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/[0.02] animate-gradient" />
      <div className="bg-grid-pattern fixed inset-0 pointer-events-none" />
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

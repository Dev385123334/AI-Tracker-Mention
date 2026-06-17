import Link from "next/link"

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-3">
        <span className="text-4xl font-bold text-muted-foreground">404</span>
        <p className="text-muted-foreground">This page doesn&apos;t exist.</p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

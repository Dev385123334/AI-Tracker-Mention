"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <span className="text-xl font-bold text-red-500">!</span>
        </div>
        <h2 className="text-lg font-semibold">Failed to load</h2>
        <p className="text-sm text-muted-foreground">{error.message || "Something went wrong loading this page."}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

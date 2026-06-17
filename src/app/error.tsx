"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <span className="text-2xl font-bold text-red-500">!</span>
        </div>
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="inline-flex items-center rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function PromptsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-64 mt-1.5" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/40 bg-white p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16 mt-3" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/40 bg-white p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 rounded-lg mt-4" />
      </div>
      <div className="rounded-lg border border-border/40 bg-white p-6">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function RecommendationsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-1.5" />
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
        <Skeleton className="h-6 w-64" />
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/40 bg-white p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full mt-3" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <Skeleton className="h-9 w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

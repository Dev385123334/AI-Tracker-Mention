import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 mt-1.5" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/40 bg-white p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16 mt-3" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border/40 bg-white p-5">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/40 bg-white p-5">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

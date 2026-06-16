import { Skeleton } from "@/components/ui/skeleton"

export default function CompetitorsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72 mt-1.5" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/40 bg-white p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16 mt-3" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/40 bg-white p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-3" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

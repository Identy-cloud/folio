export function SkeletonGrid() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-navy/5 sm:h-10 sm:w-64" />
        <div className="h-10 w-full animate-pulse rounded bg-navy/5 sm:w-48" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden border border-silver/30 bg-white">
            <div className="aspect-video animate-pulse bg-navy/5" />
            <div className="space-y-2 px-4 py-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-navy/5" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-navy/5/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

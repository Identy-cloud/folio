export function SkeletonGrid() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-800/50 sm:h-10 sm:w-64" />
        <div className="h-10 w-full animate-pulse rounded bg-neutral-800/50 sm:w-48" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden border border-neutral-800 bg-[#1e1e1e]">
            <div className="aspect-video animate-pulse bg-neutral-800/50" />
            <div className="space-y-2 px-4 py-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800/50" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-800/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

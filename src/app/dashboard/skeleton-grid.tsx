export function SkeletonGrid() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="h-10 w-64 animate-pulse rounded bg-neutral-800" />
        <div className="h-10 w-48 animate-pulse rounded bg-neutral-800" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden border border-neutral-800 bg-[#111111]">
            <div className="aspect-video animate-pulse bg-neutral-800" />
            <div className="space-y-2 px-4 py-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

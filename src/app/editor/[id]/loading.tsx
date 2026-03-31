export default function EditorLoading() {
  return (
    <div className="flex h-screen flex-col bg-navy">
      {/* Top toolbar skeleton */}
      <div className="flex h-12 items-center justify-between border-b border-steel/30 px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-32 animate-pulse rounded bg-white/5 sm:w-48" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 animate-pulse rounded bg-white/5" />
          <div className="h-7 w-16 animate-pulse rounded bg-white/5" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel skeleton (hidden on mobile) */}
        <div className="hidden w-56 flex-col gap-2 border-r border-steel/30 p-3 lg:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video w-full animate-pulse rounded bg-white/5/30"
            />
          ))}
        </div>

        {/* Canvas area */}
        <div className="flex flex-1 items-center justify-center bg-navy">
          <div className="aspect-video w-[90%] max-w-4xl animate-pulse rounded bg-white/5/20" />
        </div>

        {/* Right panel skeleton (hidden on mobile) */}
        <div className="hidden w-60 flex-col gap-3 border-l border-steel/30 p-4 lg:flex">
          <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
          <div className="h-8 w-full animate-pulse rounded bg-white/5/30" />
          <div className="h-8 w-full animate-pulse rounded bg-white/5/30" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-white/5/30" />
        </div>
      </div>

      {/* Bottom bar skeleton */}
      <div className="flex h-10 items-center justify-between border-t border-steel/30 px-3 sm:px-4">
        <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
        <div className="flex gap-2">
          <div className="h-6 w-6 animate-pulse rounded bg-white/5" />
          <div className="h-6 w-6 animate-pulse rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

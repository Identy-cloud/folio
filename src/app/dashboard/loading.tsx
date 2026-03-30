import { SkeletonGrid } from "./skeleton-grid";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#161616] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between sm:mb-10">
          <div className="h-6 w-24 animate-pulse rounded bg-neutral-800/50" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-800/50" />
        </div>
        <SkeletonGrid />
      </div>
    </div>
  );
}

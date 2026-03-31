"use client";

export function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-navy/5 ${className}`} />;
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Bone className="h-8 w-8" />
        <Bone className="h-7 w-32" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-silver/30 pb-px">
        <Bone className="h-8 w-20" />
        <Bone className="h-8 w-16" />
        <Bone className="h-8 w-24" />
        <Bone className="h-8 w-16" />
      </div>

      <div className="mt-6 space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <Bone className="h-[72px] w-[72px] rounded-full" />
          <div className="space-y-2">
            <Bone className="h-4 w-36" />
            <Bone className="h-3 w-48" />
          </div>
        </div>

        {/* Name field */}
        <div className="space-y-2">
          <Bone className="h-3 w-16" />
          <Bone className="h-9 w-full" />
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Bone className="h-3 w-12" />
          <Bone className="h-9 w-full" />
        </div>

        {/* Username + Bio */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Bone className="h-3 w-20" />
            <Bone className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Bone className="h-3 w-8" />
            <Bone className="h-20 w-full" />
          </div>
        </div>

        {/* Card */}
        <div className="border border-silver/30 p-4 space-y-3">
          <Bone className="h-3 w-24" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

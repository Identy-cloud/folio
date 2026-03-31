"use client";

function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-neutral-800 ${className}`} />;
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
      <div className="flex gap-1 border-b border-neutral-800 pb-px">
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
        <div className="border border-neutral-800 p-4 space-y-3">
          <Bone className="h-3 w-24" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function BillingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Plan card */}
      <div className="space-y-4">
        <Bone className="h-3 w-24" />
        <div className="border border-neutral-800 p-4 space-y-3">
          <Bone className="h-6 w-20" />
          <Bone className="h-3 w-32" />
          <Bone className="h-3 w-40" />
        </div>
      </div>

      {/* Features */}
      <div className="border border-neutral-800 p-4 space-y-3">
        <Bone className="h-3 w-28" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Bone key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      {/* Usage bars */}
      <div className="space-y-4">
        <Bone className="h-3 w-10" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border border-neutral-800 p-4 space-y-2">
            <Bone className="h-3 w-28" />
            <Bone className="h-4 w-24" />
            <Bone className="h-1.5 w-full rounded-full" />
          </div>
          <div className="border border-neutral-800 p-4 space-y-2">
            <Bone className="h-3 w-28" />
            <Bone className="h-4 w-20" />
            <Bone className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SecuritySkeleton() {
  return (
    <div className="space-y-8">
      {/* Password */}
      <div className="border border-neutral-800 p-4 space-y-3">
        <Bone className="h-3 w-32" />
        <Bone className="h-9 w-full" />
        <Bone className="h-9 w-full" />
      </div>

      {/* Sessions */}
      <div className="border border-neutral-800 p-4 space-y-3">
        <Bone className="h-3 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Bone className="h-5 w-5" />
            <div className="flex-1 space-y-1">
              <Bone className="h-3 w-32" />
              <Bone className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Connected accounts */}
      <div className="space-y-4">
        <Bone className="h-3 w-36" />
        <div className="border border-neutral-800 p-4 flex items-center gap-3">
          <Bone className="h-5 w-5" />
          <Bone className="h-4 w-24" />
        </div>
        <div className="border border-neutral-800 p-4 flex items-center gap-3">
          <Bone className="h-5 w-5" />
          <Bone className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

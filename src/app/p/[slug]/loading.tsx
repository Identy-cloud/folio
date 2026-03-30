export default function ViewerLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161616]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
        <p className="text-[10px] tracking-[0.5em] text-neutral-600 uppercase">
          Loading presentation
        </p>
      </div>
    </div>
  );
}

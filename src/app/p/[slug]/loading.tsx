export default function ViewerLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-steel border-t-white" />
        <p className="text-[10px] tracking-[0.5em] text-silver/40 uppercase">
          Loading presentation
        </p>
      </div>
    </div>
  );
}

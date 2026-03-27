export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100">
      <div className="text-center">
        <h1 className="font-display text-5xl tracking-tight">EDITOR</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Presentación: {id}
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Se implementará en Fase 3
        </p>
      </div>
    </div>
  );
}

import { db } from "@/db";
import { presentations, slides, presentationVersions } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

interface SnapshotSlide {
  id: string;
  presentationId: string;
  order: number;
  transition: string;
  transitionDuration: number | null;
  transitionEasing: string | null;
  backgroundColor: string;
  backgroundGradient: unknown;
  backgroundImage: string | null;
  elements: unknown;
  mobileElements: unknown;
  notes: string;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, versionId } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const [version] = await db
    .select()
    .from(presentationVersions)
    .where(
      and(
        eq(presentationVersions.id, versionId),
        eq(presentationVersions.presentationId, id)
      )
    )
    .limit(1);

  if (!version) return Response.json({ error: "Version not found" }, { status: 404 });

  const snapshot = version.snapshot as SnapshotSlide[];

  await db.transaction(async (tx) => {
    await tx.delete(slides).where(eq(slides.presentationId, id));

    if (snapshot.length > 0) {
      await tx.insert(slides).values(
        snapshot.map((s) => ({
          id: s.id,
          presentationId: id,
          order: s.order,
          transition: s.transition ?? "fade",
          transitionDuration: s.transitionDuration ?? null,
          transitionEasing: s.transitionEasing ?? null,
          backgroundColor: s.backgroundColor ?? "#ffffff",
          backgroundGradient: s.backgroundGradient ?? null,
          backgroundImage: s.backgroundImage ?? null,
          elements: s.elements ?? [],
          mobileElements: s.mobileElements ?? null,
          notes: s.notes ?? "",
        }))
      );
    }

    await tx
      .update(presentations)
      .set({ updatedAt: new Date() })
      .where(eq(presentations.id, id));
  });

  return Response.json({ success: true });
}

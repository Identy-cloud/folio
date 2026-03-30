import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq, asc } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [presentation] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!presentation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const presSlides = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, id))
    .orderBy(asc(slides.order));

  const exportData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    presentation: {
      title: presentation.title,
      theme: presentation.theme,
      customThemes: presentation.customThemes,
    },
    slides: presSlides.map((s) => ({
      order: s.order,
      backgroundColor: s.backgroundColor,
      backgroundImage: s.backgroundImage,
      transition: s.transition,
      transitionDuration: s.transitionDuration,
      transitionEasing: s.transitionEasing,
      elements: s.elements,
      mobileElements: s.mobileElements,
      notes: s.notes,
    })),
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${presentation.title.replace(/[^a-zA-Z0-9-_ ]/g, "")}.json"`,
    },
  });
}

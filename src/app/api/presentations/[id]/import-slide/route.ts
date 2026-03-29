import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, and, asc, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const otherPres = await db
    .select({ id: presentations.id, title: presentations.title })
    .from(presentations)
    .where(and(eq(presentations.userId, user.id), ne(presentations.id, id)));

  const result = [];
  for (const pres of otherPres) {
    const presSlides = await db
      .select({
        id: slides.id,
        order: slides.order,
        backgroundColor: slides.backgroundColor,
        elements: slides.elements,
      })
      .from(slides)
      .where(eq(slides.presentationId, pres.id))
      .orderBy(asc(slides.order));

    result.push({
      id: pres.id,
      title: pres.title,
      slides: presSlides,
    });
  }

  return Response.json(result);
}

import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { generateTemplate } from "@/lib/templates/generator";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(presentations)
    .where(eq(presentations.userId, user.id))
    .orderBy(desc(presentations.updatedAt));

  return Response.json(result);
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = (body.title as string) || "Sin título";
  const theme = (body.theme as string) || "editorial-blue";
  const useTemplate = body.useTemplate !== false;

  const [presentation] = await db
    .insert(presentations)
    .values({
      userId: user.id,
      title,
      slug: nanoid(10),
      theme,
    })
    .returning();

  if (useTemplate) {
    const templateSlides = generateTemplate(theme, presentation.id);
    if (templateSlides.length > 0) {
      await db.insert(slides).values(
        templateSlides.map((s) => ({
          id: s.id,
          presentationId: presentation.id,
          order: s.order,
          backgroundColor: s.backgroundColor,
          backgroundImage: s.backgroundImage,
          elements: s.elements,
        }))
      );
    }
  } else {
    await db.insert(slides).values({
      presentationId: presentation.id,
      order: 0,
      elements: [],
    });
  }

  return Response.json(presentation, { status: 201 });
}

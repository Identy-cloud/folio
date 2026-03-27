import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

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

  const [presentation] = await db
    .insert(presentations)
    .values({
      userId: user.id,
      title,
      slug: nanoid(10),
      theme,
    })
    .returning();

  await db.insert(slides).values({
    presentationId: presentation.id,
    order: 0,
    elements: [],
  });

  return Response.json(presentation, { status: 201 });
}

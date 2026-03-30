import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { db } from "@/db";
import { savedSlides } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { SlideElement } from "@/types/elements";
import type { GradientDef } from "@/types/elements";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(savedSlides)
    .where(eq(savedSlides.userId, user.id))
    .orderBy(desc(savedSlides.createdAt));

  return Response.json({ slides: rows });
}

interface SaveBody {
  name: string;
  category?: string;
  elements: SlideElement[];
  backgroundColor: string;
  backgroundImage?: string | null;
  backgroundGradient?: GradientDef | null;
  thumbnailUrl?: string | null;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`slides-library:${user.id}`, 20, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const body = (await request.json()) as SaveBody;

  if (!body.name || typeof body.name !== "string") {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  if (!Array.isArray(body.elements)) {
    return Response.json({ error: "Elements array is required" }, { status: 400 });
  }

  const [row] = await db
    .insert(savedSlides)
    .values({
      userId: user.id,
      name: body.name.trim(),
      category: body.category?.trim() || null,
      elements: body.elements,
      backgroundColor: body.backgroundColor || "#ffffff",
      backgroundImage: body.backgroundImage ?? null,
      backgroundGradient: body.backgroundGradient ?? null,
      thumbnailUrl: body.thumbnailUrl ?? null,
    })
    .returning();

  return Response.json({ slide: row });
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slideId = searchParams.get("id");

  if (!slideId) {
    return Response.json({ error: "Slide id is required" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: savedSlides.id })
    .from(savedSlides)
    .where(and(eq(savedSlides.id, slideId), eq(savedSlides.userId, user.id)))
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Slide not found" }, { status: 404 });
  }

  await db.delete(savedSlides).where(eq(savedSlides.id, slideId));

  return Response.json({ ok: true });
}

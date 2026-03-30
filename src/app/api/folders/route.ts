import { db } from "@/db";
import { folders } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  parentId: z.string().uuid().nullable().optional(),
});

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(folders)
    .where(eq(folders.userId, user.id))
    .orderBy(folders.name);

  return Response.json(rows);
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [folder] = await db
    .insert(folders)
    .values({
      userId: user.id,
      name: parsed.data.name,
      parentId: parsed.data.parentId ?? null,
    })
    .returning();

  return Response.json(folder, { status: 201 });
}

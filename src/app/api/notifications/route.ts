import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, desc, inArray, and } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  return Response.json(rows);
}

const patchSchema = z.object({
  ids: z.union([z.literal("all"), z.array(z.string().uuid()).min(1)]),
});

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { ids } = parsed.data;

  if (ids === "all") {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, user.id));
  } else {
    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, user.id),
          inArray(notifications.id, ids)
        )
      );
  }

  return Response.json({ success: true });
}

import { db } from "@/db";
import { users, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { eq, count, and, ne } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [stats] = await db
    .select({ total: count() })
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    plan: await getUserPlan(user.id),
    storageUsed: user.storageUsed ?? 0,
    emailDigest: user.emailDigest,
    createdAt: user.createdAt,
    presentationCount: stats?.total ?? 0,
  });
}

const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,28}[a-zA-Z0-9]$/;

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(usernameRegex, "Alphanumeric and hyphens only, 3-30 chars")
    .optional()
    .nullable(),
  bio: z.string().max(300).optional().nullable(),
  avatarUrl: z.string().url().max(2048).nullable().optional(),
  emailDigest: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.avatarUrl !== undefined) updates.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.emailDigest !== undefined) updates.emailDigest = parsed.data.emailDigest;
  if (parsed.data.bio !== undefined) updates.bio = parsed.data.bio;

  if (parsed.data.username !== undefined) {
    if (parsed.data.username !== null) {
      const lower = parsed.data.username.toLowerCase();
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.username, lower), ne(users.id, user.id)))
        .limit(1);
      if (existing) {
        return Response.json({ error: "Username already taken" }, { status: 409 });
      }
      updates.username = lower;
    } else {
      updates.username = null;
    }
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No changes" }, { status: 400 });
  }

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, user.id))
    .returning();

  return Response.json({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    username: updated.username,
    bio: updated.bio,
    avatarUrl: updated.avatarUrl,
  });
}

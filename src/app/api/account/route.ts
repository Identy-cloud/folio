import { db } from "@/db";
import {
  users,
  presentations,
  slides,
  comments,
  presentationViews,
  collaborators,
  subscriptions,
} from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { deleteUserR2Files } from "@/lib/r2";

export async function DELETE(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(`account-delete:${ip}`, 5, 900_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== "string" || !body.password.trim()) {
    return Response.json(
      { error: "Password is required" },
      { status: 400 },
    );
  }

  const supabaseAuth = await createClient();
  const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
    email: user.email,
    password: body.password,
  });

  if (signInError) {
    return Response.json(
      { error: "Invalid password" },
      { status: 403 },
    );
  }

  await deleteUserR2Files(user.id);

  await db.delete(presentations).where(eq(presentations.userId, user.id));

  await db.delete(users).where(eq(users.id, user.id));

  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  await adminClient.auth.admin.deleteUser(user.id);

  await supabaseAuth.auth.signOut();

  return Response.json({ ok: true });
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPresentations = await db
    .select()
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  const presentationIds = userPresentations.map((p) => p.id);

  const allSlides = presentationIds.length > 0
    ? await Promise.all(
        presentationIds.map((pid) =>
          db.select().from(slides).where(eq(slides.presentationId, pid))
        )
      ).then((results) => results.flat())
    : [];

  const allComments = presentationIds.length > 0
    ? await Promise.all(
        presentationIds.map((pid) =>
          db.select().from(comments).where(eq(comments.presentationId, pid))
        )
      ).then((results) => results.flat())
    : [];

  const allViews = presentationIds.length > 0
    ? await Promise.all(
        presentationIds.map((pid) =>
          db.select().from(presentationViews).where(eq(presentationViews.presentationId, pid))
        )
      ).then((results) => results.flat())
    : [];

  const userCollabs = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.userId, user.id));

  const [userSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      storageUsed: user.storageUsed,
      createdAt: user.createdAt,
    },
    presentations: userPresentations.map((p) => ({
      ...p,
      slides: allSlides.filter((s) => s.presentationId === p.id),
      comments: allComments.filter((c) => c.presentationId === p.id),
      views: allViews
        .filter((v) => v.presentationId === p.id)
        .map((v) => ({
          id: v.id,
          slideIndex: v.slideIndex,
          duration: v.duration,
          createdAt: v.createdAt,
        })),
    })),
    collaborations: userCollabs,
    subscription: userSubscription ?? null,
    exportedAt: new Date().toISOString(),
  });
}

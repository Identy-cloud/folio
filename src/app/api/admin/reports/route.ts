import { db } from "@/db";
import { reports } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

function isAdmin(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return adminEmail.split(",").map((e) => e.trim()).includes(email);
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allReports = await db
    .select()
    .from(reports)
    .orderBy(desc(reports.createdAt));

  return Response.json(allReports);
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "reviewed", "dismissed"]),
});

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user || !isAdmin(user.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id, status } = parsed.data;

  const [updated] = await db
    .update(reports)
    .set({ status })
    .where(eq(reports.id, id))
    .returning();

  if (!updated) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }

  return Response.json(updated);
}

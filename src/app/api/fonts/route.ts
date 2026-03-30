import { getAuthenticatedUser } from "@/lib/auth";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getUserPlan } from "@/lib/stripe";
import { getPlanLimits } from "@/lib/plan-limits";
import { db } from "@/db";
import { fonts, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

const ALLOWED_FORMATS: Record<string, string> = {
  "font/woff2": "woff2",
  "font/woff": "woff",
  "font/ttf": "ttf",
  "font/otf": "otf",
  "application/font-woff2": "woff2",
  "application/font-woff": "woff",
  "application/x-font-ttf": "ttf",
  "application/x-font-opentype": "otf",
  "application/vnd.ms-opentype": "otf",
};

const EXTENSION_FORMATS: Record<string, string> = {
  woff2: "woff2",
  woff: "woff",
  ttf: "ttf",
  otf: "otf",
};

const MAX_FONT_SIZE = 2 * 1024 * 1024; // 2MB

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(fonts)
    .where(eq(fonts.userId, user.id))
    .orderBy(fonts.createdAt);

  return Response.json({ fonts: rows });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`font-upload:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);

  if (!limits.canUseCustomFonts) {
    return Response.json(
      { error: "PLAN_REQUIRED", requiredPlan: "studio" },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const fontName = formData.get("name");
  const fontFamily = formData.get("family");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (typeof fontName !== "string" || !fontName.trim()) {
    return Response.json({ error: "Font name is required" }, { status: 400 });
  }

  if (typeof fontFamily !== "string" || !fontFamily.trim()) {
    return Response.json({ error: "Font family is required" }, { status: 400 });
  }

  if (file.size > MAX_FONT_SIZE) {
    return Response.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const format = ALLOWED_FORMATS[file.type] ?? EXTENSION_FORMATS[ext];

  if (!format) {
    return Response.json(
      { error: "Invalid font format. Allowed: woff2, woff, ttf, otf" },
      { status: 400 },
    );
  }

  const [userRow] = await db
    .select({ storageUsed: users.storageUsed })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const currentStorage = userRow?.storageUsed ?? 0;
  if (currentStorage + file.size > limits.maxStorageBytes) {
    return Response.json(
      { error: "STORAGE_LIMIT", plan, used: currentStorage, limit: limits.maxStorageBytes },
      { status: 403 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const key = `fonts/${user.id}/${nanoid()}.${ext}`;
  const contentType = file.type || `font/${format}`;
  const publicUrl = await uploadToR2(key, buffer, contentType);

  await db
    .update(users)
    .set({ storageUsed: currentStorage + file.size })
    .where(eq(users.id, user.id));

  const [row] = await db
    .insert(fonts)
    .values({
      userId: user.id,
      name: fontName.trim(),
      family: fontFamily.trim(),
      url: publicUrl,
      format,
    })
    .returning();

  return Response.json({ font: row });
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fontId = searchParams.get("id");

  if (!fontId) {
    return Response.json({ error: "Font id is required" }, { status: 400 });
  }

  const [font] = await db
    .select()
    .from(fonts)
    .where(and(eq(fonts.id, fontId), eq(fonts.userId, user.id)))
    .limit(1);

  if (!font) {
    return Response.json({ error: "Font not found" }, { status: 404 });
  }

  const r2Key = font.url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
  await deleteFromR2(r2Key);

  await db.delete(fonts).where(eq(fonts.id, fontId));

  return Response.json({ ok: true });
}

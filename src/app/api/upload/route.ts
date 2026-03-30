import { getAuthenticatedUser } from "@/lib/auth";
import { generateUploadUrl, uploadToR2 } from "@/lib/r2";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getUserPlan } from "@/lib/stripe";
import { getPlanLimits } from "@/lib/plan-limits";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { processImage } from "@/lib/image-processing";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const uploadSchema = z.object({
  contentType: z.enum(ALLOWED_TYPES as [string, ...string[]]),
  filename: z.string().min(1).max(255),
  fileSize: z.number().int().min(1).max(MAX_FILE_SIZE).optional(),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`upload:${user.id}`, 20, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const contentTypeHeader = request.headers.get("content-type") ?? "";
  if (contentTypeHeader.includes("multipart/form-data")) {
    return handleFormDataUpload(request, user.id);
  }

  const raw = await request.json().catch(() => null);
  const parsed = uploadSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);

  const [userRow] = await db
    .select({ storageUsed: users.storageUsed })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const currentStorage = userRow?.storageUsed ?? 0;
  const fileSize = parsed.data.fileSize ?? 0;

  if (currentStorage + fileSize > limits.maxStorageBytes) {
    return Response.json(
      { error: "STORAGE_LIMIT", plan, used: currentStorage, limit: limits.maxStorageBytes },
      { status: 403 }
    );
  }

  const ext = parsed.data.filename.split(".").pop() ?? "bin";
  const key = `uploads/${user.id}/${nanoid()}.${ext}`;

  const { signedUrl, publicUrl } = await generateUploadUrl(
    key,
    parsed.data.contentType
  );

  if (fileSize > 0) {
    await db
      .update(users)
      .set({ storageUsed: currentStorage + fileSize })
      .where(eq(users.id, user.id));
  }

  return Response.json({ signedUrl, publicUrl });
}

async function handleFormDataUpload(request: Request, userId: string) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File too large" }, { status: 400 });
  }

  const plan = await getUserPlan(userId);
  const limits = getPlanLimits(plan);

  const [userRow] = await db
    .select({ storageUsed: users.storageUsed })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const currentStorage = userRow?.storageUsed ?? 0;

  if (currentStorage + file.size > limits.maxStorageBytes) {
    return Response.json(
      { error: "STORAGE_LIMIT", plan, used: currentStorage, limit: limits.maxStorageBytes },
      { status: 403 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);

  const processed = await processImage(rawBuffer, file.type);

  const ext = file.name.split(".").pop() ?? "bin";
  const key = `uploads/${userId}/${nanoid()}.${ext}`;

  const publicUrl = await uploadToR2(key, processed.buffer, file.type);

  await db
    .update(users)
    .set({ storageUsed: currentStorage + processed.buffer.length })
    .where(eq(users.id, userId));

  return Response.json({
    publicUrl,
    width: processed.width,
    height: processed.height,
    format: processed.format,
    size: processed.buffer.length,
  });
}

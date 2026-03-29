import { getAuthenticatedUser } from "@/lib/auth";
import { generateUploadUrl } from "@/lib/r2";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan-limits";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";

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

  const rl = checkRateLimit(`upload:${user.id}`, 20, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => null);
  const parsed = uploadSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Check storage limit
  const limits = getPlanLimits(user.plan ?? "free");
  const fileSize = parsed.data.fileSize ?? 0;
  if ((user.storageUsed ?? 0) + fileSize > limits.maxStorageBytes) {
    return Response.json(
      { error: "Storage limit reached", limit: limits.maxStorageBytes },
      { status: 403 }
    );
  }

  const ext = parsed.data.filename.split(".").pop() ?? "bin";
  const key = `uploads/${user.id}/${nanoid()}.${ext}`;

  const { signedUrl, publicUrl } = await generateUploadUrl(
    key,
    parsed.data.contentType
  );

  // Track storage usage (best-effort, column may not exist pre-migration)
  if (fileSize > 0) {
    try {
      await db
        .update(users)
        .set({ storageUsed: sql`COALESCE(${users.storageUsed}, 0) + ${fileSize}` })
        .where(eq(users.id, user.id));
    } catch {
      // Column not yet migrated — skip tracking
    }
  }

  return Response.json({ signedUrl, publicUrl });
}

import { getAuthenticatedUser } from "@/lib/auth";
import { generateUploadUrl } from "@/lib/r2";
import { z } from "zod";
import { nanoid } from "nanoid";

const uploadLimits = new Map<string, { count: number; resetAt: number }>();

const MAX_UPLOADS_PER_MINUTE = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = uploadLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    uploadLimits.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= MAX_UPLOADS_PER_MINUTE) {
    return false;
  }

  entry.count++;
  return true;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const uploadSchema = z.object({
  contentType: z.enum(ALLOWED_TYPES as [string, ...string[]]),
  filename: z.string().min(1).max(255),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(user.id)) {
    return Response.json(
      { error: "Rate limit exceeded. Max 10 uploads per minute." },
      { status: 429 }
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = uploadSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const ext = parsed.data.filename.split(".").pop() ?? "bin";
  const key = `uploads/${user.id}/${nanoid()}.${ext}`;

  const { signedUrl, publicUrl } = await generateUploadUrl(
    key,
    parsed.data.contentType
  );

  return Response.json({ signedUrl, publicUrl });
}

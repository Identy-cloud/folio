import { getAuthenticatedUser } from "@/lib/auth";
import { generateUploadUrl } from "@/lib/r2";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";
import { nanoid } from "nanoid";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
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

  const ext = parsed.data.filename.split(".").pop() ?? "bin";
  const key = `uploads/${user.id}/${nanoid()}.${ext}`;

  const { signedUrl, publicUrl } = await generateUploadUrl(
    key,
    parsed.data.contentType
  );

  return Response.json({ signedUrl, publicUrl });
}

import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { uploadToR2 } from "@/lib/r2";
import { processImage } from "@/lib/image-processing";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPlanLimits } from "@/lib/plan-limits";

const PAID_PLANS = new Set(["creator", "studio", "agency"]);

const bodySchema = z.object({
  prompt: z.string().min(1).max(1000),
  width: z.number().int().min(256).max(2048).optional().default(1024),
  height: z.number().int().min(256).max(2048).optional().default(1024),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  if (!PAID_PLANS.has(plan)) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Creator plan for AI image generation", plan },
      { status: 403 },
    );
  }

  const rl = await checkRateLimit(`ai-image:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { prompt, width, height } = parsed.data;
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) {
      return Response.json({ error: "Image generation failed" }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    const processed = await processImage(rawBuffer, contentType);

    const limits = getPlanLimits(plan);
    const [userRow] = await db
      .select({ storageUsed: users.storageUsed })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const currentStorage = userRow?.storageUsed ?? 0;
    if (currentStorage + processed.buffer.length > limits.maxStorageBytes) {
      return Response.json(
        { error: "STORAGE_LIMIT", plan, used: currentStorage, limit: limits.maxStorageBytes },
        { status: 403 },
      );
    }

    const key = `uploads/${user.id}/${nanoid()}.${processed.format}`;
    const publicUrl = await uploadToR2(key, processed.buffer, contentType);

    await db
      .update(users)
      .set({ storageUsed: currentStorage + processed.buffer.length })
      .where(eq(users.id, user.id));

    return Response.json({
      url: publicUrl,
      width: processed.width,
      height: processed.height,
    });
  } catch {
    return Response.json({ error: "Image generation timed out or failed" }, { status: 502 });
  }
}

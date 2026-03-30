import { db } from "@/db";
import { presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

interface TimelineEntry {
  slideIndex: number;
  startTime: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`recording:${user.id}`, 5, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const { id } = await params;
  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const audio = formData.get("audio");
  const timelineRaw = formData.get("timeline");
  const durationRaw = formData.get("duration");

  if (!(audio instanceof Blob)) {
    return Response.json({ error: "Missing audio file" }, { status: 400 });
  }
  if (typeof timelineRaw !== "string" || typeof durationRaw !== "string") {
    return Response.json({ error: "Missing timeline or duration" }, { status: 400 });
  }

  let timeline: TimelineEntry[];
  try {
    timeline = JSON.parse(timelineRaw) as TimelineEntry[];
  } catch {
    return Response.json({ error: "Invalid timeline JSON" }, { status: 400 });
  }

  const durationMs = parseInt(durationRaw, 10);
  if (isNaN(durationMs) || durationMs <= 0) {
    return Response.json({ error: "Invalid duration" }, { status: 400 });
  }

  if (pres.recordingUrl) {
    const oldKey = pres.recordingUrl.split("/").slice(-3).join("/");
    await deleteFromR2(oldKey).catch(() => {});
  }

  const buffer = Buffer.from(await audio.arrayBuffer());
  const key = `recordings/${user.id}/${id}-${Date.now()}.webm`;
  const publicUrl = await uploadToR2(key, buffer, "audio/webm");

  const [updated] = await db
    .update(presentations)
    .set({
      recordingUrl: publicUrl,
      recordingTimeline: timeline,
      recordingDuration: durationMs,
      updatedAt: new Date(),
    })
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .returning();

  return Response.json({
    recordingUrl: updated.recordingUrl,
    recordingDuration: updated.recordingDuration,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (pres.recordingUrl) {
    const key = pres.recordingUrl.split("/").slice(-3).join("/");
    await deleteFromR2(key).catch(() => {});
  }

  await db
    .update(presentations)
    .set({
      recordingUrl: null,
      recordingTimeline: null,
      recordingDuration: null,
      updatedAt: new Date(),
    })
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)));

  return Response.json({ success: true });
}

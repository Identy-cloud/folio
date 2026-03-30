import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getPlanLimits } from "@/lib/plan-limits";
import { getUserPlan } from "@/lib/stripe";
import { generatePptxBuffer } from "@/lib/export-pptx";
import { eq, asc } from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { Slide } from "@/types/elements";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`export-pptx:${user.id}`, 10, 3600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);

  if (!limits.canExportPptx) {
    return Response.json(
      { error: "PLAN_LIMIT", message: "Upgrade to Studio or Agency to export PPTX" },
      { status: 403 }
    );
  }

  const { id } = await params;

  const [presentation] = await db
    .select()
    .from(presentations)
    .where(eq(presentations.id, id))
    .limit(1);

  if (!presentation || presentation.userId !== user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const slideRows = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, id))
    .orderBy(asc(slides.order));

  const slideData: Slide[] = slideRows.map((row) => ({
    id: row.id,
    presentationId: row.presentationId,
    order: row.order,
    transition: row.transition as Slide["transition"],
    backgroundColor: row.backgroundColor,
    backgroundImage: row.backgroundImage,
    elements: (row.elements ?? []) as Slide["elements"],
    mobileElements: (row.mobileElements ?? null) as Slide["mobileElements"],
    notes: row.notes,
  }));

  const buffer = await generatePptxBuffer(
    presentation.title,
    slideData
  );

  const safeName = presentation.title
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim() || "presentation";

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${safeName}.pptx"`,
      "Cache-Control": "no-store",
    },
  });
}

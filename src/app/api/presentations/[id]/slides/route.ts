import { db } from "@/db";
import { slides, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq, asc } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const animationEnum = z.enum(["none", "fade-up", "fade-down", "fade-left", "fade-right", "zoom-in"]).optional();

const baseElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "image", "shape", "arrow", "divider"]),
  x: z.number(), y: z.number(), w: z.number(), h: z.number(),
  rotation: z.number(), opacity: z.number().min(0).max(1),
  zIndex: z.number().int(), locked: z.boolean(),
  animation: animationEnum,
  animationDelay: z.number().min(0).optional(),
});

const textElementSchema = baseElementSchema.extend({
  type: z.literal("text"),
  content: z.string().max(50000),
  fontFamily: z.string().max(100),
  fontSize: z.number().min(1).max(1000),
  fontWeight: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.number(),
  color: z.string().max(50),
  textAlign: z.enum(["left", "center", "right"]),
  verticalAlign: z.enum(["top", "middle", "bottom"]),
});

const imageElementSchema = baseElementSchema.extend({
  type: z.literal("image"),
  src: z.string().url().max(2048),
  objectFit: z.enum(["cover", "contain", "fill"]),
  filter: z.string().max(200),
  isPlaceholder: z.boolean().optional(),
});

const shapeElementSchema = baseElementSchema.extend({
  type: z.literal("shape"),
  shape: z.enum(["rect", "circle", "triangle"]),
  fill: z.string().max(50),
  stroke: z.string().max(50),
  strokeWidth: z.number().min(0),
  borderRadius: z.number().min(0),
});

const arrowElementSchema = baseElementSchema.extend({
  type: z.literal("arrow"),
  direction: z.enum(["right", "left", "up", "down"]),
  color: z.string().max(50),
  strokeWidth: z.number().min(0),
});

const dividerElementSchema = baseElementSchema.extend({
  type: z.literal("divider"),
  color: z.string().max(50),
  strokeWidth: z.number().min(0),
});

const elementSchema = z.discriminatedUnion("type", [
  textElementSchema, imageElementSchema, shapeElementSchema,
  arrowElementSchema, dividerElementSchema,
]);

const slideSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  transition: z.enum(["fade", "slide-left", "slide-up", "zoom", "none"]).default("fade"),
  backgroundColor: z.string().max(50),
  backgroundImage: z.string().url().nullable().or(z.literal("")),
  elements: z.array(elementSchema).max(500),
  mobileElements: z.array(elementSchema).max(500).nullable().default(null),
  notes: z.string().max(10000).default(""),
});

const putSlidesSchema = z.array(slideSchema).max(200);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const result = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, id))
    .orderBy(asc(slides.order));

  return Response.json(result);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) return Response.json({ error: "Not found" }, { status: 404 });

  const raw = await request.json().catch(() => null);
  const parsed = putSlidesSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid slides data", details: parsed.error.flatten() }, { status: 400 });
  }

  await db.transaction(async (tx) => {
    await tx.delete(slides).where(eq(slides.presentationId, id));

    if (parsed.data.length > 0) {
      await tx.insert(slides).values(
        parsed.data.map((s) => ({
          id: s.id,
          presentationId: id,
          order: s.order,
          transition: s.transition,
          backgroundColor: s.backgroundColor,
          backgroundImage: s.backgroundImage || null,
          elements: s.elements,
          mobileElements: s.mobileElements,
          notes: s.notes,
        }))
      );
    }

    await tx
      .update(presentations)
      .set({ updatedAt: new Date() })
      .where(eq(presentations.id, id));
  });

  return Response.json({ success: true });
}

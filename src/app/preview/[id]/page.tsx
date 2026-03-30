import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { and, eq, asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import type { SlideElement, SlideTransition, TransitionEasing } from "@/types/elements";
import { PreviewClient } from "./preview-client";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.id, id), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) notFound();

  const slideRows = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, pres.id))
    .orderBy(asc(slides.order));

  const ownerPlan = await getUserPlan(user.id);

  const mapped = slideRows.map((s) => ({
    id: s.id,
    presentationId: s.presentationId,
    order: s.order,
    transition: (s.transition as SlideTransition) ?? "fade",
    transitionDuration: s.transitionDuration ?? undefined,
    transitionEasing: (s.transitionEasing as TransitionEasing) ?? undefined,
    backgroundColor: s.backgroundColor,
    backgroundImage: s.backgroundImage,
    elements: s.elements as SlideElement[],
    mobileElements: s.mobileElements as SlideElement[] | null,
  }));

  return (
    <PreviewClient
      title={pres.title}
      slides={mapped}
      showWatermark={ownerPlan === "free"}
      presentationId={pres.id}
      editorUrl={`/editor/${pres.id}`}
    />
  );
}

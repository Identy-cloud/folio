import { db } from "@/db";
import { presentations, slides } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { and, eq, asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { PresenterClient } from "./presenter-client";

export default async function PresenterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const { slug } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(and(eq(presentations.slug, slug), eq(presentations.userId, user.id)))
    .limit(1);

  if (!pres) notFound();

  const slideRows = await db
    .select()
    .from(slides)
    .where(eq(slides.presentationId, pres.id))
    .orderBy(asc(slides.order));

  const mapped = slideRows.map((s) => ({
    id: s.id,
    order: s.order,
    backgroundColor: s.backgroundColor,
    backgroundImage: s.backgroundImage,
    elements: s.elements as import("@/types/elements").SlideElement[],
    notes: s.notes,
  }));

  return <PresenterClient title={pres.title} slides={mapped} slug={slug} presentationId={pres.id} />;
}

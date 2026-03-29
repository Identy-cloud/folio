import { getStripe } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const subscriptionId = session.subscription as string;

    if (userId && plan && subscriptionId) {
      const sub = await getStripe().subscriptions.retrieve(subscriptionId);
      await db
        .insert(subscriptions)
        .values({
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          plan,
          billingPeriod: sub.items.data[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly",
          status: "active",
          currentPeriodEnd: new Date(((sub as unknown as Record<string, number>).current_period_end) * 1000),
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            plan,
            billingPeriod: sub.items.data[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly",
            status: "active",
            currentPeriodEnd: new Date(((sub as unknown as Record<string, number>).current_period_end) * 1000),
            updatedAt: new Date(),
          },
        });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    const stripeSubId = sub.id;

    const status = sub.status === "active" ? "active"
      : sub.status === "past_due" ? "past_due"
      : sub.status === "trialing" ? "trialing"
      : "canceled";

    await db
      .update(subscriptions)
      .set({
        status,
        currentPeriodEnd: new Date(((sub as unknown as Record<string, number>).current_period_end) * 1000),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubId));
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await db
      .update(subscriptions)
      .set({
        plan: "free",
        status: "canceled",
        stripeSubscriptionId: null,
        currentPeriodEnd: null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, sub.id));
  }

  return Response.json({ received: true });
}

import Stripe from "stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  }
  return _stripe;
}

export type Plan = "free" | "creator" | "studio" | "agency";
export type BillingPeriod = "monthly" | "annual";

export const PRICE_IDS: Record<string, string> = {
  creator_monthly: process.env.STRIPE_PRICE_CREATOR_MONTHLY ?? "",
  creator_annual: process.env.STRIPE_PRICE_CREATOR_ANNUAL ?? "",
  studio_monthly: process.env.STRIPE_PRICE_STUDIO_MONTHLY ?? "",
  studio_annual: process.env.STRIPE_PRICE_STUDIO_ANNUAL ?? "",
  agency_monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? "",
  agency_annual: process.env.STRIPE_PRICE_AGENCY_ANNUAL ?? "",
};

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<string> {
  const [sub] = await db
    .select({ stripeCustomerId: subscriptions.stripeCustomerId })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (sub?.stripeCustomerId) return sub.stripeCustomerId;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await db
    .insert(subscriptions)
    .values({ userId, stripeCustomerId: customer.id, plan: "free", status: "active" })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: { stripeCustomerId: customer.id },
    });

  return customer.id;
}

export async function getUserPlan(userId: string): Promise<Plan> {
  try {
    const [sub] = await db
      .select({ plan: subscriptions.plan, status: subscriptions.status })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!sub || sub.status !== "active") return "free";
    return (sub.plan as Plan) ?? "free";
  } catch {
    return "free";
  }
}

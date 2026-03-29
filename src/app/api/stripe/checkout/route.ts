import { getAuthenticatedUser } from "@/lib/auth";
import { getStripe, getOrCreateStripeCustomer, PRICE_IDS } from "@/lib/stripe";
import { z } from "zod";

const bodySchema = z.object({
  plan: z.enum(["creator", "studio", "agency"]),
  period: z.enum(["monthly", "annual"]).default("monthly"),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { plan, period } = parsed.data;
  const priceId = PRICE_IDS[`${plan}_${period}`];

  if (!priceId) {
    return Response.json({ error: "Plan not configured" }, { status: 500 });
  }

  const customerId = await getOrCreateStripeCustomer(user.id, user.email);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    metadata: { userId: user.id, plan },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/pricing`,
    allow_promotion_codes: true,
  });

  return Response.json({ url: session.url });
}

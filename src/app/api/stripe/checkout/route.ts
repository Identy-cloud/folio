import { getAuthenticatedUser } from "@/lib/auth";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { z } from "zod";

const bodySchema = z.object({
  plan: z.enum(["pro", "team"]),
});

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = parsed.data.plan === "pro"
    ? PRICE_IDS.pro_monthly
    : PRICE_IDS.team_monthly;

  if (!priceId) {
    return Response.json({ error: "Plan not configured" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    metadata: { userId: user.id, plan: parsed.data.plan },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/pricing`,
  });

  return Response.json({ url: session.url });
}

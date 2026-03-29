import { getAuthenticatedUser } from "@/lib/auth";
import { getStripe, getOrCreateStripeCustomer } from "@/lib/stripe";

export async function POST() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = await getOrCreateStripeCustomer(user.id, user.email);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/settings/billing`,
  });

  return Response.json({ url: session.url });
}

import { db } from "@/db";
import { subscriptions, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plan-limits";
import { getStripe } from "@/lib/stripe";
import { eq, count } from "drizzle-orm";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  const plan = sub?.status === "active" ? (sub.plan ?? "free") : "free";
  const limits = getPlanLimits(plan);

  const [presCount] = await db
    .select({ total: count() })
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  let paymentMethod: { brand: string; last4: string; expMonth: number; expYear: number } | null = null;
  let invoices: { id: string; date: string; amount: number; currency: string; status: string; url: string | null }[] = [];

  if (sub?.stripeCustomerId && plan !== "free") {
    try {
      const stripe = getStripe();

      const customer = await stripe.customers.retrieve(sub.stripeCustomerId, {
        expand: ["invoice_settings.default_payment_method"],
      });

      if (!customer.deleted) {
        const pm = customer.invoice_settings?.default_payment_method;
        if (pm && typeof pm !== "string" && pm.card) {
          paymentMethod = {
            brand: pm.card.brand,
            last4: pm.card.last4,
            expMonth: pm.card.exp_month,
            expYear: pm.card.exp_year,
          };
        }

        const invoiceList = await stripe.invoices.list({
          customer: sub.stripeCustomerId,
          limit: 5,
        });

        invoices = invoiceList.data.map((inv) => ({
          id: inv.id,
          date: new Date((inv.created ?? 0) * 1000).toISOString(),
          amount: inv.amount_paid ?? 0,
          currency: inv.currency ?? "usd",
          status: inv.status ?? "unknown",
          url: inv.hosted_invoice_url ?? null,
        }));
      }
    } catch {
      // Stripe keys not configured or customer not found — continue without payment info
    }
  }

  return Response.json({
    plan,
    billingPeriod: sub?.billingPeriod ?? "monthly",
    status: sub?.status ?? "active",
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    presentationCount: presCount?.total ?? 0,
    maxPresentations: limits.maxPresentations,
    paymentMethod,
    invoices,
  });
}

# Folio — Production Deployment Guide

Step-by-step guide to deploy Folio from zero to production.

---

## 1. Supabase (Auth + Database)

1. Create a new project at [supabase.com](https://supabase.com).
2. From **Settings > API**, copy:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public key)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role key — keep secret)
3. From **Settings > Database > Connection string (URI)**, copy the connection string for `DATABASE_URL`. Use the **Session Mode** (port 5432) URI.
4. Enable OAuth providers under **Authentication > Providers**:
   - **Google**: Create OAuth credentials in Google Cloud Console. Set authorized redirect URI to `https://your-project.supabase.co/auth/v1/callback`.
   - **GitHub**: Create an OAuth App at github.com/settings/developers. Set callback URL to `https://your-project.supabase.co/auth/v1/callback`.
5. Under **Authentication > URL Configuration**, set:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`
6. **RLS Note**: Folio uses Drizzle for all DB queries (server-side with service role key), so RLS policies on custom tables are not strictly required. However, ensure Supabase Auth tables have default RLS enabled.

---

## 2. Cloudflare R2 (Asset Storage)

1. Log in to Cloudflare and navigate to **R2 Object Storage**.
2. Create a bucket named `folio-assets`.
3. Under the bucket settings, enable a **Custom Domain** or use the **R2.dev subdomain** for public access. Copy the URL as `R2_PUBLIC_URL`.
4. Create an **R2 API Token** (Settings > R2 > Manage R2 API Tokens):
   - Permission: Object Read & Write
   - Specify bucket: `folio-assets`
   - Copy `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`
5. Your `R2_ACCOUNT_ID` is visible in the Cloudflare dashboard URL or via `npx wrangler whoami`.
6. Configure CORS on the bucket. Create a `cors.json` in the repo root:

```json
[{
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://yourdomain.com",
    "https://*.vercel.app"
  ],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}]
```

Apply it:

```bash
npx wrangler r2 bucket cors put folio-assets --file cors.json
```

---

## 3. Stripe (Payments)

1. Create a Stripe account at [stripe.com](https://stripe.com). Switch to **Live mode** when ready.
2. Create **Products** with **Prices** for each tier:

| Product  | Monthly Price ID               | Annual Price ID               |
|----------|--------------------------------|-------------------------------|
| Creator  | `STRIPE_PRICE_CREATOR_MONTHLY` | `STRIPE_PRICE_CREATOR_ANNUAL` |
| Studio   | `STRIPE_PRICE_STUDIO_MONTHLY`  | `STRIPE_PRICE_STUDIO_ANNUAL`  |
| Agency   | `STRIPE_PRICE_AGENCY_MONTHLY`  | `STRIPE_PRICE_AGENCY_ANNUAL`  |

3. Copy your **Publishable key** (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) and **Secret key** (`STRIPE_SECRET_KEY`) from **Developers > API keys**.
4. Create a **Webhook endpoint**:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the signing secret as `STRIPE_WEBHOOK_SECRET`
5. Enable **Customer Portal** under **Settings > Billing > Customer Portal**. Configure it to allow plan changes and cancellations.

---

## 4. Upstash Redis (Rate Limiting)

1. Create a database at [upstash.com](https://upstash.com) (select the region closest to your Vercel deployment).
2. From the database details page, copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. If not configured, the app falls back to in-memory rate limiting (not suitable for serverless/multi-instance).

---

## 5. Resend (Transactional Email)

1. Create an account at [resend.com](https://resend.com).
2. Add and verify your sending domain (e.g., `identy.cloud`): **Domains > Add Domain**, then add the DNS records Resend provides.
3. Create an API key and copy it as `RESEND_API_KEY`.
4. Set `EMAIL_FROM` to an address on your verified domain (e.g., `noreply@identy.cloud`).

---

## 6. Sentry (Error Monitoring)

1. Create a project at [sentry.io](https://sentry.io) — select **Next.js** as the platform.
2. Copy the DSN as `NEXT_PUBLIC_SENTRY_DSN`.
3. Note your organization slug (`SENTRY_ORG`) and project slug (`SENTRY_PROJECT`) — these are used for source map uploads during the Vercel build.
4. Create a Sentry Auth Token and add it as `SENTRY_AUTH_TOKEN` in Vercel env vars (the Sentry Next.js plugin uses this at build time).

---

## 7. PostHog (Product Analytics)

1. Create a project at [posthog.com](https://posthog.com).
2. From **Settings > Project**, copy the **Project API Key** as `NEXT_PUBLIC_POSTHOG_KEY`.
3. Set `NEXT_PUBLIC_POSTHOG_HOST` to `https://us.i.posthog.com` (US) or `https://eu.i.posthog.com` (EU) based on your data region.

---

## 8. Anthropic (AI Features)

1. Get an API key from [console.anthropic.com](https://console.anthropic.com).
2. Set it as `ANTHROPIC_API_KEY`.
3. Used for: AI slide generation, translation, and speaker notes generation.

---

## 9. Unsplash (Stock Photos)

1. Create an app at [unsplash.com/developers](https://unsplash.com/developers).
2. Copy the **Access Key** as `UNSPLASH_ACCESS_KEY`.
3. For production, apply for Production status to get higher rate limits (50 req/hour on demo vs 5000/hour on production).

---

## 10. PartyKit (Realtime Collaboration)

1. Deploy the PartyKit server from the repo root:

```bash
npx partykit deploy
```

2. The output will show the host URL (e.g., `folio.your-user.partykit.dev`). Set this as `NEXT_PUBLIC_PARTYKIT_HOST`.
3. To redeploy after changes to `party/main.ts`, run the same command again.

---

## 11. Vercel (Hosting)

1. Import the repo at [vercel.com](https://vercel.com).
2. Set **Framework Preset** to Next.js (should auto-detect).
3. Add ALL environment variables from `.env.example` with their production values. Use the Vercel dashboard or CLI:

```bash
vercel env pull .env.local  # to sync locally
```

4. Set the following additional Vercel-specific vars if needed:
   - `SENTRY_AUTH_TOKEN` — for source map uploads during build
5. Configure your **custom domain** under Project Settings > Domains.
6. Ensure the build command is `npm run build` and output directory is auto-detected.
7. Trigger a deploy and verify the build succeeds.

---

## 12. Post-Deploy Checklist

### Database Migrations

```bash
npx drizzle-kit migrate
```

Run this against the production `DATABASE_URL`. You can do it locally by temporarily setting the env var, or via a CI step.

### Verification Steps

- [ ] Visit the app URL — landing page loads
- [ ] Sign up / log in with Google and GitHub OAuth
- [ ] Create a presentation — editor loads
- [ ] Upload an image — appears in canvas (R2 working)
- [ ] Open the same presentation in two tabs — realtime sync works (PartyKit)
- [ ] Go to Pricing, start a checkout — Stripe checkout page loads
- [ ] Complete a test payment (use Stripe test mode first) — plan upgrades
- [ ] Trigger a test error — appears in Sentry
- [ ] Check PostHog — events are being tracked
- [ ] Share a presentation — public viewer loads at `/p/[slug]`
- [ ] Send a collaboration invite — email arrives (Resend)

### Cron Jobs

If using Vercel Cron, add a `vercel.json` or configure cron in the dashboard:

- `/api/cron/analytics-digest` — analytics summary
- `/api/cron/collab-digest` — collaboration digest emails
- `/api/cron/publish` — scheduled publishing

Each cron endpoint validates the `CRON_SECRET` header. Set the secret in Vercel and configure cron jobs to pass it as `Authorization: Bearer <CRON_SECRET>`.

### DNS / SSL

- Verify custom domain DNS is propagated
- HTTPS should be automatic via Vercel
- Ensure `NEXT_PUBLIC_APP_URL` matches the production domain exactly

---

## Environment Variable Summary

| Variable | Required | Service |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase |
| `DATABASE_URL` | Yes | Supabase (Postgres) |
| `R2_ACCOUNT_ID` | Yes | Cloudflare R2 |
| `R2_ACCESS_KEY_ID` | Yes | Cloudflare R2 |
| `R2_SECRET_ACCESS_KEY` | Yes | Cloudflare R2 |
| `R2_BUCKET_NAME` | Yes | Cloudflare R2 |
| `R2_PUBLIC_URL` | Yes | Cloudflare R2 |
| `NEXT_PUBLIC_PARTYKIT_HOST` | Yes | PartyKit |
| `NEXT_PUBLIC_APP_URL` | Yes | App |
| `ADMIN_EMAIL` | No | App |
| `CRON_SECRET` | No | App |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe |
| `STRIPE_SECRET_KEY` | No | Stripe |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe |
| `STRIPE_PRICE_CREATOR_MONTHLY` | No | Stripe |
| `STRIPE_PRICE_CREATOR_ANNUAL` | No | Stripe |
| `STRIPE_PRICE_STUDIO_MONTHLY` | No | Stripe |
| `STRIPE_PRICE_STUDIO_ANNUAL` | No | Stripe |
| `STRIPE_PRICE_AGENCY_MONTHLY` | No | Stripe |
| `STRIPE_PRICE_AGENCY_ANNUAL` | No | Stripe |
| `UPSTASH_REDIS_REST_URL` | No | Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash |
| `RESEND_API_KEY` | No | Resend |
| `EMAIL_FROM` | No | Resend |
| `ANTHROPIC_API_KEY` | No | Anthropic |
| `UNSPLASH_ACCESS_KEY` | No | Unsplash |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry |
| `SENTRY_ORG` | No | Sentry |
| `SENTRY_PROJECT` | No | Sentry |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog |

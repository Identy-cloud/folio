# Folio

Editorial presentation platform with agency-grade aesthetics. Create, collaborate, and present — all in the browser.

## Features

**Editor**
- DOM-based canvas (1920x1080) with CSS transforms
- 9 element types: text, image, shape, arrow, divider, embed, video, icon, line, table
- Inline WYSIWYG text editing, rich formatting, custom fonts
- Image crop, filters, gradients, shadows, blur effects
- Smart alignment guides, snap-to-grid, distribute evenly
- Drag-and-drop slide reordering, slide library
- Find & replace across all slides
- Animation timeline with 9 animation types
- Undo/redo with 50-action history
- Keyboard shortcuts panel (?)

**AI-Powered**
- Generate full presentations from a topic description
- Generate individual slides from natural language
- AI speaker notes from slide content
- Translate entire presentations to 10 languages
- AI image generation (Pollinations.ai)

**Collaboration**
- Real-time editing via Yjs + PartyKit (CRDT)
- Live cursor presence with color-coded users
- Threaded comments with replies
- Real-time chat panel
- Workspace and team management
- Collaborator invites with email notifications

**Presentation & Sharing**
- Public share links with password protection
- Expiring links and private share tokens
- Embedded viewer with customizable iframe
- Presenter view with dual-screen support (BroadcastChannel)
- Voice recording/narration with timeline sync
- Interactive slides (non-linear navigation)
- Live audience Q&A with upvoting
- Fork public presentations
- QR code sharing

**Dashboard**
- Folder organization
- Bulk operations (select, delete, move, toggle visibility)
- 20+ templates across 4 categories
- Analytics overview with CSS charts
- Recent presentations and favorites
- JSON import/export for backups
- Workspace switcher

**Export**
- PDF export
- PowerPoint (PPTX) export
- JSON export/import
- Print-optimized CSS (Cmd+P)

**Monetization**
- 4-tier pricing: Free, Creator, Studio, Agency
- Stripe checkout, billing portal, webhooks
- Plan enforcement on all features
- Upgrade prompts at every limit
- Watermark on free plan
- Weekly analytics email digest

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, App Router |
| Language | TypeScript (strict) |
| Styles | Tailwind CSS v4 |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle |
| Auth | Supabase Auth (email + Google + GitHub) |
| Storage | Cloudflare R2 |
| Realtime | Yjs + y-partyserver |
| Payments | Stripe |
| Email | Resend |
| Analytics | PostHog (consent-gated) |
| Monitoring | Sentry |
| AI | Anthropic Claude (Haiku 4.5) |
| Hosting | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Generate DB migration
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Start PartyKit server (realtime)
npx partykit dev
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# PartyKit
NEXT_PUBLIC_PARTYKIT_HOST=

# App
NEXT_PUBLIC_APP_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_TEAM_MONTHLY=

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@identy.cloud

# AI
ANTHROPIC_API_KEY=

# Stock Images
UNSPLASH_ACCESS_KEY=

# Cron
CRON_SECRET=

# Admin
ADMIN_EMAIL=
```

## Project Structure

```
src/
  app/
    (auth)/login/          # Authentication
    dashboard/             # Dashboard + analytics
    editor/[id]/           # Slide editor
    p/[slug]/              # Public viewer
    presenter/[slug]/      # Presenter mode
    embed/[slug]/          # Embedded viewer
    api/                   # API routes
  components/              # Shared components
  db/                      # Drizzle schema + client
  lib/                     # Utilities, templates, AI, email
  store/                   # Zustand editor store
  hooks/                   # Custom hooks
  types/                   # TypeScript types
party/
  main.ts                  # PartyKit Yjs server
drizzle/                   # SQL migrations
```

## License

Proprietary. All rights reserved.

Built by [Identy Cloud](https://identy.cloud).

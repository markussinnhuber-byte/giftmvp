# GiftMVP — Next.js + Supabase (App Router)

A minimal, production-ready scaffold for a **gift recommendation + shareable wishlist** app, set up for **affiliate monetization**.

## Features
- Onboarding quiz → "gift brief" (who you're shopping for, interests, budget).
- Gift ideas list with filters, add to wishlist.
- **Public share link** for a wishlist (no login required).
- **Claim / Bought** flow that hides purchases from the wishlist owner but is visible to viewers.
- Paste-any-URL ingestion (Open Graph/Schema.org scrape) to add anything from the web.
- Affiliate link monetization hook (Sovrn/Skimlinks script + optional wrappers for Awin/impact).
- Supabase Auth + Postgres schema (pgvector optional).
- Tailwind + shadcn-like baseline styling.

## Quick start

1) **Install deps**
```bash
pnpm i   # or npm i / yarn
```

2) **Create `.env`**
Copy `.env.example` → `.env` and fill values:

```
NEXT_PUBLIC_SUPABASE_URL=...       # from your Supabase project
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # anon key
SUPABASE_SERVICE_ROLE_KEY=...      # service role (server only)
SOVRN_SITE_ID=                     # (optional) your Sovrn/Skimlinks site ID
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3) **Create DB tables**
Open your Supabase SQL editor, paste and run **`supabase/schema.sql`**. Optional RLS hardening in **`supabase/policies.sql`**.

4) **Run the dev server**
```bash
pnpm dev   # or npm run dev / yarn dev
```

5) **Try it**
- Visit `/` to fill the gift brief.
- Visit `/dashboard` to manage your wishlists (requires login).
- Share `/wishlist/<share_id>` with friends; they can view/claim items without an account.
- Paste any product URL to add to a wishlist; the server scrapes OG tags for title/image/price.

## Notes
- This project uses Next.js App Router, React Server Components, and **API routes** for server work.
- For affiliate monetization:
  - If you use **Sovrn (Skimlinks)**, just set `SOVRN_SITE_ID`. The script auto-rewrites outbound merchant links.
  - For **Awin/impact**, see `lib/affiliate.ts` to wrap links to priority merchants.
- For production: deploy on **Vercel**, keep your Supabase keys/env in project settings, and consider enabling pgvector for semantic re-ranking later.

MIT License.
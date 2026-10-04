# StoreForge — AI Store Generator (POC)

A proof of concept for an AI e-commerce store generator. One platform generates
many independent stores from a shared component library.

**Core paradigm:** AI produces a *StoreBlueprint* (JSON configuration), never
code. A deterministic *SectionRenderer* turns that blueprint into a website.
Products, orders, and customers live separately, keyed by `storeId`.

## The three core pieces

| Piece | What it is | Where it lives |
|-------|-----------|----------------|
| **StoreBlueprint** | The "DNA" — identity, branding, theme, navigation, pages, sections, e-commerce settings. Zod-validated. | `src/lib/blueprint/schema.ts` |
| **Database** | Where configuration + business data live. Multi-tenant via `storeId`. | `prisma/schema.prisma` (design artifact) |
| **Rendering engine** | `SectionRenderer` maps `section.type` → component. AI picks sections; the renderer builds UI. | `src/components/store/SectionRenderer.tsx` |

## Templates, styles & sections

**6 sample stores** (`/store/<slug>`): Kairo (footwear), Mama's Kitchen (food), Lumen (jewelry), Volt (electronics), Terra (furniture), Glow (skincare).

**10 visual styles** (the generator): minimal, premium, vibrant, cozy, luxury, earthy, bold, pastel, tech, editorial — each maps to its own palette, fonts, radius, button/card style, and hero variant.

**18 industries** (the generator): fashion, footwear, food, beauty, skincare, electronics, furniture, jewelry, accessories, fitness, home-decor, toys, books, pets, wellness, groceries, artisan, other.

**14 section types** in the registry: hero (4 variants), featured-products (4 incl. carousel), category-grid, promo-banner, testimonials, newsletter, announcement-bar, text-image, brand-story, faq, social-proof (stats/logos), image-gallery, rich-text, collection-grid.

## Quick start

```bash
npm install
npm run dev
```

Then open:

- `/` — platform landing + links to demo stores
- `/store/kairo`, `/store/mamas-kitchen`, `/store/lumen`, `/store/volt`, `/store/terra`, `/store/glow` — six demo stores
- `/generate` — interactive generator: name + industry + style → live blueprint + render

## Architecture

```
Reference / description
        ↓
   AI pipeline            (heuristic generator in the POC)
        ↓
   StoreBlueprint   ──validate──▶  errors or typed blueprint
        ↓
   SectionRenderer ──▶  shared component library ──▶  website
        ↓
   Products/Orders/Customers   (separate, storeId-scoped)
```

### Why not let AI generate React code?

Generated code per store becomes unmaintainable at scale. Instead:

- AI controls **configuration** (`section.type`, `variant`, colors, fonts, order).
- The renderer is **deterministic** — consistent quality, fewer bugs, cheaper,
  safer output.
- Scaling = scaling infrastructure, not maintaining N separate codebases.

## Tech

- Next.js 15 (App Router) + React 19 + TypeScript
- Zod for blueprint validation
- Plain CSS (theme tokens via CSS custom properties) — no Tailwind dependency
- Prisma schema included as a design artifact (Postgres in production; the POC
  renders from in-memory samples so it runs with zero infra)

## Next steps (beyond the POC)

1. Wire the blueprint to Postgres/Prisma (replace in-memory samples with
   storeId-scoped queries).
2. Swap the heuristic generator for a real vision + LLM pipeline
   (reference image/URL → design characteristics → blueprint).
3. Add the visual editor (user/AI edits mutate the blueprint, not the app).
4. Domain resolution for custom domains (`store.example.com` → `storeId`).
5. Payment abstraction layer (Flutterwave / Paystack / Stripe).
# Supabase setup

StoreForge uses Next.js server rendering and route handlers directly; there is
no separate backend service.

Supabase provides authentication, PostgreSQL, and Storage.

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_STOREFORGE_SUPABASE_URL`
- `NEXT_PUBLIC_STOREFORGE_SUPABASE_KEY` (publishable key)
- `STOREFORGE_SUPABASE_SERVER_KEY` (server-only)

The publishable key is expected to be visible in browser bundles. Never expose
`STOREFORGE_SUPABASE_SERVER_KEY` to browser code.

Create a Supabase Storage bucket named `store-media` and configure its policies
before enabling server image uploads.

Checkout currently records an order locally without payment processing. Payment
provider integration is intentionally postponed.

## Database migration

Run `supabase/migrations/001_storeforge.sql` in the Supabase SQL editor. It
creates the owner-scoped `stores` table, stores validated blueprints/catalogs as
JSONB, and enables RLS so users can only manage their own stores. Published
stores remain publicly readable.

The Next.js store API is available at `/api/stores`. It uses the authenticated
Supabase session on the server; the service-role key is not required for normal
store CRUD.

The visual editor at `/stores/[slug]/edit` now reads/writes through these API
routes when Supabase is available, with browser local storage retained as a
fallback for demo/offline mode.

Run `supabase/migrations/002_orders.sql` after the stores migration. Checkout
then submits orders through `/api/storefront/orders`, and store owners can view
them through `/api/stores/[slug]/orders`. Payment processing remains disabled.

The editor uploads images through `/api/stores/[slug]/media` when the
`store-media` bucket exists. If the bucket or credentials are unavailable, the
editor falls back to browser-local image data.

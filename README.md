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
# Production integration setup

The app is currently local-first, but production adapters are included for:

- Supabase Auth and PostgreSQL
- Supabase Storage (`store-media` bucket)
- Paystack payments
- Vercel deployment

Copy `.env.example` to `.env.local` and fill in the values from your provider dashboards. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYSTACK_SECRET_KEY` to the browser.

Create the Supabase Storage bucket named `store-media` and configure its policies before enabling server image uploads. The Paystack integration is intentionally disabled until `PAYSTACK_SECRET_KEY` is configured.

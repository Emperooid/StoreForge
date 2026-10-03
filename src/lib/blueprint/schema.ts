/**
 * StoreBlueprint — the "DNA" of a generated store.
 *
 * This is the single source of truth for what a store *looks like* and how it
 * is configured. AI produces this JSON; the renderer turns it into a website.
 * AI NEVER writes code — it only writes this configuration.
 *
 * The section union below is the "approved design vocabulary". AI may only
 * select from these types + variants, so the system stays predictable while
 * the AI stays creative.
 */

import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Store identity                                                      */
/* ------------------------------------------------------------------ */

export const INDUSTRIES = [
  "fashion",
  "footwear",
  "food",
  "beauty",
  "skincare",
  "electronics",
  "furniture",
  "jewelry",
  "accessories",
  "fitness",
  "home-decor",
  "toys",
  "books",
  "pets",
  "wellness",
  "groceries",
  "artisan",
  "other",
] as const;

export const StoreIdentitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  industry: z.enum(INDUSTRIES).default("other"),
  slug: z.string().min(1),
});

/* ------------------------------------------------------------------ */
/* Branding                                                            */
/* ------------------------------------------------------------------ */

export const BrandingSchema = z.object({
  logo: z.string().optional(),
  favicon: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export const ThemeSchema = z.object({
  headingFont: z.string(),
  bodyFont: z.string(),
  spacing: z.enum(["compact", "medium", "large"]).default("medium"),
  borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),
  buttonStyle: z.enum(["square", "rounded", "pill"]).default("rounded"),
  cardStyle: z.enum(["minimal", "bordered", "shadow"]).default("minimal"),
});

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const NavigationSchema = z.object({
  logoPosition: z.enum(["left", "center"]).default("left"),
  links: z.array(NavLinkSchema).default([]),
  showSearch: z.boolean().default(true),
  showCart: z.boolean().default(true),
  showAccount: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/* Section content schemas                                             */
/* ------------------------------------------------------------------ */

export const HeroSectionSchema = z.object({
  type: z.literal("hero"),
  variant: z.enum(["large-image", "split", "minimal", "editorial"]).default("large-image"),
  content: z.object({
    heading: z.string(),
    subheading: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const FeaturedProductsSectionSchema = z.object({
  type: z.literal("featured-products"),
  variant: z.enum(["two-column", "three-column", "four-column", "carousel"]).default("four-column"),
  settings: z.object({
    limit: z.number().int().min(1).max(24).default(8),
    sort: z.enum(["featured", "newest", "price-asc", "price-desc", "bestseller"]).default("featured"),
    title: z.string().optional(),
  }),
});

export const CategoryGridSectionSchema = z.object({
  type: z.literal("category-grid"),
  variant: z.enum(["two-column", "three-column", "four-column"]).default("three-column"),
  settings: z.object({
    title: z.string().optional(),
  }),
});

export const PromoBannerSectionSchema = z.object({
  type: z.literal("promo-banner"),
  variant: z.enum(["split", "full-width", "centered"]).default("split"),
  content: z.object({
    heading: z.string().optional(),
    subheading: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const TestimonialsSectionSchema = z.object({
  type: z.literal("testimonials"),
  variant: z.enum(["cards", "single", "carousel"]).default("cards"),
  settings: z.object({
    title: z.string().optional(),
  }),
});

export const NewsletterSectionSchema = z.object({
  type: z.literal("newsletter"),
  variant: z.literal("default"),
  content: z
    .object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
    })
    .default({ heading: "Stay in the loop" }),
});

/* ----- New sections (registry is extensible) ----- */

export const AnnouncementBarSectionSchema = z.object({
  type: z.literal("announcement-bar"),
  variant: z.enum(["static", "rotating"]).default("static"),
  content: z.object({
    message: z.string(),
    ctaLabel: z.string().optional(),
    ctaLink: z.string().optional(),
  }),
});

export const TextImageSectionSchema = z.object({
  type: z.literal("text-image"),
  variant: z.enum(["image-left", "image-right"]).default("image-right"),
  content: z.object({
    eyebrow: z.string().optional(),
    heading: z.string(),
    body: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const BrandStorySectionSchema = z.object({
  type: z.literal("brand-story"),
  variant: z.enum(["centered", "split"]).default("centered"),
  content: z.object({
    eyebrow: z.string().optional(),
    heading: z.string(),
    body: z.string().optional(),
    values: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const FaqSectionSchema = z.object({
  type: z.literal("faq"),
  variant: z.literal("default"),
  settings: z.object({
    title: z.string().optional(),
  }),
});

export const SocialProofSectionSchema = z.object({
  type: z.literal("social-proof"),
  variant: z.enum(["stats", "logos"]).default("stats"),
  settings: z.object({
    title: z.string().optional(),
  }),
});

export const ImageGallerySectionSchema = z.object({
  type: z.literal("image-gallery"),
  variant: z.enum(["grid", "masonry"]).default("grid"),
  settings: z.object({
    title: z.string().optional(),
    columns: z.number().int().min(2).max(4).default(3),
  }),
});

export const RichTextSectionSchema = z.object({
  type: z.literal("rich-text"),
  variant: z.literal("default"),
  content: z.object({
    heading: z.string().optional(),
    body: z.string(),
  }),
});

export const CollectionGridSectionSchema = z.object({
  type: z.literal("collection-grid"),
  variant: z.enum(["two-column", "three-column"]).default("three-column"),
  settings: z.object({
    title: z.string().optional(),
  }),
});

export const SectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  FeaturedProductsSectionSchema,
  CategoryGridSectionSchema,
  PromoBannerSectionSchema,
  TestimonialsSectionSchema,
  NewsletterSectionSchema,
  AnnouncementBarSectionSchema,
  TextImageSectionSchema,
  BrandStorySectionSchema,
  FaqSectionSchema,
  SocialProofSectionSchema,
  ImageGallerySectionSchema,
  RichTextSectionSchema,
  CollectionGridSectionSchema,
]);

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export const PageTypeSchema = z.enum([
  "home",
  "shop",
  "product",
  "about",
  "contact",
  "cart",
  "checkout",
]);

export const PageSchema = z.object({
  type: PageTypeSchema,
  slug: z.string().default("/"),
  title: z.string().optional(),
  sections: z.array(SectionSchema).default([]),
});

/* ------------------------------------------------------------------ */
/* E-commerce settings                                                 */
/* ------------------------------------------------------------------ */

export const EcommerceSchema = z.object({
  currency: z.string().default("NGN"),
  country: z.string().default("NG"),
  taxEnabled: z.boolean().default(true),
  inventoryEnabled: z.boolean().default(true),
  guestCheckout: z.boolean().default(true),
});

/* ------------------------------------------------------------------ */
/* The full blueprint                                                  */
/* ------------------------------------------------------------------ */

export const StoreBlueprintSchema = z.object({
  version: z.literal(1),
  store: StoreIdentitySchema,
  branding: BrandingSchema,
  theme: ThemeSchema,
  navigation: NavigationSchema,
  pages: z.array(PageSchema).default([]),
  ecommerce: EcommerceSchema,
});

/* ------------------------------------------------------------------ */
/* Inferred TypeScript types                                           */
/* ------------------------------------------------------------------ */

export type StoreBlueprint = z.infer<typeof StoreBlueprintSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type StoreIdentity = z.infer<typeof StoreIdentitySchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Navigation = z.infer<typeof NavigationSchema>;
export type Page = z.infer<typeof PageSchema>;
export type EcommerceSettings = z.infer<typeof EcommerceSchema>;
export type Industry = (typeof INDUSTRIES)[number];

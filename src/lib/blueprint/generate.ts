/**
 * Blueprint generator.
 *
 * In production this is where the AI pipeline lives:
 *   reference (image/URL/description) -> vision/LLM analysis -> blueprint.
 *
 * For the POC we provide a deterministic heuristic generator so the whole
 * flow runs offline with zero API keys. The function signature is exactly what
 * the real AI call would replace, so you can drop in an LLM later.
 */

import { validateBlueprint, type ValidationResult } from "./validate";
import { INDUSTRIES, type Industry, type StoreBlueprint } from "./schema";
import { placeholderImage } from "@/lib/samples/catalog";

export const STYLES = [
  "minimal",
  "premium",
  "vibrant",
  "cozy",
  "luxury",
  "earthy",
  "bold",
  "pastel",
  "tech",
  "editorial",
] as const;

export type StyleName = (typeof STYLES)[number];

export interface GeneratorInput {
  name: string;
  industry: string;
  style: StyleName;
  description?: string;
}

interface StylePreset {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: "none" | "small" | "medium" | "large";
  buttonStyle: "square" | "rounded" | "pill";
  cardStyle: "minimal" | "bordered" | "shadow";
  spacing: "compact" | "medium" | "large";
  heroVariant: "large-image" | "split" | "minimal" | "editorial";
}

const STYLE_PRESETS: Record<StyleName, StylePreset> = {
  minimal: {
    primaryColor: "#111111", secondaryColor: "#FFFFFF", accentColor: "#555555",
    headingFont: "Helvetica, Arial, sans-serif", bodyFont: "Helvetica, Arial, sans-serif",
    borderRadius: "small", buttonStyle: "square", cardStyle: "minimal", spacing: "medium",
    heroVariant: "minimal",
  },
  premium: {
    primaryColor: "#0B0B0B", secondaryColor: "#F5F1E8", accentColor: "#8A5A32",
    headingFont: "Georgia, 'Times New Roman', serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "none", buttonStyle: "square", cardStyle: "minimal", spacing: "large",
    heroVariant: "large-image",
  },
  vibrant: {
    primaryColor: "#1E3A8A", secondaryColor: "#FFFFFF", accentColor: "#F59E0B",
    headingFont: "'Trebuchet MS', sans-serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "large", buttonStyle: "pill", cardStyle: "shadow", spacing: "medium",
    heroVariant: "large-image",
  },
  cozy: {
    primaryColor: "#7C2D12", secondaryColor: "#FFF7ED", accentColor: "#D97706",
    headingFont: "Georgia, 'Times New Roman', serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "medium", buttonStyle: "rounded", cardStyle: "bordered", spacing: "medium",
    heroVariant: "minimal",
  },
  luxury: {
    primaryColor: "#0D0D0D", secondaryColor: "#F7F4EF", accentColor: "#C6A15B",
    headingFont: "Georgia, 'Times New Roman', serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "none", buttonStyle: "square", cardStyle: "minimal", spacing: "large",
    heroVariant: "editorial",
  },
  earthy: {
    primaryColor: "#2F4F2F", secondaryColor: "#F7F3EC", accentColor: "#B07D4F",
    headingFont: "Georgia, 'Times New Roman', serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "medium", buttonStyle: "rounded", cardStyle: "bordered", spacing: "medium",
    heroVariant: "editorial",
  },
  bold: {
    primaryColor: "#E11D48", secondaryColor: "#FFFFFF", accentColor: "#FBBF24",
    headingFont: "'Arial Black', 'Helvetica Neue', sans-serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "large", buttonStyle: "pill", cardStyle: "shadow", spacing: "medium",
    heroVariant: "split",
  },
  pastel: {
    primaryColor: "#9D4EDD", secondaryColor: "#FFF7FB", accentColor: "#F9A8D4",
    headingFont: "'Trebuchet MS', 'Segoe UI', sans-serif", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "large", buttonStyle: "pill", cardStyle: "minimal", spacing: "medium",
    heroVariant: "split",
  },
  tech: {
    primaryColor: "#0B1220", secondaryColor: "#F8FAFC", accentColor: "#22D3EE",
    headingFont: "ui-monospace, 'SF Mono', Menlo, monospace", bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: "small", buttonStyle: "rounded", cardStyle: "bordered", spacing: "compact",
    heroVariant: "minimal",
  },
  editorial: {
    primaryColor: "#1A1A1A", secondaryColor: "#FBF9F5", accentColor: "#B23A2A",
    headingFont: "Georgia, 'Times New Roman', serif", bodyFont: "Georgia, 'Times New Roman', serif",
    borderRadius: "none", buttonStyle: "square", cardStyle: "minimal", spacing: "large",
    heroVariant: "editorial",
  },
};

const INDUSTRY_COPY: Record<Industry, {
  eyebrow: string;
  hero: string;
  storyHeading: string;
  values: string[];
}> = {
  fashion: { eyebrow: "Curated for your everyday", hero: "Style that feels like you.", storyHeading: "Thoughtful pieces, made to be worn.", values: ["Easy to wear", "Made to last", "Designed with intention"] },
  footwear: { eyebrow: "Walk your own way", hero: "Made for every step.", storyHeading: "Comfort, character, and craft.", values: ["All-day comfort", "Quality materials", "Made for movement"] },
  food: { eyebrow: "Good food, made simple", hero: "Your new favourite meal.", storyHeading: "Fresh ingredients. Full flavour.", values: ["Freshly prepared", "Packed with flavour", "Delivered with care"] },
  beauty: { eyebrow: "Your ritual, elevated", hero: "Feel good in your own skin.", storyHeading: "Small rituals. Real confidence.", values: ["Thoughtfully formulated", "Made for real routines", "Cruelty-free care"] },
  skincare: { eyebrow: "Care that understands you", hero: "Healthy skin starts here.", storyHeading: "Simple care for your best skin.", values: ["Gentle formulas", "Visible results", "Made for daily use"] },
  electronics: { eyebrow: "Better tech, simply", hero: "Technology that keeps up.", storyHeading: "Useful design for modern life.", values: ["Reliable performance", "Smart design", "Easy to use"] },
  furniture: { eyebrow: "Make room for living", hero: "Pieces with a point of view.", storyHeading: "Furniture made for real life.", values: ["Built to last", "Timeless design", "Made with care"] },
  jewelry: { eyebrow: "Details worth keeping", hero: "A little more extraordinary.", storyHeading: "Meaningful pieces for every moment.", values: ["Thoughtfully sourced", "Made to keep", "Easy to gift"] },
  accessories: { eyebrow: "The finishing touch", hero: "Everyday essentials, elevated.", storyHeading: "The details make the look.", values: ["Easy to style", "Built for everyday", "Designed to last"] },
  fitness: { eyebrow: "Move with purpose", hero: "Show up for yourself.", storyHeading: "Tools for stronger everyday habits.", values: ["Built for movement", "Made to motivate", "Ready for every level"] },
  "home-decor": { eyebrow: "A home that feels like you", hero: "Make space for beautiful living.", storyHeading: "Warm details for considered spaces.", values: ["Thoughtfully made", "Easy to live with", "Full of character"] },
  toys: { eyebrow: "Made for curious minds", hero: "Play starts here.", storyHeading: "More imagination, less screen time.", values: ["Fun to discover", "Made for little hands", "Built for replay"] },
  books: { eyebrow: "Stories for every season", hero: "Find your next great read.", storyHeading: "A better kind of escape.", values: ["Thoughtfully selected", "Something for everyone", "Delivered with care"] },
  pets: { eyebrow: "For the ones who love us", hero: "Happier days for every pet.", storyHeading: "Good things for good companions.", values: ["Pet-approved", "Made with care", "Easy to love"] },
  wellness: { eyebrow: "Feel more like yourself", hero: "Wellbeing for real life.", storyHeading: "Small choices that add up.", values: ["Simple routines", "Thoughtfully sourced", "Made for consistency"] },
  groceries: { eyebrow: "Good food, close to home", hero: "Everyday essentials, made easy.", storyHeading: "The things you need, delivered.", values: ["Fresh and reliable", "Fairly priced", "Packed with care"] },
  artisan: { eyebrow: "Made by real hands", hero: "Objects with a story.", storyHeading: "Craft, character, and connection.", values: ["Made by artisans", "One of a kind", "Rooted in place"] },
  other: { eyebrow: "Welcome to something good", hero: "Things you'll want to keep.", storyHeading: "A considered collection for you.", values: ["Thoughtfully selected", "Made to enjoy", "Delivered with care"] },
};

const INDUSTRY_DESCRIPTIONS: Record<Industry, string> = {
  fashion: "Trend-setting apparel and accessories for the modern wardrobe",
  footwear: "Quality shoes and footwear, crafted for comfort and style",
  food: "Delicious, fresh meals and pantry staples delivered to your door",
  beauty: "Makeup and beauty essentials that help you look your best",
  skincare: "Clean, science-backed skincare for healthy, glowing skin",
  electronics: "Everyday tech and gadgets that just work",
  furniture: "Sustainable, handcrafted furniture built to last",
  jewelry: "Fine jewelry and timeless pieces, ethically sourced",
  accessories: "The finishing touches — bags, belts, and everyday essentials",
  fitness: "Gear and equipment to support your active lifestyle",
  "home-decor": "Beautiful pieces to make your space feel like home",
  toys: "Toys and games that spark imagination and joy",
  books: "Stories and knowledge for every kind of reader",
  pets: "Everything your furry friends need to thrive",
  wellness: "Supplements and essentials for a balanced life",
  groceries: "Everyday groceries, fresh and affordable",
  artisan: "Handmade goods and crafts from skilled local makers",
  other: "Quality products, curated for you",
};

export function generateBlueprint(input: GeneratorInput): ValidationResult {
  const preset = STYLE_PRESETS[input.style];
  const industry = (INDUSTRIES as readonly string[]).includes(input.industry)
    ? (input.industry as Industry)
    : "other";

  const description = input.description || INDUSTRY_DESCRIPTIONS[industry];
  const copy = INDUSTRY_COPY[industry];
  const images = {
    hero: placeholderImage(input.name.toUpperCase(), preset.primaryColor, preset.secondaryColor),
    collection: placeholderImage("COLLECTION", preset.accentColor, "#ffffff"),
    story: placeholderImage("CRAFTED FOR YOU", preset.secondaryColor, preset.primaryColor),
  };

  const blueprint: StoreBlueprint = {
    version: 1,
    store: {
      name: input.name,
      description,
      industry,
      slug: slugify(input.name),
    },
    branding: {
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
    },
    theme: {
      headingFont: preset.headingFont,
      bodyFont: preset.bodyFont,
      spacing: preset.spacing,
      borderRadius: preset.borderRadius,
      buttonStyle: preset.buttonStyle,
      cardStyle: preset.cardStyle,
    },
    navigation: {
      logoPosition: "left",
      links: [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: "About", href: "/about" },
      ],
      showSearch: true,
      showCart: true,
      showAccount: true,
    },
    pages: [
      {
        type: "home",
        slug: "/",
        title: "Home",
        sections: buildSections(input, preset, description, copy, images),
      },
      {
        type: "shop",
        slug: "/shop",
        title: "Shop",
        sections: [
          { type: "hero", variant: "minimal", content: { heading: "Shop the collection", subheading: `Discover ${input.name}'s most-loved pieces.` } },
          { type: "category-grid", variant: "three-column", settings: { title: "Browse by collection" } },
          { type: "featured-products", variant: "four-column", settings: { limit: 24, sort: "featured", title: "All products" } },
        ],
      },
      {
        type: "about",
        slug: "/about",
        title: "About",
        sections: [
          { type: "brand-story", variant: "split", content: { eyebrow: copy.eyebrow, heading: copy.storyHeading, body: description, values: copy.values, image: images.story } },
          { type: "rich-text", variant: "default", content: { heading: `Why ${input.name}?`, body: `We believe shopping should feel personal, not overwhelming. ${description} Every detail is chosen to make the experience feel considered, useful, and worth coming back to.` } },
          { type: "faq", variant: "default", settings: { title: "Common questions" } },
        ],
      },
    ],
    ecommerce: {
      currency: "NGN",
      country: "NG",
      taxEnabled: true,
      inventoryEnabled: true,
      guestCheckout: true,
    },
  };

  return validateBlueprint(blueprint);
}

function buildSections(
  input: GeneratorInput,
  preset: StylePreset,
  description: string,
  copy: (typeof INDUSTRY_COPY)[Industry],
  images: { hero: string; collection: string; story: string },
): StoreBlueprint["pages"][number]["sections"] {
  const useCarousel = input.style === "tech" || input.style === "vibrant" || input.style === "bold";
  const useCollectionGrid = input.style === "luxury" || input.style === "editorial" || input.style === "earthy";

  return [
    {
      type: "announcement-bar",
      variant: "static",
      content: {
        message: `Welcome to ${input.name} — free shipping on your first order`,
        ctaLabel: "Shop now",
        ctaLink: "/shop",
      },
    },
    {
      type: "hero",
      variant: preset.heroVariant,
      content: {
        heading: copy.hero,
        subheading: description.length > 110 ? `${description.slice(0, 107).trimEnd()}…` : description,
        buttonText: "Shop Collection",
        buttonLink: "/shop",
        image: images.hero,
      },
    },
    ...(useCollectionGrid
      ? [{ type: "collection-grid" as const, variant: "three-column" as const, settings: { title: "The Collections" } }]
      : [{ type: "category-grid" as const, variant: "three-column" as const, settings: { title: "Shop by Category" } }]),
    {
      type: "featured-products",
      variant: useCarousel ? "carousel" : "four-column",
      settings: { limit: 8, sort: "featured", title: "Featured Products" },
    },
    {
      type: "promo-banner",
      variant: "split",
      content: {
        heading: "A better way to discover your next favourite.",
        subheading: "Curated products, thoughtful service, and delivery you can count on.",
        buttonText: "Explore the collection",
        buttonLink: "/shop",
        image: images.collection,
      },
    },
    {
      type: "text-image",
      variant: "image-left",
      content: {
        eyebrow: "Why Us",
        heading: copy.storyHeading,
        body: description,
        buttonText: "Our Story",
        buttonLink: "/about",
        image: images.story,
      },
    },
    { type: "brand-story", variant: "centered", content: { eyebrow: copy.eyebrow, heading: `Welcome to ${input.name}`, body: description, values: copy.values } },
    { type: "testimonials", variant: "cards", settings: { title: "What Customers Say" } },
    {
      type: "newsletter",
      variant: "default",
      content: { heading: "Stay in the loop", subheading: "New arrivals and exclusive offers, straight to your inbox." },
    },
  ];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

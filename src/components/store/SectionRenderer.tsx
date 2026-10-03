/**
 * SectionRenderer — the heart of the rendering engine.
 *
 * It maps a `section.type` to the matching component. AI never writes React;
 * it only picks section types + variants, and this switch turns them into UI.
 *
 * To add a new section: (1) create the component, (2) add its Zod schema to
 * schema.ts, (3) register it here. The AI can then select it automatically.
 */

import type { Section, StoreBlueprint } from "@/lib/blueprint/schema";
import type { Catalog } from "@/lib/samples/catalog";

import { Hero } from "./Hero";
import { FeaturedProducts } from "./FeaturedProducts";
import { CategoryGrid } from "./CategoryGrid";
import { PromoBanner } from "./PromoBanner";
import { Testimonials } from "./Testimonials";
import { Newsletter } from "./Newsletter";
import { AnnouncementBar } from "./AnnouncementBar";
import { TextImage } from "./TextImage";
import { BrandStory } from "./BrandStory";
import { Faq } from "./Faq";
import { SocialProof } from "./SocialProof";
import { ImageGallery } from "./ImageGallery";
import { RichText } from "./RichText";
import { CollectionGrid } from "./CollectionGrid";

export interface RendererContext {
  blueprint: StoreBlueprint;
  catalog: Catalog;
  storePath: (href: string) => string;
}

export function SectionRenderer({
  section,
  context,
}: {
  section: Section;
  context: RendererContext;
}) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} context={context} />;
    case "featured-products":
      return <FeaturedProducts section={section} context={context} />;
    case "category-grid":
      return <CategoryGrid section={section} context={context} />;
    case "promo-banner":
      return <PromoBanner section={section} context={context} />;
    case "testimonials":
      return <Testimonials section={section} context={context} />;
    case "newsletter":
      return <Newsletter section={section} context={context} />;
    case "announcement-bar":
      return <AnnouncementBar section={section} context={context} />;
    case "text-image":
      return <TextImage section={section} context={context} />;
    case "brand-story":
      return <BrandStory section={section} context={context} />;
    case "faq":
      return <Faq section={section} context={context} />;
    case "social-proof":
      return <SocialProof section={section} context={context} />;
    case "image-gallery":
      return <ImageGallery section={section} context={context} />;
    case "rich-text":
      return <RichText section={section} />;
    case "collection-grid":
      return <CollectionGrid section={section} context={context} />;
    default: {
      // Exhaustiveness check — a new section type must be handled here.
      const _exhaustive: never = section;
      return <div>Unknown section: {(_exhaustive as Section).type}</div>;
    }
  }
}

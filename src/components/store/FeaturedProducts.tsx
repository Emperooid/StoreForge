"use client";

import { useRef } from "react";
import type { z } from "zod";
import type { FeaturedProductsSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/samples/catalog";

type FeaturedProductsSection = z.infer<typeof FeaturedProductsSectionSchema>;

const COLUMN_MAP = {
  "two-column": "repeat(auto-fill, minmax(320px, 1fr))",
  "three-column": "repeat(auto-fill, minmax(250px, 1fr))",
  "four-column": "repeat(auto-fill, minmax(200px, 1fr))",
} as const;

export function FeaturedProducts({
  section,
  context,
}: {
  section: FeaturedProductsSection;
  context: RendererContext;
}) {
  const { settings } = section;
  const { catalog, blueprint } = context;
  const currency = blueprint.ecommerce.currency;

  // Pull from the catalog (in production this is a storeId-scoped DB query).
  const products = sortProducts(catalog.products, settings.sort).slice(0, settings.limit);

  return (
    <section className="sf-section">
      <div className="sf-container">
        {settings.title && (
          <div className="sf-section-head">
            <h2 className="sf-section-title">{settings.title}</h2>
            <a href={context.storePath("/shop")} className="sf-btn sf-btn--outline sf-btn--sm">
              View all →
            </a>
          </div>
        )}

        {section.variant === "carousel" ? (
          <Carousel products={products} currency={currency} storeSlug={blueprint.store.slug} />
        ) : (
          <div
            className="sf-grid-products"
            style={{ gridTemplateColumns: COLUMN_MAP[section.variant] }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} currency={currency} storeSlug={blueprint.store.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Carousel({ products, currency, storeSlug }: { products: Product[]; currency: string; storeSlug: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="sf-carousel">
      <div className="sf-carousel__track" ref={trackRef}>
        {products.map((product) => (
          <div className="sf-carousel__item" key={product.id}>
            <ProductCard product={product} currency={currency} storeSlug={storeSlug} />
          </div>
        ))}
      </div>
      <button className="sf-carousel__btn sf-carousel__btn--prev" onClick={() => scroll(-1)} aria-label="Previous">
        ‹
      </button>
      <button className="sf-carousel__btn sf-carousel__btn--next" onClick={() => scroll(1)} aria-label="Next">
        ›
      </button>
    </div>
  );
}

function sortProducts<
  T extends { featured?: boolean; bestseller?: boolean; createdAt: string; price: number },
>(products: T[], sort: string): T[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "bestseller":
      return list.sort((a, b) => Number(b.bestseller ?? false) - Number(a.bestseller ?? false));
    case "featured":
    default:
      return list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
}

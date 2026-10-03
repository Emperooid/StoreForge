"use client";

import type { z } from "zod";
import type { CollectionGridSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type CollectionGridSection = z.infer<typeof CollectionGridSectionSchema>;

const COLUMN_MAP = {
  "two-column": "repeat(auto-fill, minmax(300px, 1fr))",
  "three-column": "repeat(auto-fill, minmax(240px, 1fr))",
} as const;

export function CollectionGrid({
  section,
  context,
}: {
  section: CollectionGridSection;
  context: RendererContext;
}) {
  const { catalog } = context;
  if (catalog.collections.length === 0) return null;

  return (
    <section className="sf-section">
      <div className="sf-container">
        {section.settings.title && (
          <div className="sf-section-head">
            <h2 className="sf-section-title">{section.settings.title}</h2>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: COLUMN_MAP[section.variant], gap: 16 }}>
          {catalog.collections.map((collection) => (
            <div className="sf-collection" key={collection.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={collection.image} alt={collection.name} loading="lazy" />
              <div className="sf-collection__overlay">
                <span className="sf-collection__name">{collection.name}</span>
                <span className="sf-collection__meta">
                  {collection.description}
                  {collection.productCount ? ` · ${collection.productCount} items` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

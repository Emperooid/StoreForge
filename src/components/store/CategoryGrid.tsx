"use client";

import type { z } from "zod";
import type { CategoryGridSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type CategoryGridSection = z.infer<typeof CategoryGridSectionSchema>;

const COLUMN_MAP = {
  "two-column": "repeat(auto-fill, minmax(220px, 1fr))",
  "three-column": "repeat(auto-fill, minmax(150px, 1fr))",
  "four-column": "repeat(auto-fill, minmax(120px, 1fr))",
} as const;

export function CategoryGrid({
  section,
  context,
}: {
  section: CategoryGridSection;
  context: RendererContext;
}) {
  const { catalog } = context;

  return (
    <section className="sf-section">
      <div className="sf-container">
        {section.settings.title && (
          <div className="sf-section-head">
            <h2 className="sf-section-title">{section.settings.title}</h2>
          </div>
        )}
        <div className="cat-tiles" style={{ gridTemplateColumns: COLUMN_MAP[section.variant] }}>
          {catalog.categories.map((category) => (
            <div key={category.id} className="cat-tile">
              <div className="cat-tile__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={category.image} alt={category.name} loading="lazy" />
              </div>
              <div className="cat-tile__name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

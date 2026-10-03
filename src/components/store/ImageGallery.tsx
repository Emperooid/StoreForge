"use client";

import type { z } from "zod";
import type { ImageGallerySectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type ImageGallerySection = z.infer<typeof ImageGallerySectionSchema>;

export function ImageGallery({
  section,
  context,
}: {
  section: ImageGallerySection;
  context: RendererContext;
}) {
  const { catalog } = context;
  if (catalog.gallery.length === 0) return null;

  const { columns } = section.settings;
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;

  return (
    <section className="sf-section">
      <div className="sf-container">
        {section.settings.title && (
          <div className="sf-section-head">
            <h2 className="sf-section-title">{section.settings.title}</h2>
          </div>
        )}
        <div className="sf-gallery" style={{ gridTemplateColumns }}>
          {catalog.gallery.map((image) => (
            <figure key={image.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.image} alt={image.caption ?? "Gallery image"} loading="lazy" />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

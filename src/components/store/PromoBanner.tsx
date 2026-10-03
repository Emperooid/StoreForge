"use client";

import type { z } from "zod";
import type { PromoBannerSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type PromoBannerSection = z.infer<typeof PromoBannerSectionSchema>;

export function PromoBanner({
  section,
  context,
}: {
  section: PromoBannerSection;
  context: RendererContext;
}) {
  const { content, variant } = section;

  const inner = (
    <div className="sf-promo__inner" style={{ textAlign: variant === "centered" ? "center" : "left" }}>
      {content.heading && <h2>{content.heading}</h2>}
      {content.subheading && <p>{content.subheading}</p>}
      {content.buttonText && (
        <a href={context.storePath(content.buttonLink ?? "#")} className="sf-btn sf-btn--white">
          {content.buttonText} →
        </a>
      )}
    </div>
  );

  if (variant === "split" && content.image) {
    return (
      <section className="sf-section">
        <div className="sf-container">
          <div className="sf-promo" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div>{inner}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 240 }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sf-section">
      <div className="sf-container">
        <div className="sf-promo">{inner}</div>
      </div>
    </section>
  );
}

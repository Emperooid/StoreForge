"use client";

import type { z } from "zod";
import type { BrandStorySectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type BrandStorySection = z.infer<typeof BrandStorySectionSchema>;

export function BrandStory({
  section,
  context,
}: {
  section: BrandStorySection;
  context: RendererContext;
}) {
  const { content, variant } = section;

  if (variant === "split" && content.image) {
    return (
      <section className="sf-section" style={{ padding: 0 }}>
        <div className="sf-split">
          <div className="sf-split__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.image} alt={content.heading} />
          </div>
          <StoryBody content={content} />
        </div>
      </section>
    );
  }

  return (
    <section className="sf-section">
      <div className="sf-container" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <StoryBody content={content} centered />
      </div>
    </section>
  );
}

function StoryBody({
  content,
  centered,
}: {
  content: BrandStorySection["content"];
  centered?: boolean;
}) {
  return (
    <div className="sf-split__body" style={centered ? { alignItems: "center", textAlign: "center" } : undefined}>
      {content.eyebrow && <div className="sf-eyebrow">{content.eyebrow}</div>}
      <h2>{content.heading}</h2>
      {content.body && <p>{content.body}</p>}
      {content.values && content.values.length > 0 && (
        <ul className="sf-values">
          {content.values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

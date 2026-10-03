"use client";

import type { z } from "zod";
import type { TextImageSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type TextImageSection = z.infer<typeof TextImageSectionSchema>;

export function TextImage({
  section,
  context,
}: {
  section: TextImageSection;
  context: RendererContext;
}) {
  const { content, variant } = section;
  const imageLeft = variant === "image-left";

  const media = (
    <div className="sf-split__media">
      {content.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.image} alt={content.heading} />
      )}
    </div>
  );

  const body = (
    <div className="sf-split__body">
      {content.eyebrow && <div className="sf-eyebrow">{content.eyebrow}</div>}
      <h2>{content.heading}</h2>
      {content.body && <p>{content.body}</p>}
      {content.buttonText && (
        <a
          href={context.storePath(content.buttonLink ?? "#")}
          className="sf-btn sf-btn--solid"
          style={{ alignSelf: "flex-start", marginTop: 22 }}
        >
          {content.buttonText}
        </a>
      )}
    </div>
  );

  return (
    <section className="sf-section" style={{ padding: 0 }}>
      <div className="sf-split">
        {imageLeft ? (
          <>
            {media}
            {body}
          </>
        ) : (
          <>
            {body}
            {media}
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import type { z } from "zod";
import type { RichTextSectionSchema } from "@/lib/blueprint/schema";

type RichTextSection = z.infer<typeof RichTextSectionSchema>;

export function RichText({ section }: { section: RichTextSection }) {
  const { content } = section;
  return (
    <section className="sf-section" style={{ padding: "28px 0" }}>
      <div className="sf-container" style={{ maxWidth: 720 }}>
        {content.heading && (
          <h2 className="sf-section-title" style={{ marginBottom: 14 }}>
            {content.heading}
          </h2>
        )}
        <div
          style={{
            color: "var(--color-primary)",
            opacity: 0.82,
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
          }}
        >
          {content.body}
        </div>
      </div>
    </section>
  );
}

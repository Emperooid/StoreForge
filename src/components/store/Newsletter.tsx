"use client";

import type { z } from "zod";
import type { NewsletterSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type NewsletterSection = z.infer<typeof NewsletterSectionSchema>;

export function Newsletter({
  section,
}: {
  section: NewsletterSection;
  context: RendererContext;
}) {
  const { content } = section;
  return (
    <section className="sf-section">
      <div className="sf-container">
        <div className="sf-newsletter">
          <h2 className="sf-section-title" style={{ color: "#fff", marginBottom: 0 }}>
            {content.heading ?? "Stay in the loop"}
          </h2>
          {content.subheading && <p style={{ opacity: 0.92, margin: "8px 0 0" }}>{content.subheading}</p>}
          <form className="sf-newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@example.com" />
            <button type="submit" className="sf-btn sf-btn--white">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

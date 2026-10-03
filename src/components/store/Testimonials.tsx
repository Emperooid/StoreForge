"use client";

import type { z } from "zod";
import type { TestimonialsSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type TestimonialsSection = z.infer<typeof TestimonialsSectionSchema>;

export function Testimonials({
  section,
  context,
}: {
  section: TestimonialsSection;
  context: RendererContext;
}) {
  const { catalog } = context;
  const testimonials = catalog.testimonials;

  if (testimonials.length === 0) return null;

  if (section.variant === "single") {
    const t = testimonials[0];
    return (
      <section className="sf-section">
        <div className="sf-container" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: "1.3rem",
              color: "var(--color-primary)",
              margin: 0,
            }}
          >
            &ldquo;{t.text}&rdquo;
          </p>
          <div style={{ marginTop: 14, fontWeight: 700, color: "var(--color-primary)" }}>— {t.author}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="sf-section">
      <div className="sf-container">
        {section.settings.title && (
          <div className="sf-section-head">
            <h2 className="sf-section-title">{section.settings.title}</h2>
          </div>
        )}
        <div className="sf-testimonials">
          {testimonials.map((t) => (
            <div className="sf-testimonial" key={t.id}>
              <div className="stars" style={{ marginBottom: 12 }} aria-hidden>
                {"★".repeat(t.rating)}
                <span style={{ opacity: 0.3 }}>{"★".repeat(5 - t.rating)}</span>
              </div>
              <p className="sf-testimonial__text">&ldquo;{t.text}&rdquo;</p>
              <div className="sf-testimonial__author">
                <div className="sf-avatar">{initials(t.author)}</div>
                <div className="sf-testimonial__name">{t.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

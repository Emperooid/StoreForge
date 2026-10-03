"use client";

import type { z } from "zod";
import type { SocialProofSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type SocialProofSection = z.infer<typeof SocialProofSectionSchema>;

export function SocialProof({
  section,
  context,
}: {
  section: SocialProofSection;
  context: RendererContext;
}) {
  const { catalog } = context;

  if (section.variant === "logos") {
    return (
      <section className="sf-section" style={{ padding: "28px 0" }}>
        <div className="sf-container" style={{ textAlign: "center" }}>
          {section.settings.title && (
            <div
              style={{
                opacity: 0.55,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.8rem",
                marginBottom: 16,
                color: "var(--color-primary)",
              }}
            >
              {section.settings.title}
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap",
              opacity: 0.5,
              fontWeight: 700,
              color: "var(--color-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {["TechDaily", "The Insider", "Business NG", "ProductWeek", "Retail Hub"].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (catalog.stats.length === 0) return null;

  return (
    <section className="sf-section" style={{ background: "var(--color-primary)", color: "var(--color-secondary)" }}>
      <div className="sf-container">
        {section.settings.title && (
          <div className="sf-section-head" style={{ justifyContent: "center" }}>
            <h2 className="sf-section-title" style={{ color: "var(--color-secondary)" }}>
              {section.settings.title}
            </h2>
          </div>
        )}
        <div className="sf-stats">
          {catalog.stats.map((stat) => (
            <div key={stat.id}>
              <div className="sf-stat__value">{stat.value}</div>
              <div className="sf-stat__label" style={{ color: "var(--color-secondary)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import type { z } from "zod";
import type { HeroSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";
import { SearchIcon } from "./icons";

type HeroSection = z.infer<typeof HeroSectionSchema>;

export function Hero({
  section,
  context,
}: {
  section: HeroSection;
  context: RendererContext;
}) {
  const { content, variant } = section;
  const href = context.storePath;

  if (variant === "minimal") {
    return (
      <section className="sf-hero sf-hero--minimal">
        <div className="sf-hero__overlay">
          <h1>{content.heading}</h1>
          {content.subheading && <p>{content.subheading}</p>}
          {content.buttonText && (
            <a href={href(content.buttonLink ?? "#")} className="sf-btn sf-btn--solid sf-btn--lg">
              {content.buttonText}
            </a>
          )}
        </div>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="sf-hero sf-hero--split">
        <div className="sf-hero__overlay">
          {content.subheading && <div className="sf-eyebrow">{content.subheading}</div>}
          <h1>{content.heading}</h1>
          {content.subheading && <p>{content.subheading}</p>}
          {content.buttonText && (
            <a href={href(content.buttonLink ?? "#")} className="sf-btn sf-btn--solid sf-btn--lg">
              {content.buttonText}
            </a>
          )}
        </div>
        <div className="sf-hero__media">
          {content.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.image} alt={content.heading} className="sf-hero__bg" />
          )}
        </div>
      </section>
    );
  }

  if (variant === "editorial") {
    return (
      <section className="sf-hero sf-hero--editorial" style={{ minHeight: 520, position: "relative" }}>
        {content.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.image} alt={content.heading} className="sf-hero__bg" style={{ opacity: 0.55 }} />
        )}
        <div
          className="sf-hero__overlay"
          style={{ alignItems: "center", textAlign: "center", color: "var(--color-primary)" }}
        >
          <div
            style={{
              borderTop: "2px solid var(--color-accent)",
              borderBottom: "2px solid var(--color-accent)",
              padding: "26px 12px",
            }}
          >
            <h1 style={{ color: "var(--color-primary)" }}>{content.heading}</h1>
            {content.subheading && <p style={{ color: "var(--color-primary)", margin: "16px auto 0" }}>{content.subheading}</p>}
          </div>
          {content.buttonText && (
            <a href={href(content.buttonLink ?? "#")} className="sf-btn sf-btn--solid sf-btn--lg" style={{ marginTop: 24 }}>
              {content.buttonText}
            </a>
          )}
        </div>
      </section>
    );
  }

  // large-image (default) — marketplace hero with search
  return (
    <section className="sf-hero" style={{ background: "var(--color-primary)" }}>
      {content.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.image} alt={content.heading} className="sf-hero__bg" style={{ opacity: 0.45 }} />
      )}
      <div className="sf-container sf-hero__overlay">
        <h1>{content.heading}</h1>
        {content.subheading && <p>{content.subheading}</p>}
        <form className="sf-hero__search" onSubmit={(e) => e.preventDefault()}>
          <input type="search" placeholder="What are you looking for?" />
          <button type="submit">
            <SearchIcon size={18} />
            &nbsp;Search
          </button>
        </form>
        {content.buttonText && (
          <a href={href(content.buttonLink ?? "#")} className="sf-btn sf-btn--white sf-btn--lg" style={{ marginTop: 22, alignSelf: "flex-start" }}>
            {content.buttonText} →
          </a>
        )}
      </div>
    </section>
  );
}

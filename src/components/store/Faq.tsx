"use client";

import { useState } from "react";
import type { z } from "zod";
import type { FaqSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type FaqSection = z.infer<typeof FaqSectionSchema>;

export function Faq({
  section,
  context,
}: {
  section: FaqSection;
  context: RendererContext;
}) {
  const { catalog } = context;
  const [openId, setOpenId] = useState<string | null>(null);

  if (catalog.faqs.length === 0) return null;

  return (
    <section className="sf-section">
      <div className="sf-container">
        {section.settings.title && (
          <div className="sf-section-head" style={{ justifyContent: "center" }}>
            <h2 className="sf-section-title">{section.settings.title}</h2>
          </div>
        )}
        <div className="sf-faq">
          {catalog.faqs.map((faq) => {
            const open = openId === faq.id;
            return (
              <div className="sf-faq__item" key={faq.id}>
                <button className="sf-faq__q" onClick={() => setOpenId(open ? null : faq.id)}>
                  {faq.question}
                  <span>{open ? "−" : "+"}</span>
                </button>
                {open && <div className="sf-faq__a">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

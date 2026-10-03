"use client";

import { useEffect, useState } from "react";
import type { z } from "zod";
import type { AnnouncementBarSectionSchema } from "@/lib/blueprint/schema";
import type { RendererContext } from "./SectionRenderer";

type AnnouncementBarSection = z.infer<typeof AnnouncementBarSectionSchema>;

export function AnnouncementBar({ section, context }: { section: AnnouncementBarSection; context: RendererContext }) {
  const { content, variant } = section;
  const [index, setIndex] = useState(0);

  const messages = variant === "rotating" ? content.message.split(" | ") : [content.message];

  useEffect(() => {
    if (variant !== "rotating" || messages.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 3500);
    return () => clearInterval(id);
  }, [variant, messages.length]);

  return (
    <div className="sf-announce">
      <span>{messages[index]}</span>
      {content.ctaLabel && content.ctaLink && (
        <a href={context.storePath(content.ctaLink)}>{content.ctaLabel}</a>
      )}
    </div>
  );
}

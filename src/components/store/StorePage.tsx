"use client";

import type { StoreBlueprint, Section } from "@/lib/blueprint/schema";
import type { Catalog } from "@/lib/samples/catalog";
import { themeToCssVars } from "@/lib/theme";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SectionRenderer } from "./SectionRenderer";
import { TruckIcon, ShieldIcon, RefreshIcon, HeadsetIcon } from "./icons";
import { storePath } from "@/lib/store-links";

/**
 * StorePage — assembles a complete storefront from a blueprint + catalog.
 *
 * This is the single render path every store shares. The ONLY thing that
 * changes between stores is the data passed in here.
 */
export function StorePage({
  blueprint,
  catalog,
  pageSlug = "/",
}: {
  blueprint: StoreBlueprint;
  catalog: Catalog;
  pageSlug?: string;
}) {
  const normalizedSlug = pageSlug === "/" ? "/" : `/${pageSlug.replace(/^\/+|\/+$/g, "")}`;
  const page = blueprint.pages.find((candidate) => candidate.slug === normalizedSlug);
  const sections: Section[] = page?.sections ?? fallbackSections(normalizedSlug);

  return (
    <div
      style={{
        ...themeToCssVars(blueprint.branding, blueprint.theme),
        fontFamily: "var(--font-body)",
        color: "var(--color-primary)",
        background: "var(--color-secondary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        navigation={blueprint.navigation}
        branding={blueprint.branding}
        storeName={blueprint.store.name}
        storeSlug={blueprint.store.slug}
      />

      <div className="sf-trust">
        <span className="sf-trust__item">
          <TruckIcon size={18} /> Free Delivery
        </span>
        <span className="sf-trust__item">
          <ShieldIcon size={18} /> Secure Payment
        </span>
        <span className="sf-trust__item">
          <RefreshIcon size={18} /> Easy Returns
        </span>
        <span className="sf-trust__item">
          <HeadsetIcon size={18} /> 24/7 Support
        </span>
      </div>

      <main style={{ flex: 1 }}>
        {sections.map((section, index) => (
          <SectionRenderer
            key={`${section.type}-${index}`}
            section={section}
            context={{ blueprint, catalog, storePath: (href) => storePath(blueprint.store.slug, href) }}
          />
        ))}
      </main>

      <Footer blueprint={blueprint} />
    </div>
  );
}

function fallbackSections(path: string): Section[] {
  if (path === "/shop") {
    return [
      { type: "hero", variant: "minimal", content: { heading: "Shop our collection", subheading: "Find something made for you." } },
      { type: "category-grid", variant: "three-column", settings: { title: "Browse categories" } },
      { type: "featured-products", variant: "four-column", settings: { limit: 24, sort: "featured", title: "All products" } },
    ];
  }

  const title = path.slice(1).replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Store";
  return [
    { type: "hero", variant: "minimal", content: { heading: title, subheading: "Discover more from our store." } },
    { type: "featured-products", variant: "four-column", settings: { limit: 8, sort: "featured", title: "Featured products" } },
  ];
}

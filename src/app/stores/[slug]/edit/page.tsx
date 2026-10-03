"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Section, StoreBlueprint } from "@/lib/blueprint/schema";
import type { Product } from "@/lib/samples/catalog";
import { loadStore, saveStore, type StoredStore } from "@/lib/store-storage";
import { StorePage } from "@/components/store/StorePage";
import { ImageUpload } from "@/components/store/ImageUpload";

type HeroSection = Extract<Section, { type: "hero" }>;

export default function StoreEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [store, setStore] = useState<StoredStore | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    params.then(({ slug: routeSlug }) => {
      setSlug(routeSlug);
      setStore(loadStore(routeSlug));
    });
  }, [params]);

  const homePage = useMemo(
    () => store?.blueprint.pages.find((page) => page.slug === "/"),
    [store],
  );
  const hero = homePage?.sections.find((section): section is HeroSection => section.type === "hero");

  function updateBlueprint(update: (blueprint: StoreBlueprint) => StoreBlueprint) {
    setStore((current) => current ? { ...current, blueprint: update(current.blueprint) } : current);
    setSaved(false);
  }

  function updateHero(field: keyof HeroSection["content"], value: string) {
    updateSectionContent(0, field, value);
  }

  function updateSectionContent(
    index: number,
    field: string,
    value: string,
  ) {
    updateBlueprint((blueprint) => ({
      ...blueprint,
      pages: blueprint.pages.map((page) => {
        if (page.slug !== "/") return page;
        return {
          ...page,
          sections: page.sections.map((section, sectionIndex) => {
            if (sectionIndex !== index) return section;
            switch (section.type) {
              case "hero":
              case "promo-banner":
              case "text-image":
              case "brand-story":
              case "rich-text":
                return { ...section, content: { ...section.content, [field]: value } } as Section;
              case "announcement-bar":
                return { ...section, content: { ...section.content, [field]: value } } as Section;
              default:
                return section;
            }
          }),
        };
      }),
    }));
  }

  function updateProduct(productId: string, field: keyof Product, value: string | number | boolean) {
    setStore((current) => current ? {
      ...current,
      catalog: {
        ...current.catalog,
        products: current.catalog.products.map((product) =>
          product.id === productId ? { ...product, [field]: value } : product,
        ),
      },
    } : current);
    setSaved(false);
  }

  function updateProductImage(productId: string, value: string | undefined) {
    setStore((current) => current ? {
      ...current,
      catalog: {
        ...current.catalog,
        products: current.catalog.products.map((product) =>
          product.id === productId ? { ...product, image: value ?? "" } : product,
        ),
      },
    } : current);
    setSaved(false);
  }

  function addProduct() {
    setStore((current) => {
      if (!current) return current;
      const id = `${current.blueprint.store.slug}-custom-${Date.now()}`;
      return {
        ...current,
        catalog: {
          ...current.catalog,
          products: [
            ...current.catalog.products,
            {
              id,
              storeId: current.catalog.storeId,
              name: "New product",
              description: "Add a description for this product.",
              price: 0,
              image: "",
              category: "New Arrivals",
              featured: false,
              createdAt: new Date().toISOString().slice(0, 10),
            },
          ],
        },
      };
    });
    setSaved(false);
  }

  function deleteProduct(productId: string) {
    setStore((current) => current ? {
      ...current,
      catalog: { ...current.catalog, products: current.catalog.products.filter((product) => product.id !== productId) },
    } : current);
    setSaved(false);
  }

  function updateBrandImage(value: string | undefined) {
    updateBlueprint((blueprint) => ({
      ...blueprint,
      branding: { ...blueprint.branding, logo: value },
    }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    if (!homePage) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= homePage.sections.length) return;
    const sections = [...homePage.sections];
    [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
    updateBlueprint((blueprint) => ({
      ...blueprint,
      pages: blueprint.pages.map((page) => page.slug !== "/" ? page : { ...page, sections }),
    }));
  }

  function removeSection(index: number) {
    if (!homePage || homePage.sections.length <= 1) return;
    const sections = homePage.sections.filter((_, sectionIndex) => sectionIndex !== index);
    updateBlueprint((blueprint) => ({
      ...blueprint,
      pages: blueprint.pages.map((page) => page.slug !== "/" ? page : { ...page, sections }),
    }));
  }

  function saveChanges() {
    if (!store) return;
    saveStore({ blueprint: store.blueprint, catalog: store.catalog, status: store.status });
    setSaved(true);
  }

  if (!slug || !store) {
    return (
      <main style={shellStyle}>
        <Link href="/stores" style={backLink}>← Back to stores</Link>
        <section style={emptyStyle}>
          <h1>Store not found</h1>
          <p>This store has not been saved in this browser.</p>
          <Link href="/generate" style={buttonStyle}>Create a store</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={shellStyle}>
      <header style={topbarStyle}>
        <div>
          <Link href="/stores" style={backLink}>← Your stores</Link>
          <h1 style={{ margin: "10px 0 0" }}>Edit {store.blueprint.store.name}</h1>
        </div>
        <div style={toolbarStyle}>
          {saved && <span style={{ color: "#166534", fontSize: 13 }}>Saved locally</span>}
          <button onClick={saveChanges} style={buttonStyle}>Save changes</button>
          <Link href={`/store/${slug}`} target="_blank" style={secondaryButton}>Preview ↗</Link>
        </div>
      </header>

      <div style={editorGridStyle}>
        <aside style={panelStyle}>
          <h2 style={panelHeading}>Content</h2>
          <p style={hintStyle}>Edit the most important content and shape the order of your homepage sections.</p>
          <section style={fieldGroupStyle}>
            <h3 style={subheading}>Brand assets</h3>
            <ImageUpload value={store.blueprint.branding.logo} label="Logo" onChange={updateBrandImage} />
          </section>
          <section style={fieldGroupStyle}>
            <h3 style={subheading}>Theme</h3>
            <label style={labelStyle}>Button style
              <select value={store.blueprint.theme.buttonStyle} onChange={(e) => updateBlueprint((blueprint) => ({ ...blueprint, theme: { ...blueprint.theme, buttonStyle: e.target.value as StoreBlueprint["theme"]["buttonStyle"] } }))} style={inputStyle}>
                <option value="square">Square</option><option value="rounded">Rounded</option><option value="pill">Pill</option>
              </select>
            </label>
            <label style={labelStyle}>Card style
              <select value={store.blueprint.theme.cardStyle} onChange={(e) => updateBlueprint((blueprint) => ({ ...blueprint, theme: { ...blueprint.theme, cardStyle: e.target.value as StoreBlueprint["theme"]["cardStyle"] } }))} style={inputStyle}>
                <option value="minimal">Minimal</option><option value="bordered">Bordered</option><option value="shadow">Shadow</option>
              </select>
            </label>
            <label style={labelStyle}>Heading font<input value={store.blueprint.theme.headingFont} onChange={(e) => updateBlueprint((blueprint) => ({ ...blueprint, theme: { ...blueprint.theme, headingFont: e.target.value } }))} style={inputStyle} /></label>
            <label style={labelStyle}>Body font<input value={store.blueprint.theme.bodyFont} onChange={(e) => updateBlueprint((blueprint) => ({ ...blueprint, theme: { ...blueprint.theme, bodyFont: e.target.value } }))} style={inputStyle} /></label>
          </section>
          <section style={fieldGroupStyle}>
            <h3 style={subheading}>Navigation</h3>
            {store.blueprint.navigation.links.map((link, index) => (
              <div key={`${link.href}-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input aria-label={`Navigation label ${index + 1}`} value={link.label} onChange={(e) => updateBlueprint((blueprint) => ({ ...blueprint, navigation: { ...blueprint.navigation, links: blueprint.navigation.links.map((item, itemIndex) => itemIndex === index ? { ...item, label: e.target.value } : item) } }))} style={inputStyle} />
                <input aria-label={`Navigation URL ${index + 1}`} value={link.href} onChange={(e) => updateBlueprint((blueprint) => ({ ...blueprint, navigation: { ...blueprint.navigation, links: blueprint.navigation.links.map((item, itemIndex) => itemIndex === index ? { ...item, href: e.target.value } : item) } }))} style={inputStyle} />
              </div>
            ))}
          </section>

          {homePage?.sections.map((section, index) => (
            <SectionFields
              key={`fields-${section.type}-${index}`}
              section={section}
              onChange={(field, value) => updateSectionContent(index, field, value)}
              onImageChange={(value) => updateSectionContent(index, "image", value ?? "")}
            />
          ))}

          <section style={fieldGroupStyle}>
            <h3 style={subheading}>Homepage sections</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {homePage?.sections.map((section, index) => (
                <div key={`${section.type}-${index}`} style={sectionRowStyle}>
                  <div>
                    <strong>{labelForSection(section.type)}</strong>
                    <div style={sectionMeta}>{section.type}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button disabled={index === 0} onClick={() => moveSection(index, -1)} style={iconButton}>↑</button>
                    <button disabled={index === homePage.sections.length - 1} onClick={() => moveSection(index, 1)} style={iconButton}>↓</button>
                    <button disabled={homePage.sections.length <= 1} onClick={() => removeSection(index)} style={removeButton}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={fieldGroupStyle}>
            <h3 style={subheading}>Products</h3>
            <p style={hintStyle}>Update the starter catalog before connecting a database.</p>
            <div style={{ display: "grid", gap: 12 }}>
              {store.catalog.products.map((product) => (
                <ProductFields key={product.id} product={product} onChange={updateProduct} onImageChange={updateProductImage} onDelete={deleteProduct} />
              ))}
            </div>
            <button type="button" onClick={addProduct} style={secondaryButton}>Add product</button>
          </section>
        </aside>

        <section style={previewPanelStyle}>
          <div style={previewHeader}>
            <span>Live preview</span>
            <span style={{ color: "#64748b", fontSize: 12 }}>Changes appear instantly</span>
          </div>
          <div style={previewFrame}>
            <StorePage blueprint={store.blueprint} catalog={store.catalog} />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionFields({
  section,
  onChange,
  onImageChange,
}: {
  section: Section;
  onChange: (field: string, value: string) => void;
  onImageChange: (value: string | undefined) => void;
}) {
  const content = "content" in section ? section.content : null;
  const settings = "settings" in section ? section.settings : null;
  if (!content && !settings) return null;

  return (
    <section style={fieldGroupStyle}>
      <h3 style={subheading}>{labelForSection(section.type)}</h3>
      {"heading" in (content ?? {}) && (
        <label style={labelStyle}>Heading<input value={contentField(content, "heading")} onChange={(e) => onChange("heading", e.target.value)} style={inputStyle} /></label>
      )}
      {"subheading" in (content ?? {}) && (
        <label style={labelStyle}>Supporting text<textarea value={contentField(content, "subheading")} onChange={(e) => onChange("subheading", e.target.value)} rows={2} style={inputStyle} /></label>
      )}
      {"body" in (content ?? {}) && (
        <label style={labelStyle}>Body<textarea value={contentField(content, "body")} onChange={(e) => onChange("body", e.target.value)} rows={3} style={inputStyle} /></label>
      )}
      {"message" in (content ?? {}) && (
        <label style={labelStyle}>Message<input value={contentField(content, "message")} onChange={(e) => onChange("message", e.target.value)} style={inputStyle} /></label>
      )}
      {"buttonText" in (content ?? {}) && (
        <label style={labelStyle}>Button text<input value={contentField(content, "buttonText")} onChange={(e) => onChange("buttonText", e.target.value)} style={inputStyle} /></label>
      )}
      {"image" in (content ?? {}) && (
        <ImageUpload value={contentField(content, "image")} label="Section image" onChange={onImageChange} />
      )}
      {"title" in (settings ?? {}) && (
        <label style={labelStyle}>Section title<input value={settingsField(settings, "title")} onChange={(e) => onChange("title", e.target.value)} style={inputStyle} /></label>
      )}
    </section>
  );
}

function contentField(content: unknown, field: string): string {
  if (!content || typeof content !== "object") return "";
  const value = (content as Record<string, unknown>)[field];
  return typeof value === "string" ? value : "";
}

function settingsField(settings: unknown, field: string): string {
  return contentField(settings, field);
}

function ProductFields({
  product,
  onChange,
  onImageChange,
  onDelete,
}: {
  product: Product;
  onChange: (id: string, field: keyof Product, value: string | number | boolean) => void;
  onImageChange: (id: string, value: string | undefined) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 10, display: "grid", gap: 8 }}>
      <ImageUpload value={product.image} label="Product image" onChange={(value) => onImageChange(product.id, value)} />
      <label style={labelStyle}>Product name<input value={product.name} onChange={(e) => onChange(product.id, "name", e.target.value)} style={inputStyle} /></label>
      <label style={labelStyle}>Description<textarea value={product.description ?? ""} onChange={(e) => onChange(product.id, "description", e.target.value)} rows={2} style={inputStyle} /></label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <label style={labelStyle}>Price<input type="number" min="0" value={product.price} onChange={(e) => onChange(product.id, "price", Number(e.target.value))} style={inputStyle} /></label>
        <label style={labelStyle}>Category<input value={product.category} onChange={(e) => onChange(product.id, "category", e.target.value)} style={inputStyle} /></label>
      </div>
      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={Boolean(product.featured)} onChange={(e) => onChange(product.id, "featured", e.target.checked)} />
        Featured product
      </label>
      <button type="button" onClick={() => onDelete(product.id)} style={removeButton}>Delete product</button>
    </div>
  );
}

function labelForSection(type: Section["type"]) {
  return type.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

const shellStyle: React.CSSProperties = { minHeight: "100vh", background: "#f8fafc", padding: "28px 24px 60px", fontFamily: "system-ui, sans-serif" };
const topbarStyle: React.CSSProperties = { maxWidth: 1440, margin: "0 auto 24px", display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" };
const toolbarStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" };
const editorGridStyle: React.CSSProperties = { maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", gap: 20, alignItems: "start" };
const panelStyle: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, position: "sticky", top: 20 };
const previewPanelStyle: React.CSSProperties = { minWidth: 0 };
const previewFrame: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 30px rgba(15,23,42,.08)" };
const previewHeader: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "12px 4px", fontSize: 13, fontWeight: 700 };
const panelHeading: React.CSSProperties = { margin: "0 0 6px", fontSize: 18 };
const subheading: React.CSSProperties = { margin: "0 0 12px", fontSize: 14 };
const hintStyle: React.CSSProperties = { color: "#64748b", lineHeight: 1.5, fontSize: 13, marginTop: 0 };
const fieldGroupStyle: React.CSSProperties = { borderTop: "1px solid #e2e8f0", paddingTop: 18, marginTop: 18, display: "grid", gap: 12 };
const labelStyle: React.CSSProperties = { display: "grid", gap: 5, color: "#475569", fontSize: 12, fontWeight: 700 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 10px", border: "1px solid #cbd5e1", borderRadius: 7, font: "inherit", fontWeight: 400 };
const sectionRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 10px", fontSize: 12 };
const sectionMeta: React.CSSProperties = { color: "#94a3b8", marginTop: 2 };
const iconButton: React.CSSProperties = { border: "1px solid #cbd5e1", background: "#fff", borderRadius: 5, width: 26, height: 26, cursor: "pointer" };
const removeButton: React.CSSProperties = { ...iconButton, color: "#b91c1c" };
const buttonStyle: React.CSSProperties = { display: "inline-block", border: 0, borderRadius: 8, background: "#111827", color: "#fff", padding: "10px 14px", fontWeight: 700, cursor: "pointer", textDecoration: "none" };
const secondaryButton: React.CSSProperties = { display: "inline-block", border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#111827", padding: "9px 13px", fontWeight: 600, textDecoration: "none" };
const backLink: React.CSSProperties = { color: "#64748b", textDecoration: "none", fontSize: 13 };
const emptyStyle: React.CSSProperties = { maxWidth: 560, margin: "80px auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 36, textAlign: "center" };

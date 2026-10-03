"use client";

import { useEffect, useMemo, useState } from "react";
import type { Catalog, Product } from "@/lib/samples/catalog";
import { loadStore } from "@/lib/store-storage";
import { ProductCard } from "./ProductCard";

export function ShopPage({
  storeSlug,
  initialCatalog,
  currency,
}: {
  storeSlug: string;
  initialCatalog: Catalog;
  currency: string;
}) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const saved = loadStore(storeSlug);
    if (saved) setCatalog(saved.catalog);
  }, [storeSlug]);

  const categories = ["All", ...Array.from(new Set(catalog.products.map((product) => product.category)))];
  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...catalog.products]
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery) || product.category.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
        return Number(b.featured ?? false) - Number(a.featured ?? false);
      });
  }, [catalog.products, category, query, sort]);

  return (
    <main className="sf-section">
      <div className="sf-container">
        <div style={{ maxWidth: 680, marginBottom: 28 }}>
          <div className="sf-eyebrow">The collection</div>
          <h1 className="sf-section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Shop everything</h1>
          <p className="sf-section-sub">Find something made for your everyday.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 10, marginBottom: 26 }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" aria-label="Search products" style={controlStyle} />
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category" style={controlStyle}>
            {categories.map((value) => <option key={value}>{value}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" style={controlStyle}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        {products.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>No products match your search.</div>
        ) : (
          <div className="sf-grid-products" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {products.map((product) => <ProductCard key={product.id} product={product} currency={currency} storeSlug={storeSlug} />)}
          </div>
        )}
      </div>
    </main>
  );
}

const controlStyle: React.CSSProperties = { width: "100%", minWidth: 0, padding: "11px 12px", border: "1px solid rgba(0,0,0,.18)", borderRadius: "var(--radius, 8px)", background: "var(--color-secondary)", color: "var(--color-primary)", font: "inherit" };

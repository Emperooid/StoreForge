"use client";

import { useState } from "react";
import type { Product } from "@/lib/samples/catalog";
import { addToCart } from "@/lib/cart-storage";
import { formatMoney } from "@/lib/money";

export function ProductDetail({ product, currency, storeSlug }: { product: Product; currency: string; storeSlug: string }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    addToCart(storeSlug, product, quantity);
    setAdded(true);
  }

  return (
    <div className="sf-container" style={{ paddingTop: 48, paddingBottom: 72 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 48, alignItems: "start" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: "var(--radius, 8px)" }} />
        <div>
          <div className="sf-eyebrow">{product.category}</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 4rem)", margin: "0 0 16px" }}>{product.name}</h1>
          <div className="product-card__price" style={{ fontSize: "1.4rem", marginBottom: 18 }}>{formatMoney(product.price, currency)}</div>
          <p style={{ lineHeight: 1.8, opacity: 0.72 }}>{product.description ?? "A carefully selected piece from our collection, made to bring quality and character to your everyday."}</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "28px 0" }}>
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" type="number" min={1} max={20} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} style={{ width: 70, padding: 10 }} />
          </div>
          <button className="sf-btn sf-btn--solid" onClick={add}>{added ? "Added to cart" : "Add to cart"}</button>
        </div>
      </div>
    </div>
  );
}

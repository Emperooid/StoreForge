"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCart, saveCart, type CartLine } from "@/lib/cart-storage";
import { formatMoney } from "@/lib/money";

export function CartPage({ storeSlug, currency }: { storeSlug: string; currency: string }) {
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => setCart(loadCart(storeSlug)), [storeSlug]);

  function update(index: number, quantity: number) {
    const next = cart
      .map((line, lineIndex) => lineIndex === index ? { ...line, quantity } : line)
      .filter((line) => line.quantity > 0);
    setCart(next);
    saveCart(storeSlug, next);
  }

  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <div className="sf-container" style={{ paddingTop: 48, paddingBottom: 72 }}>
      <h1 style={{ fontFamily: "var(--font-heading)" }}>Your cart</h1>
      {cart.length === 0 ? (
        <div style={{ padding: "48px 0" }}>
          <p>Your cart is empty.</p>
          <Link href={`/store/${storeSlug}/shop`} className="sf-btn sf-btn--solid">Continue shopping</Link>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12, maxWidth: 760 }}>
            {cart.map((line, index) => (
              <div key={line.product.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, alignItems: "center", borderBottom: "1px solid rgba(0,0,0,.12)", padding: "12px 0" }}>
                <img src={line.product.image} alt="" style={{ width: 80, height: 80, objectFit: "cover" }} />
                <div><strong>{line.product.name}</strong><div>{formatMoney(line.product.price, currency)}</div></div>
                <input type="number" min={0} value={line.quantity} onChange={(e) => update(index, Number(e.target.value))} style={{ width: 60, padding: 8 }} />
              </div>
            ))}
          </div>
          <h2 style={{ marginTop: 28 }}>Total: {formatMoney(total, currency)}</h2>
          <Link href={`/store/${storeSlug}/checkout`} className="sf-btn sf-btn--solid">Checkout</Link>
        </>
      )}
    </div>
  );
}

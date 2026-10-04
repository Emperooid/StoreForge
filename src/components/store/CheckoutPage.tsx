"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCart, saveCart, type CartLine } from "@/lib/cart-storage";
import { formatMoney } from "@/lib/money";
import { saveOrder } from "@/lib/order-storage";

export function CheckoutPage({ storeSlug, currency }: { storeSlug: string; currency: string }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setCart(loadCart(storeSlug)), [storeSlug]);
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setError(null);
    const fallbackId = `SF-${Date.now().toString(36).toUpperCase()}`;
    try {
      const response = await fetch("/api/storefront/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeSlug, items: cart, customer, currency }),
      });
      if (!response.ok) throw new Error("Server order creation failed.");
      const order = await response.json() as { orderNumber: string };
      saveCart(storeSlug, []);
      setSubmitted(order.orderNumber);
    } catch (requestError) {
      console.warn("Unable to create server order; saving locally.", requestError);
      saveOrder({ id: fallbackId, storeSlug, lines: cart, customer, total, createdAt: new Date().toISOString() });
      saveCart(storeSlug, []);
      setSubmitted(fallbackId);
      setError("Saved in demo mode. Server persistence is unavailable.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <div className="sf-container" style={{ paddingTop: 64, paddingBottom: 80, textAlign: "center" }}><h1>Order received</h1><p>Your order number is <strong>{submitted}</strong>.</p>{error && <p role="status">{error}</p>}<Link href={`/store/${storeSlug}`} className="sf-btn sf-btn--solid">Continue shopping</Link></div>;
  }

  if (cart.length === 0) {
    return <div className="sf-container" style={{ paddingTop: 64, paddingBottom: 80 }}><h1>Your cart is empty</h1><Link href={`/store/${storeSlug}/shop`} className="sf-btn sf-btn--solid">Return to shop</Link></div>;
  }

  return (
    <div className="sf-container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 900 }}>
      <h1>Checkout</h1>
      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 36, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 14 }}>
          <label>Full name<input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} style={inputStyle} /></label>
          <label>Email<input required type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} style={inputStyle} /></label>
          <label>Phone<input required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} style={inputStyle} /></label>
          <label>Delivery address<textarea required rows={4} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} style={inputStyle} /></label>
          {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
          <button disabled={submitting} className="sf-btn sf-btn--solid" type="submit">{submitting ? "Placing order…" : "Place order"}</button>
        </div>
        <aside style={{ border: "1px solid rgba(0,0,0,.15)", borderRadius: "var(--radius, 8px)", padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Order summary</h2>
          {cart.map((line) => <div key={line.product.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 }}><span>{line.product.name} × {line.quantity}</span><span>{formatMoney(line.product.price * line.quantity, currency)}</span></div>)}
          <hr />
          <strong>Total: {formatMoney(total, currency)}</strong>
        </aside>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = { display: "block", width: "100%", marginTop: 6, padding: "11px 12px", border: "1px solid rgba(0,0,0,.2)", borderRadius: "var(--radius, 8px)", font: "inherit" };

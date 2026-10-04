"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadOrders, type Order } from "@/lib/order-storage";
import { formatMoney } from "@/lib/money";
import { loadStore } from "@/lib/store-storage";

export default function OrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrency] = useState("NGN");

  useEffect(() => {
    params.then(({ slug: routeSlug }) => {
      setSlug(routeSlug);
      setCurrency(loadStore(routeSlug)?.blueprint.ecommerce.currency ?? "NGN");
      fetch(`/api/stores/${encodeURIComponent(routeSlug)}/orders`)
        .then(async (response) => {
          if (!response.ok) throw new Error("Server orders unavailable.");
          return response.json();
        })
        .then((serverOrders: Array<{
          orderNumber: string;
          items: Order["lines"];
          customer: Order["customer"];
          total: number;
          createdAt: string;
        }>) => setOrders(serverOrders.map((order) => ({
          id: order.orderNumber,
          storeSlug: routeSlug,
          lines: order.items,
          customer: order.customer,
          total: order.total,
          createdAt: order.createdAt,
        }))))
        .catch(() => setOrders(loadOrders(routeSlug)));
    });
  }, [params]);

  if (!slug) return null;

  return (
    <main style={pageStyle}>
      <Link href="/stores" style={backLink}>← Your stores</Link>
      <header style={headerStyle}>
        <div><h1>Orders</h1><p style={muted}>Orders are loaded from Supabase when available.</p></div>
        <Link href={`/store/${slug}`} style={button}>View storefront</Link>
      </header>
      {orders.length === 0 ? (
        <section style={empty}><h2>No orders yet</h2><p style={muted}>Orders placed through checkout will appear here.</p></section>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {orders.map((order) => (
            <article key={order.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div><strong>{order.id}</strong><div style={muted}>{order.customer.name} · {order.customer.email}</div></div>
                <strong>{formatMoney(order.total, currency)}</strong>
              </div>
              <div style={{ marginTop: 12, color: "#475569", fontSize: 14 }}>{order.lines.map((line) => `${line.product.name} × ${line.quantity}`).join(", ")}</div>
              <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>{new Date(order.createdAt).toLocaleString()}</div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

const pageStyle: React.CSSProperties = { maxWidth: 980, margin: "0 auto", padding: "40px 24px", fontFamily: "system-ui, sans-serif" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, margin: "18px 0 28px", flexWrap: "wrap" };
const card: React.CSSProperties = { border: "1px solid #e2e8f0", borderRadius: 12, padding: 18, background: "#fff" };
const empty: React.CSSProperties = { border: "1px dashed #cbd5e1", borderRadius: 12, padding: 48, textAlign: "center" };
const muted: React.CSSProperties = { color: "#64748b", lineHeight: 1.5 };
const backLink: React.CSSProperties = { color: "#64748b", textDecoration: "none", fontSize: 13 };
const button: React.CSSProperties = { background: "#111827", color: "#fff", textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontWeight: 700 };

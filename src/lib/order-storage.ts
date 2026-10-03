import type { CartLine } from "@/lib/cart-storage";

export interface Order {
  id: string;
  storeSlug: string;
  lines: CartLine[];
  customer: { name: string; email: string; phone: string; address: string };
  total: number;
  createdAt: string;
}

function key(slug: string) {
  return `storeforge:orders:${slug}`;
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  const orders = loadOrders(order.storeSlug);
  localStorage.setItem(key(order.storeSlug), JSON.stringify([order, ...orders]));
}

export function loadOrders(slug: string): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch (error) {
    console.error(`Unable to load orders for "${slug}".`, error);
    return [];
  }
}

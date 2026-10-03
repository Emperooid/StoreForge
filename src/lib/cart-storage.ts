import type { Product } from "@/lib/samples/catalog";

export interface CartLine {
  product: Product;
  quantity: number;
}

function key(slug: string) {
  return `storeforge:cart:${slug}`;
}

export function loadCart(slug: string): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch (error) {
    console.error(`Unable to load cart for "${slug}".`, error);
    return [];
  }
}

export function saveCart(slug: string, cart: CartLine[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(slug), JSON.stringify(cart));
}

export function addToCart(slug: string, product: Product, quantity = 1) {
  const cart = loadCart(slug);
  const existing = cart.find((line) => line.product.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ product, quantity });
  saveCart(slug, cart);
  return cart;
}

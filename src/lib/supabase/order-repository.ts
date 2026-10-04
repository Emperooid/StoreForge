import type { CartLine } from "@/lib/cart-storage";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ServerOrder {
  id: string;
  storeId: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: CartLine[];
  subtotal: number;
  total: number;
  currency: string;
  status: "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  createdAt: string;
}

type OrderRow = {
  id: string;
  store_id: string;
  order_number: string;
  customer: ServerOrder["customer"];
  items: CartLine[];
  subtotal: number;
  total: number;
  currency: string;
  status: ServerOrder["status"];
  payment_status: ServerOrder["paymentStatus"];
  created_at: string;
};

function parseOrder(row: OrderRow): ServerOrder {
  return {
    id: row.id,
    storeId: row.store_id,
    orderNumber: row.order_number,
    customer: row.customer,
    items: row.items,
    subtotal: row.subtotal,
    total: row.total,
    currency: row.currency,
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
}

export async function listOwnedOrders(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", slug)
    .single();
  if (storeError || !store) throw new Error("Store not found.");

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load orders: ${error.message}`);
  return (data ?? []).map(parseOrder);
}

export async function createPublicOrder(input: {
  storeSlug: string;
  items: CartLine[];
  customer: ServerOrder["customer"];
  currency: string;
}) {
  if (input.items.length === 0) throw new Error("Cannot create an empty order.");
  const supabase = createSupabaseAdminClient();
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", input.storeSlug)
    .eq("status", "PUBLISHED")
    .single();
  if (storeError || !store) throw new Error("Store is not available for orders.");

  const subtotal = input.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const orderNumber = `SF-${Date.now().toString(36).toUpperCase()}`;
  const { data, error } = await supabase
    .from("orders")
    .insert({
      store_id: store.id,
      order_number: orderNumber,
      customer: input.customer,
      items: input.items,
      subtotal,
      total: subtotal,
      currency: input.currency,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Unable to create order: ${error.message}`);
  return parseOrder(data);
}

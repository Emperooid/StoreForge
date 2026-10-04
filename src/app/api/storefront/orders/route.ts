import { NextResponse } from "next/server";
import { createPublicOrder } from "@/lib/supabase/order-repository";
import type { CartLine } from "@/lib/cart-storage";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      storeSlug?: string;
      items?: CartLine[];
      customer?: { name: string; email: string; phone: string; address: string };
      currency?: string;
    };
    if (!body.storeSlug || !body.items?.length || !body.customer || !body.currency) {
      return NextResponse.json({ error: "Store, items, customer, and currency are required." }, { status: 400 });
    }
    const order = await createPublicOrder({
      storeSlug: body.storeSlug,
      items: body.items,
      customer: body.customer,
      currency: body.currency,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Unable to create storefront order.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create order." }, { status: 500 });
  }
}

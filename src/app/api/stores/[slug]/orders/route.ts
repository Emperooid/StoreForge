import { NextResponse } from "next/server";
import { listOwnedOrders } from "@/lib/supabase/order-repository";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    return NextResponse.json(await listOwnedOrders((await params).slug));
  } catch (error) {
    console.error("Unable to list owned orders.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load orders." }, { status: 500 });
  }
}

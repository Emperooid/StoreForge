import { NextResponse } from "next/server";
import { initializePaystackPayment } from "@/lib/payments/paystack";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      amountMinor?: number;
      currency?: string;
      reference?: string;
    };
    if (!body.email || !body.amountMinor || !body.currency || !body.reference) {
      return NextResponse.json({ error: "email, amountMinor, currency, and reference are required." }, { status: 400 });
    }
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin}/payment/callback`;
    const payment = await initializePaystackPayment({ ...body, email: body.email, amountMinor: body.amountMinor, currency: body.currency, reference: body.reference, callbackUrl });
    return NextResponse.json(payment);
  } catch (error) {
    console.error("Paystack initialization failed.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment initialization failed." }, { status: 500 });
  }
}

import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Payment provider is not configured." }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (
    !signature ||
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as { event?: string; data?: { reference?: string; status?: string } };
  console.info("Paystack webhook received.", {
    event: event.event,
    reference: event.data?.reference,
    status: event.data?.status,
  });
  return NextResponse.json({ received: true });
}

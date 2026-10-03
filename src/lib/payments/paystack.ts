interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: { authorization_url: string; access_code: string; reference: string };
}

export async function initializePaystackPayment(input: {
  email: string;
  amountMinor: number;
  currency: string;
  reference: string;
  callbackUrl: string;
}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
    }),
  });
  const result = (await response.json()) as PaystackInitializeResponse;
  if (!response.ok || !result.status || !result.data) {
    throw new Error(result.message || "Paystack payment initialization failed.");
  }
  return result.data;
}

export async function verifyPaystackPayment(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const result = (await response.json()) as { status: boolean; message: string; data?: { status: string; reference: string } };
  if (!response.ok || !result.status || !result.data) throw new Error(result.message || "Paystack verification failed.");
  return result.data;
}

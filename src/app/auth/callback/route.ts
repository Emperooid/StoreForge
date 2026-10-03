import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.json({ error: "Unable to complete sign-in." }, { status: 400 });
  }
  const next = url.searchParams.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/stores";
  return NextResponse.redirect(new URL(destination, request.url));
}

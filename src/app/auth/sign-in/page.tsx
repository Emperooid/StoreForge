"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/stores";
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      setMessage("Check your email for a magic sign-in link.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start sign-in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
      <a className="auth-back" href="/">← StoreForge</a>
      <p className="auth-kicker">Store builder</p>
      <h1>Sign in to StoreForge</h1>
      <p className="auth-copy">Create, edit, and publish storefronts from one workspace. We’ll send a secure magic link to your inbox.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" style={inputStyle} />
        <button disabled={pending} type="submit" style={buttonStyle}>{pending ? "Sending…" : "Send sign-in link"}</button>
      </form>
      {message && <p className="auth-message" role="status">{message}</p>}
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = { padding: 12, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" };
const buttonStyle: React.CSSProperties = { padding: 12, border: 0, borderRadius: 8, background: "#111827", color: "#fff", fontWeight: 700, cursor: "pointer" };

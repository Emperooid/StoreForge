"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function DashboardHeader() {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      window.location.assign("/auth/sign-in");
    }
  }

  return (
    <nav className="dashboard-nav" aria-label="Dashboard navigation">
      <Link href="/stores" className="dashboard-brand">StoreForge</Link>
      <div className="dashboard-nav__links">
        <Link href="/stores">Stores</Link>
        <Link href="/generate">Create</Link>
        <button type="button" onClick={signOut} disabled={pending}>
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </nav>
  );
}

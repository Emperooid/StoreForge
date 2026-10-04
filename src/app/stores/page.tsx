"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoreBlueprint } from "@/lib/blueprint/schema";
import {
  deleteStore,
  listStoredStores,
  saveStore,
  exportStore,
  importStore,
  type StoredStore,
} from "@/lib/store-storage";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function StoresPage() {
  const [stores, setStores] = useState<StoredStore[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/stores")
      .then(async (response) => {
        if (!response.ok) throw new Error("Server stores unavailable.");
        return response.json();
      })
      .then((serverStores: Array<{
        blueprint: StoredStore["blueprint"];
        catalog: StoredStore["catalog"];
        status: StoredStore["status"];
        updatedAt: string;
      }>) => {
        if (!active) return;
        setStores(serverStores.map((store) => ({
          blueprint: store.blueprint,
          catalog: store.catalog,
          status: store.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          savedAt: store.updatedAt,
        })));
      })
      .catch(() => {
        if (active) setStores(listStoredStores());
      });
    return () => { active = false; };
  }, []);

  function remove(slug: string) {
    if (!window.confirm("Delete this saved store? This cannot be undone.")) return;
    fetch(`/api/stores/${encodeURIComponent(slug)}`, { method: "DELETE" })
      .catch(() => deleteStore(slug))
      .finally(() => setStores((current) => current.filter((store) => store.blueprint.store.slug !== slug)));
  }

  function togglePublished(store: StoredStore) {
    const status = store.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    fetch(`/api/stores/${encodeURIComponent(store.blueprint.store.slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => saveStore({ blueprint: store.blueprint, catalog: store.catalog, status }))
      .finally(() => setStores((current) => current.map((item) => item.blueprint.store.slug === store.blueprint.store.slug ? { ...item, status } : item)));
  }

  async function handleImport(file?: File) {
    if (!file) return;
    try {
      await importStore(file);
      setImportError(null);
      setStores(listStoredStores());
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Unable to import store.");
    }
  }

  return (
    <main style={pageStyle}>
      <DashboardHeader />
      <header style={headerStyle}>
        <div>
          <Link href="/" style={mutedLink}>← StoreForge home</Link>
          <h1 style={{ margin: "12px 0 4px" }}>Your stores</h1>
          <p style={mutedText}>Manage the storefronts saved in this browser.</p>
        </div>
        <div style={actionsStyle}>
          <Link href="/generate" style={primaryButton}>Create a store</Link>
          <label style={secondaryButton}>Import store<input type="file" accept="application/json,.json" hidden onChange={(e) => handleImport(e.target.files?.[0])} /></label>
        </div>
      </header>
      {importError && <p style={{ color: "#b91c1c" }}>{importError}</p>}

      {stores.length === 0 ? (
        <section style={emptyStyle}>
          <h2>No saved stores yet</h2>
          <p style={mutedText}>Generate a store and save it here to start editing.</p>
          <Link href="/generate" style={primaryButton}>Generate your first store</Link>
        </section>
      ) : (
        <div style={gridStyle}>
          {stores.map((store) => (
            <StoreCard key={store.blueprint.store.slug} store={store} onDelete={remove} onSave={setStores} onTogglePublished={togglePublished} />
          ))}
        </div>
      )}
    </main>
  );
}

function StoreCard({
  store,
  onDelete,
  onSave,
  onTogglePublished,
}: {
  store: StoredStore;
  onDelete: (slug: string) => void;
  onSave: (stores: StoredStore[]) => void;
  onTogglePublished: (store: StoredStore) => void;
}) {
  const { blueprint } = store;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(blueprint);

  function update<K extends keyof StoreBlueprint["store"]>(
    key: K,
    value: StoreBlueprint["store"][K],
  ) {
    setDraft((current) => ({
      ...current,
      store: { ...current.store, [key]: value },
    }));
  }

  function saveChanges() {
    saveStore({ blueprint: draft, catalog: store.catalog, status: store.status });
    setEditing(false);
    onSave(listStoredStores());
  }

  return (
    <article style={{ ...cardStyle, borderTop: `5px solid ${draft.branding.primaryColor}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={swatch(draft.branding.primaryColor)} />
            <span style={swatch(draft.branding.secondaryColor)} />
            <span style={swatch(draft.branding.accentColor ?? draft.branding.primaryColor)} />
          </div>
          <h2 style={{ margin: 0 }}>{draft.store.name}</h2>
          <p style={mutedText}>{draft.store.description}</p>
        </div>
        <span style={statusStyle}>{store.status === "PUBLISHED" ? "Published" : "Draft"}</span>
      </div>

      {editing ? (
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          <label style={labelStyle}>Store name<input value={draft.store.name} onChange={(e) => update("name", e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Description<textarea value={draft.store.description ?? ""} onChange={(e) => update("description", e.target.value)} rows={3} style={inputStyle} /></label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <label style={labelStyle}>Primary<input type="color" value={draft.branding.primaryColor} onChange={(e) => setDraft((current) => ({ ...current, branding: { ...current.branding, primaryColor: e.target.value } }))} style={colorInput} /></label>
            <label style={labelStyle}>Background<input type="color" value={draft.branding.secondaryColor} onChange={(e) => setDraft((current) => ({ ...current, branding: { ...current.branding, secondaryColor: e.target.value } }))} style={colorInput} /></label>
            <label style={labelStyle}>Accent<input type="color" value={draft.branding.accentColor ?? "#8A5A32"} onChange={(e) => setDraft((current) => ({ ...current, branding: { ...current.branding, accentColor: e.target.value } }))} style={colorInput} /></label>
          </div>
          <div style={actionsStyle}>
            <button onClick={saveChanges} style={primaryButton}>Save changes</button>
            <button onClick={() => { setDraft(blueprint); setEditing(false); }} style={secondaryButton}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={actionsStyle}>
          <Link href={`/store/${draft.store.slug}`} style={primaryButton}>Open store</Link>
          <Link href={`/stores/${draft.store.slug}/edit`} style={secondaryButton}>Visual editor</Link>
          <Link href={`/stores/${draft.store.slug}/orders`} style={secondaryButton}>Orders</Link>
          <button onClick={() => exportStore(store)} style={secondaryButton}>Export</button>
          <button onClick={() => onTogglePublished(store)} style={secondaryButton}>{store.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
          <button onClick={() => setEditing(true)} style={secondaryButton}>Edit</button>
          <button onClick={() => onDelete(draft.store.slug)} style={dangerButton}>Delete</button>
        </div>
      )}
    </article>
  );
}

const pageStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, marginBottom: 36 };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 };
const cardStyle: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 16, padding: 22, boxShadow: "0 8px 28px rgba(0,0,0,.06)" };
const emptyStyle: React.CSSProperties = { textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: 16, padding: "64px 24px" };
const mutedText: React.CSSProperties = { color: "#64748b", lineHeight: 1.6 };
const mutedLink: React.CSSProperties = { color: "#64748b", textDecoration: "none" };
const primaryButton: React.CSSProperties = { display: "inline-block", border: 0, borderRadius: 8, background: "#111827", color: "#fff", padding: "11px 16px", fontWeight: 700, cursor: "pointer", textDecoration: "none" };
const secondaryButton: React.CSSProperties = { border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#111827", padding: "10px 15px", fontWeight: 600, cursor: "pointer" };
const dangerButton: React.CSSProperties = { ...secondaryButton, color: "#b91c1c", borderColor: "#fecaca" };
const actionsStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 };
const labelStyle: React.CSSProperties = { display: "grid", gap: 5, color: "#475569", fontSize: 13, fontWeight: 600 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontWeight: 400 };
const colorInput: React.CSSProperties = { width: "100%", height: 38, padding: 2, border: "1px solid #cbd5e1", borderRadius: 8 };
const statusStyle: React.CSSProperties = { color: "#166534", background: "#dcfce7", borderRadius: 999, padding: "5px 9px", fontSize: 12, fontWeight: 700, height: "fit-content" };
const swatch = (color: string): React.CSSProperties => ({ width: 18, height: 18, borderRadius: "50%", background: color, border: "1px solid #cbd5e1" });

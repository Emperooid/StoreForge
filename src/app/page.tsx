import Link from "next/link";
import { samples } from "@/lib/samples/stores";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: 8 }}>StoreForge</h1>
      <p style={{ color: "#555", fontSize: "1.1rem", marginTop: 0 }}>
        POC — an AI e-commerce store generator. Same renderer, many stores.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2>Demo stores</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {samples.map(({ blueprint }) => (
            <Link
              key={blueprint.store.slug}
              href={`/store/${blueprint.store.slug}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                color: "inherit",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: blueprint.branding.primaryColor,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: blueprint.branding.secondaryColor,
                    display: "inline-block",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <strong style={{ fontSize: "1.1rem" }}>{blueprint.store.name}</strong>
              <div style={{ color: "#666", marginTop: 4 }}>{blueprint.store.description}</div>
              <div style={{ color: "#999", fontSize: "0.85rem", marginTop: 8 }}>
                {blueprint.theme.spacing} spacing · {blueprint.theme.buttonStyle} buttons
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Generate a store</h2>
        <p style={{ color: "#555" }}>
          Describe a store (name, industry, style) and see the blueprint + live render.
        </p>
        <Link
          href="/generate"
          style={{
            display: "inline-block",
            background: "#111",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Open the generator →
        </Link>
        <Link
          href="/stores"
          style={{
            display: "inline-block",
            marginLeft: 10,
            border: "1px solid #ccc",
            color: "#111",
            padding: "12px 24px",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Manage saved stores
        </Link>
      </section>

      <section style={{ marginTop: 40, fontSize: "0.9rem", color: "#888", lineHeight: 1.6 }}>
        <strong>The paradigm:</strong> AI produces a <em>StoreBlueprint</em> (JSON), never code. A
        deterministic <em>SectionRenderer</em> turns that blueprint into a website using a shared
        component library. Products, orders, and customers live separately, keyed by{" "}
        <code>storeId</code> for multi-tenancy.
      </section>
    </main>
  );
}

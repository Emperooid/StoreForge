"use client";

import { useState } from "react";
import { generateBlueprint, STYLES, type StyleName } from "@/lib/blueprint/generate";
import { INDUSTRIES, type Industry, type StoreBlueprint } from "@/lib/blueprint/schema";
import type { Catalog } from "@/lib/samples/catalog";
import { makeStarterCatalog } from "@/lib/samples/catalog";
import { StorePage } from "@/components/store/StorePage";
import { saveStore } from "@/lib/store-storage";

const STYLE_LABELS: Record<StyleName, string> = {
  minimal: "Minimal",
  premium: "Premium",
  vibrant: "Vibrant",
  cozy: "Cozy",
  luxury: "Luxury",
  earthy: "Earthy",
  bold: "Bold",
  pastel: "Pastel",
  tech: "Tech",
  editorial: "Editorial",
};

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<Industry>("fashion");
  const [style, setStyle] = useState<StyleName>("premium");
  const [description, setDescription] = useState("");
  const [showJson, setShowJson] = useState(false);

  const [result, setResult] = useState<{
    blueprint: StoreBlueprint;
    catalog: Catalog;
  } | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const res = generateBlueprint({ name: name || "My Store", industry, style, description });

    if (!res.ok) {
      setErrors(res.errors);
      setResult(null);
      return;
    }

    setErrors(null);
    const generatedStore = {
      blueprint: res.blueprint,
      catalog: makeStarterCatalog(res.blueprint.store.slug, industry),
    };
    saveStore({ ...generatedStore, status: "DRAFT" });
    try {
      await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...generatedStore, status: "DRAFT" }),
      });
    } catch {
      // Local storage remains the offline/demo persistence fallback.
    }
    setResult(generatedStore);
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <a href="/" style={{ color: "#555" }}>← Back</a>
        <h1 style={{ marginTop: 8 }}>Create your store</h1>
        <p style={{ color: "#555" }}>
          In production, an AI vision/LLM pipeline analyzes a reference and emits this blueprint.
          Here we use a deterministic generator so it runs offline.
        </p>

        <div style={progressStyle} aria-label={`Step ${step} of 3`}>
          {[["1", "Identity"], ["2", "Direction"], ["3", "Review"]].map(([number, label]) => (
            <div key={number} style={{ ...progressItemStyle, opacity: step >= Number(number) ? 1 : 0.45 }}>
              <span style={step === Number(number) ? activeStepStyle : stepStyle}>{number}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleGenerate}
          style={{ display: "grid", gap: 16, maxWidth: 520, margin: "24px 0" }}
        >
          {step === 1 && (
            <>
              <div>
                <p style={stepEyebrowStyle}>Start with the basics</p>
                <h2 style={stepTitleStyle}>What should we call your store?</h2>
              </div>
              <label style={{ display: "grid", gap: 4 }}>
                Store name
                <input autoFocus required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kairo" style={inputStyle} />
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                What do you sell?
                <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)} style={inputStyle}>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => setStep(2)} style={primaryBtnStyle}>Continue</button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <p style={stepEyebrowStyle}>Set the direction</p>
                <h2 style={stepTitleStyle}>How should it feel?</h2>
              </div>
              <label style={{ display: "grid", gap: 4 }}>
                Visual style
                <select autoFocus value={style} onChange={(e) => setStyle(e.target.value as StyleName)} style={inputStyle}>
                  {STYLES.map((s) => <option key={s} value={s}>{STYLE_LABELS[s]}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                Brand description <span style={{ color: "#999", fontSize: "0.85rem" }}>(optional)</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Premium Nigerian leather footwear" rows={3} style={inputStyle} />
              </label>
              <div style={formActionsStyle}>
                <button type="button" onClick={() => setStep(1)} style={secondaryBtnStyle}>Back</button>
                <button type="button" onClick={() => setStep(3)} style={primaryBtnStyle}>Review details</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <p style={stepEyebrowStyle}>Ready to generate</p>
                <h2 style={stepTitleStyle}>{name || "My Store"}</h2>
                <p style={{ color: "#64748b", lineHeight: 1.6 }}>A {STYLE_LABELS[style].toLowerCase()} {industry} storefront with starter products and editable sections.</p>
              </div>
              <div style={reviewStyle}>
                <strong>Store details</strong>
                <span>{industry} · {STYLE_LABELS[style]}</span>
                {description && <span>{description}</span>}
              </div>
              <div style={formActionsStyle}>
                <button type="button" onClick={() => setStep(2)} style={secondaryBtnStyle}>Back</button>
                <button type="submit" style={primaryBtnStyle}>Generate store</button>
              </div>
            </>
          )}
        </form>

        {errors && (
          <div style={{ background: "#fee", border: "1px solid #faa", padding: 16, borderRadius: 8, color: "#a00" }}>
            <strong>Validation failed</strong>
            <ul style={{ marginBottom: 0 }}>
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {result && (
        <div>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 16px" }}>
            <a
              href={`/store/${result.blueprint.store.slug}`}
              style={{ ...secondaryBtnStyle, display: "inline-block", textDecoration: "none", marginRight: 8 }}
            >
              Open saved store →
            </a>
            <button onClick={() => setShowJson((v) => !v)} style={secondaryBtnStyle}>
              {showJson ? "Hide" : "Show"} StoreBlueprint JSON
            </button>
          </div>

          {showJson && (
            <pre
              style={{
                maxWidth: 960,
                margin: "0 auto 16px",
                padding: 16,
                background: "#0d1117",
                color: "#c9d1d9",
                borderRadius: 8,
                overflow: "auto",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}
            >
              {JSON.stringify(result.blueprint, null, 2)}
            </pre>
          )}

          <StorePage blueprint={result.blueprint} catalog={result.catalog} />
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: "1rem",
};

const secondaryBtnStyle: React.CSSProperties = {
  background: "#eee",
  color: "#111",
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ccc",
  cursor: "pointer",
  fontWeight: 600,
};

const progressStyle: React.CSSProperties = { display: "flex", gap: 24, marginTop: 28, color: "#64748b", fontSize: 13, fontWeight: 600 };
const progressItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 };
const stepStyle: React.CSSProperties = { display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: "50%", background: "#e2e8f0", color: "#475569" };
const activeStepStyle: React.CSSProperties = { ...stepStyle, background: "#111827", color: "#fff" };
const stepEyebrowStyle: React.CSSProperties = { margin: 0, color: "#7c3aed", fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" };
const stepTitleStyle: React.CSSProperties = { margin: "6px 0 0", fontSize: "1.6rem", letterSpacing: "-.03em" };
const primaryBtnStyle: React.CSSProperties = { background: "#111827", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", border: "none" };
const formActionsStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 10 };
const reviewStyle: React.CSSProperties = { display: "grid", gap: 6, padding: 16, borderRadius: 10, background: "#f8fafc", color: "#475569", lineHeight: 1.5 };

"use client";

import { useRef, useState } from "react";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function ImageUpload({
  value,
  label,
  onChange,
  storeSlug,
}: {
  value?: string;
  label: string;
  onChange: (value: string | undefined) => void;
  storeSlug?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function selectFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images must be 2 MB or smaller.");
      return;
    }
    if (storeSlug) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/media`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Cloud upload failed.");
        const result = await response.json() as { url?: string };
        if (!result.url) throw new Error("Cloud upload returned no URL.");
        setError(null);
        onChange(result.url);
        return;
      } catch (uploadError) {
        console.warn("Unable to upload image to Supabase; using local fallback.", uploadError);
      }
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      onChange(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.onerror = () => setError("Could not read this image.");
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "#475569", fontSize: 12, fontWeight: 700 }}>{label}</span>
      {value && <img src={value} alt="" style={{ width: "100%", maxHeight: 110, objectFit: "cover", borderRadius: 7 }} />}
      <div style={{ display: "flex", gap: 6 }}>
        <button type="button" onClick={() => inputRef.current?.click()} style={uploadButton}>
          {value ? "Replace image" : "Upload image"}
        </button>
        {value && <button type="button" onClick={() => onChange(undefined)} style={removeButton}>Remove</button>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => selectFile(event.target.files?.[0])} />
      {error && <span style={{ color: "#b91c1c", fontSize: 12 }}>{error}</span>}
    </div>
  );
}

const uploadButton: React.CSSProperties = { border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", padding: "8px 10px", cursor: "pointer", fontWeight: 600 };
const removeButton: React.CSSProperties = { ...uploadButton, color: "#b91c1c" };

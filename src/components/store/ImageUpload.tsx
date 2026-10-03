"use client";

import { useRef, useState } from "react";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function ImageUpload({
  value,
  label,
  onChange,
}: {
  value?: string;
  label: string;
  onChange: (value: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function selectFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images must be 2 MB or smaller.");
      return;
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

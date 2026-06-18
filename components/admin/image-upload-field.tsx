"use client";

import { useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ImageUploadField({
  supabaseUrl,
  supabaseAnonKey,
  folder,
  label,
  value,
  onChange,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  folder: string;
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
}) {
  const supabase = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    if (!supabase) {
      setError("Supabase client is not configured.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error("You are not signed in.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; url?: string }
        | null;

      if (!response.ok || !result?.ok || !result.url) {
        throw new Error(result?.error ?? "Upload failed.");
      }

      onChange(result.url);
    } catch (uploadError) {
      const detail = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(detail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-upload-field">
      <div className="image-upload-header">
        <span>{label}</span>
        {value ? (
          <button type="button" className="ghost-button" onClick={() => onChange("")}>
            <X size={14} />
            Clear
          </button>
        ) : null}
      </div>
      {value ? <img src={value} alt={label} className="image-upload-preview" /> : <div className="image-upload-empty">No image uploaded yet.</div>}
      <label className="secondary-button upload-button">
        {busy ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
        <span>{busy ? "Uploading..." : "Upload Image"}</span>
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void upload(file);
            }
          }}
        />
      </label>
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  );
}

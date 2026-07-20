"use client";

import { useState } from "react";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type DocumentValue = {
  url: string;
  path: string;
  fileName: string;
};

export function DocumentUploadField({
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
  value: DocumentValue;
  onChange: (next: DocumentValue) => void;
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

      if (!accessToken) throw new Error("You are not signed in.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; url?: string; path?: string }
        | null;

      if (!response.ok || !result?.ok || !result.url || !result.path) {
        throw new Error(result?.error ?? "Upload failed.");
      }

      onChange({ url: result.url, path: result.path, fileName: file.name });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-upload-field document-upload-field">
      <div className="image-upload-header">
        <span>{label}</span>
        {value.url ? (
          <button type="button" className="ghost-button" onClick={() => onChange({ url: "", path: "", fileName: "" })}>
            <X size={14} />
            Clear
          </button>
        ) : null}
      </div>

      {value.url ? (
        <a className="document-upload-current" href={value.url} target="_blank" rel="noreferrer">
          <FileText size={18} />
          <span>{value.fileName || "privacy-policy.pdf"}</span>
        </a>
      ) : (
        <div className="image-upload-empty">No privacy policy uploaded yet.</div>
      )}

      <label className="secondary-button upload-button">
        {busy ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
        <span>{busy ? "Uploading..." : "Upload PDF"}</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </label>
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  );
}

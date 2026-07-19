"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import type { PerformanceScreenshot } from "@/lib/cms-types";
import { PERFORMANCE_GALLERY_LIMIT } from "@/lib/performance-gallery";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ApiResult = {
  ok?: boolean;
  error?: string;
  items?: PerformanceScreenshot[];
};

export function PerformanceGalleryEditor({
  items,
  supabaseUrl,
  supabaseAnonKey,
  onChange,
}: {
  items: PerformanceScreenshot[];
  supabaseUrl: string;
  supabaseAnonKey: string;
  onChange: (items: PerformanceScreenshot[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function getAccessToken() {
    const supabase = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
    if (!supabase) return undefined;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  }

  async function uploadScreenshot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Choose a screenshot to upload.");
      return;
    }

    setBusyId("upload");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Your admin session has expired. Sign in again.");
      }

      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("file", file);

      const response = await fetch("/api/admin/performance", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as ApiResult | null;

      if (!response.ok || !result?.items) {
        throw new Error(result?.error ?? "The screenshot could not be uploaded.");
      }

      onChange(result.items);
      setTitle("");
      setDescription("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The screenshot could not be uploaded.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteScreenshot(item: PerformanceScreenshot) {
    setError("");
    setBusyId(item.id);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Your admin session has expired. Sign in again.");
      }

      const response = await fetch(`/api/admin/performance?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = (await response.json().catch(() => null)) as ApiResult | null;

      if (!response.ok || !result?.items) {
        throw new Error(result?.error ?? "The screenshot could not be deleted.");
      }

      onChange(result.items);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "The screenshot could not be deleted.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <article className="admin-section-card">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">Performance gallery</p>
          <h2>Performance screenshots</h2>
          <p className="admin-copy">
            Upload JPG, PNG, or WebP screenshots. The newest 20 are retained automatically.
          </p>
        </div>
        <span className="performance-upload-count">{items.length} / {PERFORMANCE_GALLERY_LIMIT}</span>
      </div>

      <form className="performance-admin-form" onSubmit={uploadScreenshot}>
        <div className="cms-grid two-col">
          <label className="cms-field">
            <span>Heading</span>
            <input value={title} maxLength={100} required onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="cms-field">
            <span>Screenshot</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <label className="cms-field">
          <span>Short paragraph</span>
          <textarea
            value={description}
            maxLength={280}
            rows={4}
            required
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <button className="primary-button compact" type="submit" disabled={busyId !== null}>
          {busyId === "upload" ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
          {busyId === "upload" ? "Uploading" : "Upload screenshot"}
        </button>
      </form>

      {error ? <p className="admin-error">{error}</p> : null}

      {items.length ? (
        <div className="performance-admin-list">
          {items.map((item) => (
            <article className="performance-admin-item" key={item.id}>
              <img src={item.image.url} alt={item.image.alt || item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <button
                className="ghost-button danger"
                type="button"
                disabled={busyId !== null}
                onClick={() => void deleteScreenshot(item)}
              >
                {busyId === item.id ? <Loader2 size={15} className="spin" /> : <Trash2 size={15} />}
                Delete
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">No performance screenshots have been uploaded yet.</p>
      )}
    </article>
  );
}

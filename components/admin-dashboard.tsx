"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ADMIN_SECTIONS, type AdminSectionKey } from "@/lib/admin";
import { ArrowRight, Loader2, LogOut, RefreshCcw, Save, ShieldCheck } from "lucide-react";

type ContentRow = {
  section_key: AdminSectionKey;
  payload: unknown;
};

type ApplicationRow = {
  id: number;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  broker: string | null;
  account_size: string;
  message: string;
  created_at: string;
};

export function AdminDashboard({
  supabaseUrl,
  supabaseAnonKey,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
}) {
  const router = useRouter();
  const supabase = useMemo(
    () => createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey),
    [supabaseUrl, supabaseAnonKey]
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [content, setContent] = useState<ContentRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function loadData() {
    setLoading(true);
    setError("");

    if (!supabase) {
      setError("Public Supabase environment variables are missing.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    const response = await fetch("/api/admin/content", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      setError("Unable to load admin data.");
      setLoading(false);
      return;
    }

    const payload = (await response.json()) as {
      content: ContentRow[];
      applications: ApplicationRow[];
    };

    setContent(payload.content);
    setApplications(payload.applications);
    setDrafts(
      Object.fromEntries(
        payload.content.map((row) => [row.section_key, JSON.stringify(row.payload, null, 2)])
      )
    );
    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function saveSection(sectionKey: AdminSectionKey) {
    setSaving(sectionKey);
    setError("");

    try {
      if (!supabase) {
        throw new Error("Supabase client missing");
      }

      const rawPayload = drafts[sectionKey];
      let payload: unknown;

      try {
        payload = JSON.parse(rawPayload);
      } catch {
        throw new Error("The JSON in this section is invalid.");
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sectionKey, payload }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Save failed");
      }

      await loadData();
    } catch (saveError) {
      const detail = saveError instanceof Error ? saveError.message : "Unknown error";
      setError(`Could not save ${sectionKey}. ${detail}`);
    } finally {
      setSaving(null);
    }
  }

  async function signOut() {
    if (!supabase) {
      router.replace("/admin/login");
      return;
    }

    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Supabase CMS</p>
          <h1>Landing page control center</h1>
          <p className="admin-copy">
            Edit the database-driven sections, review applications, and keep the public page aligned with the brand.
          </p>
        </div>
        <div className="admin-actions">
          <button className="secondary-button" type="button" onClick={() => void loadData()}>
            <RefreshCcw size={16} />
            Refresh
          </button>
          <button className="secondary-button" type="button" onClick={() => void signOut()}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      {error ? <p className="admin-error">{error}</p> : null}

      <section className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <p className="eyebrow">Editable Content</p>
              <h2>Database sections</h2>
            </div>
            <ShieldCheck size={18} />
          </div>

          <div className="content-editor-list">
            {ADMIN_SECTIONS.map((sectionKey) => {
              const row = content.find((item) => item.section_key === sectionKey);
              const value = drafts[sectionKey] ?? (row ? JSON.stringify(row.payload, null, 2) : "{}");

              return (
                <div key={sectionKey} className="content-editor">
                  <div className="content-editor-head">
                    <strong>{sectionKey}</strong>
                    <button
                      className="secondary-button compact"
                      type="button"
                      onClick={() => void saveSection(sectionKey)}
                      disabled={saving === sectionKey || loading}
                    >
                      {saving === sectionKey ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                      <span>Save</span>
                    </button>
                  </div>
                  <textarea
                    value={value}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [sectionKey]: event.target.value,
                      }))
                    }
                    rows={sectionKey === "site" ? 10 : 8}
                    spellCheck={false}
                  />
                </div>
              );
            })}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <p className="eyebrow">Applications</p>
              <h2>Recent leads</h2>
            </div>
            <ArrowRight size={18} />
          </div>
          <div className="application-list">
            {applications.length ? (
              applications.map((item) => (
                <div key={item.id} className="application-item">
                  <div className="application-top">
                    <strong>{item.full_name}</strong>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <p>{item.email}</p>
                  <p>{item.whatsapp_number}</p>
                  <p>{item.country}</p>
                  <p>{item.account_size}</p>
                  {item.broker ? <p>Broker: {item.broker}</p> : null}
                  <p className="application-message">{item.message}</p>
                </div>
              ))
            ) : (
              <p className="empty-state">No applications yet.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

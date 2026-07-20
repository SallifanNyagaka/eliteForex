import { NextResponse } from "next/server";
import { normalizePrivacyPolicy } from "@/lib/contact-settings";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function safeDownloadName(value: string) {
  const normalized = value.replace(/[^a-zA-Z0-9._-]/g, "-");
  return normalized.toLowerCase().endsWith(".pdf") ? normalized : `${normalized || "privacy-policy"}.pdf`;
}

export async function GET() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Privacy policy service is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("payload")
    .eq("section_key", "contact_settings")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: "Could not load the privacy policy." }, { status: 500 });
  }

  const payload = data?.payload && typeof data.payload === "object" && !Array.isArray(data.payload)
    ? data.payload as Record<string, unknown>
    : {};
  const policy = normalizePrivacyPolicy(payload.privacyPolicy);

  if (!policy) {
    return NextResponse.json({ ok: false, error: "The privacy policy has not been published yet." }, { status: 404 });
  }

  let file: Blob;

  if (policy.path) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "site-assets";
    const download = await supabase.storage.from(bucket).download(policy.path);

    if (download.error || !download.data) {
      return NextResponse.json({ ok: false, error: "Could not download the privacy policy." }, { status: 500 });
    }

    file = download.data;
  } else {
    const response = await fetch(policy.url, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Could not download the privacy policy." }, { status: 502 });
    }

    file = await response.blob();
  }

  return new NextResponse(await file.arrayBuffer(), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${safeDownloadName(policy.fileName)}"`,
      "Content-Type": "application/pdf",
    },
  });
}

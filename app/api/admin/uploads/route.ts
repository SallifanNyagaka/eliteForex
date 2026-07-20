import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "site-assets");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });
  }

  const isPrivacyPolicy = folder === "site/privacy-policy";

  if (isPrivacyPolicy && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ ok: false, error: "The privacy policy must be a PDF file." }, { status: 400 });
  }

  if (isPrivacyPolicy && file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "The privacy policy PDF must be 10 MB or smaller." }, { status: 400 });
  }

  const serviceClient = createSupabaseServerClient();
  if (!serviceClient) {
    return NextResponse.json({ ok: false, error: "Storage client not configured." }, { status: 503 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "site-assets";
  const extension = isPrivacyPolicy ? "pdf" : file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await serviceClient.storage.from(bucket).upload(path, arrayBuffer, {
    contentType: isPrivacyPolicy ? "application/pdf" : file.type || "image/png",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data } = serviceClient.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    url: data.publicUrl,
    path,
    bucket,
  });
}

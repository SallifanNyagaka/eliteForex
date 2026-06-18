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

  const serviceClient = createSupabaseServerClient();
  if (!serviceClient) {
    return NextResponse.json({ ok: false, error: "Storage client not configured." }, { status: 503 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "site-assets";
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await serviceClient.storage.from(bucket).upload(path, arrayBuffer, {
    contentType: file.type || "image/png",
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

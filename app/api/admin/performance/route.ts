import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { PerformanceScreenshot } from "@/lib/cms-types";
import {
  PERFORMANCE_GALLERY_KEY,
  PERFORMANCE_GALLERY_LIMIT,
  normalizePerformanceGallery,
} from "@/lib/performance-gallery";

const metadataSchema = z.object({
  title: z.string().trim().min(1, "A heading is required.").max(100),
  description: z.string().trim().min(1, "A short description is required.").max(280),
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 8 * 1024 * 1024;

function fileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  return file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const metadata = metadataSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!metadata.success) {
    return NextResponse.json({ ok: false, error: metadata.error.issues[0]?.message }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose a screenshot to upload." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type) || file.size > maxFileSize) {
    return NextResponse.json(
      { ok: false, error: "Use a JPG, PNG, or WebP image smaller than 8 MB." },
      { status: 400 }
    );
  }

  const serviceClient = createSupabaseServerClient();
  if (!serviceClient) {
    return NextResponse.json({ ok: false, error: "Storage client not configured." }, { status: 503 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "site-assets";
  const id = crypto.randomUUID();
  const storagePath = `performance/${id}.${fileExtension(file)}`;
  const { error: uploadError } = await serviceClient.storage.from(bucket).upload(storagePath, await file.arrayBuffer(), {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = serviceClient.storage.from(bucket).getPublicUrl(storagePath);
  const { data: currentRow, error: readError } = await serviceClient
    .from("site_content")
    .select("payload")
    .eq("section_key", PERFORMANCE_GALLERY_KEY)
    .maybeSingle();

  if (readError) {
    await serviceClient.storage.from(bucket).remove([storagePath]);
    return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
  }

  const newItem: PerformanceScreenshot = {
    id,
    title: metadata.data.title,
    description: metadata.data.description,
    image: { url: publicUrlData.publicUrl, alt: metadata.data.title },
    storagePath,
    createdAt: new Date().toISOString(),
  };
  const allItems = [newItem, ...normalizePerformanceGallery(currentRow?.payload)];
  const retainedItems = allItems.slice(0, PERFORMANCE_GALLERY_LIMIT);
  const removedItems = allItems.slice(PERFORMANCE_GALLERY_LIMIT);

  const { error: saveError } = await serviceClient.from("site_content").upsert(
    {
      section_key: PERFORMANCE_GALLERY_KEY,
      payload: retainedItems,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section_key" }
  );

  if (saveError) {
    await serviceClient.storage.from(bucket).remove([storagePath]);
    return NextResponse.json({ ok: false, error: saveError.message }, { status: 500 });
  }

  const pathsToRemove = removedItems.map((item) => item.storagePath).filter(Boolean);
  if (pathsToRemove.length) {
    const { error: cleanupError } = await serviceClient.storage.from(bucket).remove(pathsToRemove);
    if (cleanupError) {
      console.error("Performance screenshot cleanup failed:", cleanupError.message);
    }
  }

  return NextResponse.json({ ok: true, items: retainedItems });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Screenshot id is required." }, { status: 400 });
  }

  const serviceClient = createSupabaseServerClient();
  if (!serviceClient) {
    return NextResponse.json({ ok: false, error: "Storage client not configured." }, { status: 503 });
  }

  const { data: currentRow, error: readError } = await serviceClient
    .from("site_content")
    .select("payload")
    .eq("section_key", PERFORMANCE_GALLERY_KEY)
    .maybeSingle();

  if (readError) {
    return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
  }

  const currentItems = normalizePerformanceGallery(currentRow?.payload);
  const itemToDelete = currentItems.find((item) => item.id === id);
  if (!itemToDelete) {
    return NextResponse.json({ ok: false, error: "Screenshot not found." }, { status: 404 });
  }

  const nextItems = currentItems.filter((item) => item.id !== id);
  const { error: saveError } = await serviceClient.from("site_content").upsert(
    {
      section_key: PERFORMANCE_GALLERY_KEY,
      payload: nextItems,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section_key" }
  );

  if (saveError) {
    return NextResponse.json({ ok: false, error: saveError.message }, { status: 500 });
  }

  if (itemToDelete.storagePath) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "site-assets";
    const { error: cleanupError } = await serviceClient.storage.from(bucket).remove([itemToDelete.storagePath]);
    if (cleanupError) {
      console.error("Performance screenshot deletion failed:", cleanupError.message);
    }
  }

  return NextResponse.json({ ok: true, items: nextItems });
}

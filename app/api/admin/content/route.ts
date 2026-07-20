import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ADMIN_SECTIONS } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const updateSchema = z.object({
  sectionKey: z.enum(ADMIN_SECTIONS),
  payload: z.unknown(),
});

export async function GET(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { supabase } = admin;

  const [contentResult, applicationsResult] = await Promise.all([
    supabase.from("site_content").select("section_key, payload").order("section_key", { ascending: true }),
    supabase
      .from("applications")
      .select("id, lead_type, full_name, email, whatsapp_number, country, broker, account_size, message, package_name, investment_budget, source_page, preferred_contact_method, preferred_contact_detail, confirmed_over_18, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  if (contentResult.error || applicationsResult.error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({
    content: contentResult.data ?? [],
    applications: applicationsResult.data ?? [],
    applicationsCount: applicationsResult.count ?? 0,
  });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { sectionKey, payload } = parsed.data;
  const serviceClient = createSupabaseServerClient();

  if (!serviceClient) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const { error } = await serviceClient.from("site_content").upsert({
    section_key: sectionKey,
    payload,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: "section_key",
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

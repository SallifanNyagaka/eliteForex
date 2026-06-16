import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ADMIN_SECTIONS } from "@/lib/admin";
import { z } from "zod";

const updateSchema = z.object({
  sectionKey: z.enum(ADMIN_SECTIONS),
  payload: z.unknown(),
});

async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return null;
  }

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();

  if (!admin) {
    return null;
  }

  return { supabase, user };
}

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
      .select("id, full_name, email, whatsapp_number, country, broker, account_size, message, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  if (contentResult.error || applicationsResult.error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({
    content: contentResult.data ?? [],
    applications: applicationsResult.data ?? [],
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

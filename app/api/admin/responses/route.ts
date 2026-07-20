import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const PAGE_SIZE = 25;

function readPage(request: Request) {
  const rawPage = Number(new URL(request.url).searchParams.get("page") ?? "1");
  return Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const page = readPage(request);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count, error } = await admin.supabase
    .from("applications")
    .select(
      "id, lead_type, full_name, email, whatsapp_number, country, broker, account_size, message, package_name, investment_budget, source_page, preferred_contact_method, preferred_contact_detail, confirmed_over_18, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Could not load admin responses.", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json({ ok: false, error: "Could not load submitted responses." }, { status: 500 });
  }

  const total = count ?? 0;

  return NextResponse.json({
    ok: true,
    responses: data ?? [],
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    },
  });
}

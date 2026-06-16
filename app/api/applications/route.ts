import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid submission." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Submission service is not configured." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("applications").insert({
    full_name: data.fullName,
    email: data.email,
    whatsapp_number: data.whatsappNumber,
    country: data.country,
    broker: data.broker || null,
    account_size: data.accountSize,
    message: data.message,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Could not submit your application." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

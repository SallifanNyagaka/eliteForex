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
    whatsapp_number: "whatsappNumber" in data ? data.whatsappNumber : data.phoneNumber,
    country: "country" in data ? data.country : "N/A",
    broker: "broker" in data ? data.broker || null : null,
    account_size: "accountSize" in data ? data.accountSize : data.investmentBudget,
    message: data.message,
    lead_type: data.leadType,
    package_name: "packageName" in data ? data.packageName || null : null,
    investment_budget: "investmentBudget" in data ? data.investmentBudget : null,
    source_page: data.sourcePage || null,
    preferred_contact_method: data.preferredContactMethod,
    preferred_contact_detail: data.preferredContactMethod === "whatsapp" ? null : data.preferredContactDetail || null,
    confirmed_over_18: data.confirmedOver18,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Could not submit your application." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

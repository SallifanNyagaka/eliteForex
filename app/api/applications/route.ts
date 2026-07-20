import { after, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { processEmailQueue } from "@/lib/email-queue";
import { leadSchema } from "@/lib/validation";

type SupabaseInsertError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function submissionErrorResponse(error: SupabaseInsertError) {
  console.error("Application submission database error.", {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  const errorText = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  const migrationRequired =
    error.code === "42703" ||
    error.code === "42P01" ||
    error.code === "PGRST204" ||
    errorText.includes("column") && (errorText.includes("does not exist") || errorText.includes("schema cache"));

  if (migrationRequired) {
    return NextResponse.json(
      {
        ok: false,
        code: "DATABASE_MIGRATION_REQUIRED",
        error: "The submission database is missing a required update. Please ask the administrator to run the latest Supabase migration.",
      },
      { status: 503 }
    );
  }

  if (error.code === "23502" || error.code === "23514") {
    return NextResponse.json(
      {
        ok: false,
        code: "DATABASE_CONSTRAINT_ERROR",
        error: "The database rejected one of the submitted values. Please review the form and try again.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      code: "DATABASE_SUBMISSION_FAILED",
      error: "Your information could not be saved because the submission service is temporarily unavailable. Please try again shortly.",
    },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const field = firstIssue?.path.join(".");

    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        error: field
          ? `Please check ${field}: ${firstIssue.message}`
          : firstIssue?.message || "Please review the form and try again.",
      },
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
      {
        ok: false,
        code: "SUBMISSION_SERVICE_NOT_CONFIGURED",
        error: "The submission service is not configured. Please contact the site administrator.",
      },
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
    return submissionErrorResponse(error);
  }

  after(async () => {
    try {
      await processEmailQueue(10);
    } catch (queueError) {
      console.error("Email queue processing failed after form submission.", queueError);
    }
  });

  return NextResponse.json({ ok: true });
}

import { createSupabaseServerClient } from "@/lib/supabase-server";

type EmailJob = {
  id: number;
  application_id: number;
  email_type: "admin_notification" | "user_confirmation";
  attempts: number;
  max_attempts: number;
};

type ApplicationEmailData = {
  id: number;
  lead_type: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  broker: string | null;
  account_size: string;
  message: string;
  package_name: string | null;
  investment_budget: string | null;
  source_page: string | null;
  preferred_contact_method: string;
  preferred_contact_detail: string | null;
  confirmed_over_18: boolean;
  created_at: string;
};

type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type EmailQueueResult = {
  claimed: number;
  sent: number;
  failed: number;
};

const applicationColumns = [
  "id",
  "lead_type",
  "full_name",
  "email",
  "whatsapp_number",
  "country",
  "broker",
  "account_size",
  "message",
  "package_name",
  "investment_budget",
  "source_page",
  "preferred_contact_method",
  "preferred_contact_detail",
  "confirmed_over_18",
  "created_at",
].join(", ");

function escapeHtml(value: string | number | boolean | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function preferredContactLabel(application: ApplicationEmailData) {
  const method = titleCase(application.preferred_contact_method || "whatsapp");
  return application.preferred_contact_detail
    ? `${method}: ${application.preferred_contact_detail}`
    : method;
}

function detailRows(application: ApplicationEmailData) {
  return [
    ["Submission type", titleCase(application.lead_type)],
    ["Name", application.full_name],
    ["Email", application.email],
    ["Phone / WhatsApp", application.whatsapp_number],
    ["Preferred contact", preferredContactLabel(application)],
    ["Country", application.country],
    ["Account size / budget", application.investment_budget || application.account_size],
    ["Broker", application.broker || "Not provided"],
    ["Package", application.package_name || "Not selected"],
    ["Source page", application.source_page || "Not provided"],
    ["18+ confirmed", application.confirmed_over_18 ? "Yes" : "No"],
    ["Submitted", new Date(application.created_at).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })],
  ] as const;
}

function emailFrame(content: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f5f7f8;color:#292f33;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:28px 16px;">
      <div style="background:#ffffff;border:1px solid #dde4e0;border-radius:18px;overflow:hidden;">
        <div style="background:#163a5f;color:#ffffff;padding:22px 26px;">
          <strong style="font-size:20px;letter-spacing:.04em;">Elite Forex Fund</strong>
        </div>
        <div style="padding:26px;line-height:1.6;">${content}</div>
      </div>
      <p style="margin:14px 0 0;color:#66736d;font-size:12px;text-align:center;">
        Professional forex account management
      </p>
    </div>
  </body>
</html>`;
}

function buildAdminEmail(application: ApplicationEmailData, adminEmail: string): OutgoingEmail {
  const rows = detailRows(application)
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px 8px 0;color:#66736d;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;color:#292f33;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`)
    .join("");

  const textDetails = detailRows(application).map(([label, value]) => `${label}: ${value}`).join("\n");

  return {
    to: adminEmail,
    replyTo: application.email,
    subject: `New ${titleCase(application.lead_type)} inquiry from ${application.full_name}`,
    html: emailFrame(`
      <h1 style="margin:0 0 12px;color:#163a5f;font-size:24px;">New form submission</h1>
      <p style="margin:0 0 18px;color:#66736d;">A new inquiry has been saved to the admin dashboard.</p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="margin-top:20px;padding:16px;border-left:3px solid #b88a2a;background:#f5f7f8;">
        <strong style="color:#163a5f;">Message</strong>
        <p style="margin:8px 0 0;white-space:pre-wrap;">${escapeHtml(application.message)}</p>
      </div>`),
    text: `New form submission\n\n${textDetails}\n\nMessage:\n${application.message}`,
  };
}

function buildUserEmail(application: ApplicationEmailData, adminEmail: string): OutgoingEmail {
  const firstName = application.full_name.trim().split(/\s+/)[0] || application.full_name;
  const contactMethod = preferredContactLabel(application);

  return {
    to: application.email,
    replyTo: adminEmail || undefined,
    subject: "We received your Elite Forex Fund inquiry",
    html: emailFrame(`
      <h1 style="margin:0 0 12px;color:#163a5f;font-size:24px;">Thank you, ${escapeHtml(firstName)}.</h1>
      <p style="margin:0 0 14px;">Your inquiry has been received and saved securely.</p>
      <p style="margin:0 0 18px;color:#66736d;">Our team will review it and follow up using your preferred contact method: <strong style="color:#292f33;">${escapeHtml(contactMethod)}</strong>.</p>
      <div style="padding:16px;border-left:3px solid #b88a2a;background:#f5f7f8;">
        <strong style="color:#163a5f;">Your message</strong>
        <p style="margin:8px 0 0;white-space:pre-wrap;">${escapeHtml(application.message)}</p>
      </div>
      <p style="margin:20px 0 0;">We appreciate your interest in Elite Forex Fund.</p>`),
    text: `Thank you, ${firstName}.\n\nYour inquiry has been received and saved securely. Our team will follow up using: ${contactMethod}.\n\nYour message:\n${application.message}\n\nElite Forex Fund`,
  };
}

async function sendWithResend(job: EmailJob, email: OutgoingEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Elite Forex Fund <onboarding@resend.dev>";

  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `elite-form-email-job-${job.id}`,
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });
  const result = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; error?: { message?: string } }
    | null;

  if (!response.ok || !result?.id) {
    throw new Error(result?.message || result?.error?.message || `Resend returned HTTP ${response.status}.`);
  }

  return result.id;
}

function nextAttemptAt(attempts: number) {
  const delaysInMinutes = [1, 5, 15, 60, 360];
  const delay = delaysInMinutes[Math.min(Math.max(attempts - 1, 0), delaysInMinutes.length - 1)];
  return new Date(Date.now() + delay * 60_000).toISOString();
}

export async function processEmailQueue(limit = 10): Promise<EmailQueueResult> {
  const supabase = createSupabaseServerClient();

  if (!supabase) return { claimed: 0, sent: 0, failed: 0 };

  if (!process.env.RESEND_API_KEY || !process.env.FORM_NOTIFICATION_EMAIL?.trim()) {
    throw new Error("RESEND_API_KEY and FORM_NOTIFICATION_EMAIL must be configured before processing email jobs.");
  }

  const { data, error } = await supabase.rpc("claim_email_jobs", { batch_size: limit });

  if (error) throw new Error(`Could not claim email jobs: ${error.message}`);

  const jobs = (data ?? []) as EmailJob[];
  const adminEmail = process.env.FORM_NOTIFICATION_EMAIL?.trim() ?? "";

  const outcomes = await Promise.all(jobs.map(async (job) => {
    try {
      const applicationResult = await supabase
        .from("applications")
        .select(applicationColumns)
        .eq("id", job.application_id)
        .single();

      if (applicationResult.error || !applicationResult.data) {
        throw new Error(applicationResult.error?.message || "Application record was not found.");
      }

      const application = applicationResult.data as unknown as ApplicationEmailData;

      if (job.email_type === "admin_notification" && !adminEmail) {
        throw new Error("FORM_NOTIFICATION_EMAIL is not configured.");
      }

      const email = job.email_type === "admin_notification"
        ? buildAdminEmail(application, adminEmail)
        : buildUserEmail(application, adminEmail);
      const providerMessageId = await sendWithResend(job, email);
      const updateResult = await supabase
        .from("email_jobs")
        .update({
          status: "sent",
          provider_message_id: providerMessageId,
          completed_at: new Date().toISOString(),
          locked_at: null,
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      if (updateResult.error) throw new Error(`Email sent but job update failed: ${updateResult.error.message}`);
      return true;
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : "Unknown email delivery error.";
      const exhausted = job.attempts >= job.max_attempts;

      await supabase
        .from("email_jobs")
        .update({
          status: exhausted ? "dead" : "failed",
          available_at: nextAttemptAt(job.attempts),
          locked_at: null,
          last_error: message.slice(0, 2000),
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return false;
    }
  }));

  const sent = outcomes.filter(Boolean).length;
  return { claimed: jobs.length, sent, failed: jobs.length - sent };
}

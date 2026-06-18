"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import {
  contactLeadSchema,
  homeLeadSchema,
  packageLeadSchema,
} from "@/lib/validation";

type LeadVariant = "home" | "contact" | "package";

type LeadFormValues = {
  leadType: LeadVariant;
  fullName: string;
  email: string;
  message: string;
  honeypot: string;
  packageName: string;
  sourcePage: string;
  whatsappNumber?: string;
  country?: string;
  broker?: string;
  accountSize?: string;
  phoneNumber?: string;
  investmentBudget?: string;
};

const schemaMap = {
  home: homeLeadSchema,
  contact: contactLeadSchema,
  package: packageLeadSchema,
} as const;

type FieldLabelMap = Record<string, string>;

function renderErrorMessage(message: unknown) {
  return typeof message === "string" ? message : null;
}

export function LeadCaptureForm({
  variant,
  sourcePage,
  packageName,
  compact = false,
}: {
  variant: LeadVariant;
  sourcePage: string;
  packageName?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const schema = schemaMap[variant];

  const defaultValues = useMemo(() => {
    if (variant === "home") {
      return {
        leadType: "home",
        fullName: "",
        email: "",
        message: "",
        honeypot: "",
        packageName: "",
        sourcePage,
        whatsappNumber: "",
        country: "",
        broker: "",
        accountSize: "",
      } satisfies LeadFormValues;
    }

    return {
      leadType: variant,
      fullName: "",
      email: "",
      message: "",
      honeypot: "",
      packageName: packageName ?? "",
      sourcePage,
      phoneNumber: "",
      investmentBudget: "",
    } satisfies LeadFormValues;
  }, [packageName, sourcePage, variant]);

  const form = useForm<any>({
    resolver: zodResolver(schema as never) as any,
    defaultValues,
  });

  async function onSubmit(values: LeadFormValues) {
    setStatus("idle");
    setMessage("");

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        packageName: packageName ?? values.packageName,
        sourcePage,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok || !payload?.ok) {
      setStatus("error");
      setMessage(payload?.error ?? "We could not submit your inquiry right now.");
      return;
    }

    setStatus("success");
    setMessage("Your inquiry was submitted successfully.");
    form.reset(defaultValues);
  }

  const fieldCopy: Record<LeadVariant, FieldLabelMap> = {
    home: {
      fullName: "Full Name",
      email: "Email Address",
      whatsappNumber: "WhatsApp Number",
      country: "Country",
      broker: "Broker",
      accountSize: "Account Size (USD)",
      message: "Tell us about your goals",
    },
    contact: {
      fullName: "Full Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      investmentBudget: "Investment Budget",
      message: "Tell us about your goals",
    },
    package: {
      fullName: "Full Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      investmentBudget: "Investment Budget",
      message: "Tell us about your goals",
    },
  };

  const isHome = variant === "home";

  return (
    <form className={`lead-capture-form ${compact ? "compact" : ""}`} onSubmit={form.handleSubmit(onSubmit)}>
      <input type="hidden" {...form.register("leadType")} />
      <input type="hidden" {...form.register("sourcePage")} />
      <input type="hidden" {...form.register("honeypot")} />
      <input type="hidden" {...form.register("packageName")} />

      <div className="form-grid">
        <label className="field">
          <span>{fieldCopy[variant].fullName}</span>
          <input type="text" {...form.register("fullName")} />
          {renderErrorMessage(form.formState.errors.fullName?.message) ? (
            <em>{renderErrorMessage(form.formState.errors.fullName?.message)}</em>
          ) : null}
        </label>

        <label className="field">
          <span>{fieldCopy[variant].email}</span>
          <input type="email" {...form.register("email")} />
          {renderErrorMessage(form.formState.errors.email?.message) ? (
            <em>{renderErrorMessage(form.formState.errors.email?.message)}</em>
          ) : null}
        </label>

        {isHome ? (
          <>
            <label className="field">
              <span>{fieldCopy.home.whatsappNumber}</span>
              <input type="tel" {...form.register("whatsappNumber")} />
              {renderErrorMessage(form.formState.errors.whatsappNumber?.message) ? (
                <em>{renderErrorMessage(form.formState.errors.whatsappNumber?.message)}</em>
              ) : null}
            </label>

            <label className="field">
              <span>{fieldCopy.home.country}</span>
              <input type="text" {...form.register("country")} />
              {renderErrorMessage(form.formState.errors.country?.message) ? (
                <em>{renderErrorMessage(form.formState.errors.country?.message)}</em>
              ) : null}
            </label>

            <label className="field">
              <span>{fieldCopy.home.broker}</span>
              <input type="text" {...form.register("broker")} />
            </label>

            <label className="field">
              <span>{fieldCopy.home.accountSize}</span>
              <select {...form.register("accountSize")}>
                <option value="">Select size</option>
                <option value="$500 - $2,000">$500 - $2,000</option>
                <option value="$2,000 - $10,000">$2,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
              {renderErrorMessage(form.formState.errors.accountSize?.message) ? (
                <em>{renderErrorMessage(form.formState.errors.accountSize?.message)}</em>
              ) : null}
            </label>
          </>
        ) : (
          <>
            <label className="field">
              <span>Phone Number</span>
              <input type="tel" {...form.register("phoneNumber")} />
              {renderErrorMessage(form.formState.errors.phoneNumber?.message) ? (
                <em>{renderErrorMessage(form.formState.errors.phoneNumber?.message)}</em>
              ) : null}
            </label>

            <label className="field">
              <span>{fieldCopy.contact.investmentBudget}</span>
              <select {...form.register("investmentBudget")}>
                <option value="">Select budget</option>
                <option value="$500 - $2,000">$500 - $2,000</option>
                <option value="$2,000 - $10,000">$2,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
              {renderErrorMessage(form.formState.errors.investmentBudget?.message) ? (
                <em>{renderErrorMessage(form.formState.errors.investmentBudget?.message)}</em>
              ) : null}
            </label>
          </>
        )}
      </div>

      <label className="field textarea-field">
        <span>{fieldCopy[variant].message}</span>
        <textarea rows={compact ? 4 : 5} {...form.register("message")} />
        {renderErrorMessage(form.formState.errors.message?.message) ? (
          <em>{renderErrorMessage(form.formState.errors.message?.message)}</em>
        ) : null}
      </label>

      <button className="primary-button submit-button" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Loader2 size={18} className="spin" /> : <ArrowRight size={18} />}
        <span>{variant === "package" ? "Send Package Inquiry" : "Submit Inquiry"}</span>
      </button>

      <p className={`form-feedback ${status}`}>
        <ShieldCheck size={16} />
        <span>{message || "Your information is handled securely and used only for follow-up."}</span>
      </p>
    </form>
  );
}

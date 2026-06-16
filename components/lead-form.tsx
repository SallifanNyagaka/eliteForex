"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

type FormState = {
  fullName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  broker: string;
  accountSize: string;
  message: string;
  honeypot: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  whatsappNumber: "",
  country: "",
  broker: "",
  accountSize: "",
  message: "",
  honeypot: "",
};

export function LeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error ?? "Something went wrong.");
      }

      setStatus("success");
      setMessage("Your application was submitted successfully.");
      setForm(initialState);
    } catch {
      setStatus("error");
      setMessage("We could not submit the form right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <input
          type="text"
          placeholder="Full Name"
          aria-label="Full Name"
          value={form.fullName}
          onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          aria-label="Email Address"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="WhatsApp Number"
          aria-label="WhatsApp Number"
          value={form.whatsappNumber}
          onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Country"
          aria-label="Country"
          value={form.country}
          onChange={(event) => setForm({ ...form, country: event.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Broker"
          aria-label="Broker"
          value={form.broker}
          onChange={(event) => setForm({ ...form, broker: event.target.value })}
        />
        <select
          aria-label="Account Size"
          value={form.accountSize}
          onChange={(event) => setForm({ ...form, accountSize: event.target.value })}
          required
        >
          <option value="">Account Size (USD)</option>
          <option value="$500 - $2,000">$500 - $2,000</option>
          <option value="$2,000 - $10,000">$2,000 - $10,000</option>
          <option value="$10,000+">$10,000+</option>
        </select>
      </div>
      <textarea
        rows={4}
        placeholder="Tell us about your goals"
        aria-label="Tell us about your goals"
        value={form.message}
        onChange={(event) => setForm({ ...form, message: event.target.value })}
        required
      />
      <input
        className="honeypot"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.honeypot}
        onChange={(event) => setForm({ ...form, honeypot: event.target.value })}
      />
      <button className="primary-button submit-button" type="submit" disabled={loading}>
        {loading ? <Loader2 size={18} className="spin" /> : "Send Application"}
        {!loading ? <ArrowRight size={18} /> : null}
      </button>
      <p className={`form-feedback ${status}`}>
        <ShieldCheck size={16} />
        <span>{message || "Your information should be handled securely and only used for follow-up."}</span>
      </p>
    </form>
  );
}

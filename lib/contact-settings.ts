import type { PhoneNumberEntry, PrivacyPolicyDocument } from "@/lib/cms-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizePhoneNumbers(value: unknown, fallback: PhoneNumberEntry[] = []): PhoneNumberEntry[] {
  if (!Array.isArray(value)) return fallback;

  const entries = value.flatMap((item) => {
    if (!isRecord(item)) return [];

    const number = typeof item.number === "string" ? item.number.trim() : "";
    if (!number) return [];

    return [{
      label: typeof item.label === "string" && item.label.trim() ? item.label.trim() : "WhatsApp",
      number,
      display: typeof item.display === "string" && item.display.trim() ? item.display.trim() : number,
    }];
  });

  return entries.length ? entries : fallback;
}

export function normalizePrivacyPolicy(value: unknown): PrivacyPolicyDocument | null {
  if (!isRecord(value) || typeof value.url !== "string" || !value.url.trim()) return null;

  return {
    url: value.url.trim(),
    path: typeof value.path === "string" ? value.path.trim() : "",
    fileName: typeof value.fileName === "string" && value.fileName.trim()
      ? value.fileName.trim()
      : "privacy-policy.pdf",
  };
}

export function normalizeContactSettings(
  value: unknown,
  fallbackPhones: PhoneNumberEntry[] = []
) {
  const settings = isRecord(value) ? value : {};

  return {
    phoneNumbers: normalizePhoneNumbers(settings.phoneNumbers, fallbackPhones),
    privacyPolicy: normalizePrivacyPolicy(settings.privacyPolicy),
  };
}

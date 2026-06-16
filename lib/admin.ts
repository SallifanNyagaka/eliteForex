export const ADMIN_SECTIONS = [
  "site",
  "navigation",
  "hero",
  "stats",
  "plans",
  "performance",
  "whyChoose",
  "steps",
] as const;

export type AdminSectionKey = (typeof ADMIN_SECTIONS)[number];

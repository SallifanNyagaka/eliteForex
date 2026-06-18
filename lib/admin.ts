export const ADMIN_SECTIONS = [
  "site",
  "navigation",
  "hero",
  "stats",
  "plans",
  "performance",
  "whyChoose",
  "steps",
  "about_hero",
  "about_journey",
  "about_team",
  "services_hero",
  "services_list",
  "packages_hero",
  "packages_tiers",
  "contact_hero",
  "contact_channels",
  "contact_budgets",
  "faq_hero",
  "faq_items",
] as const;

export type AdminSectionKey = (typeof ADMIN_SECTIONS)[number];

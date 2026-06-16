import type { LucideIcon } from "lucide-react";

export type IconKey =
  | "shield-check"
  | "line-chart"
  | "target"
  | "users"
  | "briefcase-business"
  | "zap";

export type NavigationItem = {
  label: string;
  href: string;
};

export type HeroHighlight = {
  title: string;
  text: string;
  iconKey: IconKey;
  icon: LucideIcon;
};

export type Plan = {
  name: string;
  deposit: string;
  features: string[];
  featured?: boolean;
};

export type PerformanceEntry = {
  month: string;
  return: string;
};

export type SiteContent = {
  site: {
    brandName: string;
    tagline: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    phone: string;
    email: string;
    location: string;
    footerBlurb: string;
    disclaimer: string;
  };
  navigation: NavigationItem[];
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    rating: string;
    highlights: HeroHighlight[];
  };
  stats: Array<{
    value: string;
    label: string;
  }>;
  plans: Plan[];
  performance: PerformanceEntry[];
  whyChoose: HeroHighlight[];
  steps: Array<{
    number: string;
    title: string;
    text: string;
  }>;
};

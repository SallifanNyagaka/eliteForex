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
    siteName?: string;
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
    media?: {
      url: string;
      alt: string;
    } | null;
    mediaActions: Array<{
      label: string;
      href: string;
      position?:
        | "auto"
        | "top-left"
        | "top-center"
        | "top-right"
        | "center-left"
        | "center"
        | "center-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";
    }>;
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

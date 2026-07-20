import type { LucideIcon } from "lucide-react";

export type MediaAsset = {
  url: string;
  alt: string;
};

export type IconName =
  | "shield-check"
  | "line-chart"
  | "target"
  | "users"
  | "briefcase-business"
  | "badge-percent"
  | "circle-dollar-sign"
  | "calendar-clock"
  | "map-pin"
  | "phone"
  | "mail"
  | "globe"
  | "clipboard-list"
  | "sparkles"
  | "star";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialIconName =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "twitter"
  | "telegram"
  | "tiktok"
  | "website";

export type SocialLink = {
  label: string;
  iconName: SocialIconName;
  url: string;
  description: string;
};

export type MediaAction = {
  label: string;
  href: string;
};

export type MediaPlaceholder = {
  label: string;
  note?: string;
};

export type PageHero = {
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  media?: MediaAsset | null;
};

export type TeamProfile = {
  name: string;
  role: string;
  linkedinUrl?: string;
  image?: MediaAsset | null;
};

export type JourneyEntry = {
  label: string;
  title: string;
  text: string;
};

export type ServiceItem = {
  title: string;
  description: string;
  iconName: IconName;
  bullets: string[];
  image?: MediaAsset | null;
};

export type ResolvedServiceItem = ServiceItem & {
  icon: LucideIcon;
};

export type PackageTier = {
  name: string;
  minimumDeposit: string;
  targetMonthlyRoi: string;
  profitSplit: string;
  riskProfile: string;
  featured?: boolean;
  benefits: string[];
  image?: MediaAsset | null;
};

export type ContactChannel = {
  label: string;
  value: string;
  iconName: IconName;
};

export type ResolvedContactChannel = ContactChannel & {
  icon: LucideIcon;
};

export type FaqItem = {
  question: string;
  answer: string;
  priority: number;
};

export type SiteChrome = {
  brandName?: string;
  siteName: string;
  tagline: string;
  navLinks: NavLink[];
  footerBlurb: string;
  disclaimer: string;
  copyrightName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  location: string;
  logo?: MediaAsset | null;
  socialLinks: SocialLink[];
};

export type AboutPageContent = {
  hero: PageHero;
  journey: {
    startYear: number;
    milestones: JourneyEntry[];
  };
  team: TeamProfile[];
};

export type ServicesPageContent = {
  hero: PageHero;
  services: ResolvedServiceItem[];
};

export type PackagesPageContent = {
  hero: PageHero;
  tiers: PackageTier[];
};

export type ContactPageContent = {
  hero: PageHero;
  channels: ResolvedContactChannel[];
  investmentBudgets: string[];
};

export type FaqPageContent = {
  hero: PageHero;
  items: FaqItem[];
};

export type PerformanceScreenshot = {
  id: string;
  title: string;
  description: string;
  image: MediaAsset;
  storagePath: string;
  createdAt: string;
};

export type PerformancePageContent = {
  screenshots: PerformanceScreenshot[];
};

export type DynamicCmsSection = {
  section_key: string;
  payload: unknown;
};

export type IconResolver = Record<IconName, LucideIcon>;

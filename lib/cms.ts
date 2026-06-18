import { createClient } from "@supabase/supabase-js";
import {
  BriefcaseBusiness,
  BadgePercent,
  CalendarClock,
  CircleDollarSign,
  Globe,
  LineChart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  ClipboardList,
} from "lucide-react";
import type {
  AboutPageContent,
  ContactPageContent,
  DynamicCmsSection,
  FaqPageContent,
  IconName,
  IconResolver,
  PackagesPageContent,
  PageHero,
  ServicesPageContent,
  SiteChrome,
} from "@/lib/cms-types";

const iconResolver: IconResolver = {
  "shield-check": ShieldCheck,
  "line-chart": LineChart,
  target: Target,
  users: Users,
  "briefcase-business": BriefcaseBusiness,
  "badge-percent": BadgePercent,
  "circle-dollar-sign": CircleDollarSign,
  "calendar-clock": CalendarClock,
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  globe: Globe,
  "clipboard-list": ClipboardList,
  sparkles: Sparkles,
  star: Star,
};

const currentYear = new Date().getFullYear();
const dynamicStartYear = currentYear - 6;

const fallbackChrome: SiteChrome = {
  siteName: "Elite Forex Fund",
  tagline: "Institutional forex account management",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Packages", href: "/packages" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  footerBlurb: "Professional forex account management for serious investors.",
  disclaimer:
    "Forex trading involves significant risk and may not be suitable for all investors. Past performance is not indicative of future results.",
  copyrightName: "Elite Forex",
  whatsappNumber: "254708218368",
  whatsappDisplay: "+254 708 218 368",
  email: "support@eliteforexfund.com",
  location: "Nairobi, Kenya",
  logo: {
    url: "",
    alt: "Elite Forex Fund logo",
  },
};

const fallbackAbout: AboutPageContent = {
  hero: {
    eyebrow: "About Elite Forex Fund",
    title: "Built for disciplined capital preservation and long-term growth.",
    description:
      "We combine structured account management, risk-first execution, and transparent reporting for institutional-style FX exposure.",
    ctaPrimary: "Explore Services",
    ctaSecondary: "View Packages",
    media: {
      url: "",
      alt: "Team and office visual placeholder",
    },
  },
  journey: {
    startYear: dynamicStartYear,
    milestones: [
      {
        label: "Foundation",
        title: "Strategy-first operations",
        text: "We started with a simple operating rule: preserve capital before chasing performance.",
      },
      {
        label: "Growth",
        title: "Client-centric reporting",
        text: "The business expanded through clearer reporting, stronger communication, and repeatable systems.",
      },
      {
        label: "Now",
        title: "Institutional presentation",
        text: "The platform now supports a multi-page, database-driven experience for a premium client journey.",
      },
    ],
  },
  team: [
    {
      name: "Chief Strategist",
      role: "Trading and portfolio oversight",
      linkedinUrl: "https://www.linkedin.com",
      image: { url: "", alt: "Chief Strategist profile placeholder" },
    },
    {
      name: "Risk Lead",
      role: "Capital protection and controls",
      linkedinUrl: "https://www.linkedin.com",
      image: { url: "", alt: "Risk Lead profile placeholder" },
    },
    {
      name: "Client Success Manager",
      role: "Onboarding and communication",
      linkedinUrl: "https://www.linkedin.com",
      image: { url: "", alt: "Client Success Manager profile placeholder" },
    },
  ],
};

const fallbackServices: ServicesPageContent = {
  hero: {
    eyebrow: "Services",
    title: "Flagship account management services built around risk discipline.",
    description:
      "Every service card can be edited from Supabase and rendered with a dynamic Lucide icon mapping.",
    ctaPrimary: "View Packages",
    ctaSecondary: "Contact Us",
    media: { url: "", alt: "Services page hero placeholder" },
  },
  services: [
    {
      title: "Managed Forex Accounts",
      description: "End-to-end account oversight for clients seeking a structured FX mandate.",
      iconName: "briefcase-business",
      icon: BriefcaseBusiness,
      bullets: ["Clear mandate", "Transparent reporting", "Execution oversight"],
      image: { url: "", alt: "Managed accounts placeholder" },
    },
    {
      title: "Risk Management Advisory",
      description: "Capital-preservation frameworks and portfolio guardrails for serious investors.",
      iconName: "shield-check",
      icon: ShieldCheck,
      bullets: ["Drawdown controls", "Position sizing", "Account monitoring"],
      image: { url: "", alt: "Risk management placeholder" },
    },
    {
      title: "Performance Analytics",
      description: "Monthly reporting dashboards that keep clients aligned with live activity.",
      iconName: "line-chart",
      icon: LineChart,
      bullets: ["Monthly summaries", "Account metrics", "Priority updates"],
      image: { url: "", alt: "Performance analytics placeholder" },
    },
  ],
};

const fallbackPackages: PackagesPageContent = {
  hero: {
    eyebrow: "Packages",
    title: "Investment tiers with transparent entry points and risk profiles.",
    description:
      "Package cards are database-driven and can launch pre-filled inquiry modals for lead capture.",
    ctaPrimary: "Inquire Now",
    ctaSecondary: "Ask a Question",
    media: { url: "", alt: "Packages page hero placeholder" },
  },
  tiers: [
    {
      name: "Starter",
      minimumDeposit: "$500",
      targetMonthlyRoi: "8 - 12%",
      profitSplit: "80 / 20",
      riskProfile: "Conservative",
      benefits: ["Small-account friendly", "Weekly updates", "Standard risk controls"],
      image: { url: "", alt: "Starter package placeholder" },
    },
    {
      name: "Growth",
      minimumDeposit: "$2,000",
      targetMonthlyRoi: "10 - 15%",
      profitSplit: "80 / 20",
      riskProfile: "Balanced",
      featured: true,
      benefits: ["Dedicated manager", "Advanced strategy mix", "Priority reporting"],
      image: { url: "", alt: "Growth package placeholder" },
    },
    {
      name: "Elite",
      minimumDeposit: "$10,000",
      targetMonthlyRoi: "12 - 18%",
      profitSplit: "80 / 20",
      riskProfile: "Institutional",
      benefits: ["Custom settings", "Priority support", "Tailored execution"],
      image: { url: "", alt: "Elite package placeholder" },
    },
  ],
};

const fallbackContact: ContactPageContent = {
  hero: {
    eyebrow: "Contact",
    title: "Speak with the team and submit a secure inquiry.",
    description:
      "Contact details, office channels, and the lead form are all driven by the database for easy updates.",
    ctaPrimary: "Submit Inquiry",
    ctaSecondary: "View FAQ",
    media: { url: "", alt: "Contact page placeholder" },
  },
  channels: [
    {
      label: "Office Address",
      value: "Nairobi, Kenya",
      iconName: "map-pin",
      icon: MapPin,
    },
    {
      label: "Phone",
      value: "+254 708 218 368",
      iconName: "phone",
      icon: Phone,
    },
    {
      label: "Email",
      value: "support@eliteforexfund.com",
      iconName: "mail",
      icon: Mail,
    },
  ],
  investmentBudgets: ["$500 - $2,000", "$2,000 - $10,000", "$10,000+"],
};

const fallbackFaq: FaqPageContent = {
  hero: {
    eyebrow: "FAQ",
    title: "Answers to common client questions.",
    description:
      "Frequently asked questions are pulled from the database and sorted by priority.",
    ctaPrimary: "Contact Us",
    ctaSecondary: "View Packages",
    media: { url: "", alt: "FAQ page placeholder" },
  },
  items: [
    {
      question: "How do I get started?",
      answer:
        "Choose a package or submit a contact inquiry and the team will guide you through the onboarding process.",
      priority: 1,
    },
    {
      question: "Can I change my package later?",
      answer:
        "Yes. Package changes can be handled after review of your account and trading objectives.",
      priority: 2,
    },
    {
      question: "How are results reported?",
      answer:
        "Performance summaries are communicated through the account reporting process and admin dashboard.",
      priority: 3,
    },
  ],
};

function getUrlAndKey() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return null;
  }
  return { url, anonKey };
}

async function fetchSections(keys: string[]) {
  const config = getUrlAndKey();
  if (!config) return [];

  const client = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await client
    .from("site_content")
    .select("section_key, payload")
    .in("section_key", keys);

  if (error || !data) {
    return [];
  }

  return data as DynamicCmsSection[];
}

function toMap(rows: DynamicCmsSection[]) {
  return new Map(rows.map((row) => [row.section_key, row.payload]));
}

function resolveIcon(name: IconName | undefined) {
  if (!name) return undefined;
  return iconResolver[name] ?? ShieldCheck;
}

export function formatYearsInOperation(startYear: number) {
  return Math.max(1, currentYear - startYear);
}

export async function getChromeContent(): Promise<SiteChrome> {
  const rows = await fetchSections(["site", "navigation"]);
  const map = toMap(rows);
  const rawSite = (map.get("site") ?? {}) as Partial<SiteChrome>;
  const navLinks = (map.get("navigation") ?? fallbackChrome.navLinks) as SiteChrome["navLinks"];

  return {
    ...fallbackChrome,
    ...rawSite,
    brandName: rawSite.brandName ?? rawSite.siteName,
    siteName: rawSite.siteName ?? rawSite.brandName ?? fallbackChrome.siteName,
    navLinks,
  };
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const rows = await fetchSections(["about_hero", "about_journey", "about_team"]);
  const map = toMap(rows);
  const hero = (map.get("about_hero") ?? {}) as Partial<PageHero>;
  const journey = (map.get("about_journey") ?? {}) as Partial<AboutPageContent["journey"]>;
  const team = (map.get("about_team") ?? fallbackAbout.team) as AboutPageContent["team"];

  return {
    hero: { ...fallbackAbout.hero, ...hero },
    journey: {
      startYear: journey.startYear ?? fallbackAbout.journey.startYear,
      milestones: (journey.milestones ?? fallbackAbout.journey.milestones) as AboutPageContent["journey"]["milestones"],
    },
    team,
  };
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  const rows = await fetchSections(["services_hero", "services_list"]);
  const map = toMap(rows);
  const hero = (map.get("services_hero") ?? {}) as Partial<PageHero>;
  const services = (map.get("services_list") ?? fallbackServices.services) as ServicesPageContent["services"];

  return {
    hero: { ...fallbackServices.hero, ...hero },
    services: services.map((service) => ({
      ...service,
      icon: resolveIcon(service.iconName) ?? ShieldCheck,
    })),
  };
}

export async function getPackagesPageContent(): Promise<PackagesPageContent> {
  const rows = await fetchSections(["packages_hero", "packages_tiers"]);
  const map = toMap(rows);
  const hero = (map.get("packages_hero") ?? {}) as Partial<PageHero>;
  const tiers = (map.get("packages_tiers") ?? fallbackPackages.tiers) as PackagesPageContent["tiers"];

  return {
    hero: { ...fallbackPackages.hero, ...hero },
    tiers,
  };
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  const rows = await fetchSections(["contact_hero", "contact_channels", "contact_budgets"]);
  const map = toMap(rows);
  const hero = (map.get("contact_hero") ?? {}) as Partial<PageHero>;
  const channels = (map.get("contact_channels") ?? fallbackContact.channels) as ContactPageContent["channels"];
  const investmentBudgets = (map.get("contact_budgets") ?? fallbackContact.investmentBudgets) as string[];

  return {
    hero: { ...fallbackContact.hero, ...hero },
    channels: channels.map((channel) => ({
      ...channel,
      icon: resolveIcon(channel.iconName) ?? MapPin,
    })) as ContactPageContent["channels"],
    investmentBudgets,
  };
}

export async function getFaqPageContent(): Promise<FaqPageContent> {
  const rows = await fetchSections(["faq_hero", "faq_items"]);
  const map = toMap(rows);
  const hero = (map.get("faq_hero") ?? {}) as Partial<PageHero>;
  const items = (map.get("faq_items") ?? fallbackFaq.items) as FaqPageContent["items"];

  return {
    hero: { ...fallbackFaq.hero, ...hero },
    items: [...items].sort((a, b) => a.priority - b.priority),
  };
}

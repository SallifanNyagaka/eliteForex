import { BriefcaseBusiness, LineChart, ShieldCheck, Target, Users, Zap } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import type { IconKey, SiteContent } from "@/lib/types";

const fallbackContent: SiteContent = {
  site: {
    brandName: "Elite Forex Fund",
    tagline: "Professional forex account management",
    whatsappNumber: "254708218368",
    whatsappDisplay: "+254 708 218 368",
    phone: "+254 708 218 368",
    email: "support@eliteforexfund.com",
    location: "Nairobi, Kenya",
    footerBlurb: "Professional Forex Account Management for serious investors.",
    disclaimer:
      "Forex trading involves significant risk and may not be suitable for all investors. Past performance is not indicative of future results.",
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#why-us" },
    { label: "Performance", href: "#performance" },
    { label: "Plans", href: "#plans" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#apply" },
  ],
  hero: {
    eyebrow: "Elite Forex Fund",
    title: "Professional Forex\nAccount Management",
    description:
      "Grow your capital through disciplined risk management, proven strategies, and transparent reporting.",
    primaryCta: "Apply Now",
    secondaryCta: "View Performance",
    rating: "4.9/5 Excellent",
    media: {
      url: "",
      alt: "Homepage hero placeholder",
    },
    mediaActions: [
      { label: "Apply Now", href: "#apply", position: "auto" },
      { label: "View Performance", href: "/performance", position: "auto" },
    ],
    highlights: [
      {
        title: "Disciplined",
        text: "Risk management first",
        iconKey: "shield-check",
        icon: ShieldCheck,
      },
      {
        title: "Consistent",
        text: "Performance transparency",
        iconKey: "line-chart",
        icon: LineChart,
      },
      {
        title: "Secure",
        text: "Funds safety matters",
        iconKey: "target",
        icon: Target,
      },
    ],
  },
  stats: [
    { value: "250+", label: "Active Clients" },
    { value: "$8M+", label: "Capital Managed" },
    { value: "3+ Years", label: "Proven Track Record" },
    { value: "95%", label: "Client Satisfaction" },
    { value: "100%", label: "Funds Security" },
  ],
  plans: [
    {
      name: "Starter Plan",
      deposit: "$500",
      features: [
        "80% Profit Share (Client)",
        "20% Profit Share (Fund)",
        "Standard Risk Management",
        "Weekly Performance Report",
      ],
    },
    {
      name: "Growth Plan",
      deposit: "$2,000",
      features: [
        "80% Profit Share (Client)",
        "20% Profit Share (Fund)",
        "Dedicated Account Manager",
        "Advanced Trading Strategies",
        "Weekly Performance Report",
      ],
      featured: true,
    },
    {
      name: "Elite Plan",
      deposit: "$10,000",
      features: [
        "80% Profit Share (Client)",
        "20% Profit Share (Fund)",
        "Priority Support",
        "Custom Risk Settings",
        "Advanced Strategies",
      ],
    },
  ],
  performance: [
    { return: "+12.45%", month: "May 2024" },
    { return: "+10.32%", month: "Apr 2024" },
    { return: "+8.67%", month: "Mar 2024" },
    { return: "+15.21%", month: "Feb 2024" },
    { return: "+9.18%", month: "Jan 2024" },
  ],
  whyChoose: [
    {
      title: "Proven Trading Strategies",
      text: "Market-tested approaches with a clear emphasis on risk control.",
      iconKey: "target",
      icon: Target,
    },
    {
      title: "Risk Management First",
      text: "Capital preservation is treated as a product requirement.",
      iconKey: "shield-check",
      icon: ShieldCheck,
    },
    {
      title: "Transparent Results",
      text: "Publish date-stamped updates and keep the numbers current.",
      iconKey: "line-chart",
      icon: LineChart,
    },
    {
      title: "Dedicated Support",
      text: "Offer a direct line of communication for every active client.",
      iconKey: "users",
      icon: Users,
    },
  ],
  steps: [
    {
      number: "1",
      title: "Apply",
      text: "Fill out the application form and choose your plan.",
    },
    {
      number: "2",
      title: "Fund Your Account",
      text: "We share the required details to start the account setup.",
    },
    {
      number: "3",
      title: "We Trade",
      text: "Our team manages the account with defined controls.",
    },
    {
      number: "4",
      title: "You Profit",
      text: "Receive your share of profits on the agreed schedule.",
    },
  ],
};

const iconMap: Record<IconKey, typeof ShieldCheck> = {
  "shield-check": ShieldCheck,
  "line-chart": LineChart,
  target: Target,
  users: Users,
  "briefcase-business": BriefcaseBusiness,
  zap: Zap,
};

function resolveHighlightIcons(items: SiteContent["hero"]["highlights"]) {
  return items.map((item) => ({
    ...item,
    icon: iconMap[item.iconKey] ?? ShieldCheck,
  }));
}

export async function getLandingPageContent(): Promise<SiteContent> {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return fallbackContent;
  }

  try {
    const supabase = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("site_content")
      .select("section_key, payload")
      .order("section_key", { ascending: true });

    if (error || !data?.length) {
      return fallbackContent;
    }

    const byKey = new Map<string, unknown>();
    for (const row of data) {
      byKey.set(row.section_key, row.payload);
    }

    const rawSite = (byKey.get("site") ?? fallbackContent.site) as Partial<SiteContent["site"]>;
    const site: SiteContent["site"] = {
      ...fallbackContent.site,
      ...rawSite,
      brandName: rawSite.brandName ?? rawSite.siteName ?? fallbackContent.site.brandName,
      siteName: rawSite.siteName ?? rawSite.brandName ?? fallbackContent.site.brandName,
      phone: rawSite.phone ?? rawSite.whatsappDisplay ?? fallbackContent.site.phone,
    };
    const navigation = (byKey.get("navigation") ?? fallbackContent.navigation) as SiteContent["navigation"];
    const hero = (byKey.get("hero") ?? fallbackContent.hero) as Partial<SiteContent["hero"]>;
    const stats = (byKey.get("stats") ?? fallbackContent.stats) as SiteContent["stats"];
    const plans = (byKey.get("plans") ?? fallbackContent.plans) as SiteContent["plans"];
    const performance = (byKey.get("performance") ?? fallbackContent.performance) as SiteContent["performance"];
    const whyChoose = (byKey.get("whyChoose") ?? fallbackContent.whyChoose) as SiteContent["whyChoose"];
    const steps = (byKey.get("steps") ?? fallbackContent.steps) as SiteContent["steps"];

    return {
      site,
      hero: {
        ...fallbackContent.hero,
        ...hero,
        media: hero.media ?? fallbackContent.hero.media,
        highlights: resolveHighlightIcons((hero.highlights ?? fallbackContent.hero.highlights) as SiteContent["hero"]["highlights"]),
      },
      navigation,
      stats,
      plans,
      performance,
      whyChoose: resolveHighlightIcons(whyChoose),
      steps,
    };
  } catch {
    return fallbackContent;
  }
}

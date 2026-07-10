"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Menu,
  Loader2,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AdminSectionKey } from "@/lib/admin";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type ContentRow = {
  section_key: AdminSectionKey;
  payload: unknown;
};

type ApplicationRow = {
  id: number;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  broker: string | null;
  account_size: string;
  message: string;
  created_at: string;
};

type DraftState = Partial<Record<AdminSectionKey, unknown>>;

type MediaDraft = {
  url: string;
  alt: string;
};

type HighlightDraft = {
  title: string;
  text: string;
  iconName: string;
};

type NavigationDraft = {
  label: string;
  href: string;
};

type SiteDraft = {
  brandName: string;
  siteName: string;
  phone: string;
  tagline: string;
  footerBlurb: string;
  disclaimer: string;
  copyrightName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  location: string;
  logo: MediaDraft;
};

type HeroDraft = {
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  rating?: string;
  media: MediaDraft;
  highlights?: HighlightDraft[];
};

type StatDraft = {
  value: string;
  label: string;
};

type PlanDraft = {
  name: string;
  deposit: string;
  features: string[];
  featured?: boolean;
};

type PerformanceDraft = {
  month: string;
  return: string;
};

type StepDraft = {
  number: string;
  title: string;
  text: string;
};

type JourneyMilestoneDraft = {
  label: string;
  title: string;
  text: string;
};

type TeamDraft = {
  name: string;
  role: string;
  linkedinUrl: string;
  image: MediaDraft;
};

type ServiceDraft = {
  title: string;
  description: string;
  iconName: string;
  bullets: string[];
  image: MediaDraft;
};

type PackageTierDraft = {
  name: string;
  minimumDeposit: string;
  targetMonthlyRoi: string;
  profitSplit: string;
  riskProfile: string;
  featured: boolean;
  benefits: string[];
  image: MediaDraft;
};

type ContactChannelDraft = {
  label: string;
  value: string;
  iconName: string;
};

type FaqDraft = {
  question: string;
  answer: string;
  priority: number;
};

type SectionCardProps = {
  sectionKey: AdminSectionKey;
  title: string;
  description: string;
  saving: string | null;
  onSave: (sectionKey: AdminSectionKey) => void;
  footer?: ReactNode;
  children: ReactNode;
};

const iconOptions = [
  { label: "Shield Check", value: "shield-check" },
  { label: "Line Chart", value: "line-chart" },
  { label: "Target", value: "target" },
  { label: "Users", value: "users" },
  { label: "Briefcase", value: "briefcase-business" },
  { label: "Badge Percent", value: "badge-percent" },
  { label: "Dollar Circle", value: "circle-dollar-sign" },
  { label: "Calendar", value: "calendar-clock" },
  { label: "Map Pin", value: "map-pin" },
  { label: "Phone", value: "phone" },
  { label: "Mail", value: "mail" },
  { label: "Globe", value: "globe" },
  { label: "Clipboard", value: "clipboard-list" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Star", value: "star" },
] as const;

const sectionGroups: Array<{ title: string; sections: AdminSectionKey[] }> = [
  { title: "Global Brand", sections: ["site", "navigation"] },
  { title: "Home Page", sections: ["hero", "stats", "plans", "performance", "whyChoose", "steps"] },
  { title: "About Page", sections: ["about_hero", "about_journey", "about_team"] },
  { title: "Services Page", sections: ["services_hero", "services_list"] },
  { title: "Packages Page", sections: ["packages_hero", "packages_tiers"] },
  { title: "Contact Page", sections: ["contact_hero", "contact_channels", "contact_budgets"] },
  { title: "FAQ Page", sections: ["faq_hero", "faq_items"] },
];

const quickJumpTargets = sectionGroups.map((group) => ({
  label: group.title,
  id: group.title.toLowerCase().replace(/\s+/g, "-"),
}));

const defaultAdminGroup = sectionGroups.find((group) => group.title === "Home Page")?.title ?? sectionGroups[0]?.title ?? "Overview";

const sectionLabels: Record<AdminSectionKey, string> = {
  site: "Brand settings",
  navigation: "Navigation",
  hero: "Homepage hero",
  stats: "Homepage stats",
  plans: "Homepage plans",
  performance: "Homepage performance",
  whyChoose: "Homepage value points",
  steps: "Homepage steps",
  about_hero: "About hero",
  about_journey: "About journey",
  about_team: "About team",
  services_hero: "Services hero",
  services_list: "Services list",
  packages_hero: "Packages hero",
  packages_tiers: "Package tiers",
  contact_hero: "Contact hero",
  contact_channels: "Contact channels",
  contact_budgets: "Budget options",
  faq_hero: "FAQ hero",
  faq_items: "FAQ items",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function emptyMedia(): MediaDraft {
  return { url: "", alt: "" };
}

function emptyHighlight(): HighlightDraft {
  return { title: "", text: "", iconName: "shield-check" };
}

function normalizeMedia(value: unknown): MediaDraft {
  if (!isRecord(value)) {
    return emptyMedia();
  }

  return {
    url: asString(value.url),
    alt: asString(value.alt),
  };
}

function normalizeNavigationItem(value: unknown): NavigationDraft {
  if (!isRecord(value)) {
    return { label: "", href: "/" };
  }

  return {
    label: asString(value.label),
    href: asString(value.href, "/"),
  };
}

function normalizeSite(value: unknown): SiteDraft {
  if (!isRecord(value)) {
    return {
      brandName: "",
      siteName: "",
      phone: "",
      tagline: "",
      footerBlurb: "",
      disclaimer: "",
      copyrightName: "",
      whatsappNumber: "",
      whatsappDisplay: "",
      email: "",
      location: "",
      logo: emptyMedia(),
    };
  }

  return {
    brandName: asString(value.brandName, asString(value.siteName)),
    siteName: asString(value.siteName),
    phone: asString(value.phone, asString(value.whatsappDisplay)),
    tagline: asString(value.tagline),
    footerBlurb: asString(value.footerBlurb),
    disclaimer: asString(value.disclaimer),
    copyrightName: asString(value.copyrightName),
    whatsappNumber: asString(value.whatsappNumber),
    whatsappDisplay: asString(value.whatsappDisplay),
    email: asString(value.email),
    location: asString(value.location),
    logo: normalizeMedia(value.logo),
  };
}

function normalizeHero(value: unknown): HeroDraft {
  if (!isRecord(value)) {
    return {
      eyebrow: "",
      title: "",
      description: "",
      ctaPrimary: "",
      ctaSecondary: "",
      rating: "",
      media: emptyMedia(),
      highlights: [emptyHighlight()],
    };
  }

  const highlights = Array.isArray(value.highlights)
    ? value.highlights.map((item) =>
        isRecord(item)
          ? {
              title: asString(item.title),
              text: asString(item.text),
              iconName: asString(item.iconName, "shield-check"),
            }
          : emptyHighlight()
      )
    : [emptyHighlight()];

  return {
    eyebrow: asString(value.eyebrow),
    title: asString(value.title),
    description: asString(value.description),
    ctaPrimary: asString(value.ctaPrimary),
    ctaSecondary: asString(value.ctaSecondary),
    rating: asString(value.rating),
    media: normalizeMedia(value.media),
    highlights,
  };
}

function normalizeStats(value: unknown): StatDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ value: "", label: "" }];
  }

  return value.map((item) =>
    isRecord(item) ? { value: asString(item.value), label: asString(item.label) } : { value: "", label: "" }
  );
}

function normalizePlans(value: unknown): PlanDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ name: "", deposit: "", features: [""], featured: false }];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          name: asString(item.name),
          deposit: asString(item.deposit),
          features: Array.isArray(item.features) && item.features.length ? item.features.map((feature) => asString(feature)) : [""],
          featured: asBoolean(item.featured),
        }
      : { name: "", deposit: "", features: [""], featured: false }
  );
}

function normalizePerformance(value: unknown): PerformanceDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ month: "", return: "" }];
  }

  return value.map((item) =>
    isRecord(item) ? { month: asString(item.month), return: asString(item.return) } : { month: "", return: "" }
  );
}

function normalizeHighlights(value: unknown): HighlightDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [emptyHighlight()];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          title: asString(item.title),
          text: asString(item.text),
          iconName: asString(item.iconName, "shield-check"),
        }
      : emptyHighlight()
  );
}

function normalizeSteps(value: unknown): StepDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ number: "1", title: "", text: "" }];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          number: asString(item.number, "1"),
          title: asString(item.title),
          text: asString(item.text),
        }
      : { number: "1", title: "", text: "" }
  );
}

function normalizeJourney(value: unknown): { startYear: number; milestones: JourneyMilestoneDraft[] } {
  if (!isRecord(value)) {
    return { startYear: new Date().getFullYear() - 6, milestones: [{ label: "", title: "", text: "" }] };
  }

  const milestones = Array.isArray(value.milestones) && value.milestones.length
    ? value.milestones.map((item) =>
        isRecord(item)
          ? {
              label: asString(item.label),
              title: asString(item.title),
              text: asString(item.text),
            }
          : { label: "", title: "", text: "" }
      )
    : [{ label: "", title: "", text: "" }];

  return {
    startYear: asNumber(value.startYear, new Date().getFullYear() - 6),
    milestones,
  };
}

function normalizeTeam(value: unknown): TeamDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ name: "", role: "", linkedinUrl: "", image: emptyMedia() }];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          name: asString(item.name),
          role: asString(item.role),
          linkedinUrl: asString(item.linkedinUrl),
          image: normalizeMedia(item.image),
        }
      : { name: "", role: "", linkedinUrl: "", image: emptyMedia() }
  );
}

function normalizeServices(value: unknown): ServiceDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ title: "", description: "", iconName: "briefcase-business", bullets: [""], image: emptyMedia() }];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          title: asString(item.title),
          description: asString(item.description),
          iconName: asString(item.iconName, "briefcase-business"),
          bullets: Array.isArray(item.bullets) && item.bullets.length ? item.bullets.map((bullet) => asString(bullet)) : [""],
          image: normalizeMedia(item.image),
        }
      : { title: "", description: "", iconName: "briefcase-business", bullets: [""], image: emptyMedia() }
  );
}

function normalizeTiers(value: unknown): PackageTierDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [
      {
        name: "",
        minimumDeposit: "",
        targetMonthlyRoi: "",
        profitSplit: "",
        riskProfile: "",
        featured: false,
        benefits: [""],
        image: emptyMedia(),
      },
    ];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          name: asString(item.name),
          minimumDeposit: asString(item.minimumDeposit),
          targetMonthlyRoi: asString(item.targetMonthlyRoi),
          profitSplit: asString(item.profitSplit),
          riskProfile: asString(item.riskProfile),
          featured: asBoolean(item.featured),
          benefits: Array.isArray(item.benefits) && item.benefits.length ? item.benefits.map((benefit) => asString(benefit)) : [""],
          image: normalizeMedia(item.image),
        }
      : {
          name: "",
          minimumDeposit: "",
          targetMonthlyRoi: "",
          profitSplit: "",
          riskProfile: "",
          featured: false,
          benefits: [""],
          image: emptyMedia(),
        }
  );
}

function normalizeChannels(value: unknown): ContactChannelDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ label: "", value: "", iconName: "map-pin" }];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          label: asString(item.label),
          value: asString(item.value),
          iconName: asString(item.iconName, "map-pin"),
        }
      : { label: "", value: "", iconName: "map-pin" }
  );
}

function normalizeBudgets(value: unknown): string[] {
  if (!Array.isArray(value) || !value.length) {
    return [""];
  }

  return value.map((item) => asString(item));
}

function normalizeFaq(value: unknown): FaqDraft[] {
  if (!Array.isArray(value) || !value.length) {
    return [{ question: "", answer: "", priority: 1 }];
  }

  return value.map((item) =>
    isRecord(item)
      ? {
          question: asString(item.question),
          answer: asString(item.answer),
          priority: asNumber(item.priority, 1),
        }
      : { question: "", answer: "", priority: 1 }
  );
}

function buildDrafts(content: ContentRow[]): DraftState {
  const map = new Map(content.map((row) => [row.section_key, row.payload]));

  return {
    site: normalizeSite(map.get("site")),
    navigation: Array.isArray(map.get("navigation"))
      ? (map.get("navigation") as unknown[]).map(normalizeNavigationItem)
      : [{ label: "", href: "/" }],
    hero: normalizeHero(map.get("hero")),
    stats: normalizeStats(map.get("stats")),
    plans: normalizePlans(map.get("plans")),
    performance: normalizePerformance(map.get("performance")),
    whyChoose: normalizeHighlights(map.get("whyChoose")),
    steps: normalizeSteps(map.get("steps")),
    about_hero: normalizeHero(map.get("about_hero")),
    about_journey: normalizeJourney(map.get("about_journey")),
    about_team: normalizeTeam(map.get("about_team")),
    services_hero: normalizeHero(map.get("services_hero")),
    services_list: normalizeServices(map.get("services_list")),
    packages_hero: normalizeHero(map.get("packages_hero")),
    packages_tiers: normalizeTiers(map.get("packages_tiers")),
    contact_hero: normalizeHero(map.get("contact_hero")),
    contact_channels: normalizeChannels(map.get("contact_channels")),
    contact_budgets: normalizeBudgets(map.get("contact_budgets")),
    faq_hero: normalizeHero(map.get("faq_hero")),
    faq_items: normalizeFaq(map.get("faq_items")),
  };
}

function SectionCard({ sectionKey, title, description, saving, onSave, footer, children }: SectionCardProps) {
  return (
    <article className="admin-section-card">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">{sectionKey}</p>
          <h2>{title}</h2>
          <p className="admin-copy">{description}</p>
        </div>
        <button className="secondary-button compact" type="button" onClick={() => onSave(sectionKey)} disabled={saving === sectionKey}>
          {saving === sectionKey ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
          <span>{saving === sectionKey ? "Saving" : "Save"}</span>
        </button>
      </div>
      {children}
      {footer ? <div className="section-card-footer">{footer}</div> : null}
    </article>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      <textarea value={value} placeholder={placeholder} rows={rows} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="cms-toggle">
      <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function MediaEditor({
  supabaseUrl,
  supabaseAnonKey,
  label,
  folder,
  value,
  onChange,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  label: string;
  folder: string;
  value: MediaDraft;
  onChange: (next: MediaDraft) => void;
}) {
  return (
    <div className="cms-media-editor">
      <ImageUploadField
        supabaseUrl={supabaseUrl}
        supabaseAnonKey={supabaseAnonKey}
        folder={folder}
        label={label}
        value={value.url}
        onChange={(nextUrl) => onChange({ ...value, url: nextUrl })}
      />
      <TextField
        label={`${label} alt text`}
        value={value.alt}
        onChange={(nextAlt) => onChange({ ...value, alt: nextAlt })}
        placeholder="Describe the image for accessibility"
      />
    </div>
  );
}

function RepeatControls({
  index,
  total,
  onAdd,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  index: number;
  total: number;
  onAdd: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="repeat-controls">
      <button type="button" className="ghost-button" onClick={onAdd}>
        <Plus size={14} />
        Add
      </button>
      <button type="button" className="ghost-button" onClick={onMoveUp} disabled={index === 0}>
        <ArrowUp size={14} />
      </button>
      <button type="button" className="ghost-button" onClick={onMoveDown} disabled={index === total - 1}>
        <ArrowDown size={14} />
      </button>
      <button type="button" className="ghost-button danger" onClick={onRemove} disabled={total <= 1}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return <h3 className="section-divider">{title}</h3>;
}

function scrollToAdminTarget(id: string, block: ScrollLogicalPosition = "start") {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block });
}

function buildMailtoHref(email: string) {
  return `mailto:${email}`;
}

function buildTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function OverviewCard({
  applications,
  showAllEmails,
  onToggleAllEmails,
}: {
  applications: ApplicationRow[];
  showAllEmails: boolean;
  onToggleAllEmails: () => void;
}) {
  const latestLead = applications[0];

  return (
    <article className="admin-card admin-overview-card" id="overview">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Forms submitted</h2>
          <p className="admin-copy">This is the first thing the admin sees after signing in.</p>
        </div>
        <ShieldCheck size={18} />
      </div>

      <div className="overview-stats">
        <div className="overview-stat">
          <span>Total submissions</span>
          <strong>{applications.length}</strong>
        </div>
        <div className="overview-stat">
          <span>Latest lead</span>
          <strong>{latestLead ? latestLead.full_name : "None yet"}</strong>
        </div>
      </div>

      <div className="application-list overview-list">
        {applications.length ? (
          applications.slice(0, 1).map((item) => (
            <div key={item.id} className="application-item">
              <div className="application-top">
                <strong>{item.full_name}</strong>
                <span>{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <a className="application-link" href={buildMailtoHref(item.email)}>
                {item.email}
              </a>
              <a className="application-link" href={buildTelHref(item.whatsapp_number)}>
                {item.whatsapp_number}
              </a>
              <p>{item.country}</p>
              <p>{item.account_size}</p>
              {item.broker ? <p>Broker: {item.broker}</p> : null}
              <p className="application-message">{item.message}</p>
            </div>
          ))
        ) : (
          <p className="empty-state">No applications yet.</p>
        )}
      </div>

      <div className="overview-actions">
        <button type="button" className="ghost-button" onClick={onToggleAllEmails} disabled={!applications.length}>
          {showAllEmails ? "Hide all emails" : "View all emails"}
        </button>
      </div>
    </article>
  );
}

function EmailListCard({ applications }: { applications: ApplicationRow[] }) {
  return (
    <article className="admin-card admin-emails-card" id="all-emails">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">Email list</p>
          <h2>All submitted emails</h2>
          <p className="admin-copy">Click any email to open a new message in your mail app.</p>
        </div>
        <ArrowRight size={18} />
      </div>

      <div className="email-list">
        {applications.length ? (
          applications.map((item) => (
            <div key={item.id} className="email-item">
              <div>
                <strong>{item.full_name}</strong>
                <span>{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <a className="application-link" href={buildMailtoHref(item.email)}>
                {item.email}
              </a>
            </div>
          ))
        ) : (
          <p className="empty-state">No emails to show yet.</p>
        )}
      </div>
    </article>
  );
}

function SectionSwitcher({
  sections,
  activeSectionKey,
  onSelectSection,
}: {
  sections: AdminSectionKey[];
  activeSectionKey: AdminSectionKey | null;
  onSelectSection: (sectionKey: AdminSectionKey) => void;
}) {
  return (
    <div className="section-switcher" aria-label="Page sections">
      {sections.map((sectionKey) => (
        <button
          key={sectionKey}
          type="button"
          className={`section-switcher-button ${activeSectionKey === sectionKey ? "active" : ""}`}
          onClick={() => onSelectSection(sectionKey)}
        >
          {sectionLabels[sectionKey]}
        </button>
      ))}
    </div>
  );
}

function AdminSidebar({
  applicationsCount,
  activeGroup,
  isOpen,
  onClose,
  onViewOverview,
  onSelectGroup,
}: {
  applicationsCount: number;
  activeGroup: string;
  isOpen: boolean;
  onClose: () => void;
  onViewOverview: () => void;
  onSelectGroup: (groupTitle: string) => void;
}) {
  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-backdrop ${isOpen ? "open" : ""}`}
        aria-label="Close admin panel"
        onClick={onClose}
      />
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sticky-panel admin-sidebar-panel">
          <div className="admin-sidebar-head">
            <div>
              <p className="eyebrow">Admin Panel</p>
              <h3>Forms and pages</h3>
            </div>
            <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Close panel">
              <X size={18} />
            </button>
          </div>

          <button type="button" className="sidebar-forms-link" onClick={onViewOverview}>
            <span>Forms received</span>
            <strong>{applicationsCount}</strong>
          </button>

          <div className="sidebar-links">
            {sectionGroups.map((group) => (
              <button
                key={group.title}
                type="button"
                className={`sidebar-group-link ${activeGroup === group.title ? "active" : ""}`}
                onClick={() => onSelectGroup(group.title)}
              >
                <span>{group.title}</span>
                <small>{group.sections.length} sections</small>
              </button>
            ))}
          </div>

          <p className="sidebar-hint">Choose a page to edit it in the main panel.</p>
        </div>
      </aside>
    </>
  );
}

export function AdminDashboard({
  supabaseUrl,
  supabaseAnonKey,
}: {
  supabaseUrl: string;
  supabaseAnonKey: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey), [supabaseUrl, supabaseAnonKey]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [content, setContent] = useState<ContentRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [drafts, setDrafts] = useState<DraftState>({});
  const [activeGroup, setActiveGroup] = useState(defaultAdminGroup);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState<AdminSectionKey | null>(null);
  const [showAllEmails, setShowAllEmails] = useState(false);
  const activeGroupConfig = useMemo(() => sectionGroups.find((group) => group.title === activeGroup) ?? null, [activeGroup]);
  const sortedApplications = useMemo(
    () => [...applications].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()),
    [applications]
  );

  async function loadData() {
    setLoading(true);
    setError("");

    if (!supabase) {
      setError("Public Supabase environment variables are missing.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }

    const response = await fetch("/api/admin/content", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      setError("Unable to load admin data.");
      setLoading(false);
      return;
    }

    const payload = (await response.json()) as {
      content: ContentRow[];
      applications: ApplicationRow[];
    };

    setContent(payload.content);
    setApplications(payload.applications);
    setDrafts(buildDrafts(payload.content));
    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!sectionGroups.some((group) => group.title === activeGroup)) {
      setActiveGroup(defaultAdminGroup);
    }
  }, [activeGroup]);

  useEffect(() => {
    if (!activeGroupConfig) {
      setActiveSectionKey(null);
      return;
    }

    setActiveSectionKey((current) => (current && activeGroupConfig.sections.includes(current) ? current : activeGroupConfig.sections[0] ?? null));
  }, [activeGroupConfig]);

  function updateSection<T>(sectionKey: AdminSectionKey, updater: (current: T) => T) {
    setDrafts((current) => {
      const nextValue = updater((current[sectionKey] ?? {}) as T);
      return {
        ...current,
        [sectionKey]: nextValue,
      };
    });
  }

  function selectGroup(groupTitle: string) {
    setActiveGroup(groupTitle);
    const nextGroup = sectionGroups.find((group) => group.title === groupTitle);
    setActiveSectionKey(nextGroup?.sections[0] ?? null);
    setPanelOpen(false);
  }

  function viewOverview() {
    setPanelOpen(false);
    window.setTimeout(() => scrollToAdminTarget("overview"), 0);
  }

  function toggleAllEmails() {
    setShowAllEmails((current) => {
      const next = !current;

      if (next) {
        window.setTimeout(() => scrollToAdminTarget("all-emails"), 0);
      }

      return next;
    });
  }

  async function saveSection(sectionKey: AdminSectionKey) {
    setSaving(sectionKey);
    setError("");

    try {
      if (!supabase) {
        throw new Error("Supabase client missing");
      }

      const payload = drafts[sectionKey];

      if (!payload) {
        throw new Error("No content found for this section.");
      }

      const payloadToSave =
        sectionKey === "site" && isRecord(payload)
          ? {
              ...payload,
              brandName: asString(payload.brandName, asString(payload.siteName)),
              siteName: asString(payload.siteName, asString(payload.brandName)),
            }
          : payload;

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sectionKey, payload: payloadToSave }),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Save failed");
      }

      await loadData();
    } catch (saveError) {
      const detail = saveError instanceof Error ? saveError.message : "Unknown error";
      setError(`Could not save ${sectionKey}. ${detail}`);
    } finally {
      setSaving(null);
    }
  }

  async function signOut() {
    if (!supabase) {
      router.replace("/admin/login");
      return;
    }

    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function renderSection(sectionKey: AdminSectionKey) {
    const payload = drafts[sectionKey];

    switch (sectionKey) {
      case "site": {
        const site = (payload ?? normalizeSite(undefined)) as SiteDraft;

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Brand settings"
            description="Logo, contact details, footer copy, and legal disclaimer."
            saving={saving}
            onSave={saveSection}
          >
            <div className="cms-grid two-col">
              <TextField
                label="Site name"
                value={site.siteName}
                onChange={(next) =>
                  updateSection<SiteDraft>(sectionKey, (current) => ({
                    ...current,
                    siteName: next,
                    brandName: next,
                  }))
                }
              />
              <TextField
                label="Brand name"
                value={site.brandName}
                onChange={(next) =>
                  updateSection<SiteDraft>(sectionKey, (current) => ({
                    ...current,
                    siteName: next,
                    brandName: next,
                  }))
                }
              />
              <TextField label="Phone" value={site.phone} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, phone: next }))} />
              <TextField label="Tagline" value={site.tagline} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, tagline: next }))} />
              <TextField label="Copyright name" value={site.copyrightName} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, copyrightName: next }))} />
              <TextField label="WhatsApp number" value={site.whatsappNumber} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, whatsappNumber: next }))} />
              <TextField label="WhatsApp display" value={site.whatsappDisplay} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, whatsappDisplay: next }))} />
              <TextField label="Email" value={site.email} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, email: next }))} />
              <TextField label="Location" value={site.location} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, location: next }))} />
            </div>
            <TextAreaField label="Footer blurb" value={site.footerBlurb} rows={3} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, footerBlurb: next }))} />
            <TextAreaField label="Disclaimer" value={site.disclaimer} rows={5} onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, disclaimer: next }))} />
            <MediaEditor
              supabaseUrl={supabaseUrl}
              supabaseAnonKey={supabaseAnonKey}
              folder="site/logo"
              label="Site logo"
              value={site.logo}
              onChange={(next) => updateSection<SiteDraft>(sectionKey, (current) => ({ ...current, logo: next }))}
            />
          </SectionCard>
        );
      }

      case "navigation": {
        const navigation = (payload ?? [{ label: "", href: "/" }]) as NavigationDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Navigation links"
            description="Edit the top navigation items that appear in the header and footer."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {navigation.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <TextField
                    label="Label"
                    value={item.label}
                    onChange={(next) =>
                      updateSection<NavigationDraft[]>(sectionKey, (current) =>
                        current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: next } : entry))
                      )
                    }
                  />
                  <TextField
                    label="Href"
                    value={item.href}
                    onChange={(next) =>
                      updateSection<NavigationDraft[]>(sectionKey, (current) =>
                        current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, href: next } : entry))
                      )
                    }
                  />
                  <RepeatControls
                    index={index}
                    total={navigation.length}
                    onAdd={() =>
                      updateSection<NavigationDraft[]>(sectionKey, (current) => [
                        ...current.slice(0, index + 1),
                        { label: "", href: "/" },
                        ...current.slice(index + 1),
                      ])
                    }
                    onRemove={() =>
                      updateSection<NavigationDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))
                    }
                    onMoveUp={() =>
                      updateSection<NavigationDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<NavigationDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "hero":
      case "about_hero":
      case "services_hero":
      case "packages_hero":
      case "contact_hero":
      case "faq_hero": {
        const hero = (payload ?? normalizeHero(undefined)) as HeroDraft;
        const folder = sectionKey.replace("_hero", "/hero");

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Hero banner"
            description="Edit the heading, CTA labels, and hero media for this page."
            saving={saving}
            onSave={saveSection}
          >
            <div className="cms-grid two-col">
              <TextField label="Eyebrow" value={hero.eyebrow} onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, eyebrow: next }))} />
              <TextField label="Primary CTA" value={hero.ctaPrimary} onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, ctaPrimary: next }))} />
              <TextField label="Title" value={hero.title} onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, title: next }))} />
              <TextField label="Secondary CTA" value={hero.ctaSecondary} onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, ctaSecondary: next }))} />
            </div>
            <TextAreaField label="Description" value={hero.description} rows={4} onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, description: next }))} />
            <div className="cms-grid two-col">
              {sectionKey === "hero" ? (
                <TextField label="Rating text" value={hero.rating ?? ""} onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, rating: next }))} />
              ) : null}
              <MediaEditor
                supabaseUrl={supabaseUrl}
                supabaseAnonKey={supabaseAnonKey}
                folder={folder}
                label="Hero image"
                value={hero.media}
                onChange={(next) => updateSection<HeroDraft>(sectionKey, (current) => ({ ...current, media: next }))}
              />
            </div>
            {sectionKey === "hero" ? (
              <div className="repeat-stack">
                <SectionDivider title="Highlights" />
                {(hero.highlights ?? [emptyHighlight()]).map((item, index) => (
                  <div key={`${sectionKey}-highlight-${index}`} className="repeat-item">
                    <div className="cms-grid three-col">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(next) =>
                          updateSection<HeroDraft>(sectionKey, (current) => ({
                            ...current,
                            highlights: (current.highlights ?? [emptyHighlight()]).map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, title: next } : entry
                            ),
                          }))
                        }
                      />
                      <TextField
                        label="Text"
                        value={item.text}
                        onChange={(next) =>
                          updateSection<HeroDraft>(sectionKey, (current) => ({
                            ...current,
                            highlights: (current.highlights ?? [emptyHighlight()]).map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, text: next } : entry
                            ),
                          }))
                        }
                      />
                      <SelectField
                        label="Icon"
                        value={item.iconName}
                        onChange={(next) =>
                          updateSection<HeroDraft>(sectionKey, (current) => ({
                            ...current,
                            highlights: (current.highlights ?? [emptyHighlight()]).map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, iconName: next } : entry
                            ),
                          }))
                        }
                        options={iconOptions}
                      />
                    </div>
                    <RepeatControls
                      index={index}
                      total={(hero.highlights ?? []).length}
                      onAdd={() =>
                        updateSection<HeroDraft>(sectionKey, (current) => ({
                          ...current,
                          highlights: [
                            ...(current.highlights ?? [emptyHighlight()]).slice(0, index + 1),
                            emptyHighlight(),
                            ...(current.highlights ?? [emptyHighlight()]).slice(index + 1),
                          ],
                        }))
                      }
                      onRemove={() =>
                        updateSection<HeroDraft>(sectionKey, (current) => ({
                          ...current,
                          highlights: (current.highlights ?? [emptyHighlight()]).filter((_, entryIndex) => entryIndex !== index),
                        }))
                      }
                      onMoveUp={() =>
                        updateSection<HeroDraft>(sectionKey, (current) => {
                          const next = [...(current.highlights ?? [emptyHighlight()])];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          return { ...current, highlights: next };
                        })
                      }
                      onMoveDown={() =>
                        updateSection<HeroDraft>(sectionKey, (current) => {
                          const next = [...(current.highlights ?? [emptyHighlight()])];
                          [next[index], next[index + 1]] = [next[index + 1], next[index]];
                          return { ...current, highlights: next };
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </SectionCard>
        );
      }

      case "stats": {
        const stats = (payload ?? [{ value: "", label: "" }]) as StatDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Homepage stats"
            description="Edit the numbers shown beneath the hero section."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {stats.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid two-col">
                    <TextField
                      label="Value"
                      value={item.value}
                      onChange={(next) =>
                        updateSection<StatDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, value: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Label"
                      value={item.label}
                      onChange={(next) =>
                        updateSection<StatDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: next } : entry))
                        )
                      }
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={stats.length}
                    onAdd={() => updateSection<StatDraft[]>(sectionKey, (current) => [...current.slice(0, index + 1), { value: "", label: "" }, ...current.slice(index + 1)])}
                    onRemove={() => updateSection<StatDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<StatDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<StatDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "plans": {
        const plans = (payload ?? normalizePlans(undefined)) as PlanDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Homepage plans"
            description="Manage the cards on the landing page pricing area."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {plans.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid two-col">
                    <TextField
                      label="Plan name"
                      value={item.name}
                      onChange={(next) =>
                        updateSection<PlanDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, name: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Minimum deposit"
                      value={item.deposit}
                      onChange={(next) =>
                        updateSection<PlanDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, deposit: next } : entry))
                        )
                      }
                    />
                  </div>
                  <ToggleField
                    label="Featured"
                    value={Boolean(item.featured)}
                    onChange={(next) =>
                      updateSection<PlanDraft[]>(sectionKey, (current) =>
                        current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, featured: next } : entry))
                      )
                    }
                  />
                  <div className="repeat-list">
                    <SectionDivider title="Features" />
                    {item.features.map((feature, featureIndex) => (
                      <TextField
                        key={`${sectionKey}-${index}-feature-${featureIndex}`}
                        label={`Feature ${featureIndex + 1}`}
                        value={feature}
                        onChange={(next) =>
                          updateSection<PlanDraft[]>(sectionKey, (current) =>
                            current.map((entry, entryIndex) =>
                              entryIndex === index
                                ? {
                                    ...entry,
                                    features: entry.features.map((line, lineIndex) => (lineIndex === featureIndex ? next : line)),
                                  }
                                : entry
                            )
                          )
                        }
                      />
                    ))}
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() =>
                        updateSection<PlanDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, features: [...entry.features, ""] } : entry
                          )
                        )
                      }
                    >
                      <Plus size={14} />
                      Add feature
                    </button>
                  </div>
                  <RepeatControls
                    index={index}
                    total={plans.length}
                    onAdd={() =>
                      updateSection<PlanDraft[]>(sectionKey, (current) => [
                        ...current.slice(0, index + 1),
                        { name: "", deposit: "", features: [""], featured: false },
                        ...current.slice(index + 1),
                      ])
                    }
                    onRemove={() => updateSection<PlanDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<PlanDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<PlanDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "performance": {
        const performance = (payload ?? [{ month: "", return: "" }]) as PerformanceDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Homepage performance"
            description="Update the monthly performance strip shown on the home page."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {performance.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid two-col">
                    <TextField
                      label="Return"
                      value={item.return}
                      onChange={(next) =>
                        updateSection<PerformanceDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, return: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Month"
                      value={item.month}
                      onChange={(next) =>
                        updateSection<PerformanceDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, month: next } : entry))
                        )
                      }
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={performance.length}
                    onAdd={() => updateSection<PerformanceDraft[]>(sectionKey, (current) => [...current.slice(0, index + 1), { month: "", return: "" }, ...current.slice(index + 1)])}
                    onRemove={() => updateSection<PerformanceDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<PerformanceDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<PerformanceDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "whyChoose": {
        const whyChoose = (payload ?? [emptyHighlight()]) as HighlightDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Homepage value points"
            description="The persuasive points shown in the left info card on the home page."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {whyChoose.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Title"
                      value={item.title}
                      onChange={(next) =>
                        updateSection<HighlightDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Text"
                      value={item.text}
                      onChange={(next) =>
                        updateSection<HighlightDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text: next } : entry))
                        )
                      }
                    />
                    <SelectField
                      label="Icon"
                      value={item.iconName}
                      onChange={(next) =>
                        updateSection<HighlightDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, iconName: next } : entry))
                        )
                      }
                      options={iconOptions}
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={whyChoose.length}
                    onAdd={() => updateSection<HighlightDraft[]>(sectionKey, (current) => [...current.slice(0, index + 1), emptyHighlight(), ...current.slice(index + 1)])}
                    onRemove={() => updateSection<HighlightDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<HighlightDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<HighlightDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "steps": {
        const steps = (payload ?? [{ number: "1", title: "", text: "" }]) as StepDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Homepage steps"
            description="The onboarding/process cards shown in the middle of the home page."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {steps.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Number"
                      value={item.number}
                      onChange={(next) =>
                        updateSection<StepDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, number: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Title"
                      value={item.title}
                      onChange={(next) =>
                        updateSection<StepDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: next } : entry))
                        )
                      }
                    />
                    <TextAreaField
                      label="Text"
                      value={item.text}
                      rows={3}
                      onChange={(next) =>
                        updateSection<StepDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text: next } : entry))
                        )
                      }
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={steps.length}
                    onAdd={() =>
                      updateSection<StepDraft[]>(sectionKey, (current) => [
                        ...current.slice(0, index + 1),
                        { number: String(index + 2), title: "", text: "" },
                        ...current.slice(index + 1),
                      ])
                    }
                    onRemove={() => updateSection<StepDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<StepDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<StepDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "about_journey": {
        const journey = (payload ?? normalizeJourney(undefined)) as { startYear: number; milestones: JourneyMilestoneDraft[] };

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Journey timeline"
            description="Edit the start year and the milestone cards used on the About page."
            saving={saving}
            onSave={saveSection}
          >
            <div className="cms-grid two-col">
              <NumberField
                label="Start year"
                value={journey.startYear}
                onChange={(next) => updateSection<typeof journey>(sectionKey, (current) => ({ ...current, startYear: next }))}
              />
            </div>
            <div className="repeat-stack">
              {journey.milestones.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Label"
                      value={item.label}
                      onChange={(next) =>
                        updateSection<typeof journey>(sectionKey, (current) => ({
                          ...current,
                          milestones: current.milestones.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: next } : entry)),
                        }))
                      }
                    />
                    <TextField
                      label="Title"
                      value={item.title}
                      onChange={(next) =>
                        updateSection<typeof journey>(sectionKey, (current) => ({
                          ...current,
                          milestones: current.milestones.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: next } : entry)),
                        }))
                      }
                    />
                    <TextAreaField
                      label="Text"
                      value={item.text}
                      rows={3}
                      onChange={(next) =>
                        updateSection<typeof journey>(sectionKey, (current) => ({
                          ...current,
                          milestones: current.milestones.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text: next } : entry)),
                        }))
                      }
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={journey.milestones.length}
                    onAdd={() =>
                      updateSection<typeof journey>(sectionKey, (current) => ({
                        ...current,
                        milestones: [...current.milestones.slice(0, index + 1), { label: "", title: "", text: "" }, ...current.milestones.slice(index + 1)],
                      }))
                    }
                    onRemove={() =>
                      updateSection<typeof journey>(sectionKey, (current) => ({
                        ...current,
                        milestones: current.milestones.filter((_, entryIndex) => entryIndex !== index),
                      }))
                    }
                    onMoveUp={() =>
                      updateSection<typeof journey>(sectionKey, (current) => {
                        const next = [...current.milestones];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return { ...current, milestones: next };
                      })
                    }
                    onMoveDown={() =>
                      updateSection<typeof journey>(sectionKey, (current) => {
                        const next = [...current.milestones];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return { ...current, milestones: next };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "about_team": {
        const team = (payload ?? [{ name: "", role: "", linkedinUrl: "", image: emptyMedia() }]) as TeamDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Leadership grid"
            description="Manage team profiles and their uploaded images."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {team.map((member, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid two-col">
                    <TextField
                      label="Name"
                      value={member.name}
                      onChange={(next) =>
                        updateSection<TeamDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, name: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Role"
                      value={member.role}
                      onChange={(next) =>
                        updateSection<TeamDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, role: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="LinkedIn URL"
                      value={member.linkedinUrl}
                      onChange={(next) =>
                        updateSection<TeamDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, linkedinUrl: next } : entry))
                        )
                      }
                    />
                  </div>
                  <MediaEditor
                    supabaseUrl={supabaseUrl}
                    supabaseAnonKey={supabaseAnonKey}
                    folder="about/team"
                    label="Profile image"
                    value={member.image}
                    onChange={(next) =>
                      updateSection<TeamDraft[]>(sectionKey, (current) =>
                        current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, image: next } : entry))
                      )
                    }
                  />
                  <RepeatControls
                    index={index}
                    total={team.length}
                    onAdd={() => updateSection<TeamDraft[]>(sectionKey, (current) => [...current.slice(0, index + 1), { name: "", role: "", linkedinUrl: "", image: emptyMedia() }, ...current.slice(index + 1)])}
                    onRemove={() => updateSection<TeamDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<TeamDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<TeamDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "services_list": {
        const services = (payload ?? [{ title: "", description: "", iconName: "briefcase-business", bullets: [""], image: emptyMedia() }]) as ServiceDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Services list"
            description="Database-driven service cards with icons, bullets, and optional images."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {services.map((service, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Title"
                      value={service.title}
                      onChange={(next) =>
                        updateSection<ServiceDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Description"
                      value={service.description}
                      onChange={(next) =>
                        updateSection<ServiceDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, description: next } : entry))
                        )
                      }
                    />
                    <SelectField
                      label="Icon"
                      value={service.iconName}
                      onChange={(next) =>
                        updateSection<ServiceDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, iconName: next } : entry))
                        )
                      }
                      options={iconOptions}
                    />
                  </div>
                  <MediaEditor
                    supabaseUrl={supabaseUrl}
                    supabaseAnonKey={supabaseAnonKey}
                    folder="services/list"
                    label="Service image"
                    value={service.image}
                    onChange={(next) =>
                      updateSection<ServiceDraft[]>(sectionKey, (current) =>
                        current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, image: next } : entry))
                      )
                    }
                  />
                  <div className="repeat-list">
                    <SectionDivider title="Bullet points" />
                    {service.bullets.map((bullet, bulletIndex) => (
                      <TextField
                        key={`${sectionKey}-${index}-bullet-${bulletIndex}`}
                        label={`Bullet ${bulletIndex + 1}`}
                        value={bullet}
                        onChange={(next) =>
                          updateSection<ServiceDraft[]>(sectionKey, (current) =>
                            current.map((entry, entryIndex) =>
                              entryIndex === index
                                ? { ...entry, bullets: entry.bullets.map((item, itemIndex) => (itemIndex === bulletIndex ? next : item)) }
                                : entry
                            )
                          )
                        }
                      />
                    ))}
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() =>
                        updateSection<ServiceDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, bullets: [...entry.bullets, ""] } : entry
                          )
                        )
                      }
                    >
                      <Plus size={14} />
                      Add bullet
                    </button>
                  </div>
                  <RepeatControls
                    index={index}
                    total={services.length}
                    onAdd={() =>
                      updateSection<ServiceDraft[]>(sectionKey, (current) => [
                        ...current.slice(0, index + 1),
                        { title: "", description: "", iconName: "briefcase-business", bullets: [""], image: emptyMedia() },
                        ...current.slice(index + 1),
                      ])
                    }
                    onRemove={() => updateSection<ServiceDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<ServiceDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<ServiceDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "packages_tiers": {
        const tiers = (payload ?? normalizeTiers(undefined)) as PackageTierDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Package tiers"
            description="Manage the pricing matrix, risk profile, and inquiry imagery."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {tiers.map((tier, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Name"
                      value={tier.name}
                      onChange={(next) =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, name: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Minimum deposit"
                      value={tier.minimumDeposit}
                      onChange={(next) =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, minimumDeposit: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Target monthly ROI"
                      value={tier.targetMonthlyRoi}
                      onChange={(next) =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, targetMonthlyRoi: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Profit split"
                      value={tier.profitSplit}
                      onChange={(next) =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, profitSplit: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Risk profile"
                      value={tier.riskProfile}
                      onChange={(next) =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, riskProfile: next } : entry))
                        )
                      }
                    />
                    <ToggleField
                      label="Featured"
                      value={tier.featured}
                      onChange={(next) =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, featured: next } : entry))
                        )
                      }
                    />
                  </div>
                  <MediaEditor
                    supabaseUrl={supabaseUrl}
                    supabaseAnonKey={supabaseAnonKey}
                    folder="packages/tiers"
                    label="Tier image"
                    value={tier.image}
                    onChange={(next) =>
                      updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                        current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, image: next } : entry))
                      )
                    }
                  />
                  <div className="repeat-list">
                    <SectionDivider title="Benefits" />
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <TextField
                        key={`${sectionKey}-${index}-benefit-${benefitIndex}`}
                        label={`Benefit ${benefitIndex + 1}`}
                        value={benefit}
                        onChange={(next) =>
                          updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                            current.map((entry, entryIndex) =>
                              entryIndex === index
                                ? {
                                    ...entry,
                                    benefits: entry.benefits.map((item, itemIndex) => (itemIndex === benefitIndex ? next : item)),
                                  }
                                : entry
                            )
                          )
                        }
                      />
                    ))}
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() =>
                        updateSection<PackageTierDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, benefits: [...entry.benefits, ""] } : entry
                          )
                        )
                      }
                    >
                      <Plus size={14} />
                      Add benefit
                    </button>
                  </div>
                  <RepeatControls
                    index={index}
                    total={tiers.length}
                    onAdd={() =>
                      updateSection<PackageTierDraft[]>(sectionKey, (current) => [
                        ...current.slice(0, index + 1),
                        {
                          name: "",
                          minimumDeposit: "",
                          targetMonthlyRoi: "",
                          profitSplit: "",
                          riskProfile: "",
                          featured: false,
                          benefits: [""],
                          image: emptyMedia(),
                        },
                        ...current.slice(index + 1),
                      ])
                    }
                    onRemove={() => updateSection<PackageTierDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<PackageTierDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<PackageTierDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "contact_channels": {
        const channels = (payload ?? [{ label: "", value: "", iconName: "map-pin" }]) as ContactChannelDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Contact channels"
            description="Edit office details, phone numbers, and email channels."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {channels.map((channel, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Label"
                      value={channel.label}
                      onChange={(next) =>
                        updateSection<ContactChannelDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: next } : entry))
                        )
                      }
                    />
                    <TextField
                      label="Value"
                      value={channel.value}
                      onChange={(next) =>
                        updateSection<ContactChannelDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, value: next } : entry))
                        )
                      }
                    />
                    <SelectField
                      label="Icon"
                      value={channel.iconName}
                      onChange={(next) =>
                        updateSection<ContactChannelDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, iconName: next } : entry))
                        )
                      }
                      options={iconOptions}
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={channels.length}
                    onAdd={() => updateSection<ContactChannelDraft[]>(sectionKey, (current) => [...current.slice(0, index + 1), { label: "", value: "", iconName: "map-pin" }, ...current.slice(index + 1)])}
                    onRemove={() => updateSection<ContactChannelDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<ContactChannelDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<ContactChannelDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "contact_budgets": {
        const budgets = (payload ?? [""]) as string[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="Budget options"
            description="Manage the dropdown items shown in the contact form."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {budgets.map((budget, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <TextField
                    label={`Budget ${index + 1}`}
                    value={budget}
                    onChange={(next) =>
                      updateSection<string[]>(sectionKey, (current) => current.map((entry, entryIndex) => (entryIndex === index ? next : entry)))
                    }
                  />
                  <RepeatControls
                    index={index}
                    total={budgets.length}
                    onAdd={() => updateSection<string[]>(sectionKey, (current) => [...current.slice(0, index + 1), "", ...current.slice(index + 1)])}
                    onRemove={() => updateSection<string[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<string[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<string[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      case "faq_items": {
        const items = (payload ?? [{ question: "", answer: "", priority: 1 }]) as FaqDraft[];

        return (
          <SectionCard
            sectionKey={sectionKey}
            title="FAQ items"
            description="Questions are sorted by priority on the public page."
            saving={saving}
            onSave={saveSection}
          >
            <div className="repeat-stack">
              {items.map((item, index) => (
                <div key={`${sectionKey}-${index}`} className="repeat-item">
                  <div className="cms-grid three-col">
                    <TextField
                      label="Question"
                      value={item.question}
                      onChange={(next) =>
                        updateSection<FaqDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, question: next } : entry))
                        )
                      }
                    />
                    <TextAreaField
                      label="Answer"
                      value={item.answer}
                      rows={4}
                      onChange={(next) =>
                        updateSection<FaqDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, answer: next } : entry))
                        )
                      }
                    />
                    <NumberField
                      label="Priority"
                      value={item.priority}
                      onChange={(next) =>
                        updateSection<FaqDraft[]>(sectionKey, (current) =>
                          current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, priority: next } : entry))
                        )
                      }
                    />
                  </div>
                  <RepeatControls
                    index={index}
                    total={items.length}
                    onAdd={() => updateSection<FaqDraft[]>(sectionKey, (current) => [...current.slice(0, index + 1), { question: "", answer: "", priority: index + 2 }, ...current.slice(index + 1)])}
                    onRemove={() => updateSection<FaqDraft[]>(sectionKey, (current) => current.filter((_, entryIndex) => entryIndex !== index))}
                    onMoveUp={() =>
                      updateSection<FaqDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                    onMoveDown={() =>
                      updateSection<FaqDraft[]>(sectionKey, (current) => {
                        const next = [...current];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );
      }

      default:
        return null;
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-copy">
          <p className="eyebrow">Supabase CMS</p>
          <h1>Content control center</h1>
          <p className="admin-copy">
            Edit the database-driven sections from the panel, keep the overview focused on submissions, and avoid the long scroll.
          </p>
        </div>
        <div className="admin-actions">
          <button className="secondary-button admin-menu-button" type="button" onClick={() => setPanelOpen(true)}>
            <Menu size={16} />
            Menu
          </button>
          <button className="secondary-button" type="button" onClick={() => void loadData()}>
            <RefreshCcw size={16} />
            Refresh
          </button>
          <button className="secondary-button" type="button" onClick={() => void signOut()}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      {error ? <p className="admin-error">{error}</p> : null}

      <section className="admin-grid">
        <AdminSidebar
          applicationsCount={sortedApplications.length}
          activeGroup={activeGroup}
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          onViewOverview={viewOverview}
          onSelectGroup={selectGroup}
        />

        <div className="admin-main-column">
          <OverviewCard applications={sortedApplications} showAllEmails={showAllEmails} onToggleAllEmails={toggleAllEmails} />

          {showAllEmails ? <EmailListCard applications={sortedApplications} /> : null}

          {activeGroupConfig ? (
            <article className="admin-card admin-content-column">
              <div className="admin-card-head">
                <div>
                  <p className="eyebrow">Editing</p>
                  <h2>{activeGroupConfig.title}</h2>
                  <p className="admin-copy">Use the side panel to switch pages without scrolling through every section.</p>
                </div>
                <ShieldCheck size={18} />
              </div>

              <SectionSwitcher
                sections={activeGroupConfig.sections}
                activeSectionKey={activeSectionKey}
                onSelectSection={setActiveSectionKey}
              />

              {activeSectionKey ? (
                <div className="content-editor" id={`section-${activeSectionKey}`}>
                  {renderSection(activeSectionKey)}
                </div>
              ) : (
                <p className="empty-state">Select a section to start editing.</p>
              )}
            </article>
          ) : (
            <article className="admin-card admin-content-column">
              <div className="admin-card-head">
                <div>
                  <p className="eyebrow">Overview</p>
                  <h2>Choose a page to edit</h2>
                </div>
                <ShieldCheck size={18} />
              </div>
              <p className="admin-copy">Open the side panel and pick a page to load its editors here.</p>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}

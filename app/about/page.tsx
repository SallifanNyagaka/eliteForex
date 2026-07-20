import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAboutPageContent, getChromeContent, formatYearsInOperation } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { PlaceholderMedia } from "@/components/placeholder-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getAboutPageContent()]);
  const yearsInOperation = formatYearsInOperation(content.journey.startYear);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero split-hero">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 className="page-title">{content.hero.title}</h1>
          <p className="page-description">{content.hero.description}</p>
          <div className="hero-actions">
            {content.hero.ctaPrimary ? (
              <Link className="primary-button" href="/services">
                {content.hero.ctaPrimary}
                <ArrowRight size={18} />
              </Link>
            ) : null}
            {content.hero.ctaSecondary ? (
              <Link className="secondary-button" href="/packages">
                {content.hero.ctaSecondary}
              </Link>
            ) : null}
          </div>
        </div>

        <PlaceholderMedia
          asset={content.hero.media}
          label="About page image"
          note="Upload a brand or office image from the admin panel."
          actions={[
            { label: "Contact Us", href: "/contact" },
            { label: "View Performance", href: "/performance" },
          ]}
        />
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow={`Our Journey`}
          title={`${yearsInOperation}+ years of operation, calculated dynamically.`}
          description="The timeline below is sourced from Supabase and can be updated without code changes."
        />

        <div className="timeline">
          {content.journey.milestones.map((entry) => (
            <article key={entry.label} className="timeline-card">
              <span className="timeline-label">{entry.label}</span>
              <h3>{entry.title}</h3>
              <p>{entry.text}</p>
            </article>
          ))}
        </div>
      </section>

    </SiteShell>
  );
}

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getChromeContent, getPackagesPageContent } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { PackageInquiryModal } from "@/components/package-inquiry-modal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function PlanCard({
  name,
  deposit,
  features,
  featured,
}: {
  name: string;
  deposit: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <article className={`plan-card ${featured ? "featured" : ""}`}>
      {featured ? <span className="plan-badge">Most Popular</span> : null}
      <div className="plan-top">
        <CheckCircle2 size={18} />
        <h3>{name}</h3>
      </div>
      <div className="plan-deposit">
        <span>Minimum Deposit</span>
        <strong>{deposit}</strong>
      </div>
      <ul className="feature-list">
        {features.map((feature) => (
          <li key={feature}>
            <CheckCircle2 size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <PackageInquiryModal packageName={name} triggerLabel="Get Started" />
    </article>
  );
}

export default async function PackagesPage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getPackagesPageContent()]);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero wide-media-hero">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 className="page-title">{content.hero.title}</h1>
          <p className="page-description">{content.hero.description}</p>
          <div className="hero-actions">
            {content.hero.ctaPrimary ? (
              <Link className="primary-button" href="#tiers">
                {content.hero.ctaPrimary}
                <ArrowRight size={18} />
              </Link>
            ) : null}
            {content.hero.ctaSecondary ? (
              <Link className="secondary-button" href="/faq">
                {content.hero.ctaSecondary}
              </Link>
            ) : null}
          </div>
        </div>
        <PlaceholderMedia
          asset={content.hero.media}
          label="Packages hero image"
          note="Upload a tier banner in the admin panel."
          actions={content.hero.mediaActions}
        />
      </section>

      <section className="content-section" id="tiers">
        <SectionHeading
          eyebrow="Account Management Plans"
          title="Structured plans with clear positioning and no clutter."
          description="Each package uses the same card layout as the homepage, with pricing and benefits managed from the database."
        />

        <div className="plans-grid">
          {content.tiers.map((tier) => (
            <PlanCard
              key={tier.name}
              name={tier.name}
              deposit={tier.minimumDeposit}
              featured={tier.featured}
              features={[
                ...tier.benefits,
                `Target Monthly ROI: ${tier.targetMonthlyRoi}`,
                `Profit Split: ${tier.profitSplit}`,
                `Risk Profile: ${tier.riskProfile}`,
              ]}
            />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

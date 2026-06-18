import Link from "next/link";
import { ArrowRight, CircleDollarSign, ShieldCheck } from "lucide-react";
import { getChromeContent, getPackagesPageContent } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { PackageInquiryModal } from "@/components/package-inquiry-modal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PackagesPage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getPackagesPageContent()]);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero">
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
        />
      </section>

      <section className="content-section" id="tiers">
        <SectionHeading
          eyebrow="Investment Plans"
          title="Responsive tier matrix with database-driven CTA modals."
          description="Every tier card can be edited in Supabase and the inquiry flow captures the selected package automatically."
        />

        <div className="tier-grid">
          {content.tiers.map((tier) => (
            <article key={tier.name} className={`tier-card ${tier.featured ? "featured" : ""}`}>
              {tier.featured ? <span className="tier-badge">Most Popular</span> : null}
              {tier.image?.url ? <img src={tier.image.url} alt={tier.image.alt || tier.name} className="tier-image" /> : null}

              <h3>{tier.name}</h3>

              <div className="tier-stats">
                <div>
                  <span>Minimum Deposit</span>
                  <strong>{tier.minimumDeposit}</strong>
                </div>
                <div>
                  <span>Target Monthly ROI</span>
                  <strong>{tier.targetMonthlyRoi}</strong>
                </div>
                <div>
                  <span>Profit Split</span>
                  <strong>{tier.profitSplit}</strong>
                </div>
                <div>
                  <span>Risk Profile</span>
                  <strong>{tier.riskProfile}</strong>
                </div>
              </div>

              <ul className="tier-benefits">
                {tier.benefits.map((benefit) => (
                  <li key={benefit}>
                    <ShieldCheck size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="tier-actions">
                <PackageInquiryModal packageName={tier.name} />
                <Link className="secondary-button" href="/contact">
                  Contact Sales
                  <CircleDollarSign size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

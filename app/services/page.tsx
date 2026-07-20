import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getChromeContent, getServicesPageContent } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { PlaceholderMedia } from "@/components/placeholder-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesPage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getServicesPageContent()]);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero wide-media-hero">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 className="page-title">{content.hero.title}</h1>
          <p className="page-description">{content.hero.description}</p>
          <div className="hero-actions">
            {content.hero.ctaPrimary ? (
              <Link className="primary-button" href="/packages">
                {content.hero.ctaPrimary}
                <ArrowRight size={18} />
              </Link>
            ) : null}
            {content.hero.ctaSecondary ? (
              <Link className="secondary-button" href="/contact">
                {content.hero.ctaSecondary}
              </Link>
            ) : null}
          </div>
        </div>
        <PlaceholderMedia
          asset={content.hero.media}
          label="Services hero image"
          note="Upload a service banner in the admin panel."
          actions={content.hero.mediaActions}
        />
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Core Services"
          title="Structured account management with dynamic service cards."
          description="Each card uses a Lucide icon string from the database, so the presentation stays flexible."
        />

        <div className="service-grid">
          {content.services.map((service) => {
            const Icon = service.icon;

            return (
              <article key={service.title} className="service-card">
                <div className="service-icon">
                  <Icon size={20} />
                </div>
                <div className="service-image">
                  {service.image?.url ? <img src={service.image.url} alt={service.image.alt || service.title} /> : null}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}

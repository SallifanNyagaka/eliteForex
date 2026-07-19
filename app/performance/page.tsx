import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { getChromeContent, getPerformancePageContent } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PerformancePage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getPerformancePageContent()]);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero performance-page-hero">
        <div className="hero-copy">
          <p className="eyebrow">Performance</p>
          <h1 className="page-title">Our latest performance updates.</h1>
          <p className="page-description">
            Review the most recent account-management screenshots and the context supplied with each result.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact">
              Start a conversation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Performance gallery"
          title="Documented results, presented clearly."
          description="The newest updates appear first. Up to 20 performance screenshots are kept in the gallery."
        />

        {content.screenshots.length ? (
          <div className="performance-gallery">
            {content.screenshots.map((screenshot) => (
              <article className="performance-card" key={screenshot.id}>
                <div className="performance-card-image">
                  <img
                    src={screenshot.image.url}
                    alt={screenshot.image.alt || screenshot.title}
                    loading="lazy"
                  />
                </div>
                <div className="performance-card-copy">
                  <h2>{screenshot.title}</h2>
                  <p>{screenshot.description}</p>
                  {screenshot.createdAt ? (
                    <time dateTime={screenshot.createdAt}>
                      {new Date(screenshot.createdAt).toLocaleDateString("en", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="performance-empty">
            <Images size={28} />
            <h2>Performance updates are being prepared.</h2>
            <p>Uploaded screenshots will appear here automatically.</p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

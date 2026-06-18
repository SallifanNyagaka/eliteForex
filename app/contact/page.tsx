import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getChromeContent, getContactPageContent } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { PlaceholderMedia } from "@/components/placeholder-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getContactPageContent()]);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero split-hero">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 className="page-title">{content.hero.title}</h1>
          <p className="page-description">{content.hero.description}</p>
          <div className="hero-actions">
            {content.hero.ctaPrimary ? (
              <Link className="primary-button" href="#contact-form">
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
          label="Contact hero image"
          note="Upload an office or map visual in the admin panel."
        />
      </section>

      <section className="contact-layout" id="contact-form">
        <div className="contact-card">
          <SectionHeading
            eyebrow="Contact Channels"
            title="Direct office information from the database."
            description="Update the contact channels in Supabase without touching the code."
          />

          <div className="contact-channels">
            {content.channels.map((channel) => {
              const Icon = channel.icon;

              return (
                <div key={channel.label} className="contact-channel">
                  <Icon size={18} />
                  <div>
                    <span>{channel.label}</span>
                    <strong>{channel.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="contact-card">
          <SectionHeading
            eyebrow="Lead Capture"
            title="Strict client-side validation before submission."
            description="The form below uses React Hook Form and Zod, then safely posts to Supabase through the server route."
          />

          <LeadCaptureForm variant="contact" sourcePage="/contact" />
        </div>
      </section>
    </SiteShell>
  );
}

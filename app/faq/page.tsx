import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getChromeContent, getFaqPageContent } from "@/lib/cms";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaceholderMedia } from "@/components/placeholder-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FaqPage() {
  const [chrome, content] = await Promise.all([getChromeContent(), getFaqPageContent()]);

  return (
    <SiteShell chrome={chrome}>
      <section className="page-hero">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 className="page-title">{content.hero.title}</h1>
          <p className="page-description">{content.hero.description}</p>
          <div className="hero-actions">
            {content.hero.ctaPrimary ? (
              <Link className="primary-button" href="/contact">
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
          label="FAQ hero image"
          note="Upload a support or knowledge-base visual in the admin panel."
          actions={[
            { label: "Contact Us", href: "/contact" },
            { label: "View Performance", href: "/performance" },
          ]}
        />
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Priority-sorted answers from the admin database."
          description="The FAQ accordion is rendered dynamically and stays easy to update from Supabase."
        />

        <Accordion type="single" collapsible className="faq-accordion">
          {content.items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteShell>
  );
}

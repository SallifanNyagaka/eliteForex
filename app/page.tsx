import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { getChromeContent } from "@/lib/cms";
import { getLandingPageContent } from "@/lib/content";
import { SiteShell } from "@/components/site-shell";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { SectionHeading } from "@/components/section-heading";
import { PlaceholderMedia } from "@/components/placeholder-media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

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
      <a className="secondary-button" href="#apply">
        Get Started
      </a>
    </article>
  );
}

export default async function Home() {
  const [chrome, content] = await Promise.all([getChromeContent(), getLandingPageContent()]);
  const [heroLineOne, heroLineTwo] = content.hero.title.split("\n");
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "short" });
  const currentYear = now.getFullYear();

  return (
    <SiteShell chrome={chrome}>
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1>
            <span className="hero-line-one">{heroLineOne}</span>
            <span className="hero-line-two">{heroLineTwo ?? ""}</span>
          </h1>
          <p className="hero-description">{content.hero.description}</p>
          <div className="hero-points">
            {content.hero.highlights.map((item) => (
              <div key={item.title} className="hero-point">
                <item.icon size={18} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-actions">
            <a className="primary-button" href="#apply">
              {content.hero.primaryCta}
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="#performance">
              {content.hero.secondaryCta}
            </a>
          </div>
          <div className="rating-row" aria-label="Trustpilot style rating">
            <div className="rating-mark">
              <Star size={16} fill="currentColor" />
              <span>Trustpilot</span>
            </div>
            <div className="rating-stars" aria-hidden="true">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={16} fill="currentColor" />
              ))}
            </div>
            <span>{content.hero.rating}</span>
          </div>
        </div>

        <div className="hero-visual">
          <PlaceholderMedia
            asset={content.hero.media}
            label="Homepage hero image"
            note={`Updated through the admin panel. Verified Monthly Return ${currentMonth} ${currentYear}.`}
          />
        </div>
      </section>

      <section className="stats-grid">
        {content.stats.map((stat) => (
          <StatCard key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </section>

      <section id="plans" className="section">
        <SectionHeading
          eyebrow="Account Management Plans"
          title="Structured plans with clear positioning and no clutter."
          description="Each plan can be managed from the database, including pricing, features, and highlight state."
        />
        <div className="plans-grid">
          {content.plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </section>

      <section id="performance" className="section performance-panel">
        <SectionHeading
          eyebrow="Verified Performance"
          title="Performance entries are date-stamped and easy to update."
          description="Keep the public-facing numbers current through Supabase, and include the proper disclaimer in the footer."
        />
        <div className="performance-grid">
          {content.performance.map((entry) => (
            <div key={entry.month} className="performance-item">
              <strong>{entry.return}</strong>
              <span>{entry.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="triple-grid" id="why-us">
        <article className="info-card">
          <SectionHeading
            eyebrow="Why Invest With Us"
            title="Clear value, not noisy marketing."
            description="A strong landing page should feel credible before it feels flashy."
          />
          <div className="info-list">
            {content.whyChoose.map((item) => (
              <div key={item.title} className="info-row">
                <item.icon size={18} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="info-card">
          <SectionHeading
            eyebrow="How It Works"
            title="Simple steps with room for a real workflow."
            description="This can later connect to onboarding, CRM, or WhatsApp automation."
          />
          <div className="steps">
            {content.steps.map((step) => (
              <div key={step.number} className="step-row">
                <span className="step-number">{step.number}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="info-card form-card" id="apply">
          <SectionHeading
            eyebrow="Start Your Journey"
            title="Application-ready and secure."
            description="The form should submit server-side to Supabase so your keys stay private."
          />
          <LeadCaptureForm variant="home" sourcePage="/" compact />
        </article>
      </section>

      <section className="section" id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions, answered clearly."
          description="A concise FAQ section helps conversion and reduces repetitive support questions."
        />
        <div className="faq-grid">
          {[
            {
              question: "How do we keep the page dynamic?",
              answer:
                "We store each section in Supabase and read it server-side, so edits update the page without rebuilding the design.",
            },
            {
              question: "How are applications submitted?",
              answer:
                "The form posts to a server route, which validates the payload and inserts it into Supabase securely.",
            },
            {
              question: "Can we edit the text without touching code?",
              answer:
                "Yes. The content model is built for database-driven updates and can be paired with an admin interface later.",
            },
          ].map((item) => (
            <article key={item.question} className="faq-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

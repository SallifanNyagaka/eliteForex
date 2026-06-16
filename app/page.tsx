import {
  CheckCircle2,
  Crown,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { getLandingPageContent } from "@/lib/content";
import { LeadForm } from "@/components/lead-form";

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

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-description">{description}</p>
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
        <Crown size={18} />
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

function BullIllustration() {
  return (
    <svg
      className="bull-svg"
      viewBox="0 0 1200 900"
      fill="none"
      role="img"
      aria-label="Stylized golden bull illustration"
    >
      <defs>
        <linearGradient id="goldFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff0bc" />
          <stop offset="48%" stopColor="#f0c96f" />
          <stop offset="100%" stopColor="#9e6f1a" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0c96f" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0c96f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="658" cy="526" rx="250" ry="110" fill="url(#glow)" />
      <path
        d="M351 389C374 309 434 256 515 243C612 227 711 258 781 320C851 381 879 468 857 547C846 586 821 632 783 668C734 715 657 744 578 746C478 748 399 714 342 648C294 592 271 516 285 456C292 423 306 403 351 389Z"
        fill="url(#goldFill)"
        opacity="0.95"
      />
      <path
        d="M378 322C352 260 338 218 344 188C351 151 375 124 415 116C458 108 496 125 515 160C528 184 528 214 522 248"
        stroke="url(#goldFill)"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <path
        d="M776 324C806 261 822 219 816 188C808 149 783 123 741 116C698 109 660 127 641 162C628 186 628 216 634 248"
        stroke="url(#goldFill)"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <path d="M486 438H710" stroke="#1d1305" strokeOpacity="0.42" strokeWidth="30" strokeLinecap="round" />
      <path d="M476 494H726" stroke="#1d1305" strokeOpacity="0.3" strokeWidth="22" strokeLinecap="round" />
      <path
        d="M845 408C910 380 975 366 1080 282"
        stroke="url(#goldFill)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M864 429C931 397 1012 383 1108 294"
        stroke="url(#goldFill)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M885 360L925 363L919 323" stroke="url(#goldFill)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M778 675L776 774" stroke="#f0c96f" strokeWidth="24" strokeLinecap="round" />
      <path d="M460 675L450 772" stroke="#f0c96f" strokeWidth="24" strokeLinecap="round" />
      <ellipse cx="470" cy="792" rx="54" ry="22" fill="#f0c96f" />
      <ellipse cx="782" cy="792" rx="54" ry="22" fill="#f0c96f" />
      <circle cx="591" cy="364" r="18" fill="#180f05" fillOpacity="0.55" />
      <path d="M535 380C576 346 633 346 675 380" stroke="#1b1005" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

export default async function Home() {
  const content = await getLandingPageContent();
  const [heroLineOne, heroLineTwo] = content.hero.title.split("\n");

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Crown size={18} />
          </div>
          <div>
            <strong>{content.site.brandName}</strong>
            <span>{content.site.tagline}</span>
          </div>
        </div>
        <nav className="nav">
          {content.navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="call-pill" href={`https://wa.me/${content.site.whatsappNumber}`} target="_blank" rel="noreferrer">
          <MessageCircle size={16} />
          <span>{content.site.whatsappDisplay}</span>
        </a>
      </header>

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
          <div className="visual-panel">
            <div className="bull-orb" aria-hidden="true" />
            <div className="bull-figure" aria-hidden="true">
              <BullIllustration />
            </div>
            <div className="floating-card">
              <span>Verified Monthly Return</span>
              <strong>+12.45%</strong>
              <small>May 2026</small>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {content.stats.map((stat) => (
          <StatCard key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </section>

      <section id="plans" className="section">
        <SectionTitle
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
        <SectionTitle
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
          <SectionTitle
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
          <SectionTitle
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
          <SectionTitle
            eyebrow="Start Your Journey"
            title="Application-ready and secure."
            description="The form should submit server-side to Supabase so your keys stay private."
          />
          <LeadForm />
        </article>
      </section>

      <section className="section" id="faq">
        <SectionTitle
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

      <footer className="footer">
        <div>
          <div className="brand footer-brand">
            <div className="brand-mark" aria-hidden="true">
              <Crown size={18} />
            </div>
            <div>
              <strong>{content.site.brandName}</strong>
              <span>Professional forex account management</span>
            </div>
          </div>
          <p>{content.site.footerBlurb}</p>
        </div>
        <div>
          <h3>Contact</h3>
          <p>{content.site.phone}</p>
          <p>{content.site.email}</p>
          <p>{content.site.location}</p>
        </div>
        <div>
          <h3>Disclaimer</h3>
          <p>{content.site.disclaimer}</p>
        </div>
      </footer>
    </main>
  );
}

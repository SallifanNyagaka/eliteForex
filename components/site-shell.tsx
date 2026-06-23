import Link from "next/link";
import Image from "next/image";
import { Crown, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { SiteChrome } from "@/lib/cms-types";
import { MobileMenu } from "@/components/mobile-menu";

export function SiteShell({
  chrome,
  children,
}: {
  chrome: SiteChrome;
  children: ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <div className="brand-mark" aria-hidden="true">
            {chrome.logo?.url ? (
              <Image src={chrome.logo.url} alt={chrome.logo.alt || chrome.siteName} fill className="brand-logo" />
            ) : (
              <Crown size={18} />
            )}
          </div>
          <div>
            <strong>{chrome.brandName ?? chrome.siteName}</strong>
            <span>{chrome.tagline}</span>
          </div>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {chrome.navLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          <a
            className="call-pill site-call-pill"
            href={`https://wa.me/${chrome.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
            <span>{chrome.whatsappDisplay}</span>
          </a>

          <MobileMenu
            navLinks={chrome.navLinks}
            whatsappNumber={chrome.whatsappNumber}
            whatsappDisplay={chrome.whatsappDisplay}
          />
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="brand-mark" aria-hidden="true">
                {chrome.logo?.url ? (
                  <Image src={chrome.logo.url} alt={chrome.logo.alt || chrome.siteName} fill className="brand-logo" />
                ) : (
                  <Crown size={18} />
                )}
              </div>
              <div>
                <strong>{chrome.brandName ?? chrome.siteName}</strong>
                <span>{chrome.tagline}</span>
              </div>
            </div>
            <p>{chrome.footerBlurb}</p>
          </div>

          <div>
            <h3>Navigate</h3>
            <div className="footer-links">
              {chrome.navLinks.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3>Contact</h3>
            <p>{chrome.whatsappDisplay}</p>
            <p>{chrome.email}</p>
            <p>{chrome.location}</p>
          </div>
        </div>

        <div className="footer-meta">
          <span>© {year} {chrome.copyrightName}.</span>
        </div>

        <div className="footer-disclaimer">
          <strong>Regulatory Disclaimer</strong>
          <p>{chrome.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
}

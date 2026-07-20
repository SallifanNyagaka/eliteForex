"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown } from "lucide-react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SiteChrome } from "@/lib/cms-types";
import { MobileMenu } from "@/components/mobile-menu";
import { PhoneDropdown } from "@/components/phone-dropdown";
import { SocialIcon } from "@/components/social-icon";

export function SiteShell({ chrome, children }: { chrome: SiteChrome; children: ReactNode }) {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  function isActiveLink(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

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
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActiveLink(item.href) ? "page" : undefined}
              className={isActiveLink(item.href) ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          <PhoneDropdown phoneNumbers={chrome.phoneNumbers} />
          <MobileMenu
            navLinks={chrome.navLinks}
            phoneNumbers={chrome.phoneNumbers}
            currentPath={pathname}
          />
        </div>
      </header>

      <main className="site-main">{children}</main>

      <section className="performance-cta-section" aria-labelledby="performance-cta-title">
        <div className="performance-cta-inner">
          <div>
            <p className="eyebrow">Documented results</p>
            <h2 id="performance-cta-title">See our latest performance updates.</h2>
          </div>
          <Link className="primary-button" href="/performance">
            View Performance
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
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
              {chrome.socialLinks.length ? (
                <div className="footer-socials" aria-label="Social media links">
                  {chrome.socialLinks
                    .filter((social) => social.url)
                    .map((social) => (
                      <a
                        key={`${social.iconName}-${social.url}`}
                        className="footer-social-link"
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.description || social.label || social.iconName}
                        title={social.description || social.label || social.iconName}
                      >
                        <SocialIcon name={social.iconName} />
                      </a>
                    ))}
                </div>
              ) : null}
            </div>

            <div>
              <h3>Navigate</h3>
              <div className="footer-links">
                {chrome.navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActiveLink(item.href) ? "page" : undefined}
                    className={isActiveLink(item.href) ? "nav-link active" : "nav-link"}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3>Contact</h3>
              {chrome.phoneNumbers.map((phone, index) => <p key={`${phone.number}-${index}`}>{phone.display}</p>)}
              <p>{chrome.email}</p>
              <p>{chrome.location}</p>
            </div>
          </div>

          <div className="footer-meta">
            <span>&copy; {year} {chrome.copyrightName}.</span>
          </div>

          <div className="footer-disclaimer">
            <strong>Regulatory Disclaimer</strong>
            <p>{chrome.disclaimer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

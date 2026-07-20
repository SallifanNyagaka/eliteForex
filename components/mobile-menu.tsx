"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavLink, PhoneNumberEntry } from "@/lib/cms-types";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function MobileMenu({
  navLinks,
  phoneNumbers,
  currentPath,
}: {
  navLinks: NavLink[];
  phoneNumbers: PhoneNumberEntry[];
  currentPath?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  function isActiveLink(href: string) {
    if (href === "/") {
      return activePath === "/";
    }

    return activePath === href || activePath.startsWith(`${href}/`);
  }

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`mobile-menu ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div id="mobile-menu-panel" className="mobile-menu-panel" aria-hidden={!open}>
        <nav className="mobile-menu-nav" aria-label="Mobile primary">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActiveLink(item.href) ? "page" : undefined}
              className={isActiveLink(item.href) ? "mobile-nav-link active" : "mobile-nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-phones" aria-label="Phone numbers">
          {phoneNumbers.map((phone, index) => (
            <div className="mobile-menu-phone" key={`${phone.number}-${index}`}>
              <span className="mobile-menu-call-text">{phone.label}: {phone.display}</span>
              <div className="mobile-menu-phone-actions">
                <a
                  href={`https://wa.me/${phone.number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  aria-label={`Message ${phone.label} on WhatsApp`}
                >
                  <WhatsAppIcon size={16} />
                </a>
                <a
                  href={`tel:${phone.number.replace(/[^\d+]/g, "")}`}
                  onClick={() => setOpen(false)}
                  aria-label={`Call ${phone.label}`}
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

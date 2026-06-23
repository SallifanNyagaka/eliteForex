"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/cms-types";

export function MobileMenu({
  navLinks,
  whatsappNumber,
  whatsappDisplay,
}: {
  navLinks: NavLink[];
  whatsappNumber: string;
  whatsappDisplay: string;
}) {
  const [open, setOpen] = useState(false);

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
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <div id="mobile-menu-panel" className="mobile-menu-panel" aria-hidden={!open}>
        <nav className="mobile-menu-nav" aria-label="Mobile primary">
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="call-pill mobile-menu-call"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          <MessageCircle size={16} />
          <span>{whatsappDisplay}</span>
        </a>
      </div>
    </div>
  );
}

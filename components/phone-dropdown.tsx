"use client";

import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PhoneNumberEntry } from "@/lib/cms-types";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

function whatsappHref(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

function callHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

export function PhoneDropdown({ phoneNumbers }: { phoneNumbers: PhoneNumberEntry[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const primary = phoneNumbers[0];

  useEffect(() => {
    if (!open) return undefined;

    function closeOnPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!primary) return null;

  return (
    <div className={`phone-dropdown ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="call-pill site-call-pill"
        aria-expanded={open}
        aria-controls="phone-dropdown-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <WhatsAppIcon size={16} />
        <span>{primary.display}</span>
      </button>

      <div id="phone-dropdown-panel" className="phone-dropdown-panel" hidden={!open}>
        {phoneNumbers.map((phone, index) => (
          <div className="phone-dropdown-item" key={`${phone.number}-${index}`}>
            <div className="phone-dropdown-copy">
              <strong>{phone.label}</strong>
              <span>{phone.display}</span>
            </div>
            <div className="phone-dropdown-actions">
              <a href={whatsappHref(phone.number)} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                <WhatsAppIcon size={15} />
                WhatsApp
              </a>
              <a href={callHref(phone.number)} onClick={() => setOpen(false)}>
                <Phone size={15} />
                Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

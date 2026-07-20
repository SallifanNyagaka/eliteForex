import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { MediaAction, MediaAsset } from "@/lib/cms-types";

export function PlaceholderMedia({
  asset,
  label,
  note,
  actions = [],
}: {
  asset?: MediaAsset | null;
  label: string;
  note?: string;
  actions?: MediaAction[];
}) {
  if (asset?.url) {
    return (
      <div className="placeholder-media">
        <Image src={asset.url} alt={asset.alt || label} fill unoptimized className="placeholder-image" />
        {actions.length ? (
          <div className="hero-media-actions" aria-label={`${label} actions`}>
            {actions.map((action, index) => (
              <Link
                key={`${action.href}-${action.label}`}
                className={index === 0 ? "hero-media-cta primary" : "hero-media-cta"}
                href={action.href}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="placeholder-media" aria-label={label}>
      <div className="placeholder-orb" />
      <div className="placeholder-grid" aria-hidden="true" />
      <div className="placeholder-icon">
        <ImageIcon size={22} />
      </div>
      <div className="placeholder-copy">
        <strong>{label}</strong>
        {note ? <span>{note}</span> : null}
      </div>
    </div>
  );
}

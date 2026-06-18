import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { MediaAsset } from "@/lib/cms-types";

export function PlaceholderMedia({
  asset,
  label,
  note,
}: {
  asset?: MediaAsset | null;
  label: string;
  note?: string;
}) {
  if (asset?.url) {
    return (
      <div className="placeholder-media">
        <Image src={asset.url} alt={asset.alt || label} fill className="placeholder-image" />
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

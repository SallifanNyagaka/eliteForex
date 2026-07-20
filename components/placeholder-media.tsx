import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { MediaAction, MediaAsset } from "@/lib/cms-types";

const automaticPositions = ["bottom-center", "bottom-center", "center-left", "center", "top-left"] as const;

function groupActionsByPosition(actions: MediaAction[]) {
  const groups = new Map<string, Array<MediaAction & { actionIndex: number }>>();

  actions.slice(0, 5).forEach((action, actionIndex) => {
    const position = action.position && action.position !== "auto"
      ? action.position
      : automaticPositions[actionIndex];
    const entries = groups.get(position) ?? [];
    entries.push({ ...action, actionIndex });
    groups.set(position, entries);
  });

  return [...groups.entries()];
}

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
  const actionGroups = groupActionsByPosition(actions);

  if (asset?.url) {
    return (
      <div className="placeholder-media">
        <Image src={asset.url} alt={asset.alt || label} fill unoptimized className="placeholder-image" />
        {actionGroups.map(([position, positionedActions]) => (
          <div
            key={position}
            className={`hero-media-actions position-${position}`}
            aria-label={`${label} actions`}
          >
            {positionedActions.map((action) => (
              <Link
                key={`${action.href}-${action.label}-${action.actionIndex}`}
                className={action.actionIndex === 0 ? "hero-media-cta primary" : "hero-media-cta"}
                href={action.href}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ))}
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

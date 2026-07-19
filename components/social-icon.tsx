import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Music2,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SocialIconName } from "@/lib/cms-types";

const socialIcons: Record<SocialIconName, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  telegram: Send,
  tiktok: Music2,
  website: Globe,
};

export function SocialIcon({ name, size = 18 }: { name: SocialIconName; size?: number }) {
  const Icon = socialIcons[name] ?? Globe;
  return <Icon size={size} aria-hidden="true" />;
}

/**
 * Profil avatarı: `profiles.avatar_url` kolonunda `emoji:💪|hue:orange`
 * biçiminde saklanır — migrasyon gerektirmez, topluluk dahil her yerde okunur.
 */

export const AVATAR_EMOJIS = ["💪", "🏋️", "🏃", "🧘", "⚡", "🔥", "🎯", "🦾", "🥇", "🌱", "🚴", "🥊"] as const;

export const AVATAR_HUES = [
  { id: "orange", label: "Sinyal", solid: "bg-orange-600", soft: "bg-orange-600/12 dark:bg-orange-500/15", ring: "ring-orange-500/40" },
  { id: "slate", label: "Kömür", solid: "bg-zinc-800", soft: "bg-zinc-500/12 dark:bg-white/10", ring: "ring-zinc-400/40" },
  { id: "amber", label: "Şafak", solid: "bg-amber-500", soft: "bg-amber-500/12 dark:bg-amber-400/15", ring: "ring-amber-400/50" },
  { id: "steel", label: "Çelik", solid: "bg-slate-600", soft: "bg-slate-500/12 dark:bg-slate-400/15", ring: "ring-slate-400/40" },
  { id: "rose", label: "Nar", solid: "bg-rose-600", soft: "bg-rose-600/12 dark:bg-rose-500/15", ring: "ring-rose-500/40" },
] as const;

export type AvatarHueId = (typeof AVATAR_HUES)[number]["id"];

export interface AvatarInfo {
  emoji: string;
  hue: (typeof AVATAR_HUES)[number];
}

export function parseAvatarToken(token?: string | null): AvatarInfo | null {
  if (!token || !token.startsWith("emoji:")) return null;
  const parts = token.split("|");
  const emoji = parts[0]?.slice("emoji:".length) || "";
  const hueId = parts[1]?.startsWith("hue:") ? parts[1].slice("hue:".length) : "orange";
  if (!emoji) return null;
  const hue = AVATAR_HUES.find((item) => item.id === hueId) || AVATAR_HUES[0];
  return { emoji, hue };
}

export function buildAvatarToken(emoji: string, hueId: string): string {
  return `emoji:${emoji}|hue:${hueId}`;
}

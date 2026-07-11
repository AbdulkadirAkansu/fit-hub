import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/services/admin.service";

type StatTone = "indigo" | "emerald" | "blue" | "amber" | "rose";

const STAT_TONES: Record<StatTone, string> = {
  indigo: "bg-primary-soft text-primary dark:bg-primary/15",
  emerald: "bg-accent/10 text-accent",
  blue: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};

export const FADE_IN = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function AdminStatCard({ label, value, icon: Icon, tone = "indigo", detail, sub, trend, color }: { label: string; value: string | number; icon: LucideIcon; tone?: StatTone; detail?: string; sub?: string; trend?: string; color?: string }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", color ? "bg-zinc-100 dark:bg-white/5" : STAT_TONES[tone], color)}><Icon size={18} /></span>
        {(detail || trend) && <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400">{detail || trend}<ArrowUpRight size={12} /></span>}
      </div>
      <p className="mt-5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-bold leading-none text-zinc-900 tabular dark:text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

export const StatCard = AdminStatCard;

function categoryCounts(items: ContentItem[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const category = String(item.category || "Diğer");
    counts.set(category, (counts.get(category) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function CategoryBreakdown({ blogs, exercises, programs }: { blogs: ContentItem[]; exercises: ContentItem[]; programs: ContentItem[] }) {
  const groups = [
    { label: "Blog", value: blogs.length, color: "bg-primary" },
    { label: "Egzersiz", value: exercises.length, color: "bg-accent" },
    { label: "Program", value: programs.length, color: "bg-sky-500" },
  ];
  const total = Math.max(1, groups.reduce((sum, item) => sum + item.value, 0));
  const topCategories = categoryCounts([...blogs, ...exercises, ...programs]).slice(0, 3);

  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
        {groups.map((group) => <span key={group.label} className={group.color} style={{ width: `${(group.value / total) * 100}%` }} />)}
      </div>
      <div className="mt-5 space-y-3">
        {groups.map((group) => <div key={group.label} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-zinc-500"><span className={cn("h-2 w-2 rounded-full", group.color)} />{group.label}</span><strong>{group.value}</strong></div>)}
      </div>
      {topCategories.length > 0 && <p className="mt-5 border-t border-zinc-950/10 pt-4 text-xs text-zinc-400 dark:border-white/10">Öne çıkan: {topCategories.map(([name]) => name).join(", ")}</p>}
    </div>
  );
}

export function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) return <p className="text-sm text-zinc-400">Önizleme için içerik girin.</p>;
  return <div className="space-y-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph.replace(/^#{1,6}\s+/, "")}</p>)}</div>;
}

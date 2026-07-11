import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600">
        <span className="absolute -inset-2 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700" aria-hidden />
        <Icon size={26} />
      </div>
      <h3 className="text-sm font-black text-zinc-700 dark:text-zinc-300">{title}</h3>
      {subtitle && <p className="text-xs text-zinc-400 mt-1.5 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

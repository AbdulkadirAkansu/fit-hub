import { Activity, Dumbbell, Flame, Sprout, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import SafeImage from "@/components/common/SafeImage";

interface ProgramCoverProps {
  title: string;
  category?: string;
  level?: string;
  image?: string;
  index?: number;
  className?: string;
  compact?: boolean;
}

const LEVEL_ART: Record<string, { background: string; icon: typeof Dumbbell }> = {
  "Başlangıç": { background: "bg-gradient-to-br from-emerald-600 to-teal-800", icon: Sprout },
  "Orta": { background: "bg-gradient-to-br from-primary to-violet-900", icon: Flame },
  "İleri": { background: "bg-gradient-to-br from-accent to-rose-950", icon: Zap },
};

export default function ProgramCover({ title, category, level, image, index, className, compact }: ProgramCoverProps) {
  const art = LEVEL_ART[level || ""] || LEVEL_ART.Orta;
  const Icon = category === "Pilates" ? Activity : art.icon;
  const watermark = (title.split(" ")[0] || "FIT").toLocaleUpperCase("tr-TR");

  return (
    <div className={cn("relative h-full w-full overflow-hidden text-white", art.background, className)}>
      {image ? (
        <>
          <SafeImage src={image} alt={`${title} program kapağı`} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-zinc-950/45" aria-hidden />
        </>
      ) : (
        <p className={cn("pointer-events-none absolute -left-1 bottom-1 select-none whitespace-nowrap font-bold leading-none text-white/10", compact ? "text-6xl" : "text-8xl")} aria-hidden>{watermark}</p>
      )}

      <div className={cn("absolute inset-x-0 top-0 flex items-start justify-between", compact ? "p-3" : "p-4")}>
        <span className={cn("flex items-center justify-center rounded-lg bg-black/35 backdrop-blur-sm", compact ? "h-8 w-8" : "h-10 w-10")} aria-hidden>
          <Icon size={compact ? 15 : 19} />
        </span>
        {typeof index === "number" && <span className="rounded-md bg-black/35 px-2 py-1 text-xs font-semibold text-white/80">{String(index + 1).padStart(2, "0")}</span>}
      </div>
    </div>
  );
}

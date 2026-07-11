"use client";

import { cn } from "@/lib/utils";
import type { Gender } from "@/services/calculations.service";

interface GenderToggleProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  label?: string;
}

/**
 * Erkek/Kadın iki düğmeli cinsiyet seçici. Etiket CSS ile büyük harfe çevrildiği
 * için görünüm tüm hesaplayıcılarda tutarlıdır.
 */
export default function GenderToggle({ value, onChange, label = "CİNSİYET" }: GenderToggleProps) {
  return (
    <div className="space-y-4">
      <label className="field-label">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        {(["erkek", "kadin"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            aria-pressed={value === g}
            className={cn(
              "relative overflow-hidden rounded-2xl border py-5 font-mono text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-300",
              value === g
                ? "border-primary bg-primary text-white shadow-xl shadow-primary/25"
                : "border-zinc-950/10 bg-white text-zinc-400 hover:-translate-y-0.5 hover:border-primary/40 hover:text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-zinc-300",
            )}
          >
            {value === g && (
              <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" aria-hidden />
            )}
            {g === "erkek" ? "Erkek" : "Kadın"}
          </button>
        ))}
      </div>
    </div>
  );
}

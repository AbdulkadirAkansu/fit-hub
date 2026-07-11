import React from "react";

interface AdSlotProps {
  id: string;
  className?: string;
  label?: string;
}

export default function AdSlot({ id, className, label = "Sponsorlu İçerik" }: AdSlotProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -top-3 left-6 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 dark:border-white/5 z-10">
        {label}
      </div>
      <div className="w-full min-h-[100px] bg-zinc-50 dark:bg-white/[0.02] border border-dashed border-zinc-200 dark:border-white/10 rounded-[2rem] flex items-center justify-center overflow-hidden transition-all group-hover:border-accent/30">
        <div className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">
          Reklam Alanı #{id}
        </div>
      </div>
    </div>
  );
}

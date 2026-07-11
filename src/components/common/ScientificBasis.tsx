import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { SCIENTIFIC_REFERENCES } from "@/constants/references";
import { ScientificReference } from "@/types";

interface ScientificBasisProps {
  referenceKey: keyof typeof SCIENTIFIC_REFERENCES;
}

export default function ScientificBasis({ referenceKey }: ScientificBasisProps) {
  const ref = SCIENTIFIC_REFERENCES[referenceKey] as ScientificReference | undefined;

  if (!ref) {
    console.warn(`Scientific reference not found for key: ${referenceKey}`);
    return null;
  }

  return (
    <div className="corner-ticks relative mt-20 overflow-hidden rounded-[2rem] border border-zinc-950/10 bg-white p-8 dark:border-white/[0.08] dark:bg-surface md:p-12">
      <div className="pointer-events-none absolute right-0 top-0 p-8 text-zinc-100 dark:text-white/[0.04]" aria-hidden>
        <BookOpen size={140} strokeWidth={0.5} />
      </div>

      <div className="relative z-10 max-w-2xl">
        <h3 className="kicker">Bilimsel Dayanak &amp; Referanslar</h3>

        <h4 className="mt-6 text-2xl font-black text-zinc-950 dark:text-white sm:text-3xl">{ref.title}</h4>
        <p className="mt-4 leading-relaxed text-zinc-500 dark:text-zinc-400">
          &ldquo;{ref.description}&rdquo;
        </p>

        <div className="mt-8 border-t border-zinc-950/8 pt-6 dark:border-white/[0.07]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="field-label mb-2">Kullanılan Formül</span>
              <code className="inline-block rounded-lg bg-primary/8 px-3 py-1.5 font-mono text-sm font-bold text-primary dark:bg-primary/15">{ref.formula}</code>
            </div>
            <a
              href={ref.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-zinc-900 transition-colors hover:text-primary dark:text-white"
            >
              Kaynak: {ref.source}
              <ExternalLink size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

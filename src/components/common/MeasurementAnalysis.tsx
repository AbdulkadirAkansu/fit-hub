"use client";

import React from "react";
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { MEASUREMENT_ANALYSES, MeasurementAnalysisKey } from "@/constants/measurementAnalysis";

interface MeasurementAnalysisProps {
  analysisType: MeasurementAnalysisKey;
}

export default function MeasurementAnalysis({ analysisType }: MeasurementAnalysisProps) {
  const analysis = MEASUREMENT_ANALYSES[analysisType];

  return (
    <section className="mt-16 overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-900/[0.04] dark:border-white/[0.07] dark:bg-surface">
      <div className="grid gap-8 border-b border-zinc-200 p-8 dark:border-white/[0.07] md:grid-cols-[1fr_1.6fr] md:p-12">
        <div>
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen size={20} /></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Sonuç rehberi</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight">{analysis.title}</h2>
        </div>
        <p className="self-end text-sm font-medium leading-7 text-zinc-600 dark:text-zinc-400">{analysis.intro}</p>
      </div>

      <div className="grid border-b border-zinc-200 dark:border-white/[0.07] md:grid-cols-3">
        {analysis.metrics.map((metric, index) => (
          <div key={metric.label} className="border-b border-zinc-200 p-7 last:border-b-0 dark:border-white/[0.07] md:border-b-0 md:border-r md:last:border-r-0">
            <span className="font-mono text-[10px] font-bold text-zinc-400">0{index + 1}</span>
            <h3 className="mt-4 text-base font-black">{metric.label}</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">{metric.description}</p>
          </div>
        ))}
      </div>

      {analysis.ranges && (
        <div className="border-b border-zinc-200 p-8 dark:border-white/[0.07] md:p-12">
          <h3 className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Referans aralıkları</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {analysis.ranges.map((range) => (
              <div key={range.value} className="rounded-2xl bg-zinc-50 p-5 dark:bg-white/[0.035]">
                <div className="flex items-baseline justify-between gap-3"><strong className="text-lg">{range.value}</strong><span className="text-[9px] font-black uppercase tracking-wider text-primary">{range.label}</span></div>
                <p className="mt-3 text-xs font-medium leading-5 text-zinc-500 dark:text-zinc-400">{range.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.14em]">Yorumlarken dikkat edin</h3>
          <ul className="mt-5 space-y-4">
            {analysis.interpretation.map((item) => (
              <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-400"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-500" />{item}</li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3 rounded-2xl border border-amber-500/15 bg-amber-500/[0.06] p-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400"><AlertTriangle size={18} className="mt-1 shrink-0 text-amber-500" /><span><strong className="text-zinc-900 dark:text-white">Ölçüm sınırı:</strong> {analysis.limitations}</span></div>
        </div>
        <div className="rounded-3xl bg-zinc-950 p-7 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Sıradaki adım</p>
          <div className="mt-6 space-y-4">
            {analysis.nextSteps.map((step, index) => (
              <div key={step} className="flex gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"><span className="font-mono text-xs font-bold text-zinc-600">0{index + 1}</span><p className="text-sm font-semibold leading-6 text-zinc-300">{step}</p></div>
            ))}
          </div>
          <div className="mt-7 flex items-center gap-2 text-xs font-black text-primary">Sonucu bağlamıyla değerlendirin <ArrowRight size={14} /></div>
        </div>
      </div>
    </section>
  );
}

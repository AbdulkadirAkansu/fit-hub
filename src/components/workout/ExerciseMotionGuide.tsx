"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CircleAlert, Wind } from "lucide-react";
import { EXERCISES_DATA } from "@/constants/exercises";

interface ExerciseGuideRecord {
  id: string;
  name: string;
  image?: string;
  steps?: string[];
  breathing?: string;
  riskFactors?: string;
}

function normalizeName(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9çğıöşü]+/g, " ")
    .trim();
}

export default function ExerciseMotionGuide({ exerciseName, isActive }: { exerciseName: string; isActive: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const guide = useMemo(() => {
    const wanted = normalizeName(exerciseName);
    return (EXERCISES_DATA as ExerciseGuideRecord[]).find((item) => {
      const candidate = normalizeName(item.name);
      return candidate === wanted || candidate.includes(wanted) || wanted.includes(candidate);
    });
  }, [exerciseName]);

  const steps = guide?.steps?.length
    ? guide.steps.slice(0, 5)
    : [
        "Hareketin başlangıç pozisyonunu kur ve eklemlerini zorlamayan bir yük seç.",
        "Tekrarları acele etmeden, kontrol edebildiğin hareket açıklığında uygula.",
        "Keskin ağrı, baş dönmesi veya olağan dışı nefes darlığında seti durdur.",
      ];

  useEffect(() => {
    if (!isActive || steps.length < 2) return;
    const timer = window.setInterval(() => setStepIndex((value) => (value + 1) % steps.length), 5200);
    return () => window.clearInterval(timer);
  }, [isActive, steps.length]);

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-950/10 bg-secondary text-white dark:border-white/10" aria-label={`${exerciseName} hareket rehberi`}>
      <div className="relative min-h-60 overflow-hidden sm:min-h-64">
        {/* Ağdan bağımsız animasyonlu sahne: gradyan + ızgara + nabız + süpürme */}
        <div className="absolute inset-0 bg-primary/10" />
        <div className="grid-lab absolute inset-0 opacity-40" aria-hidden />
        <div className="animate-hero-pulse absolute -left-14 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-accent/20" aria-hidden />
        <div className="absolute -right-2 -top-8 h-28 w-28 rounded-full border border-white/10" aria-hidden />

        {/* Dev filigran — hareketin ilk kelimesi */}
        <p className="pointer-events-none absolute -bottom-2 left-0 select-none whitespace-nowrap font-display text-7xl font-black uppercase leading-none text-white/[0.06]" aria-hidden>
          {(exerciseName.split(" ")[0] || "FIT").toLocaleUpperCase("tr-TR")}
        </p>

        {/* Tekrar ritmi çubukları — canlı "hareket" hissi */}
        <div className="absolute right-6 top-6 flex items-end gap-1.5" aria-hidden>
          {[0, 1, 2, 3].map((index) => (
            <motion.span
              key={index}
              className="w-1.5 rounded-full bg-accent/70"
              animate={isActive ? { height: [10, 26, 10] } : { height: 14 }}
              transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }}
            />
          ))}
        </div>

        <motion.div
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-accent/15 to-transparent blur-xl"
          animate={isActive ? { x: ["-30%", "650%"] } : { x: "-30%" }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md">
              Canlı adım · {stepIndex + 1}/{steps.length}
            </span>
            {guide && <Link href={`/egzersizler/${guide.id}`} className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:text-accent">Tam teknik <ArrowUpRight size={13} /></Link>}
          </div>

          <AnimatePresence mode="wait">
            <motion.p key={stepIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="max-w-2xl font-display text-xl font-black leading-7 sm:text-2xl sm:leading-8">
              {steps[stepIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="mt-5 flex gap-1.5" aria-label="Teknik adımlar">
            {steps.map((_, index) => <button key={index} type="button" onClick={() => setStepIndex(index)} aria-label={`${index + 1}. adımı göster`} className={`h-1 rounded-full transition-all ${index === stepIndex ? "w-9 bg-accent" : "w-4 bg-white/25"}`} />)}
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/10 sm:grid-cols-2">
        <div className="flex gap-3 bg-secondary p-4 text-xs leading-5 text-zinc-300"><Wind className="mt-0.5 shrink-0 text-teal-300" size={16} /><span><strong className="block text-white">Nefes</strong>{guide?.breathing || "Zorlanma anında nefesi tutma; kontrollü ve ritmik nefes al."}</span></div>
        <div className="flex gap-3 bg-secondary p-4 text-xs leading-5 text-zinc-300"><CircleAlert className="mt-0.5 shrink-0 text-amber-400" size={16} /><span><strong className="block text-white">Güvenlik</strong>{guide?.riskFactors || "Teknik bozulursa yükü azalt; keskin ağrıda hareketi bırak."}</span></div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar, Clock3, Dumbbell, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import ProgramCover from "@/components/common/ProgramCover";
import { PROGRAMS_DATA } from "@/constants/programs";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Program = (typeof PROGRAMS_DATA)[number];

const CATEGORIES = ["Tümü", "Fitness", "Pilates"];
const LEVELS = ["Tümü", "Başlangıç", "Orta", "İleri"];

const LEVEL_TONE: Record<string, string> = {
  "Başlangıç": "bg-accent text-zinc-950",
  "Orta": "bg-primary text-white",
  "İleri": "bg-zinc-950 text-accent dark:bg-white dark:text-zinc-950",
};

function exerciseCount(program: Program) {
  if (!Array.isArray(program.workout)) return 0;
  return program.workout.reduce((total, day) => total + (Array.isArray(day.exercises) ? day.exercises.length : 0), 0);
}

export default function ProgramlarPage() {
  const [category, setCategory] = useState("Tümü");
  const [level, setLevel] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS_DATA);

  useEffect(() => {
    const controller = new AbortController();
    supabase.from("programs").select("*").order("created_at", { ascending: false }).abortSignal(controller.signal).then(({ data, error }) => {
      if (!error && data?.length) {
        setPrograms(data.map((program) => ({ ...program, daysPerWeek: program.days_per_week, scientificRationale: program.scientific_rationale, progressiveOverloadTip: program.progressive_overload_tip, workout: program.schedule ?? program.workout })) as Program[]);
      }
    }, () => undefined);
    return () => controller.abort();
  }, []);

  const visiblePrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    return programs.filter((program) => {
      const matchesCategory = category === "Tümü" || program.category === category;
      const matchesLevel = level === "Tümü" || program.level === level;
      const searchable = `${program.title} ${program.desc} ${program.level}`.toLocaleLowerCase("tr-TR");
      return matchesCategory && matchesLevel && searchable.includes(normalizedQuery);
    });
  }, [category, level, programs, query]);

  const hasActiveFilter = category !== "Tümü" || level !== "Tümü" || query.trim() !== "";

  return (
    <main className="min-h-screen bg-paper pb-24 dark:bg-bg-dark">
      {/* ── Hero bandı ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-zinc-950/10 dark:border-white/10 bg-zinc-950 dark:bg-surface px-5 pb-12 pt-24 text-white sm:px-6 sm:pb-16 sm:pt-32">
        <div className="grid-lab pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-accent/[0.06] blur-[90px]" aria-hidden />

        <div className="container relative mx-auto">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="kicker reveal text-accent">Plan kütüphanesi</p>
              <h1 className="reveal reveal-1 mt-4 max-w-3xl font-display text-6xl font-black uppercase leading-[0.85] sm:text-8xl">
                Programını <span className="text-accent">seç.</span>
              </h1>
              <p className="reveal reveal-2 mt-5 max-w-xl leading-7 text-zinc-300">
                Hedefine, seviyene ve ayırabileceğin zamana uygun planı bul; günlerini ve hareketlerini başlamadan önce incele.
              </p>
            </div>
            <div className="reveal reveal-3 flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <div className="flex gap-6 rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-4 backdrop-blur-sm">
                <div>
                  <p className="font-display text-3xl font-black leading-none text-accent tabular">{programs.length}</p>
                  <p className="stat-label mt-1.5 text-zinc-400">hazır plan</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="font-display text-3xl font-black leading-none text-white tabular">3</p>
                  <p className="stat-label mt-1.5 text-zinc-400">seviye</p>
                </div>
              </div>
              <Link
                href="/programlar/olusturucu"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-6 py-4 text-sm font-black text-zinc-950 shadow-xl shadow-accent/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                <SlidersHorizontal size={16} /> Bana göre oluştur
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-5 sm:px-6">
        {/* ── Yapışkan filtre çubuğu ───────────────────────────────── */}
        <section className="sticky top-[4.25rem] z-30 -mx-5 border-b border-zinc-950/[0.07] bg-paper/90 px-5 py-3.5 backdrop-blur-xl dark:border-white/[0.07] dark:bg-bg-dark/90 sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1 lg:max-w-xs">
              <span className="sr-only">Program ara</span>
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Program veya hedef ara…"
                className="h-11 w-full rounded-full border border-zinc-950/10 bg-white pl-10 pr-4 text-sm font-semibold outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
              />
            </label>

            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto" aria-label="Kategori filtresi">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition-colors",
                    category === item ? "bg-primary text-white" : "bg-zinc-950/[0.05] text-zinc-600 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.06] dark:text-zinc-300",
                  )}
                >
                  {item}
                </button>
              ))}
              <span className="mx-1 h-5 w-px shrink-0 bg-zinc-950/10 dark:bg-white/10" aria-hidden />
              {LEVELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors",
                    level === item ? "bg-zinc-950 text-accent dark:bg-white dark:text-zinc-950" : "bg-zinc-950/[0.05] text-zinc-500 hover:text-zinc-950 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white",
                  )}
                >
                  {item === "Tümü" ? "Seviye" : item}
                </button>
              ))}
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCategory("Tümü"); setLevel("Tümü"); }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black text-zinc-400 transition-colors hover:text-primary"
                >
                  <X size={13} /> Temizle
                </button>
              )}
            </div>

            <p className="ml-auto hidden shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500 lg:block">
              <span className="text-primary">{visiblePrograms.length}</span> / {programs.length} plan
            </p>
          </div>
        </section>

        {/* ── Program gridi ────────────────────────────────────────── */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visiblePrograms.map((program, index) => {
            const isFeatured = index === 0 && !hasActiveFilter;
            const moves = exerciseCount(program);
            return (
              <Link
                key={program.id}
                href={`/programlar/${program.id}`}
                className={cn(
                  "group overflow-hidden rounded-[1.5rem] border border-zinc-950/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/10 dark:bg-surface",
                  isFeatured && "md:col-span-2",
                )}
              >
                <div className={cn("relative overflow-hidden", isFeatured ? "aspect-[16/7] min-h-52" : "aspect-[16/9]")}>
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                    <ProgramCover title={program.title} category={program.category} level={program.level} image={program.image} index={index} compact={!isFeatured} />
                  </div>
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-5">
                    <div className="flex flex-wrap gap-2">
                      <span className={cn("rounded-md px-2.5 py-1 text-xs font-black", LEVEL_TONE[program.level] || LEVEL_TONE["Orta"])}>{program.level}</span>
                      <span className="rounded-md bg-black/45 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">{program.category}</span>
                    </div>
                    {isFeatured && (
                      <span className="hidden items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:flex">
                        <Sparkles size={11} className="text-accent" /> Öne çıkan
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className={cn("font-display font-black uppercase leading-[0.95] transition-colors group-hover:text-primary", isFeatured ? "text-3xl sm:text-4xl" : "text-2xl")}>
                    {program.title}
                  </h2>
                  <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{program.desc}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-950/[0.07] pt-4 text-xs font-bold text-zinc-500 dark:border-white/[0.07] dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-primary" /> {program.daysPerWeek} gün/hafta</span>
                    <span className="flex items-center gap-1.5"><Clock3 size={13} className="text-primary" /> {program.duration}</span>
                    {moves > 0 && <span className="flex items-center gap-1.5"><Dumbbell size={13} className="text-primary" /> {moves} hareket</span>}
                    <span className="ml-auto flex items-center gap-1 font-black text-primary">
                      İncele <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Boş durum */}
        {visiblePrograms.length === 0 && (
          <div className="mt-10 rounded-[1.5rem] border border-dashed border-zinc-300 p-14 text-center dark:border-white/15">
            <Dumbbell className="mx-auto text-zinc-300 dark:text-zinc-700" size={36} />
            <h2 className="mt-4 font-display text-2xl font-black uppercase">Eşleşen program yok.</h2>
            <p className="mt-2 text-sm text-zinc-500">Filtreleri gevşet veya kendi programını oluştur.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => { setQuery(""); setCategory("Tümü"); setLevel("Tümü"); }} className="btn-outline !py-3 text-sm">
                Filtreleri temizle
              </button>
              <Link href="/programlar/olusturucu" className="btn-brand !py-3 text-sm">
                Bana göre oluştur <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Alt CTA */}
        <aside className="relative mt-12 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-zinc-950 dark:bg-surface p-8 text-white shadow-xl dark:shadow-none sm:flex-row sm:items-center sm:p-10">
          <div className="grid-lab pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-[80px]" aria-hidden />
          <div className="relative flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={19} className="text-accent" />
            </span>
            <div>
              <h2 className="font-display text-3xl font-black uppercase leading-none">Hiçbiri tam uymadı mı?</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/80">Hedefini ve haftalık gün sayını söyle; sana özel planı 2 dakikada hazırlayalım.</p>
            </div>
          </div>
          <Link href="/programlar/olusturucu" className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-black text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
            Oluşturucuyu aç <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </main>
  );
}

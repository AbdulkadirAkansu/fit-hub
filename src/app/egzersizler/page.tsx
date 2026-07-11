"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Dumbbell, RotateCcw, Search } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import SafeImage from "@/components/common/SafeImage";
import { EXERCISES_DATA } from "@/constants/exercises";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Exercise {
  id: string;
  name: string;
  targetMuscle?: string;
  target_muscle?: string;
  difficulty?: string;
  equipment?: string;
  category?: string;
  instructions?: string;
  image?: string;
  image_url?: string;
}

export default function EgzersizlerPage() {
  const [exercises, setExercises] = useState<Exercise[]>(EXERCISES_DATA);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [difficulty, setDifficulty] = useState("Tümü");

  useEffect(() => {
    const controller = new AbortController();
    supabase.from("exercises").select("*").order("name").abortSignal(controller.signal).then(({ data }) => {
      if (data?.length) setExercises(data as Exercise[]);
    });
    return () => controller.abort();
  }, []);

  const visibleExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    return exercises.filter((exercise) => {
      const searchable = `${exercise.name} ${exercise.targetMuscle || exercise.target_muscle || ""} ${exercise.equipment || ""}`.toLocaleLowerCase("tr-TR");
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (category === "Tümü" || (exercise.category || "").includes(category))
        && (difficulty === "Tümü" || exercise.difficulty === difficulty);
    });
  }, [category, difficulty, exercises, query]);

  const hasFilters = query || category !== "Tümü" || difficulty !== "Tümü";
  const reset = () => { setQuery(""); setCategory("Tümü"); setDifficulty("Tümü"); };

  return (
    <main className="min-h-screen bg-paper pb-24 text-ink dark:bg-bg-dark dark:text-white">
      <PageHeader title="Hareket Kütüphanesi" description="Hedef kası, gerekli ekipmanı ve doğru uygulama adımlarını bilimsel detaylarıyla inceleyin." kicker="Egzersiz Rehberi" />

      <div className="container mx-auto px-5 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          {/* Sol Kolon: Filtreler (Sticky Sidebar) */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="glass-panel space-y-6 p-6 rounded-3xl shadow-lg shadow-primary/5">
              <div>
                <h3 className="font-display text-sm font-black uppercase tracking-wider text-zinc-500">Arama</h3>
                <div className="relative mt-2.5">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Egzersiz veya kas ara..."
                    className="field-input !h-11 pl-10"
                  />
                </div>
              </div>

              <div className="h-px bg-zinc-950/10 dark:bg-white/10" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-sm font-black uppercase tracking-wider text-zinc-500">Branş</h3>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["Tümü", "Fitness", "Pilates"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "flex-grow rounded-xl py-2 px-3 text-xs font-bold transition-all",
                          category === cat
                            ? "bg-primary text-white shadow-md shadow-primary/15"
                            : "bg-zinc-950/[0.04] text-zinc-600 hover:bg-primary/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-sm font-black uppercase tracking-wider text-zinc-500">Zorluk Seviyesi</h3>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["Tümü", "Başlangıç", "Orta", "İleri"].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={cn(
                          "flex-grow rounded-xl py-2 px-3 text-xs font-bold transition-all",
                          difficulty === diff
                            ? "bg-accent text-white shadow-md shadow-accent/15"
                            : "bg-zinc-950/[0.04] text-zinc-600 hover:bg-accent/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
                        )}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={reset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-950/15 py-2.5 text-xs font-black text-zinc-500 transition-all hover:border-primary hover:text-primary dark:border-white/15 dark:text-zinc-400"
                >
                  <RotateCcw size={13} /> Seçimleri Sıfırla
                </button>
              )}
            </div>
          </aside>

          {/* Sağ Kolon: Liste */}
          <div>
            <div className="flex items-center justify-between pb-4">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                <span className="text-primary font-black">{visibleExercises.length}</span> egzersiz listeleniyor
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleExercises.map((exercise, index) => (
                <Link
                  key={exercise.id}
                  href={`/egzersizler/${exercise.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-zinc-950/5 bg-white shadow-sm transition-all duration-500 ease-spring hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-surface"
                  style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
                >
                  <div className="relative aspect-[1.6] overflow-hidden bg-zinc-100 dark:bg-zinc-900/50">
                    <SafeImage
                      src={exercise.image_url || exercise.image}
                      alt={exercise.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-80" />
                    
                    <span className="absolute bottom-4 left-5 rounded-full bg-white/20 px-3.5 py-1.5 font-mono text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-lg shadow-black/20">
                      {exercise.difficulty || "Orta"}
                    </span>
                  </div>

                  <div className="flex flex-grow flex-col justify-between p-6 sm:p-7">
                    <div className="relative z-10">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                        {exercise.targetMuscle || exercise.target_muscle || "Genel"}
                      </span>
                      <h3 className="mt-2 font-display text-[19px] font-black tracking-tight leading-snug text-zinc-900 group-hover:text-primary transition-colors dark:text-white">
                        {exercise.name}
                      </h3>
                    </div>

                    <div className="relative z-10 mt-6 flex items-center justify-between border-t border-zinc-950/5 pt-5 dark:border-white/5">
                      <span className="flex items-center gap-2 min-w-0 text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">
                        <Dumbbell size={14} className="shrink-0 text-primary" />
                        <span className="truncate">{exercise.equipment || "Ekipmansız"}</span>
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-950/10 text-zinc-400 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white dark:border-white/10 dark:text-zinc-500">
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {!visibleExercises.length && (
              <div className="mt-6 rounded-[2rem] border border-dashed border-zinc-950/20 p-12 text-center dark:border-white/15">
                <Dumbbell className="mx-auto text-zinc-300 dark:text-zinc-700" size={32} />
                <h3 className="mt-4 font-display text-lg font-black">Eşleşen hareket bulunamadı.</h3>
                <button onClick={reset} className="mt-3 text-sm font-black text-primary underline underline-offset-4 hover:text-primary-hover">Filtreleri Temizle</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Dumbbell, Loader2, Target, Wind } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";
import { EXERCISES_DATA } from "@/constants/exercises";
import { supabase } from "@/lib/supabase";

type Exercise = (typeof EXERCISES_DATA)[number] & {
  image_url?: string;
  target_muscle?: string;
  risk_factors?: string;
};

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadExercise = async () => {
      try {
        const { data, error } = await supabase.from("exercises").select("*").eq("id", id).abortSignal(controller.signal).maybeSingle();
        if (!error && data) {
          setExercise(data as Exercise);
          return;
        }
        const fallback = EXERCISES_DATA.find((item) => item.id === id);
        if (fallback) setExercise(fallback);
        else router.push("/egzersizler");
      } catch {
        const fallback = EXERCISES_DATA.find((item) => item.id === id);
        if (fallback) setExercise(fallback);
      } finally {
        setLoading(false);
      }
    };
    void loadExercise();
    return () => controller.abort();
  }, [id, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper dark:bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={30} />
      </main>
    );
  }
  if (!exercise) return null;

  const targetMuscle = exercise.targetMuscle || exercise.target_muscle || "Genel";
  const riskFactors = exercise.riskFactors || exercise.risk_factors;

  return (
    <main className="min-h-screen bg-paper pb-24 pt-28 text-zinc-950 dark:bg-bg-dark dark:text-white sm:pt-32">
      <div className="container mx-auto max-w-5xl px-5 sm:px-6">
        <Link href="/egzersizler" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white">
          <ArrowLeft size={14} /> Hareketlere dön
        </Link>

        {/* Hero */}
        <section className="reveal corner-ticks mt-8 overflow-hidden rounded-[2rem] border border-zinc-950/10 bg-white dark:border-white/[0.08] dark:bg-surface">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-64 overflow-hidden bg-zinc-200 md:min-h-[420px] dark:bg-zinc-800">
              <SafeImage src={exercise.image_url || exercise.image} alt={exercise.name} className="object-cover" sizes="(max-width: 768px) 100vw, 45vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/30 to-transparent md:bg-gradient-to-r" aria-hidden />
            </div>
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{exercise.category}</span>
                <span className="chip-mono !py-1.5">{exercise.difficulty}</span>
              </div>
              <h1 className="mt-5 font-display text-3xl font-black tracking-[-0.03em] sm:text-5xl">{exercise.name}</h1>
              <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-300">{exercise.instructions}</p>
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-950/[0.07] bg-paper/60 p-4 dark:border-white/[0.07] dark:bg-white/[0.03]">
                  <dt className="stat-label flex items-center gap-2"><Target size={13} className="text-primary" /> Hedef bölge</dt>
                  <dd className="mt-2 font-display text-sm font-black">{targetMuscle}</dd>
                </div>
                <div className="rounded-2xl border border-zinc-950/[0.07] bg-paper/60 p-4 dark:border-white/[0.07] dark:bg-white/[0.03]">
                  <dt className="stat-label flex items-center gap-2"><Dumbbell size={13} className="text-primary" /> Ekipman</dt>
                  <dd className="mt-2 font-display text-sm font-black">{exercise.equipment || "Ekipmansız"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
          {/* Adımlar */}
          <section className="card-lab reveal reveal-2 p-7 sm:p-8">
            <p className="kicker">Uygulama</p>
            <h2 className="mt-3 font-display text-2xl font-black tracking-tight">Adım adım</h2>
            <ol className="mt-6 space-y-5">
              {(exercise.steps?.length ? exercise.steps : [exercise.instructions]).map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="step-dot">{String(index + 1).padStart(2, "0")}</span>
                  <p className="pt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="space-y-4">
            {exercise.breathing && (
              <section className="card-lab reveal reveal-3 p-6">
                <h2 className="flex items-center gap-2.5 font-display text-lg font-black tracking-tight">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Wind size={17} /></span>
                  Nefes
                </h2>
                <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{exercise.breathing}</p>
              </section>
            )}
            {riskFactors && (
              <section className="reveal reveal-4 rounded-[1.75rem] border border-amber-500/25 bg-amber-500/[0.07] p-6 text-amber-950 dark:text-amber-100">
                <h2 className="flex items-center gap-2.5 font-display text-lg font-black tracking-tight">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400"><AlertTriangle size={17} /></span>
                  Güvenlik
                </h2>
                <p className="mt-4 text-sm leading-6 opacity-85">{riskFactors}</p>
              </section>
            )}
          </div>
        </div>

        {exercise.biomechanics && (
          <section className="card-lab corner-ticks reveal mt-5 p-7 sm:p-8">
            <p className="kicker">Biyomekanik</p>
            <h2 className="mt-3 font-display text-2xl font-black tracking-tight">Neden bu hareket?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">{exercise.biomechanics}</p>
          </section>
        )}

        {/* CTA */}
        <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-zinc-950 p-7 text-white dark:bg-surface sm:p-9">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Sıradaki adım</p>
              <p className="mt-2 font-display text-xl font-black tracking-tight">Program içinde uygulamak ister misin?</p>
              <p className="mt-1.5 text-sm text-zinc-400">Hedefine göre haftalık plan oluştur ve antrenmanda setlerini takip et.</p>
            </div>
            <Link href="/programlar/olusturucu" className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/20">
              Program oluştur <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-zinc-500">
          <Check size={15} className="mt-0.5 shrink-0 text-primary" />
          Ağrı veya rahatsızlık hissedersen hareketi durdur. Bu rehber tıbbi değerlendirme yerine geçmez.
        </p>
      </div>
    </main>
  );
}

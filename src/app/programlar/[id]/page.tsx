"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BedDouble, Calendar, Check, ChevronDown, Clock3,
  Download, Dumbbell, Loader2, Play, ShieldCheck, Timer,
} from "lucide-react";
import ProgramCover from "@/components/common/ProgramCover";
import ExerciseMotionGuide from "@/components/workout/ExerciseMotionGuide";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { PROGRAMS_DATA } from "@/constants/programs";
import { supabase } from "@/lib/supabase";
import { usePDF } from "@/hooks/usePDF";
import { cn } from "@/lib/utils";

interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  rest?: string;
}

interface WorkoutDay {
  dayName: string;
  isRest?: boolean;
  exercises: WorkoutExercise[];
}

interface ProgramView {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  daysPerWeek: number;
  image: string;
  desc: string;
  scientificRationale?: string;
  progressiveOverloadTip?: string;
  workout: Array<WorkoutDay | WorkoutExercise>;
}

function isWorkoutDay(item: WorkoutDay | WorkoutExercise): item is WorkoutDay {
  return "dayName" in item;
}

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { downloadPDF, isGenerating, pdfError } = usePDF();
  const [program, setProgram] = useState<ProgramView | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  useEffect(() => {
    const loadProgram = async () => {
      const localProgram = PROGRAMS_DATA.find((item) => item.id === id);
      if (localProgram) {
        setProgram(localProgram as ProgramView);
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from("programs").select("*").eq("id", id).maybeSingle();
        if (data) setProgram({
          id: data.id,
          title: data.title,
          category: data.category,
          level: data.level,
          duration: data.duration,
          daysPerWeek: data.days_per_week,
          image: data.image,
          desc: data.desc,
          scientificRationale: data.scientific_rationale,
          progressiveOverloadTip: data.progressive_overload_tip,
          workout: Array.isArray(data.schedule) ? data.schedule as Array<WorkoutDay | WorkoutExercise> : [],
        });
      } finally {
        setLoading(false);
      }
    };
    void loadProgram();
  }, [id]);

  useEffect(() => {
    if (!program) return;
    const checkEnrollment = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from("user_programs").select("id").eq("user_id", session.user.id).eq("title", program.title).maybeSingle();
      setIsEnrolled(Boolean(data));
    };
    void checkEnrollment();
  }, [program]);

  const days = useMemo<WorkoutDay[]>(() => {
    if (!program?.workout.length) return [];
    if (isWorkoutDay(program.workout[0])) return program.workout.filter(isWorkoutDay);
    return [{ dayName: "Antrenman günü", isRest: false, exercises: program.workout.filter((item): item is WorkoutExercise => !isWorkoutDay(item)) }];
  }, [program]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper dark:bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={30} />
      </main>
    );
  }

  if (!program) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-5 text-center dark:bg-bg-dark">
        <div>
          <p className="kicker justify-center">Kayıt bulunamadı</p>
          <h1 className="mt-4 font-display text-2xl font-black">Program bulunamadı.</h1>
          <Link href="/programlar" className="btn-outline mt-6 !py-3 text-sm">Programlara dön</Link>
        </div>
      </main>
    );
  }

  const activeDay = days[selectedDayIndex] || days[0];
  const activeDays = days.filter((day) => !day.isRest).length;
  const totalMoves = days.reduce((total, day) => total + day.exercises.length, 0);
  const pdfSchedule = days.map((day, index) => ({ day: day.dayName.split(":")[0] || `${index + 1}. gün`, type: day.dayName.split(":").slice(1).join(":").trim() || "Antrenman", status: day.isRest ? "Dinlenme" as const : "Antrenman" as const, exercises: day.exercises.map((exercise) => ({ name: exercise.name, sets: exercise.sets, reps: exercise.reps })) }));

  const selectDay = (index: number) => {
    setSelectedDayIndex(index);
    setExpandedExercise(null);
  };

  const enroll = async () => {
    setEnrolling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/hesap/giris");
        return;
      }
      const { error } = await supabase.from("user_programs").insert([{
        user_id: session.user.id,
        title: program.title,
        description: program.desc,
        goal: program.category,
        level: program.level,
        schedule: program.workout,
      }]);
      if (error) throw error;
      setIsEnrolled(true);
      router.push("/hesap");
    } catch (error) {
      console.error(error);
      window.alert("Program kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper pb-24 pt-24 text-zinc-950 dark:bg-bg-dark dark:text-white sm:pt-28">
      <ProfessionalPDFTemplate id="program-detail-pdf" title={program.title} results={[{ label: "SEVİYE", value: program.level }, { label: "SÜRE", value: program.duration }, { label: "SIKLIK", value: `${program.daysPerWeek || activeDays} gün / hafta` }]} recommendations={[program.progressiveOverloadTip || "Hareket formunu koruyarak yükü küçük adımlarla artır.", "Antrenman öncesi kısa bir ısınma yap.", "Ağrı hissedersen hareketi durdur."]} schedule={pdfSchedule} scientificNote={program.scientificRationale} />

      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <Link href="/programlar" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-primary">
          <ArrowLeft size={14} /> Programlara dön
        </Link>

        {/* ── Hero: kapak sanatı + künye ─────────────────────────────── */}
        <section className="reveal mt-6 overflow-hidden rounded-[1.75rem] border border-zinc-950/10 bg-white shadow-xl shadow-zinc-950/[0.06] dark:border-white/10 dark:bg-surface">
          <div className="grid lg:grid-cols-[1fr_1.15fr]">
            <div className="relative min-h-64 lg:min-h-full">
              <ProgramCover title={program.title} category={program.category} level={program.level} image={program.image} />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-black/60 to-transparent p-5">
                <span className="rounded-md bg-accent px-3 py-1.5 text-xs font-black text-zinc-950">{program.level}</span>
                <span className="rounded-md bg-white/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">{program.category}</span>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <h1 className="font-display text-4xl font-black uppercase leading-[0.9] sm:text-6xl">{program.title}</h1>
              <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">{program.desc}</p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Calendar, value: `${program.daysPerWeek || activeDays}`, label: "gün / hafta" },
                  { icon: Clock3, value: program.duration, label: "program süresi" },
                  { icon: Dumbbell, value: `${totalMoves}`, label: "hareket" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-xl border border-zinc-950/[0.08] bg-zinc-950/[0.02] p-3.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
                    <Icon size={15} className="text-primary" />
                    <p className="mt-2 font-display text-xl font-black leading-none tabular">{value}</p>
                    <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={enroll}
                  disabled={enrolling || isEnrolled}
                  className={cn(
                    "inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-black text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-80",
                    isEnrolled ? "bg-zinc-950 shadow-zinc-950/20 dark:bg-white/15" : "bg-primary shadow-primary/25 hover:bg-primary-hover",
                  )}
                >
                  {enrolling ? <Loader2 className="animate-spin" size={17} /> : isEnrolled ? <Check size={17} /> : <Play size={17} />}
                  {isEnrolled ? "Hesabımda kayıtlı" : "Programı hesabıma kaydet"}
                </button>
                <button type="button" disabled={isGenerating} onClick={() => downloadPDF("program-detail-pdf", program.title.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-"))} className="btn-outline text-sm disabled:cursor-wait disabled:opacity-60">
                  {isGenerating ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />} {isGenerating ? "PDF hazırlanıyor" : "PDF indir"}
                </button>
              </div>
              {pdfError && <p role="alert" className="mt-3 text-sm font-semibold text-rose-500">{pdfError}</p>}
            </div>
          </div>
        </section>

        {/* ── Haftalık ray + gün paneli ──────────────────────────────── */}
        <section className="card-lab reveal reveal-2 mt-6 rounded-[1.5rem] p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="kicker">Haftalık plan</p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase leading-none sm:text-4xl">Günü seç, hareketi aç.</h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Bir harekete dokun; teknik adımlar ve güvenlik notları açılır.</p>
          </div>

          {/* Gün rayı */}
          {days.length > 1 && (
            <div className="no-scrollbar mt-7 flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Program günleri">
              {days.map((day, index) => {
                const isSelected = selectedDayIndex === index;
                return (
                  <button
                    key={`${day.dayName}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectDay(index)}
                    className={cn(
                      "flex min-w-[5.5rem] shrink-0 flex-col items-start gap-1.5 rounded-xl border px-4 py-3 text-left transition-all duration-300",
                      isSelected
                        ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                        : day.isRest
                          ? "border-zinc-950/[0.07] bg-zinc-950/[0.02] text-zinc-400 hover:border-zinc-950/20 dark:border-white/[0.07] dark:bg-white/[0.02]"
                          : "border-zinc-950/10 bg-white text-zinc-700 hover:border-primary/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200",
                    )}
                  >
                    <span className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.12em]", isSelected ? "text-white/70" : "text-zinc-400")}>
                      Gün {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-black">
                      {day.isRest ? <><BedDouble size={13} /> Dinlenme</> : <><Dumbbell size={13} className={isSelected ? "text-accent" : "text-primary"} /> {day.exercises.length} hareket</>}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Aktif gün içeriği */}
          <div className="mt-7">
            <h3 className="font-display text-xl font-black tracking-tight">{activeDay?.dayName}</h3>

            {activeDay?.isRest ? (
              <div className="mt-4 flex items-start gap-4 rounded-2xl border border-zinc-950/[0.07] bg-gradient-to-br from-primary/[0.05] to-transparent p-6 dark:border-white/[0.07]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15">
                  <BedDouble size={19} />
                </span>
                <div className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  <p className="font-black text-zinc-950 dark:text-white">Bugün toparlanma günü.</p>
                  Kas gelişimi dinlenirken gerçekleşir: hafif yürüyüş, esneme ve 7 saat üzeri uyku bugünün antrenmanıdır.
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {activeDay?.exercises.map((exercise, index) => {
                  const isOpen = expandedExercise === index;
                  return (
                    <div
                      key={`${exercise.name}-${index}`}
                      className={cn(
                        "overflow-hidden rounded-2xl border transition-colors duration-300",
                        isOpen ? "border-primary/40 bg-white shadow-lg shadow-primary/[0.07] dark:bg-white/[0.03]" : "border-zinc-950/[0.08] bg-white hover:border-primary/30 dark:border-white/[0.08] dark:bg-white/[0.03]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedExercise(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 p-4 text-left sm:gap-4 sm:p-5"
                      >
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg font-mono text-[11px] font-bold transition-colors", isOpen ? "bg-primary text-white" : "bg-primary-soft text-primary dark:bg-primary/15")}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-black">{exercise.name}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                            <span>{exercise.sets} set × {exercise.reps}</span>
                            <span className="flex items-center gap-1"><Timer size={11} className="text-primary" /> {exercise.rest || "60-90 sn"}</span>
                          </span>
                        </span>
                        <ChevronDown size={18} className={cn("shrink-0 text-zinc-400 transition-transform duration-300", isOpen && "rotate-180 text-primary")} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <div className="border-t border-zinc-950/[0.06] p-4 dark:border-white/[0.06] sm:p-5">
                              {/* Set ritmi göstergesi */}
                              <div className="mb-4 flex items-center gap-3">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Set ritmi</span>
                                <span className="tempo-bar h-1.5 flex-1 rounded-full bg-zinc-950/[0.06] dark:bg-white/[0.08]" aria-hidden />
                                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{exercise.rest || "60-90 sn"} dinlen</span>
                              </div>
                              <ExerciseMotionGuide exerciseName={exercise.name} isActive={isOpen} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Nasıl uygulanır ────────────────────────────────────────── */}
        <section className="reveal reveal-3 mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Play, title: "Hazırlan", text: "5-8 dakikalık ısınma ile ekleme ve kaslarını uyandır." },
            { icon: Dumbbell, title: "Uygula", text: "Set ve dinlenme sırasını takip et; formu asla bozma." },
            { icon: Check, title: "Kaydet", text: "Seans sonunda ilerlemeni hesabına işle, trendi gör." },
          ].map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="card-lab rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15"><Icon size={18} /></span>
                <span className="font-mono text-[10px] font-bold text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-black uppercase leading-none">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{text}</p>
            </div>
          ))}
        </section>

        {/* ── Bilgi kartları ─────────────────────────────────────────── */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {program.progressiveOverloadTip && (
            <section className="card-lab reveal reveal-4 rounded-2xl p-7">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-black tracking-tight">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15"><ArrowRight size={17} /></span>
                Nasıl ilerleyeceksin?
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{program.progressiveOverloadTip}</p>
            </section>
          )}
          {program.scientificRationale && (
            <section className="card-lab reveal reveal-5 rounded-2xl p-7">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-black tracking-tight">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15"><ShieldCheck size={17} /></span>
                Programın mantığı
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{program.scientificRationale}</p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

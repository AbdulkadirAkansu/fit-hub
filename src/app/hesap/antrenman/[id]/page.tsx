"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Dumbbell,
  Loader2,
  Pause,
  Play,
  Plus,
  Save,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import ExerciseMotionGuide from "@/components/workout/ExerciseMotionGuide";

interface ExerciseSet {
  weight: string;
  reps: string;
  completed: boolean;
}

interface ExerciseLog {
  name: string;
  sets: ExerciseSet[];
  unit: "tekrar" | "saniye";
  restSeconds: number;
}

interface WorkoutDay {
  label: string;
  detail: string;
  isRest: boolean;
  exercises: Array<{ name: string; sets?: string | number; reps?: string | number; rest?: string | number }>;
}

type RawScheduleItem = {
  name?: string;
  sets?: string | number;
  reps?: string | number;
  rest?: string | number;
  day?: string;
  dayName?: string;
  type?: string;
  status?: string;
  isRest?: boolean;
  exercises?: Array<{ name: string; sets?: string | number; reps?: string | number; rest?: string | number }>;
};

function normalizeSchedule(schedule: RawScheduleItem[]): WorkoutDay[] {
  if (!schedule.length) return [];

  if (schedule.every((item) => item.name)) {
    return [{ label: "Antrenman", detail: "Tüm hareketler", isRest: false, exercises: schedule as WorkoutDay["exercises"] }];
  }

  return schedule.map((item, index) => ({
    label: item.day || item.dayName?.split(":")[0] || `${index + 1}. gün`,
    detail: item.type || item.dayName?.split(":").slice(1).join(":").trim() || "Antrenman günü",
    isRest: item.isRest === true || item.status === "Dinlenme",
    exercises: Array.isArray(item.exercises) ? item.exercises : [],
  }));
}

function createLogs(items: WorkoutDay["exercises"]): ExerciseLog[] {
  return items.map((exercise) => {
    const rawReps = String(exercise.reps || "10");
    const unit = /sn|sec|saniye/i.test(rawReps) ? "saniye" : "tekrar";
    const rawRest = Number.parseInt(String(exercise.rest || "60").replace(/\D/g, ""), 10);
    return {
      name: exercise.name,
      unit,
      restSeconds: Number.isFinite(rawRest) ? Math.min(180, Math.max(20, rawRest)) : 60,
      sets: Array.from({ length: Math.max(1, Number.parseInt(String(exercise.sets || 3), 10) || 3) }, () => ({
        weight: "",
        reps: rawReps.split("-")[0].replace(/\D/g, "") || (unit === "saniye" ? "30" : "10"),
        completed: false,
      })),
    };
  });
}

export default function LiveWorkoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programTitle, setProgramTitle] = useState("");
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [personalBests, setPersonalBests] = useState<Record<string, number>>({});
  const [newRecord, setNewRecord] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [setElapsedSeconds, setSetElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);

  const fetchHistory = useCallback(async () => {
    const { data } = await supabase.from("workout_logs").select("exercise_name, weight").is("is_completed", true);
    if (!data) return;
    const bests: Record<string, number> = {};
    data.forEach((log) => {
      if (!bests[log.exercise_name] || log.weight > bests[log.exercise_name]) bests[log.exercise_name] = log.weight;
    });
    setPersonalBests(bests);
  }, []);

  const startDay = useCallback((dayIndex: number, normalizedDays: WorkoutDay[] = days) => {
    const day = normalizedDays[dayIndex];
    if (!day || day.isRest || !day.exercises.length) return;
    setSelectedDayIndex(dayIndex);
    setExercises(createLogs(day.exercises));
    setExerciseIndex(0);
    setSetIndex(0);
    setSeconds(0);
    setSetElapsedSeconds(0);
    setRestSeconds(0);
    setIsActive(true);
  }, [days]);

  const fetchProgram = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchHistory();
      const { data, error } = await supabase.from("user_programs").select("*").eq("id", params.id).single();
      if (error) throw error;

      const normalizedDays = normalizeSchedule(Array.isArray(data.schedule) ? data.schedule : []);
      setProgramTitle(data.title || "Antrenman");
      setDays(normalizedDays);
      const activeDays = normalizedDays.map((day, index) => ({ day, index })).filter(({ day }) => !day.isRest && day.exercises.length);
      if (activeDays.length === 1) {
        setSelectedDayIndex(activeDays[0].index);
        setExercises(createLogs(activeDays[0].day.exercises));
        setExerciseIndex(0);
        setSetIndex(0);
        setSeconds(0);
        setSetElapsedSeconds(0);
        setRestSeconds(0);
        setIsActive(true);
      }
    } catch (error) {
      console.warn("Program açılamadı:", error);
      router.push("/hesap");
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, params.id, router]);

  useEffect(() => {
    const task = window.setTimeout(() => { void fetchProgram(); }, 0);
    return () => window.clearTimeout(task);
  }, [fetchProgram]);

  useEffect(() => {
    if (!isActive) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1);
      if (restSeconds <= 0) setSetElapsedSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isActive, restSeconds]);

  useEffect(() => {
    if (restSeconds <= 0) return;
    const timer = window.setInterval(() => setRestSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [restSeconds]);

  const activeExercise = exercises[exerciseIndex];
  const completedSets = exercises.reduce((total, exercise) => total + exercise.sets.filter((set) => set.completed).length, 0);
  const totalSets = exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const progress = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;
  const volume = useMemo(() => exercises.reduce((total, exercise) => total + exercise.sets.reduce((sum, set) => {
    if (!set.completed) return sum;
    return sum + (Number.parseFloat(set.weight) || 0) * (Number.parseInt(set.reps, 10) || 0);
  }, 0), 0), [exercises]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const secs = value % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateSet = (setIndex: number, field: "weight" | "reps", value: string) => {
    setExercises((current) => current.map((exercise, index) => index !== exerciseIndex ? exercise : {
      ...exercise,
      sets: exercise.sets.map((set, index) => index === setIndex ? { ...set, [field]: value } : set),
    }));
  };

  const toggleSet = (setIndex: number) => {
    if (!activeExercise) return;
    const set = activeExercise.sets[setIndex];
    const willComplete = !set.completed;
    if (willComplete) {
      const weight = Number.parseFloat(set.weight) || 0;
      if (weight > 0 && weight > (personalBests[activeExercise.name] || 0)) setNewRecord(activeExercise.name);
      const hasMoreWork = activeExercise.sets.some((item, index) => index !== setIndex && !item.completed) || exerciseIndex < exercises.length - 1;
      if (hasMoreWork) setRestSeconds(activeExercise.restSeconds);
    }
    setExercises((current) => current.map((exercise, index) => index !== exerciseIndex ? exercise : {
      ...exercise,
      sets: exercise.sets.map((item, index) => index === setIndex ? { ...item, completed: willComplete } : item),
    }));
    setSetElapsedSeconds(0);
    if (willComplete && setIndex < activeExercise.sets.length - 1) {
      window.setTimeout(() => setSetIndex(setIndex + 1), 180);
    }
  };

  const addSet = () => {
    const lastSet = activeExercise.sets.at(-1);
    setExercises((current) => current.map((exercise, index) => index !== exerciseIndex ? exercise : {
      ...exercise,
      sets: [...exercise.sets, { weight: lastSet?.weight || "", reps: lastSet?.reps || "10", completed: false }],
    }));
    setSetIndex(activeExercise.sets.length);
    setSetElapsedSeconds(0);
  };

  const goToExercise = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= exercises.length) return;
    setExerciseIndex(nextIndex);
    setSetIndex(0);
    setSetElapsedSeconds(0);
    setRestSeconds(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishWorkout = async () => {
    if (!window.confirm("Antrenmanı bitirip tamamlanan setleri kaydetmek istiyor musun?")) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/hesap/giris");
        return;
      }
      const selectedDay = selectedDayIndex === null ? null : days[selectedDayIndex];
      const { data: workoutSession, error } = await supabase.from("workout_sessions").insert([{
        user_id: session.user.id,
        program_id: params.id,
        title: selectedDay ? `${programTitle} · ${selectedDay.label}` : programTitle,
        duration: seconds,
        total_volume: volume,
      }]).select().single();
      if (error) throw error;

      const logs = exercises.flatMap((exercise) => exercise.sets.map((set, index) => ({
        session_id: workoutSession.id,
        exercise_name: exercise.name,
        set_number: index + 1,
        reps: Number.parseInt(set.reps, 10) || 0,
        weight: Number.parseFloat(set.weight) || 0,
        is_completed: set.completed,
      })));
      if (logs.length) await supabase.from("workout_logs").insert(logs);
      router.push("/hesap");
    } catch (error) {
      console.error(error);
      window.alert("Antrenman kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper dark:bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

  /* ── Gün seçimi ─────────────────────────────────────────────────────── */
  if (selectedDayIndex === null) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-paper px-5 pb-20 pt-28 text-ink dark:bg-bg-dark dark:text-white sm:px-6">
        <div className="grid-lab pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/3 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[250px] w-[250px] rounded-full bg-accent/10 blur-[90px]" aria-hidden />

        <div className="container relative mx-auto max-w-4xl">
          <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-primary">
            <ArrowLeft size={14} /> Hesabıma dön
          </button>

          <div className="mt-10">
            <p className="kicker reveal">{programTitle}</p>
            <h1 className="reveal reveal-1 mt-4 font-display text-4xl font-black tracking-[-0.03em] sm:text-5xl uppercase">
              Bugünkü Antrenmanı <span className="text-primary">Seçin.</span>
            </h1>
            <p className="reveal reveal-2 mt-4 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Uygulayacağınız günü seçerek antrenmanı başlatın. Dinlenme günlerinde kas onarımınız için antrenman yapılmamalıdır.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {days.map((day, index) => {
              const disabled = day.isRest || !day.exercises.length;
              return (
                <div
                  key={`${day.label}-${index}`}
                  className={cn(
                    "reveal flex flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-all duration-300 ease-spring",
                    `reveal-${Math.min(index + 1, 6)}`,
                    disabled
                      ? "border-zinc-950/[0.06] bg-zinc-950/[0.01] opacity-60 dark:border-white/[0.06] dark:bg-white/[0.01]"
                      : "border-zinc-950/10 bg-white hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 dark:border-white/[0.08] dark:bg-surface bg-gradient-to-br from-primary/[0.02] to-transparent",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm",
                        day.isRest
                          ? "bg-zinc-950/[0.05] text-zinc-400 dark:bg-white/[0.06]"
                          : "bg-primary-soft text-primary dark:bg-primary/15",
                      )}>
                        {day.isRest ? <Clock3 size={20} /> : <Dumbbell size={20} />}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-300 dark:text-zinc-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h2 className="mt-6 font-display text-xl font-black tracking-tight">{day.label}</h2>
                    <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      {day.isRest ? "Dinlenme" : `${day.detail}`}
                    </p>

                    {!day.isRest && day.exercises.length > 0 && (
                      <ul className="mt-5 space-y-2 border-t border-zinc-950/[0.05] pt-4 dark:border-white/[0.05]">
                        {day.exercises.slice(0, 3).map((ex, exIdx) => (
                          <li key={exIdx} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            <span className="truncate font-medium">{ex.name}</span>
                          </li>
                        ))}
                        {day.exercises.length > 3 && (
                          <li className="text-[10px] font-bold text-primary pl-3.5">
                            + {day.exercises.length - 3} hareket daha
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-zinc-950/[0.05] pt-4 dark:border-white/[0.05]">
                    <span className="text-xs font-bold text-zinc-400">
                      {day.isRest ? "Kas Onarımı" : `${day.exercises.length} Egzersiz`}
                    </span>
                    {!disabled ? (
                      <button
                        type="button"
                        onClick={() => startDay(index)}
                        className="group inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5"
                      >
                        Başlat <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-black text-zinc-300 dark:text-zinc-700">Pasif</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  if (!activeExercise) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-5 text-center dark:bg-bg-dark">
        <div>
          <p className="kicker justify-center">Boş gün</p>
          <h1 className="mt-4 font-display text-2xl font-black">Bu gün için hareket bulunamadı.</h1>
          <button onClick={() => router.push("/hesap")} className="btn-outline mt-6 !py-3 text-sm">Hesabıma dön</button>
        </div>
      </main>
    );
  }

  const activeSet = activeExercise.sets[Math.min(setIndex, activeExercise.sets.length - 1)];
  const exerciseComplete = activeExercise.sets.every((set) => set.completed);

  /* ── Canlı konsol ───────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-paper pb-32 pt-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      {/* Konsol başlığı */}
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-zinc-950/[0.07] bg-paper/90 backdrop-blur-2xl dark:border-white/[0.07] dark:bg-bg-dark/85">
        <div className="container mx-auto flex h-[4.25rem] max-w-3xl items-center justify-between gap-3 px-5 sm:px-6">
          <button onClick={() => router.push("/hesap")} aria-label="Antrenmandan çık" className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-950/[0.05] hover:text-zinc-950 dark:hover:bg-white/[0.07] dark:hover:text-white">
            <X size={19} />
          </button>
          <div className="min-w-0 text-center">
            <p className="truncate font-display text-sm font-black tracking-tight">{programTitle}</p>
            <p className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{days[selectedDayIndex]?.label}</p>
          </div>
          <button
            onClick={() => setIsActive((value) => !value)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border px-4 font-mono text-sm font-bold tabular transition-colors duration-300",
              isActive
                ? "border-primary/30 bg-primary/[0.08] text-primary"
                : "border-zinc-950/15 text-zinc-500 dark:border-white/15",
            )}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
            {formatTime(seconds)}
          </button>
        </div>
        {/* İlerleme rayı — başlığın altına gömülü */}
        <div className="h-1 w-full bg-zinc-950/[0.06] dark:bg-white/[0.06]" aria-hidden>
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-5 sm:px-6">
        {/* Durum satırı */}
        <section className="flex items-center justify-between py-5 text-xs font-bold text-zinc-500">
          <span><span className="text-primary">{exerciseIndex + 1}</span> / {exercises.length} hareket</span>
          <span>{completedSets} / {totalSets} set tamamlandı</span>
        </section>

        {/* Rekor bildirimi */}
        {newRecord && (
          <div className="reveal mb-4 flex items-center justify-between rounded-2xl bg-accent px-5 py-4 text-zinc-950 shadow-xl shadow-accent/25">
            <span className="flex items-center gap-2.5 text-sm font-black">
              <Trophy size={17} /> Yeni ağırlık rekoru: {newRecord}
            </span>
            <button onClick={() => setNewRecord(null)} aria-label="Bildirimi kapat" className="transition-transform hover:scale-110"><X size={16} /></button>
          </div>
        )}

        <ExerciseMotionGuide key={activeExercise.name} exerciseName={activeExercise.name} isActive={isActive && restSeconds === 0} />

        {/* Aktif hareket konsolu */}
        <section className="card-lab mt-4 p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold text-primary">Şu an · Set {setIndex + 1}/{activeExercise.sets.length}</p>
              <h1 className="mt-2 font-display text-2xl font-black tracking-[-0.03em] sm:text-3xl">{activeExercise.name}</h1>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl bg-zinc-950/[0.04] px-3 py-2 text-center dark:bg-white/[0.05]">
                <p className="text-[10px] font-bold text-zinc-400">SET SÜRESİ</p>
                <p className="mt-1 font-mono text-lg font-bold tabular">{formatTime(setElapsedSeconds)}</p>
              </div>
              <div className="rounded-xl bg-zinc-950/[0.04] px-3 py-2 text-center dark:bg-white/[0.05]">
                <p className="text-[10px] font-bold text-zinc-400">DİNLENME</p>
                <p className="mt-1 font-mono text-lg font-bold tabular">{activeExercise.restSeconds} sn</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2" aria-label="Set seçimi">
            {activeExercise.sets.map((set, index) => (
              <button
                key={index}
                type="button"
                onClick={() => { setSetIndex(index); setSetElapsedSeconds(0); }}
                aria-label={`${index + 1}. set${set.completed ? ", tamamlandı" : ""}`}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs font-black transition-all",
                  set.completed
                    ? "border-primary bg-primary text-white"
                    : index === setIndex
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-950/10 text-zinc-400 dark:border-white/10",
                )}
              >
                {set.completed ? <Check size={14} /> : index + 1}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-black text-zinc-500">
              Ağırlık (kg)
              <input type="number" inputMode="decimal" min="0" value={activeSet.weight} onChange={(event) => updateSet(setIndex, "weight", event.target.value)} className="mt-2 h-14 w-full rounded-xl border border-zinc-950/10 bg-zinc-950/[0.025] px-4 text-center text-xl font-black tabular outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]" placeholder="0" />
            </label>
            <label className="text-xs font-black text-zinc-500">
              {activeExercise.unit === "saniye" ? "Hedef süre (saniye)" : "Tekrar"}
              <input type="number" inputMode="numeric" min="0" value={activeSet.reps} onChange={(event) => updateSet(setIndex, "reps", event.target.value)} className="mt-2 h-14 w-full rounded-xl border border-zinc-950/10 bg-zinc-950/[0.025] px-4 text-center text-xl font-black tabular outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.04]" />
            </label>
          </div>

          <button type="button" onClick={() => toggleSet(setIndex)} disabled={restSeconds > 0} className={cn("mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition-all disabled:cursor-wait disabled:opacity-50", activeSet.completed ? "border border-primary/30 bg-primary/[0.08] text-primary" : "bg-primary text-white shadow-lg shadow-primary/20")}>
            {activeSet.completed ? <><Circle size={17} /> Tamamlamayı geri al</> : <><Check size={17} /> Seti tamamla</>}
          </button>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-zinc-400">Teknik bozuluyorsa ağırlığı azalt.</p>
            <button type="button" onClick={addSet} className="inline-flex items-center gap-1.5 text-xs font-black text-zinc-500 hover:text-primary"><Plus size={13} /> Set ekle</button>
          </div>

          {exerciseComplete && <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.07] p-4 text-sm font-bold text-primary">Bu hareket tamamlandı. Hazır olduğunda sonraki harekete geç.</div>}
        </section>

        {/* Dinlenme sayacı */}
        {restSeconds > 0 && (
          <div className="reveal mt-4 flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/[0.06] px-5 py-4" aria-live="polite">
            <span className="flex items-center gap-2.5 text-sm font-black">
              <Timer size={17} className="text-primary" /> Dinlenme
            </span>
            <div className="flex items-center gap-4">
              <strong className="font-mono text-2xl font-bold tabular text-primary">{restSeconds}<span className="ml-1 text-xs">sn</span></strong>
              <button onClick={() => setRestSeconds((value) => Math.min(180, value + 15))} className="text-xs font-black text-primary">+15</button>
              <button onClick={() => setRestSeconds(0)} className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white">Geç</button>
            </div>
          </div>
        )}

        {/* Gezinme */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={exerciseIndex === 0}
            onClick={() => goToExercise(exerciseIndex - 1)}
            className="btn-outline !py-3.5 text-sm disabled:opacity-40"
          >
            <ChevronLeft size={17} /> Önceki
          </button>
          {exerciseIndex < exercises.length - 1 ? (
            <button type="button" onClick={() => goToExercise(exerciseIndex + 1)} className="btn-brand !py-3.5 text-sm">
              Sonraki <ChevronRight size={17} />
            </button>
          ) : (
            <button
              type="button"
              onClick={finishWorkout}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />} Bitir ve kaydet
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

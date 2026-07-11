"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Dumbbell,
  HeartPulse,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EXERCISES_DATA } from "@/constants/exercises";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { usePDF } from "@/hooks/usePDF";
import { cn } from "@/lib/utils";

type Goal = "genel" | "kas" | "form";
type Level = "baslangic" | "duzenli";
type Location = "ev" | "salon";

interface PlanExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

interface PlanDay {
  day: string;
  type: string;
  status: "Antrenman" | "Dinlenme";
  exercises: PlanExercise[];
}

interface ExerciseSource {
  id?: string;
  name: string;
  equipment?: string;
}

const GOALS = [
  { id: "genel" as const, title: "Genel sağlık", text: "Daha aktif olmak ve temel kuvvet kazanmak", icon: HeartPulse },
  { id: "kas" as const, title: "Kas ve güç", text: "Kas kütlesi ile temel kaldırış gücünü artırmak", icon: Dumbbell },
  { id: "form" as const, title: "Yağ kaybı ve form", text: "Antrenman düzeni kurup enerji harcamasını desteklemek", icon: Activity },
];

const LEVELS = [
  { id: "baslangic" as const, title: "Yeni başlıyorum", text: "Düzenli spor geçmişim yok veya ara verdim" },
  { id: "duzenli" as const, title: "Düzenli yapıyorum", text: "En az 6 aydır haftada 2 veya daha fazla gün çalışıyorum" },
];

const PRIORITY_IDS: Record<Location, string[]> = {
  salon: [
    "barbell-squat", "bench-press", "lat-pulldown", "romanian-deadlift", "dumbbell-shoulder-press",
    "seated-cable-row", "walking-lunges", "hip-thrust", "face-pull", "plank", "biceps-curl", "triceps-pushdown",
  ],
  ev: [
    "walking-lunges", "plank", "dead-bug", "the-hundred", "single-leg-stretch", "side-kick-series",
    "swimming-pilates", "roll-up", "criss-cross", "teaser", "swan-dive", "hanging-leg-raise",
  ],
};

function createPlan(source: ExerciseSource[], goal: Goal, level: Level, location: Location, frequency: number): PlanDay[] {
  const byId = new Map(source.map((exercise) => [exercise.id, exercise]));
  const ordered = PRIORITY_IDS[location].map((id) => byId.get(id)).filter(Boolean) as ExerciseSource[];
  const pool = ordered.length >= 6 ? ordered : source;
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const activeIndexes = frequency === 2 ? [0, 3] : frequency === 3 ? [0, 2, 4] : [0, 1, 3, 4];
  const exerciseCount = level === "baslangic" ? 4 : 5;
  const sets = level === "baslangic" ? "2" : goal === "kas" ? "4" : "3";
  const reps = goal === "kas" ? (level === "baslangic" ? "8-10" : "6-10") : goal === "form" ? "10-15" : "8-12";
  const rest = goal === "kas" ? (level === "baslangic" ? "75 sn" : "90 sn") : goal === "form" ? "45 sn" : "60 sn";
  const timedExerciseIds = new Set(["plank", "dead-bug", "the-hundred", "single-leg-stretch", "side-kick-series", "swimming-pilates"]);

  return days.map((day, dayIndex) => {
    const activePosition = activeIndexes.indexOf(dayIndex);
    if (activePosition === -1) return { day, type: "Dinlenme / hafif yürüyüş", status: "Dinlenme", exercises: [] };
    const offset = (activePosition * Math.max(2, exerciseCount - 1)) % Math.max(1, pool.length);
    const selected = Array.from({ length: Math.min(exerciseCount, pool.length) }, (_, index) => pool[(offset + index) % pool.length]);
    return {
      day,
      type: frequency === 4 ? (activePosition % 2 === 0 ? "Tüm vücut A" : "Tüm vücut B") : "Tüm vücut",
      status: "Antrenman",
      exercises: selected.map((exercise) => ({
        name: exercise.name,
        sets,
        reps: exercise.id && timedExerciseIds.has(exercise.id) ? (level === "baslangic" ? "20 sn" : "30 sn") : reps,
        rest,
      })),
    };
  });
}

export default function ProgramOlusturucuPage() {
  const { downloadPDF, isGenerating, pdfError } = usePDF();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [frequency, setFrequency] = useState(3);
  const [exerciseSource, setExerciseSource] = useState<ExerciseSource[]>(EXERCISES_DATA);
  const [schedule, setSchedule] = useState<PlanDay[]>([]);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedProgramId, setSavedProgramId] = useState<string | null>(null);

  useEffect(() => {
    const goalFromUrl = new URLSearchParams(window.location.search).get("goal");
    let prefillTimer: number | undefined;
    if (goalFromUrl === "genel" || goalFromUrl === "kas" || goalFromUrl === "form") {
      prefillTimer = window.setTimeout(() => {
        setGoal(goalFromUrl);
        setStep(2);
      }, 0);
    }
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ? { id: data.session.user.id } : null));
    supabase.from("exercises").select("id,name,equipment").order("name").then(({ data }) => {
      if (data?.length) setExerciseSource(data);
    });
    return () => {
      if (prefillTimer) window.clearTimeout(prefillTimer);
    };
  }, []);

  const planTitle = useMemo(() => {
    const goalLabel = goal === "kas" ? "Kas ve Güç" : goal === "form" ? "Form Kazanma" : "Genel Fitness";
    return `${level === "baslangic" ? "Başlangıç" : "Düzenli"} · ${goalLabel} Programı`;
  }, [goal, level]);

  const generate = () => {
    if (!goal || !level || !location) return;
    setSchedule(createPlan(exerciseSource, goal, level, location, frequency));
    setSaved(false);
    setSavedProgramId(null);
    setStep(3);
  };

  const saveProgram = async () => {
    if (!user || !goal || !level || !location || saving) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("user_programs").insert([{
        user_id: user.id,
        title: planTitle,
        goal,
        level,
        location,
        schedule,
      }]).select("id").single();
      if (error) throw error;
      setSaved(true);
      setSavedProgramId(data.id);
    } catch (error) {
      console.error(error);
      window.alert("Program kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    setSchedule((current) => current.map((day, index) => index !== dayIndex ? day : { ...day, exercises: day.exercises.filter((_, index) => index !== exerciseIndex) }));
    setSaved(false);
    setSavedProgramId(null);
  };

  const addExercise = (dayIndex: number, name: string) => {
    if (!name) return;
    setSchedule((current) => current.map((day, index) => index !== dayIndex ? day : { ...day, exercises: [...day.exercises, { name, sets: "3", reps: "8-12", rest: "60 sn" }] }));
    setSaved(false);
    setSavedProgramId(null);
  };

  const activeDays = schedule.filter((day) => day.status === "Antrenman");

  return (
    <main className="min-h-screen bg-paper pb-20 pt-24 text-zinc-950 dark:bg-bg-dark dark:text-white sm:pt-28">
      <div className="container mx-auto px-5 sm:px-6">
        <Link href="/programlar" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white">
          <ArrowLeft size={14} /> Programlara dön
        </Link>

        <div className="mx-auto mt-6 max-w-4xl">
          {/* Başlık + adım göstergesi */}
          <div className="flex flex-col gap-4 border-b border-zinc-950/[0.08] pb-6 dark:border-white/[0.08] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-primary">Program oluşturucu</p>
              <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
                Sana uygun haftalık plan.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                İki kısa adımı tamamla. Sonucu gördükten sonra istersen hareketleri düzenle.
              </p>
            </div>
            <div className="reveal reveal-2 flex shrink-0 items-center gap-3" aria-label={`Adım ${Math.min(step, 2)} / 2`}>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Adım {Math.min(step, 2)}/2
              </span>
              <span className="flex gap-1.5" aria-hidden>
                <span className={cn("h-1.5 w-10 rounded-full transition-colors duration-500", step >= 1 ? "bg-primary" : "bg-zinc-950/10 dark:bg-white/10")} />
                <span className={cn("h-1.5 w-10 rounded-full transition-colors duration-500", step >= 2 ? "bg-primary" : "bg-zinc-950/10 dark:bg-white/10")} />
              </span>
            </div>
          </div>

          {step === 1 && (
            <section className="py-6 sm:py-8">
              <h2 className="flex items-baseline gap-3 font-display text-2xl font-black tracking-tight">
                <span className="font-mono text-xs font-bold text-primary">01</span> Öncelikli hedefin nedir?
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {GOALS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setGoal(item.id); setStep(2); }}
                    className={cn(
                      "group relative flex min-h-40 flex-col rounded-lg border bg-white p-5 text-left transition-all duration-300 hover:border-primary dark:bg-white/[0.03]",
                      "reveal", `reveal-${index + 2}`,
                      goal === item.id ? "border-primary ring-4 ring-primary/10" : "border-zinc-950/10 hover:border-primary/50 dark:border-white/[0.08]",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                        <item.icon size={21} />
                      </span>
                      <span className="font-mono text-xs font-bold text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-auto pt-5">
                      <strong className="font-display text-xl font-black tracking-tight">{item.title}</strong>
                      <span className="mt-2 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.text}</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                        Seç <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="py-6 sm:py-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
              >
                <ArrowLeft size={14} /> Hedefi değiştir
              </button>

              <div className="card-lab p-5 sm:p-7">
                <h2 className="flex items-baseline gap-3 font-display text-2xl font-black tracking-tight">
                  <span className="font-mono text-xs font-bold text-primary">02</span> Planı haftana uyduralım
                </h2>

                <div className="mt-6">
                  <p className="field-label">Deneyimin</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {LEVELS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLevel(item.id)}
                        className={cn(
                          "rounded-lg border p-4 text-left transition-all duration-300",
                          level === item.id
                            ? "border-primary bg-primary/[0.06] ring-4 ring-primary/10"
                            : "border-zinc-950/10 hover:border-primary/40 dark:border-white/[0.09]",
                        )}
                      >
                        <strong className="flex items-center justify-between font-display text-base font-black">
                          {item.title}
                          {level === item.id && <Check size={16} className="text-primary" />}
                        </strong>
                        <span className="mt-1.5 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="field-label">Nerede çalışacaksın?</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {([{ id: "ev" as const, title: "Evde", icon: Home }, { id: "salon" as const, title: "Spor salonunda", icon: MapPin }]).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLocation(item.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-4 font-black transition-all duration-300",
                          location === item.id
                            ? "border-primary bg-primary/[0.06] text-primary ring-4 ring-primary/10"
                            : "border-zinc-950/10 hover:border-primary/40 dark:border-white/[0.09]",
                        )}
                      >
                        <item.icon size={19} /> {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="field-label">Haftada kaç gün ayırabilirsin?</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setFrequency(day)}
                        className={cn(
                          "rounded-lg border px-3 py-3 font-display text-lg font-black transition-all duration-300",
                          frequency === day
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                            : "border-zinc-950/10 hover:border-primary/40 dark:border-white/[0.09]",
                        )}
                      >
                        {day} <span className="text-sm font-bold opacity-70">gün</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!level || !location}
                  onClick={generate}
                  className="btn-brand mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Programı oluştur <ArrowRight size={17} />
                </button>
              </div>
            </section>
          )}

          {step === 3 && goal && level && location && (
            <section className="py-10">
              <ProfessionalPDFTemplate
                id="program-pdf-template"
                title="Kişisel Antrenman Planı"
                results={[
                  { label: "HEDEF", value: GOALS.find((item) => item.id === goal)?.title || goal },
                  { label: "SEVİYE", value: LEVELS.find((item) => item.id === level)?.title || level },
                  { label: "ORTAM", value: location === "ev" ? "Ev" : "Spor salonu" },
                  { label: "SIKLIK", value: `${frequency} gün / hafta` },
                ]}
                recommendations={["İlk hafta hareket formuna odaklan.", "Tüm setleri kontrollü teknikle tamamlayabildiğinde ağırlığı küçük adımlarla artır.", "Aynı kas grubu için antrenmanlar arasında toparlanma süresi bırak."]}
                schedule={schedule}
                scientificNote="Bu genel plan, haftaya yayılan direnç antrenmanı ve aşamalı yüklenme ilkelerini temel alır. Ağrı, rahatsızlık veya tıbbi durum varsa uygulamadan önce uygun sağlık uzmanına danış."
              />

              {/* Plan başlığı — koyu konsol paneli */}
              <div className="corner-ticks reveal relative overflow-hidden rounded-[2rem] bg-zinc-950 p-7 text-white dark:bg-white/[0.04] sm:p-9">
                <div className="bg-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                      <span className="animate-hero-pulse h-2 w-2 rounded-full bg-accent" aria-hidden /> Planın hazır
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-black tracking-tight">{planTitle}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">{frequency} antrenman günü</span>
                      <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">{location === "ev" ? "Ev" : "Spor salonu"}</span>
                      <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">{activeDays.reduce((total, day) => total + day.exercises.length, 0)} hareket</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing((value) => !value)}
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-all duration-300",
                      editing ? "bg-accent text-zinc-950" : "border border-white/20 text-white hover:bg-white/[0.08] dark:border-zinc-950/20 dark:text-zinc-950 dark:hover:bg-zinc-950/[0.06]",
                    )}
                  >
                    <Pencil size={15} /> {editing ? "Düzenlemeyi bitir" : "Planı düzenle"}
                  </button>
                </div>
              </div>

              {/* Günler */}
              <div className="mt-5 space-y-4">
                {activeDays.map((day, cardIndex) => {
                  const dayIndex = schedule.indexOf(day);
                  return (
                    <article key={day.day} className={cn("card-lab reveal p-6 sm:p-7", `reveal-${Math.min(cardIndex + 1, 6)}`)}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <span className="step-dot">{String(cardIndex + 1).padStart(2, "0")}</span>
                          <div>
                            <h3 className="font-display text-lg font-black tracking-tight">{day.day}</h3>
                            <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                              {day.type} · {day.exercises.length} hareket
                            </p>
                          </div>
                        </div>
                        <Dumbbell size={19} className="text-primary" />
                      </div>

                      <div className="mt-5 divide-y divide-zinc-950/[0.06] dark:divide-white/[0.06]">
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <div key={`${exercise.name}-${exerciseIndex}`} className="flex items-center gap-4 py-3.5">
                            <span className="font-mono text-[11px] font-bold text-zinc-400">{String(exerciseIndex + 1).padStart(2, "0")}</span>
                            <span className="min-w-0 flex-1 text-sm font-bold">{exercise.name}</span>
                            <span className="chip-mono shrink-0">{exercise.sets} × {exercise.reps} · {exercise.rest}</span>
                            {editing && (
                              <button
                                type="button"
                                onClick={() => removeExercise(dayIndex, exerciseIndex)}
                                aria-label={`${exercise.name} hareketini kaldır`}
                                className="text-zinc-400 transition-colors hover:text-rose-500"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {editing && (
                        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-zinc-950/15 bg-zinc-950/[0.02] px-4 py-3 dark:border-white/15 dark:bg-white/[0.03]">
                          <Plus size={15} className="shrink-0 text-primary" />
                          <select
                            aria-label={`${day.day} gününe hareket ekle`}
                            defaultValue=""
                            onChange={(event) => { addExercise(dayIndex, event.target.value); event.target.value = ""; }}
                            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                          >
                            <option value="">Hareket ekle</option>
                            {exerciseSource.map((exercise) => (
                              <option key={exercise.id || exercise.name} value={exercise.name}>{exercise.name}</option>
                            ))}
                          </select>
                        </label>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Aksiyonlar */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button type="button" disabled={isGenerating} onClick={() => downloadPDF("program-pdf-template", "fithub-antrenman-planim")} className="btn-outline !py-3.5 text-sm disabled:cursor-wait disabled:opacity-60">
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} {isGenerating ? "PDF hazırlanıyor" : "PDF indir"}
                </button>
                {user ? (
                  <button
                    type="button"
                    onClick={saveProgram}
                    disabled={saving || saved}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black text-white transition-all duration-300 disabled:opacity-80",
                      saved ? "bg-zinc-950 dark:bg-white/15" : "btn-brand !py-3.5",
                    )}
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Hesabıma kaydedildi" : "Hesabıma kaydet"}
                  </button>
                ) : (
                  <Link href="/hesap/giris" className="btn-brand !py-3.5 text-sm">
                    <Save size={16} /> Kaydetmek için giriş yap
                  </Link>
                )}
                <button type="button" onClick={() => { setStep(1); setSchedule([]); setEditing(false); setSaved(false); setSavedProgramId(null); }} className="btn-outline !py-3.5 text-sm">
                  <RotateCcw size={16} /> Yeniden oluştur
                </button>
              </div>
              {pdfError && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{pdfError}</p>}

              {savedProgramId && (
                <Link href={`/hesap/antrenman/${savedProgramId}`} className="group mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-4 font-black text-zinc-950 shadow-xl shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
                  Antrenman moduna geç <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
              <p className="mt-6 font-mono text-[10px] font-bold uppercase leading-5 tracking-[0.14em] text-zinc-400">
                Bu plan genel bilgilendirme amaçlıdır. Ağrı veya sağlık sorunun varsa önce uygun sağlık uzmanına danış.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

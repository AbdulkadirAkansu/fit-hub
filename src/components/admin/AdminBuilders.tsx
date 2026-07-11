"use client";

import React from "react";
import { ChevronUp, ChevronDown, Trash2, PlusCircle, GripVertical, Bed, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_CLS } from "./AdminFields";
import type { WorkoutDay, WorkoutExercise } from "@/hooks/useAdmin";

const ACCENTS: Record<string, string> = {
  indigo: "bg-primary/10 text-primary",
  emerald: "bg-accent/10 text-accent",
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
  rose: "bg-rose-500/10 text-rose-500",
};

/** Editörde alanları gruplayan bölüm kartı. */
export function SectionCard({ icon: Icon, title, desc, accent = "indigo", children }: {
  icon: React.ElementType; title: string; desc?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-bg-dark overflow-hidden">
      <header className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/60 dark:bg-white/[0.02]">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", ACCENTS[accent])}>
          <Icon size={16} />
        </div>
        <div>
          <h4 className="text-sm font-black tracking-tight leading-tight">{title}</h4>
          {desc && <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5">{desc}</p>}
        </div>
      </header>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  );
}

export function MiniIconBtn({ onClick, children, danger, title }: { onClick: () => void; children: React.ReactNode; danger?: boolean; title?: string }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0",
        danger ? "text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
               : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800")}>
      {children}
    </button>
  );
}

/** Egzersiz adımlarını görsel olarak yönetir (ham JSON yerine). */
export function StepBuilder({ steps, onChange }: { steps: string[]; onChange: (s: string[]) => void }) {
  const update = (i: number, val: string) => onChange(steps.map((s, idx) => (idx === i ? val : s)));
  const remove = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2.5">
      {steps.length === 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 py-2">Henüz adım yok. Aşağıdaki butonla adım ekleyin.</p>
      )}
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-6 h-6 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[11px] font-black">{i + 1}</span>
          <input value={step} onChange={(e) => update(i, e.target.value)} placeholder={`Adım ${i + 1} açıklaması...`} className={FIELD_CLS} />
          <MiniIconBtn onClick={() => move(i, -1)} title="Yukarı"><ChevronUp size={14} /></MiniIconBtn>
          <MiniIconBtn onClick={() => move(i, 1)} title="Aşağı"><ChevronDown size={14} /></MiniIconBtn>
          <MiniIconBtn onClick={() => remove(i)} danger title="Sil"><Trash2 size={14} /></MiniIconBtn>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...steps, ""])}
        className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors pt-1">
        <PlusCircle size={15} /> Adım Ekle
      </button>
    </div>
  );
}

/** Program antrenman planını gün gün, görsel olarak oluşturur (ham JSON yerine). */
export function WorkoutBuilder({ days, onChange }: { days: WorkoutDay[]; onChange: (d: WorkoutDay[]) => void }) {
  const updateDay = (i: number, patch: Partial<WorkoutDay>) => onChange(days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  const removeDay = (i: number) => onChange(days.filter((_, idx) => idx !== i));
  const addDay = () => onChange([...days, { dayName: `${days.length + 1}. Gün`, isRest: false, exercises: [] }]);
  const updateEx = (di: number, ei: number, patch: Partial<WorkoutExercise>) =>
    updateDay(di, { exercises: days[di].exercises.map((ex, idx) => (idx === ei ? { ...ex, ...patch } : ex)) });
  const addEx = (di: number) => updateDay(di, { exercises: [...days[di].exercises, { name: "", sets: "3", reps: "12", rest: "60 sn" }] });
  const removeEx = (di: number, ei: number) => updateDay(di, { exercises: days[di].exercises.filter((_, idx) => idx !== ei) });

  return (
    <div className="space-y-3">
      {days.length === 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 py-2">Henüz gün eklenmedi. Tek günlük veya çok günlük (split) plan oluşturabilirsiniz.</p>
      )}
      {days.map((day, di) => (
        <div key={di} className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 p-3 border-b border-zinc-100 dark:border-zinc-800">
            <GripVertical size={15} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
            <input value={day.dayName} onChange={(e) => updateDay(di, { dayName: e.target.value })} placeholder="Gün adı (örn: 1. Gün: Göğüs & Triceps)" className={cn(FIELD_CLS, "font-bold")} />
            <button type="button" onClick={() => updateDay(di, { isRest: !day.isRest })}
              className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors shrink-0",
                day.isRest ? "bg-amber-500/10 text-amber-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400")}>
              <Bed size={13} /> {day.isRest ? "Dinlenme" : "Antrenman"}
            </button>
            <MiniIconBtn onClick={() => removeDay(di)} danger title="Günü sil"><Trash2 size={15} /></MiniIconBtn>
          </div>

          {day.isRest ? (
            <p className="px-4 py-4 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Bed size={14} /> Dinlenme ve toparlanma günü — egzersiz eklenmez.</p>
          ) : (
            <div className="p-3 space-y-2">
              {day.exercises.length > 0 && (
                <div className="hidden sm:grid grid-cols-[1fr_70px_80px_90px_28px] gap-2 px-1 text-[9px] font-black uppercase tracking-wider text-zinc-400">
                  <span>Egzersiz</span><span className="text-center">Set</span><span className="text-center">Tekrar</span><span className="text-center">Dinlenme</span><span />
                </div>
              )}
              {day.exercises.map((ex, ei) => (
                <div key={ei} className="grid grid-cols-2 sm:grid-cols-[1fr_70px_80px_90px_28px] gap-2 items-center">
                  <input value={ex.name} onChange={(e) => updateEx(di, ei, { name: e.target.value })} placeholder="Egzersiz adı" className={cn(FIELD_CLS, "col-span-2 sm:col-span-1")} />
                  <input value={ex.sets} onChange={(e) => updateEx(di, ei, { sets: e.target.value })} placeholder="Set" className={cn(FIELD_CLS, "text-center")} />
                  <input value={ex.reps} onChange={(e) => updateEx(di, ei, { reps: e.target.value })} placeholder="Tekrar" className={cn(FIELD_CLS, "text-center")} />
                  <input value={ex.rest} onChange={(e) => updateEx(di, ei, { rest: e.target.value })} placeholder="Dinlenme" className={cn(FIELD_CLS, "text-center")} />
                  <MiniIconBtn onClick={() => removeEx(di, ei)} danger title="Egzersizi sil"><Trash2 size={14} /></MiniIconBtn>
                </div>
              ))}
              <button type="button" onClick={() => addEx(di)} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity pt-1">
                <PlusCircle size={14} /> Egzersiz Ekle
              </button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={addDay}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-500 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <Plus size={15} /> Antrenman Günü Ekle
      </button>
    </div>
  );
}

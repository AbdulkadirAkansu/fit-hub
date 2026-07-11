"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BarChart3, CheckCircle2, ChevronRight, Dumbbell, Flame,
  LayoutDashboard, Loader2, LogOut, Plus, Save, Settings, ShieldCheck,
  Sparkles, Trash2, X, Scale, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";
import { AVATAR_EMOJIS, AVATAR_HUES } from "@/lib/avatar";
import TrendChart from "@/components/dashboard/TrendChart";
import ProgramCover from "@/components/common/ProgramCover";

const TABS = [
  { id: "rota", label: "Bugün", icon: LayoutDashboard },
  { id: "programlarim", label: "Planım", icon: Dumbbell },
  { id: "takip", label: "Takip", icon: BarChart3 },
  { id: "profil", label: "Profil", icon: Settings },
];

const CALCULATION_META: Record<string, { label: string; href: string }> = {
  vki: { label: "Vücut Kitle Endeksi", href: "/hesaplama/vki" },
  kalori: { label: "Kalori İhtiyacı", href: "/hesaplama/kalori" },
  makro: { label: "Makro Dağılımı", href: "/hesaplama/makro" },
  "1rm": { label: "1RM Güç Tahmini", href: "/hesaplama/1rm" },
  nabiz: { label: "Nabız Bölgeleri", href: "/hesaplama/nabiz" },
  su: { label: "Su İhtiyacı", href: "/hesaplama/su" },
  "ideal-kilo": { label: "İdeal Kilo", href: "/hesaplama/ideal-kilo" },
  "bel-boy": { label: "Bel-Boy Oranı", href: "/hesaplama/bel-boy" },
  "bel-kalca": { label: "Bel-Kalça Oranı", href: "/hesaplama/bel-kalca" },
  "vucut-kompozisyonu": { label: "Vücut Kompozisyonu", href: "/hesaplama/vucut-kompozisyonu" },
};

const MEASUREMENT_FIELDS = [
  { key: "weight", label: "Kilo (kg)", required: true },
  { key: "waist", label: "Bel (cm)" },
  { key: "hips", label: "Kalça (cm)" },
  { key: "chest", label: "Göğüs (cm)" },
  { key: "neck", label: "Boyun (cm)" },
  { key: "biceps", label: "Kol (cm)" },
  { key: "shoulder", label: "Omuz (cm)" },
  { key: "thigh", label: "Bacak (cm)" },
] as const;

/** Küçük SVG ilerleme halkası. */
function ProgressRing({ value, size = 72, stroke = 7, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={label || `%${clamped}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="var(--color-accent)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - clamped / 100)}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span className="absolute font-display text-lg font-black tabular">{Math.round(clamped)}</span>
    </div>
  );
}

export default function UserDashboardPage() {
  const [recordMode, setRecordMode] = useState<"none" | "measurement" | "nutrition">("none");
  const {
    activeTab, setActiveTab, loading, profile,
    measurements, programs, calculations, sessions, nutritionLogs,
    scienceScore, assistantChecklist, isAddingMeasurement, setIsAddingMeasurement,
    selectedChartMetric, setSelectedChartMetric,
    mForm, setMForm, nameInput, setNameInput,
    avatarEmoji, setAvatarEmoji, avatarHue, setAvatarHue,
    isSavingProfile,
    targetWeight, setTargetWeight, targetCalories, setTargetCalories,
    developmentProfile, setDevelopmentProfile, profileCompletion, toast,
    handleDeleteCalculation, handleDeleteProgram, handleDeleteMeasurement,
    handleUpdateProfile, handleAddMeasurement, handleAddNutrition, handleLogout,
    getAwardedBadges,
  } = useDashboard();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySessions = sessions.filter((session) => new Date(session.completed_at) > oneWeekAgo).length;
  const weeklyGoal = Number(developmentProfile.weeklyGoal) || 3;
  const latestMeasurement = measurements[0];
  const latestNutrition = nutritionLogs[0];
  const firstName = profile?.full_name?.split(" ")[0] || "Sporcu";
  const hue = AVATAR_HUES.find((item) => item.id === avatarHue) || AVATAR_HUES[0];
  const badges = getAwardedBadges();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={30} />
      </div>
    );
  }

  const openAssistant = () => window.dispatchEvent(new Event("toggle-global-assistant"));
  const openMeasurementForm = () => { setActiveTab("takip"); setRecordMode("measurement"); setIsAddingMeasurement(true); };

  return (
    <main className="min-h-screen bg-paper pb-24 pt-24 text-zinc-950 dark:bg-bg-dark dark:text-white sm:pt-28">
      {toast.show && (
        <div className={cn("fixed left-1/2 top-24 z-[120] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-xl", toast.type === "success" ? "bg-zinc-950 dark:bg-zinc-800" : "bg-rose-600")}>
          {toast.message}
        </div>
      )}

      <div className="container mx-auto px-5 sm:px-6">
        {/* ── Kimlik kartı ─────────────────────────────────────────── */}
        <header className="relative overflow-hidden rounded-[2rem] bg-zinc-950 dark:bg-surface p-7 text-white shadow-xl dark:shadow-none sm:p-9">
          <div className="grid-lab pointer-events-none absolute inset-0 opacity-35" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[90px]" aria-hidden />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-accent/[0.05] blur-[80px]" aria-hidden />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.4rem] text-4xl shadow-lg ring-4", hue.solid, hue.ring)} aria-hidden>
                {avatarEmoji}
              </div>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Hesabım</p>
                <h1 className="mt-1.5 font-display text-4xl font-black uppercase leading-none sm:text-5xl">Merhaba, {firstName}.</h1>
                <p className="mt-2.5 text-sm text-zinc-400">Bugünkü durumunu gör, kaydını ekle, planına devam et.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                <ProgressRing value={scienceScore} label={`Gelişim skoru ${scienceScore}/100`} />
                <div>
                  <p className="stat-label text-zinc-400">Gelişim skoru</p>
                  <p className="mt-1 text-sm font-black">{scienceScore >= 80 ? "Elit seviye" : scienceScore >= 45 ? "Yolunda" : "Isınıyorsun"}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">Bu hafta {weeklySessions}/{weeklyGoal} antrenman</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.role?.trim() === "admin" && (
                  <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent">
                    <ShieldCheck size={15} /> Admin
                  </Link>
                )}
                <button type="button" onClick={openAssistant} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-black text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
                  <Sparkles size={15} /> Koça sor
                </button>
                <button type="button" onClick={handleLogout} aria-label="Çıkış yap" title="Çıkış yap" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-zinc-300 transition-colors hover:border-rose-400/60 hover:text-rose-300">
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ── Sekmeler ─────────────────────────────────────────────── */}
        <nav className="sticky top-[4.25rem] z-30 mt-4 rounded-full border border-zinc-950/[0.08] bg-white/90 p-1.5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-surface/90" aria-label="Hesap bölümleri">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex shrink-0 flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-zinc-600 hover:bg-primary/[0.07] hover:text-primary dark:text-zinc-300",
                )}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-7">
          {/* ════ BUGÜN ════ */}
          {activeTab === "rota" && (
            <div className="space-y-5">
              {profileCompletion < 100 && (
                <button type="button" onClick={() => setActiveTab("profil")} className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 text-left transition-colors hover:border-primary dark:bg-primary/[0.08]">
                  <div className="flex items-center gap-4">
                    <ProgressRing value={profileCompletion} size={52} stroke={5} />
                    <div>
                      <h2 className="font-black">Profilini tamamla, önerileri kişiselleştir.</h2>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Yaş, boy ve hedef bilgilerin eksik.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </button>
              )}

              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Bugünün planı */}
                <section className="relative overflow-hidden rounded-[2rem] bg-zinc-950 dark:bg-surface p-8 text-white shadow-xl dark:shadow-none sm:p-9">
                  <div className="grid-lab absolute inset-0 opacity-30" aria-hidden />
                  <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-[80px]" aria-hidden />
                  <div className="relative">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Bugünün planı</p>
                    <h2 className="mt-3 font-display text-3xl font-black uppercase leading-none">Sıradaki küçük adımlar</h2>
                    <div className="mt-6 space-y-2.5">
                      {(assistantChecklist.length ? assistantChecklist.slice(0, 3) : ["İlk ölçümünü ekle.", "Hedefine uygun bir program seç."]).map((item, index) => (
                        <div key={item} className="flex items-center gap-3.5 rounded-xl bg-white/[0.09] p-4 backdrop-blur-sm">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-black text-zinc-950">{index + 1}</span>
                          <p className="text-sm font-semibold leading-6 text-white/90">{item}</p>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={openAssistant} className="group mt-6 inline-flex items-center gap-2 text-sm font-black text-accent">
                      Bu planı koça sor <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </section>

                {/* Hızlı kayıt */}
                <section className="card-lab rounded-[1.5rem] p-7 sm:p-8">
                  <h2 className="font-display text-2xl font-black uppercase leading-none">Hızlı kayıt</h2>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Günlük takibi birkaç saniyede güncelle.</p>
                  <div className="mt-5 grid gap-3">
                    <button type="button" onClick={openMeasurementForm} className="row-card group text-left">
                      <span className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15"><Plus size={19} /></span>
                        <span>
                          <span className="block font-black">Ölçüm ekle</span>
                          <span className="mt-0.5 block text-xs text-zinc-500">Kilo ve çevre ölçüleri</span>
                        </span>
                      </span>
                      <ArrowRight size={16} className="text-zinc-400 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </button>
                    <button type="button" onClick={() => { setActiveTab("takip"); setRecordMode("nutrition"); }} className="row-card group text-left">
                      <span className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15"><Flame size={19} /></span>
                        <span>
                          <span className="block font-black">Günü kaydet</span>
                          <span className="mt-0.5 block text-xs text-zinc-500">Kalori, protein ve su</span>
                        </span>
                      </span>
                      <ArrowRight size={16} className="text-zinc-400 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </button>
                  </div>

                  {badges.length > 0 && (
                    <div className="mt-6 border-t border-zinc-950/[0.07] pt-5 dark:border-white/[0.07]">
                      <p className="stat-label">Kazanılan rozetler</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {badges.map((badge) => (
                          <span key={badge.id} title={badge.desc} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-xs font-bold text-primary dark:bg-primary/10">
                            <badge.icon size={13} /> {badge.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Durum karoları */}
              <section className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Son Kilo", value: latestMeasurement ? `${latestMeasurement.weight} kg` : "Kayıt yok", detail: latestMeasurement ? new Date(latestMeasurement.created_at).toLocaleDateString("tr-TR") : "İlk ölçümünü ekle", icon: Scale, color: "bg-primary-soft text-primary dark:bg-primary/10" },
                  { label: "Bu Haftalık Antrenman", value: `${weeklySessions} / ${weeklyGoal}`, detail: weeklySessions >= weeklyGoal ? "Haftalık hedef tamam 🎉" : `${weeklyGoal - weeklySessions} antrenman kaldı`, ring: Math.round((weeklySessions / weeklyGoal) * 100), icon: Trophy, color: "bg-accent-soft text-accent dark:bg-accent/10" },
                  { label: "Bugünkü Beslenme", value: latestNutrition ? `${latestNutrition.calories} kcal` : "Kayıt yok", detail: latestNutrition ? `${latestNutrition.protein} g protein · ${latestNutrition.water_liters} L su` : "Bugünkü değerlerini ekle", icon: Flame, color: "bg-rose-500/10 text-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-950/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 dark:border-white/[0.08] dark:bg-surface">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">{item.label}</span>
                      {item.icon && !item.ring && (
                        <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", item.color)}>
                          <item.icon size={16} />
                        </span>
                      )}
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="font-display text-3xl font-black tracking-tight leading-none text-zinc-900 dark:text-white">{item.value}</p>
                        <p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{item.detail}</p>
                      </div>
                      {typeof item.ring === "number" && (
                        <ProgressRing value={item.ring} size={52} stroke={5} label={`Haftalık ilerleme %${item.ring}`} />
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {/* Kısayollar */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Program oluştur", href: "/programlar/olusturucu" },
                  { label: "Hesaplama yap", href: "/hesaplama" },
                  { label: "Hareket öğren", href: "/egzersizler" },
                ].map((shortcut) => (
                  <Link key={shortcut.href} href={shortcut.href} className="row-card group font-black">
                    {shortcut.label}
                    <ArrowUpRight size={17} className="text-zinc-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ════ PLANIM ════ */}
          {activeTab === "programlarim" && (
            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-4xl font-black uppercase leading-none">Planım</h2>
                  <p className="mt-2 text-zinc-500 dark:text-zinc-400">Kaydettiğin programları aç, antrenmana devam et.</p>
                </div>
                <Link href="/programlar/olusturucu" className="btn-brand !py-3 text-sm"><Plus size={16} /> Yeni program</Link>
              </div>

              {programs.length ? (
                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  {programs.map((program, index) => (
                    <article key={program.id} className="group overflow-hidden rounded-[1.5rem] border border-zinc-950/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.08] dark:border-white/10 dark:bg-surface">
                      <div className="relative h-24">
                        <ProgramCover title={program.title} level={program.level || "Orta"} category={program.goal} index={index} compact />
                        <button
                          type="button"
                          onClick={() => handleDeleteProgram(program.id)}
                          aria-label="Programı sil"
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:bg-rose-600 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-5 sm:p-6">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{program.level || "Kişisel program"}</span>
                        <h3 className="mt-2 font-display text-2xl font-black leading-tight">{program.title}</h3>
                        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{program.schedule?.length || 0} gün · {program.location || "Konum belirtilmedi"}</p>
                        <Link href={`/hesap/antrenman/${program.id}`} className="mt-5 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover">
                          Antrenmanı aç <ArrowRight size={15} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-7 rounded-[1.5rem] border border-dashed border-zinc-300 p-12 text-center dark:border-white/15">
                  <Dumbbell className="mx-auto text-zinc-300 dark:text-zinc-700" size={34} />
                  <h3 className="mt-4 font-display text-2xl font-black uppercase">Henüz kayıtlı programın yok.</h3>
                  <p className="mt-2 text-sm text-zinc-500">Hedefine ve haftana göre ilk programını oluştur.</p>
                  <Link href="/programlar/olusturucu" className="btn-brand mt-6 !py-3 text-sm">Program oluştur <ArrowRight size={15} /></Link>
                </div>
              )}
            </section>
          )}

          {/* ════ TAKİP ════ */}
          {activeTab === "takip" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-4xl font-black uppercase leading-none">Takip</h2>
                  <p className="mt-2 text-zinc-500 dark:text-zinc-400">Ölçüm, beslenme ve hesaplama kayıtların tek yerde.</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setRecordMode("measurement"); setIsAddingMeasurement(true); }} className="btn-brand !py-3 text-sm"><Plus size={15} /> Ölçüm</button>
                  <button type="button" onClick={() => setRecordMode("nutrition")} className="btn-outline !py-3 text-sm"><Plus size={15} /> Günlük</button>
                </div>
              </div>

              {recordMode === "measurement" && isAddingMeasurement && (
                <form onSubmit={handleAddMeasurement} className="rounded-[1.5rem] border border-primary/25 bg-white p-6 shadow-lg shadow-primary/[0.06] dark:bg-surface sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-black uppercase leading-none">Yeni ölçüm</h3>
                      <p className="mt-2 text-sm text-zinc-500">Kilo zorunlu; diğer alanları istersen ekle.</p>
                    </div>
                    <button type="button" onClick={() => { setRecordMode("none"); setIsAddingMeasurement(false); }} aria-label="Formu kapat" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-950/[0.05] hover:text-zinc-700 dark:hover:bg-white/[0.07]">
                      <X size={17} />
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {MEASUREMENT_FIELDS.map((field) => (
                      <label key={field.key}>
                        <span className="field-label">{field.label}{"required" in field && field.required ? " *" : ""}</span>
                        <input
                          type="number" step="0.1" required={"required" in field && field.required}
                          value={mForm[field.key as keyof typeof mForm]}
                          onChange={(event) => setMForm({ ...mForm, [field.key]: event.target.value })}
                          className="field-input mt-2"
                        />
                      </label>
                    ))}
                  </div>
                  <button type="submit" className="btn-brand mt-6 !py-3.5 text-sm"><Save size={15} /> Ölçümü kaydet</button>
                </form>
              )}

              {recordMode === "nutrition" && (
                <form onSubmit={(event) => { handleAddNutrition(event); setRecordMode("none"); }} className="rounded-[1.5rem] border border-primary/25 bg-white p-6 shadow-lg shadow-primary/[0.06] dark:bg-surface sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-black uppercase leading-none">Bugünü kaydet</h3>
                      <p className="mt-2 text-sm text-zinc-500">Yaklaşık değerler de takip için yeterlidir.</p>
                    </div>
                    <button type="button" onClick={() => setRecordMode("none")} aria-label="Formu kapat" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-950/[0.05] hover:text-zinc-700 dark:hover:bg-white/[0.07]">
                      <X size={17} />
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <label><span className="field-label">Kalori (kcal)</span><input name="calories" type="number" min="0" required className="field-input mt-2" /></label>
                    <label><span className="field-label">Protein (g)</span><input name="protein" type="number" min="0" required className="field-input mt-2" /></label>
                    <label><span className="field-label">Su (litre)</span><input name="water" type="number" min="0" step="0.1" required className="field-input mt-2" /></label>
                  </div>
                  <button type="submit" className="btn-brand mt-6 !py-3.5 text-sm"><Save size={15} /> Günü kaydet</button>
                </form>
              )}

              {/* Değişim grafiği */}
              <section className="card-lab rounded-[1.5rem] p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase leading-none">Değişim grafiği</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">En az iki kayıt olduğunda değişimi görürsün.</p>
                  </div>
                  <select value={selectedChartMetric} onChange={(event) => setSelectedChartMetric(event.target.value)} className="field-input !h-11 w-auto min-w-40 cursor-pointer">
                    <option value="weight">Kilo</option>
                    <option value="waist">Bel çevresi</option>
                    <option value="calories">Kalori</option>
                    <option value="protein">Protein</option>
                    <option value="water_liters">Su</option>
                    <option value="volume">Antrenman hacmi</option>
                  </select>
                </div>
                <div className="mt-5">
                  <TrendChart selectedChartMetric={selectedChartMetric} correlationMetricB="" isCorrelationMode={false} sessions={sessions} nutritionLogs={nutritionLogs} measurements={measurements} targetWeight={targetWeight} targetCalories={targetCalories} />
                </div>
              </section>

              <div className="grid gap-5 lg:grid-cols-2">
                <section className="card-lab rounded-[1.5rem] p-6">
                  <h3 className="font-display text-xl font-black uppercase">Son ölçümler</h3>
                  <div className="mt-3 divide-y divide-zinc-950/[0.06] dark:divide-white/[0.06]">
                    {measurements.length ? measurements.slice(0, 5).map((measurement) => (
                      <div key={measurement.id} className="flex items-center justify-between py-3.5">
                        <div>
                          <p className="font-black tabular">{measurement.weight} kg</p>
                          <p className="mt-1 text-xs text-zinc-500">{new Date(measurement.created_at).toLocaleDateString("tr-TR")}{measurement.waist ? ` · Bel ${measurement.waist} cm` : ""}</p>
                        </div>
                        <button type="button" onClick={() => handleDeleteMeasurement(measurement.id)} aria-label="Ölçümü sil" className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )) : <p className="py-5 text-sm text-zinc-500">Henüz ölçüm yok.</p>}
                  </div>
                </section>

                <section className="card-lab rounded-[1.5rem] p-6">
                  <h3 className="font-display text-xl font-black uppercase">Kaydedilen hesaplamalar</h3>
                  <div className="mt-3 divide-y divide-zinc-950/[0.06] dark:divide-white/[0.06]">
                    {calculations.length ? calculations.slice(0, 6).map((calculation) => {
                      const meta = CALCULATION_META[calculation.type] || { label: calculation.type, href: "/hesaplama" };
                      return (
                        <div key={calculation.id} className="flex items-center justify-between gap-3 py-3.5">
                          <Link href={meta.href} className="group min-w-0">
                            <p className="truncate font-black transition-colors group-hover:text-primary">{meta.label}</p>
                            <p className="mt-1 text-xs text-zinc-500">{new Date(calculation.created_at).toLocaleDateString("tr-TR")}</p>
                          </Link>
                          <button type="button" onClick={() => handleDeleteCalculation(calculation.id)} aria-label="Hesaplamayı sil" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    }) : <p className="py-5 text-sm text-zinc-500">Henüz kayıtlı hesaplama yok.</p>}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ════ PROFİL ════ */}
          {activeTab === "profil" && (
            <section className="max-w-5xl space-y-5">
              <div>
                <p className="kicker">Kişisel ayarlar</p>
                <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none">Profil ve hedefler</h2>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">Bu bilgiler hesaplamaları ve koç önerilerini kişiselleştirir.</p>
              </div>

              {/* Görünüm: avatar + renk */}
              <div className="card-lab rounded-[1.5rem] p-6 sm:p-8">
                <h3 className="font-display text-2xl font-black uppercase leading-none">Görünümünü seç</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Avatarın toplulukta ve hesabında görünür.</p>

                <div className="mt-6 flex flex-col gap-7 sm:flex-row sm:items-start">
                  <div className={cn("flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.6rem] text-5xl shadow-lg ring-4 transition-all duration-300", hue.solid, hue.ring)} aria-label="Avatar önizleme">
                    {avatarEmoji}
                  </div>
                  <div className="min-w-0 flex-1 space-y-5">
                    <div>
                      <p className="field-label">Simge</p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {AVATAR_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setAvatarEmoji(emoji)}
                            aria-label={`Avatar ${emoji}`}
                            aria-pressed={avatarEmoji === emoji}
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition-all duration-200",
                              avatarEmoji === emoji
                                ? "scale-110 border-primary bg-primary-soft shadow-lg shadow-primary/15 dark:bg-primary/15"
                                : "border-zinc-950/10 bg-white hover:border-primary/40 dark:border-white/10 dark:bg-white/[0.04]",
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="field-label">Renk</p>
                      <div className="mt-2.5 flex flex-wrap gap-2.5">
                        {AVATAR_HUES.map((hueOption) => (
                          <button
                            key={hueOption.id}
                            type="button"
                            onClick={() => setAvatarHue(hueOption.id)}
                            aria-label={hueOption.label}
                            aria-pressed={avatarHue === hueOption.id}
                            title={hueOption.label}
                            className={cn(
                              "h-9 w-9 rounded-full transition-all duration-200",
                              hueOption.solid,
                              avatarHue === hueOption.id ? "scale-110 ring-4 ring-primary/30 ring-offset-2 ring-offset-white dark:ring-offset-surface" : "opacity-70 hover:opacity-100",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bilgiler */}
              <div className="card-lab rounded-[1.5rem] p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-5">
                  <ProgressRing value={profileCompletion} size={58} stroke={6} label={`Profil tamamlanma %${profileCompletion}`} />
                  <div>
                    <p className="font-black">Profil tamamlanma</p>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{profileCompletion === 100 ? "Harika — tüm öneriler kişiselleştirildi." : "Eksik alanları doldurdukça öneriler netleşir."}</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label><span className="field-label">Ad soyad</span><input value={nameInput} onChange={(event) => setNameInput(event.target.value)} className="field-input mt-2" /></label>
                  <label><span className="field-label">Yaş</span><input type="number" min="18" max="100" value={developmentProfile.age} onChange={(event) => setDevelopmentProfile({ ...developmentProfile, age: event.target.value })} className="field-input mt-2" /></label>
                  <label><span className="field-label">Boy (cm)</span><input type="number" min="120" max="230" value={developmentProfile.height} onChange={(event) => setDevelopmentProfile({ ...developmentProfile, height: event.target.value })} className="field-input mt-2" /></label>
                  <label><span className="field-label">Biyolojik cinsiyet</span>
                    <select value={developmentProfile.gender} onChange={(event) => setDevelopmentProfile({ ...developmentProfile, gender: event.target.value as "" | "erkek" | "kadin" })} className="field-input mt-2 cursor-pointer">
                      <option value="">Seç</option><option value="erkek">Erkek</option><option value="kadin">Kadın</option>
                    </select>
                  </label>
                  <label><span className="field-label">Ana hedef</span>
                    <select value={developmentProfile.goal} onChange={(event) => setDevelopmentProfile({ ...developmentProfile, goal: event.target.value })} className="field-input mt-2 cursor-pointer">
                      <option value="">Seç</option><option value="kilo-verme">Yağ kaybetmek</option><option value="koruma">Sağlıklı kalmak</option><option value="kas-kazanma">Kas ve güç kazanmak</option>
                    </select>
                  </label>
                  <label><span className="field-label">Hareket düzeyi</span>
                    <select value={developmentProfile.activity} onChange={(event) => setDevelopmentProfile({ ...developmentProfile, activity: event.target.value })} className="field-input mt-2 cursor-pointer">
                      <option value="1.2">Hareketsiz</option><option value="1.375">Hafif aktif</option><option value="1.55">Orta aktif</option><option value="1.725">Çok aktif</option>
                    </select>
                  </label>
                  <label><span className="field-label">Haftalık antrenman</span>
                    <select value={developmentProfile.weeklyGoal} onChange={(event) => setDevelopmentProfile({ ...developmentProfile, weeklyGoal: event.target.value })} className="field-input mt-2 cursor-pointer">
                      <option value="2">2 gün</option><option value="3">3 gün</option><option value="4">4 gün</option><option value="5">5 gün</option>
                    </select>
                  </label>
                  <label><span className="field-label">Hedef kilo (kg)</span><input type="number" step="0.1" value={targetWeight} onChange={(event) => setTargetWeight(event.target.value)} className="field-input mt-2" /></label>
                  <label><span className="field-label">Günlük kalori hedefi</span><input type="number" value={targetCalories} onChange={(event) => setTargetCalories(event.target.value)} className="field-input mt-2" /></label>
                </div>

                <button type="button" onClick={handleUpdateProfile} disabled={isSavingProfile} className="btn-brand mt-8 !py-3.5 text-sm disabled:opacity-50">
                  {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Değişiklikleri kaydet
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-zinc-950/[0.08] p-5 text-sm text-zinc-500 dark:border-white/[0.08] dark:text-zinc-400">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                <p>Sağlık verilerin yalnızca kişisel hesaplamalar, ilerleme takibi ve sana gösterilen koç önerileri için kullanılır.</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

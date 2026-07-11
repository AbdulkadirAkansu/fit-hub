"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, ArrowUpRight, Calculator, Dumbbell, HeartPulse, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "form", title: "Yağ kaybı ve form", text: "Düzenli hareket ve sürdürülebilir enerji dengesi", icon: Activity },
  { id: "genel", title: "Genel sağlık", text: "Daha aktif olmak ve temel kuvvet kazanmak", icon: HeartPulse },
  { id: "kas", title: "Kas ve güç", text: "Direnç antrenmanında düzenli ilerlemek", icon: Dumbbell },
] as const;

type Goal = (typeof GOALS)[number]["id"];

export default function BaslangicPage() {
  const [goal, setGoal] = useState<Goal | null>(null);

  const calculation = goal === "kas"
    ? { title: "Çalışma ağırlığını hesapla", text: "1 tekrar maksimum tahminiyle başlangıç ağırlığını planla.", href: "/hesaplama/1rm" }
    : goal === "form"
      ? { title: "Kalori ihtiyacını hesapla", text: "Günlük enerji ihtiyacın için başlangıç referansı oluştur.", href: "/hesaplama/kalori" }
      : { title: "Başlangıç ölçümünü yap", text: "Boy ve ağırlığını genel bir tarama olarak değerlendir.", href: "/hesaplama/vki" };

  const steps = [
    {
      no: "01",
      title: "Haftalık programını oluştur",
      text: "Hedefin hazır; yalnızca deneyim, yer ve gün sayısını seç.",
      href: `/programlar/olusturucu?goal=${goal}`,
      icon: Target,
      primary: true,
    },
    {
      no: "02",
      title: calculation.title,
      text: calculation.text,
      href: calculation.href,
      icon: Calculator,
      primary: false,
    },
    {
      no: "03",
      title: "Planını ve gelişimini kaydet",
      text: "Programın, ölçümlerin ve antrenman kayıtların tek yerde dursun.",
      href: "/hesap/giris",
      icon: Activity,
      primary: false,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper pb-24 pt-32 text-zinc-950 dark:bg-bg-dark dark:text-white sm:pt-36">
      <div className="grid-lab pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" aria-hidden />

      <div className="container relative mx-auto px-5 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white">
          <ArrowLeft size={14} /> Ana sayfa
        </Link>

        <div className="mx-auto mt-10 max-w-4xl">
          {!goal ? (
            <>
              <p className="kicker reveal">Başlangıç rehberi — Adım 1 / 2</p>
              <h1 className="reveal reveal-1 mt-5 font-display text-4xl font-black tracking-[-0.03em] sm:text-6xl">
                Önce hedefini <span className="text-outline">kalibre</span> edelim.
              </h1>
              <p className="reveal reveal-2 mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Sana yalnızca ihtiyacın olan ilk adımları göstereceğiz. Hedefini daha sonra
                istediğin an değiştirebilirsin.
              </p>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {GOALS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={cn(
                      "corner-ticks group relative flex min-h-64 flex-col rounded-[1.75rem] border border-zinc-950/10 bg-white p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl dark:border-white/[0.08] dark:bg-white/[0.03]",
                      "reveal",
                      `reveal-${index + 2}`,
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                        <item.icon size={21} />
                      </span>
                      <span className="font-mono text-xs font-bold text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-auto pt-8">
                      <strong className="font-display text-xl font-black tracking-tight">{item.title}</strong>
                      <span className="mt-2 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.text}</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                        Bu hedefi seç <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGoal(null)}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
              >
                <ArrowLeft size={14} /> Hedefi değiştir
              </button>

              <div className="mt-8">
                <p className="kicker !text-primary dark:!text-accent">Rota hazır — Adım 2 / 2</p>
                <h1 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] sm:text-6xl">
                  Üç adımda <span className="text-outline">yola çık.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                  Önce programını oluştur. Hesaplama ve kayıt adımları yardımcıdır; hepsini aynı anda
                  tamamlamak zorunda değilsin.
                </p>
              </div>

              <div className="relative mt-12 space-y-4">
                <span className="absolute bottom-8 left-[1.55rem] top-8 hidden w-px bg-zinc-950/10 sm:block dark:bg-white/10" aria-hidden />
                {steps.map((step, index) => (
                  <Link
                    key={step.no}
                    href={step.href}
                    className={cn(
                      "group relative flex items-center gap-5 rounded-[1.75rem] border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-7",
                      "reveal",
                      `reveal-${index + 1}`,
                      step.primary
                        ? "corner-ticks border-primary/40 bg-zinc-950 text-white shadow-xl dark:bg-white dark:text-zinc-950"
                        : "border-zinc-950/10 bg-white hover:border-primary/40 dark:border-white/[0.08] dark:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                        step.primary ? "bg-accent text-zinc-950" : "bg-primary/10 text-primary",
                      )}
                    >
                      <step.icon size={21} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className={cn("font-mono text-[10px] font-bold", step.primary ? "text-accent dark:text-primary" : "text-zinc-400")}>{step.no}</span>
                        <strong className="font-display text-lg font-black tracking-tight sm:text-xl">{step.title}</strong>
                      </span>
                      <span className={cn("mt-1.5 block text-sm leading-6", step.primary ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400")}>
                        {step.text}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      className={cn(
                        "shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        step.primary ? "text-accent dark:text-primary" : "text-zinc-400 group-hover:text-primary",
                      )}
                    />
                  </Link>
                ))}
              </div>

              <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                İpucu: 01 numaralı adım 2 dakikadan kısa sürer.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

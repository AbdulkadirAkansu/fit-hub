"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[FitHub] Yakalanmamış hata:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-paper px-4 py-24 font-sans dark:bg-bg-dark">
      <div className="grid-lab mask-fade-b pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-red-500/[0.08] blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/[0.08] blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <Link href="/" className="group mb-10 inline-flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 dark:bg-white dark:text-zinc-950">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-zinc-950 dark:text-white">FitHub</span>
        </Link>

        <div className="reveal mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
          <AlertTriangle size={28} />
        </div>

        <p className="kicker reveal reveal-1 justify-center">Sistem Uyarısı</p>
        <h1 className="reveal reveal-2 mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          Beklenmedik bir hata oluştu
        </h1>
        <p className="reveal reveal-2 mx-auto mt-3 max-w-sm font-medium text-zinc-500 dark:text-zinc-400">
          Bu sayfayı yüklerken bir sorun yaşadık. Sorun devam ederse lütfen daha sonra tekrar deneyin.
        </p>

        <div className="reveal reveal-3 mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="btn-brand cursor-pointer">
            <RotateCcw size={16} /> Tekrar dene
          </button>
          <Link href="/" className="btn-outline">
            <Home size={16} /> Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

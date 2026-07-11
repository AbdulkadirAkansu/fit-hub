import Link from "next/link";
import { Activity, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-paper px-4 py-24 font-sans dark:bg-bg-dark">
      <div className="grid-lab mask-fade-b pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center">
        <Link href="/" className="group mb-10 inline-flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 dark:bg-white dark:text-zinc-950">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-zinc-950 dark:text-white">FitHub</span>
        </Link>

        <p className="reveal text-outline font-display text-[9rem] font-black leading-none tracking-tighter sm:text-[13rem]" aria-hidden>
          404
        </p>
        <p className="kicker reveal reveal-1 justify-center">Sinyal Kayboldu</p>
        <h1 className="reveal reveal-2 mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          Bu sayfa bulunamadı
        </h1>
        <p className="reveal reveal-2 mx-auto mt-3 max-w-sm font-medium text-zinc-500 dark:text-zinc-400">
          Aradığınız sayfa kaldırılmış, taşınmış veya hiç var olmamış olabilir.
        </p>

        <div className="reveal reveal-3 mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <Home size={16} /> Ana sayfaya dön
          </Link>
          <Link href="/egzersizler" className="btn-outline">
            <Search size={16} /> Egzersizleri keşfet
          </Link>
        </div>

        <Link
          href="/hesaplama"
          className="reveal reveal-4 mt-9 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-primary"
        >
          <ArrowLeft size={13} /> ya da hesaplama araçlarına göz at
        </Link>
      </div>
    </div>
  );
}

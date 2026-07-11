import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-paper font-sans dark:bg-bg-dark overflow-hidden">
      <div className="relative flex flex-col items-center gap-8">
        {/* Ambient Glow Aura */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px] animate-pulse" aria-hidden />
        
        {/* Glassmorphic Loader Box */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white shadow-2xl shadow-primary/20 dark:bg-surface/50 dark:border-white/10">
          <div className="absolute inset-0 animate-spin-slow rounded-[2rem] border-2 border-transparent border-t-primary border-b-accent opacity-70" />
          <div className="absolute inset-2 animate-ping-slow rounded-[1.5rem] bg-primary/5" />
          
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-inner">
            <Activity size={24} className="animate-pulse" strokeWidth={2.5} />
          </span>
        </div>
        
        {/* Loading Text */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <p className="font-display text-xl font-black tracking-tight text-zinc-900 dark:text-white">FitHub</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

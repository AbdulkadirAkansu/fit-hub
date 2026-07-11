import type { ElementType } from "react";
import { ArrowUpRight, Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";

export interface PolicySection {
  id: string;
  title: string;
  body: string[];
  bullets?: string[];
}

interface PolicyDocumentProps {
  kicker: string;
  title: string;
  description: string;
  label: string;
  updated: string;
  sections: PolicySection[];
  notice?: string;
  icon?: ElementType;
  danger?: boolean;
}

export default function PolicyDocument({
  kicker,
  title,
  description,
  label,
  updated,
  sections,
  notice,
  icon: Icon = ShieldCheck,
  danger = false,
}: PolicyDocumentProps) {
  return (
    <main className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <PageHeader title={title} kicker={kicker} description={description} />

      <div className="container mx-auto px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={cn(
              "corner-ticks overflow-hidden rounded-[1.75rem] border p-5",
              danger
                ? "border-rose-500/20 bg-rose-500/[0.06]"
                : "border-zinc-950/10 bg-white dark:border-white/[0.08] dark:bg-white/[0.03]",
            )}>
              <div className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl",
                danger ? "bg-rose-500 text-white" : "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950",
              )}>
                <Icon size={19} />
              </div>
              <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Belge durumu</p>
              <p className="mt-2 font-display text-lg font-black tracking-tight">{label}</p>
              <div className="mt-5 border-t border-zinc-950/[0.08] pt-4 dark:border-white/[0.08]">
                <p className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <Clock3 size={13} /> Güncelleme: {updated}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary">
                  <FileCheck2 size={13} /> Yürürlükte
                </p>
              </div>
            </div>

            <nav className="mt-6 hidden lg:block" aria-label="Belge bölümleri">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">İçindekiler</p>
              <ol className="mt-3 space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="group flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs font-bold leading-5 text-zinc-500 transition-colors hover:bg-zinc-950/[0.04] hover:text-zinc-950 dark:hover:bg-white/[0.05] dark:hover:text-white">
                      <span className={cn("font-mono text-[9px]", danger ? "text-rose-500" : "text-primary")}>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article>
            {notice && (
              <div className={cn(
                "mb-8 flex gap-4 rounded-[1.5rem] border p-5 sm:p-6",
                danger
                  ? "border-rose-500/20 bg-rose-500/[0.07]"
                  : "border-primary/20 bg-primary/[0.06]",
              )}>
                <Icon className={cn("mt-0.5 shrink-0", danger ? "text-rose-500" : "text-primary")} size={20} />
                <p className="text-sm font-semibold leading-7 text-zinc-700 dark:text-zinc-300">{notice}</p>
              </div>
            )}

            <div className="divide-y divide-zinc-950/[0.08] border-y border-zinc-950/[0.08] dark:divide-white/[0.08] dark:border-white/[0.08]">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 py-9 sm:py-11">
                  <div className="grid gap-5 sm:grid-cols-[64px_minmax(0,1fr)]">
                    <span className={cn("font-mono text-xs font-bold", danger ? "text-rose-500" : "text-primary")}>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h2 className="font-display text-2xl font-black tracking-[-0.025em] sm:text-3xl">{section.title}</h2>
                      <div className="mt-5 space-y-4">
                        {section.body.map((paragraph) => (
                          <p key={paragraph} className="max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[15px]">{paragraph}</p>
                        ))}
                      </div>
                      {section.bullets && (
                        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                          {section.bullets.map((item) => (
                            <li key={item} className="flex gap-3 rounded-2xl border border-zinc-950/[0.08] bg-white p-4 text-sm font-semibold leading-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
                              <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", danger ? "bg-rose-500" : "bg-primary")} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <a href="mailto:destek@fithub.com" className="group mt-8 inline-flex items-center gap-2 text-sm font-black text-primary">
              Bu belge hakkında soru sor <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </article>
        </div>
      </div>
    </main>
  );
}

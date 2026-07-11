"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, Calculator, Flame, Search, Sparkles, Trophy } from "lucide-react";
import { CALCULATION_CATEGORIES } from "@/constants/calculations";
import { cn } from "@/lib/utils";

const CATEGORIES = CALCULATION_CATEGORIES.filter((category) => category.id !== "pilates");
const PILATES = CALCULATION_CATEGORIES.find((category) => category.id === "pilates");

const TONES: Record<string, { icon: string; chip: string; label: string }> = {
  vucut: { icon: "bg-primary-soft text-primary dark:bg-primary/10", chip: "text-primary font-black", label: "Vücut Yapısı" },
  beslenme: { icon: "bg-accent-soft text-accent dark:bg-accent/10", chip: "text-accent font-black", label: "Beslenme & Diyet" },
  fitness: { icon: "bg-zinc-950/[0.04] text-zinc-950 dark:bg-white/5 dark:text-zinc-200", chip: "text-zinc-950 font-black dark:text-zinc-200", label: "Güç & Fitness" },
};

const FEATURED = [
  {
    title: "Kalori İhtiyacı",
    desc: "Günlük enerji tüketiminizi bilimsel denklemlerle hassas şekilde hesaplayın.",
    href: "/hesaplama/kalori",
    icon: Flame,
  },
  {
    title: "Makro Dağılımı",
    desc: "Protein, yağ ve karbonhidrat dengenizi hedefinize göre paylaştırın.",
    href: "/hesaplama/makro",
    icon: Calculator,
  },
  {
    title: "1RM Güç Tahmini",
    desc: "Tek tekrarda kaldırabileceğiniz maksimum teorik gücünüzü analiz edin.",
    href: "/hesaplama/1rm",
    icon: Trophy,
  },
];

export default function HesaplamaPage() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");

  const allTools = useMemo(
    () =>
      CATEGORIES.flatMap((category) =>
        category.items.map((item) => ({ ...item, categoryId: category.id, categoryIcon: category.icon })),
      ),
    [],
  );

  const visibleTools = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    return allTools.filter((tool) => {
      const matchesCategory = categoryId === "all" || tool.categoryId === categoryId;
      const searchable = `${tool.title} ${tool.desc}`.toLocaleLowerCase("tr-TR");
      return matchesCategory && searchable.includes(normalized);
    });
  }, [allTools, categoryId, query]);

  const isFiltering = query.trim() !== "" || categoryId !== "all";

  return (
    <main className="min-h-screen bg-paper pb-24 dark:bg-bg-dark">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-zinc-950/10 bg-white px-5 pb-12 pt-24 dark:border-white/10 dark:bg-surface sm:px-6 sm:pt-28">
        {/* Glows */}
        <div className="pointer-events-none absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" aria-hidden />
        <div className="container relative mx-auto">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="kicker reveal">Performans analiz merkezi</p>
              <h1 className="reveal reveal-1 mt-4 text-4xl font-black tracking-tight sm:text-5xl uppercase leading-none">
                Ölçünü bil, <span className="text-primary">planını yap.</span>
              </h1>
              <p className="reveal reveal-2 mt-5 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                FitHub hesaplama araçları modern spor hekimliği ve biyometri standartlarına sadık kalınarak formüle edilmiştir. Kendinize en uygun hedefleri belirleyin.
              </p>
            </div>

            <div className="reveal reveal-3 grid grid-cols-3 gap-4">
              {[
                { value: String(allTools.length + (PILATES?.items.length || 0)), label: "Bilimsel Araç" },
                { value: "3", label: "Ana Kategori" },
                { value: "∞", label: "Ücretsiz Erişim" },
              ].map((stat) => (
                <div key={stat.label} className="group rounded-2xl border border-zinc-950/10 bg-paper p-5 transition-all hover:-translate-y-0.5 dark:border-white/10 dark:bg-bg-dark">
                  <p className="text-3xl font-black leading-none text-primary tabular">{stat.value}</p>
                  <p className="stat-label mt-2.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-5 sm:px-6">
        {/* ── Yapışkan arama + filtre ──────────────────────────────── */}
        <section className="sticky top-[4.25rem] z-30 -mx-5 border-b border-zinc-950/[0.07] bg-paper/90 px-5 py-3.5 backdrop-blur-xl dark:border-white/[0.07] dark:bg-bg-dark/90 sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1 sm:max-w-xs">
              <span className="sr-only">Hesaplama ara</span>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Enerji, makro, güç..."
                className="h-10 w-full rounded-xl border border-zinc-950/10 bg-white pl-9 pr-4 text-xs font-semibold outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
              />
            </label>
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto" aria-label="Hesaplama kategorileri">
              <button
                type="button"
                onClick={() => setCategoryId("all")}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all",
                  categoryId === "all"
                    ? "bg-primary text-white shadow-md shadow-primary/15"
                    : "bg-white text-zinc-600 hover:bg-zinc-950/[0.04] dark:bg-surface dark:text-zinc-300 dark:hover:bg-white/[0.05]",
                )}
              >
                Tümü
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all",
                    categoryId === category.id
                      ? "bg-primary text-white shadow-md shadow-primary/15"
                      : "bg-white text-zinc-600 hover:bg-zinc-950/[0.04] dark:bg-surface dark:text-zinc-300 dark:hover:bg-white/[0.05]",
                  )}
                >
                  {category.title}
                </button>
              ))}
            </div>
            <p className="ml-auto hidden shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400 sm:block">
              <span className="text-primary font-black">{visibleTools.length}</span> hesaplayıcı
            </p>
          </div>
        </section>

        {/* ── Popüler üçlü ─────────────────────────────────────────── */}
        {!isFiltering && (
          <section className="mt-12">
            <p className="kicker">Öne Çıkan Hesaplayıcılar</p>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {FEATURED.map(({ title, desc, href, icon: Icon }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-zinc-950/5 bg-white p-7 transition-all duration-500 ease-spring hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-surface sm:p-9",
                    index === 0 && "md:col-span-2" // Make the first one a wide bento box
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-accent/[0.01] opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/10 blur-[60px] transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/20" aria-hidden />
                  <div className="relative z-10">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-transform duration-500 group-hover:scale-110">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-8 font-display text-2xl font-black tracking-tight leading-snug">{title}</h3>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">{desc}</p>
                  </div>
                  <span className="relative z-10 mt-8 inline-flex items-center gap-1.5 text-[14px] font-black text-primary">
                    Hesaplamayı aç <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Tüm araçlar ──────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <p className="kicker">{isFiltering ? "Arama Sonuçları" : "Tüm Analiz Araçları"}</p>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTools.map((tool, index) => {
              const tone = TONES[tool.categoryId] || TONES.vucut;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-zinc-950/5 bg-white p-6 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 dark:border-white/5 dark:bg-surface"
                >
                  <div className="pointer-events-none absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-primary/[0.03] blur-lg transition-all duration-500 group-hover:scale-125" aria-hidden />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110", tone.icon)}>
                        <tool.categoryIcon size={19} />
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-300 dark:text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-6 font-display text-[17px] font-black tracking-tight leading-snug text-zinc-900 group-hover:text-primary transition-colors dark:text-white">{tool.title}</h3>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{tool.desc}</p>
                  </div>
                  <span className={cn("relative z-10 mt-6 flex items-center justify-between border-t border-zinc-950/5 pt-4 dark:border-white/5 font-mono text-[10px] font-bold uppercase tracking-wider", tone.chip)}>
                    {tone.label}
                    <ArrowUpRight size={14} className="text-zinc-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary dark:text-zinc-600" />
                  </span>
                </Link>
              );
            })}
          </div>

          {visibleTools.length === 0 && (
            <div className="mt-6 rounded-[2rem] border border-dashed border-zinc-300 p-16 text-center dark:border-white/10">
              <Search className="mx-auto text-zinc-300 dark:text-zinc-700" size={36} />
              <h2 className="mt-5 font-display text-2xl font-black uppercase tracking-tight">Eşleşen araç yok.</h2>
              <button type="button" onClick={() => { setQuery(""); setCategoryId("all"); }} className="mt-5 text-[14px] font-black text-primary hover:text-primary-hover">Tümünü göster</button>
            </div>
          )}
        </section>

        {/* ── Pilates + başlangıç rotası ───────────────────────────── */}
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {PILATES && (
            <Link
              href={PILATES.items[0]?.href || "/pilates/seviye-testi"}
              className="group relative overflow-hidden rounded-[1.75rem] border border-zinc-950/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-surface sm:p-9"
            >
              <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-primary/[0.06] blur-2xl" aria-hidden />
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15">
                <Activity size={20} />
              </span>
              <h2 className="mt-6 font-display text-3xl font-black uppercase leading-none">Pilates seviye testi</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Esneklik ve core gücünü 2 dakikada ölç; hangi seviyeden başlaman gerektiğini öğren.
              </p>
              <span className="mt-6 flex items-center gap-2 text-sm font-black text-primary">
                Testi başlat <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </Link>
          )}

          <aside className="relative overflow-hidden rounded-[2rem] bg-zinc-950 dark:bg-surface p-8 text-white shadow-xl dark:shadow-none sm:p-10">
            <div className="grid-lab absolute inset-0 opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-[80px]" aria-hidden />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Sparkles size={19} className="text-accent" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-black uppercase leading-none">Hangi araçla başlamalı?</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/80">Hedefini seç; sana ölçüm → plan → takip sırasıyla kişisel bir başlangıç rotası çizelim.</p>
              <Link href="/baslangic" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent">
                Başlangıç rotası <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

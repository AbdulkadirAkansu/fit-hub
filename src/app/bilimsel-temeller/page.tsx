import { ArrowUpRight, BookOpenCheck, CircleCheck, FlaskConical, Scale, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { SCIENTIFIC_REFERENCES } from "@/constants/references";

const METHOD = [
  {
    icon: BookOpenCheck,
    title: "Kaynağı seç",
    description: "Hakemli yayınları, kurum kılavuzlarını ve yöntemin geliştirildiği özgün çalışmaları önceliklendiririz.",
  },
  {
    icon: Scale,
    title: "Sınırı tanımla",
    description: "Her formülün hedef popülasyonunu, varsayımlarını ve hata payını ürün metninde görünür kılarız.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli yorumla",
    description: "Tarama ve tahmin çıktılarını tanı diliyle sunmaz; gerektiğinde uzman değerlendirmesine yönlendiririz.",
  },
];

export default function BilimselTemellerPage() {
  const references = Object.entries(SCIENTIFIC_REFERENCES);

  return (
    <main className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <PageHeader
        kicker="Metodoloji"
        title="Her sonucun arkasında görünür bir yöntem var."
        description="FitHub hesaplamalarının hangi denklemlere dayandığını, neyi tahmin ettiğini ve nerede sınırlı kaldığını açıkça belgeliyoruz."
      />

      <div className="container mx-auto px-5 py-12 sm:px-6 sm:py-16">
        <section className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-[2rem] border border-zinc-950/10 bg-zinc-950/10 dark:border-white/10 dark:bg-white/10 lg:grid-cols-3">
          {METHOD.map((item, index) => (
            <article key={item.title} className="bg-white p-7 dark:bg-surface sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.09] text-primary"><item.icon size={19} /></span>
                <span className="font-mono text-[10px] font-bold text-zinc-400">0{index + 1}</span>
              </div>
              <h2 className="mt-8 font-display text-xl font-black tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-24 max-w-6xl">
          <div className="flex flex-col gap-6 border-b border-zinc-950/10 pb-8 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Kaynak kütüphanesi</p>
              <h2 className="mt-5 font-display text-3xl font-black tracking-[-0.03em] sm:text-5xl">Denklemler ve referanslar</h2>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-zinc-950/10 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
              <CircleCheck className="text-primary" size={15} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{references.length} yöntem belgeli</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-950/10 dark:divide-white/10">
            {references.map(([key, reference], index) => {
              const external = reference.link.startsWith("http");
              return (
                <article key={key} className="group grid gap-5 py-8 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-start sm:py-10">
                  <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-black tracking-tight transition-colors group-hover:text-primary sm:text-2xl">{reference.title}</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">{reference.description}</p>
                    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-zinc-950/[0.035] p-4 dark:bg-white/[0.04]">
                        <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Yöntem / formül</dt>
                        <dd className="mt-2 text-xs font-bold leading-5 text-zinc-700 dark:text-zinc-300">{reference.formula}</dd>
                      </div>
                      <div className="rounded-2xl bg-zinc-950/[0.035] p-4 dark:bg-white/[0.04]">
                        <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Birincil kaynak</dt>
                        <dd className="mt-2 text-xs font-bold leading-5 text-zinc-700 dark:text-zinc-300">{reference.source}</dd>
                      </div>
                    </dl>
                  </div>
                  <a
                    href={reference.link}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={`${reference.title} kaynağını aç`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-950/10 text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white dark:border-white/10 dark:text-zinc-400"
                  >
                    <ArrowUpRight size={17} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-[2rem] bg-zinc-950 p-8 text-white sm:p-10">
          <div className="grid-lab pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-zinc-950"><FlaskConical size={20} /></span>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight">Yaşayan metodoloji</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">Yeni kılavuzlar ve güçlü kanıtlar yayımlandığında yöntemleri yeniden değerlendirir, değişiklik tarihini ve yorum dilini güncelleriz.</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Sürüm 2026.07</span>
          </div>
        </section>
      </div>
    </main>
  );
}

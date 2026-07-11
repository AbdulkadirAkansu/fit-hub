import Link from "next/link";
import { ArrowRight, BookOpenCheck, ChartNoAxesCombined, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const PRINCIPLES = [
  {
    number: "01",
    icon: BookOpenCheck,
    title: "Kanıt önce gelir",
    description: "Kullandığımız denklemleri ve öneri sınırlarını görünür kaynaklarla açıklarız. Tahmini, kesin sonuç gibi sunmayız.",
  },
  {
    number: "02",
    icon: ChartNoAxesCombined,
    title: "Veri eyleme dönüşür",
    description: "Rapor kalabalığı üretmek yerine, kullanıcının bugün atabileceği bir sonraki net adımı öne çıkarırız.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Güvenlik tasarımın parçasıdır",
    description: "Sağlık sınırlarını, veri gizliliğini ve erişilebilirliği ürünün sonuna eklenen notlar değil, temel gereksinimler sayarız.",
  },
];

export default function HakkimizdaPage() {
  return (
    <main className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <PageHeader
        kicker="FitHub manifestosu"
        title="Performansı anlaşılır hale getiriyoruz."
        description="FitHub; spor bilimi, ölçüm ve programlamayı tek bir sade çalışma alanında birleştiren bağımsız bir fitness teknolojisi ürünüdür."
      />

      <div className="container mx-auto px-5 py-12 sm:px-6 sm:py-16">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="corner-ticks relative overflow-hidden rounded-[2rem] bg-zinc-950 p-8 text-white sm:p-10 lg:p-14">
            <div className="grid-lab pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-[90px]" aria-hidden />
            <div className="relative">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Neden varız?</p>
              <h2 className="mt-6 max-w-2xl font-display text-3xl font-black leading-[1.05] tracking-[-0.035em] sm:text-5xl">
                Daha fazla veri değil, daha iyi kararlar.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300">
                Fitness araçları çoğu zaman kullanıcıya bir sayı verip onu yalnız bırakıyor. Biz sayının ne anlama geldiğini, hangi varsayımlara dayandığını ve bundan sonra ne yapılabileceğini aynı deneyimin içinde gösteriyoruz.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/baslangic" className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-black text-zinc-950 transition-transform hover:-translate-y-0.5">
                  Başlangıç rotanı çiz <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/bilimsel-temeller" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-white/[0.08]">
                  Metodolojiyi incele
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { icon: Target, label: "Odak", value: "Sade ve yönlendirici", note: "Her ekranda tek bir güçlü sonraki adım" },
              { icon: Users, label: "Erişim", value: "Herkes için", note: "Temel analiz araçlarında açık ve ücretsiz erişim" },
              { icon: Sparkles, label: "Yaklaşım", value: "İnsan merkezli", note: "Karmaşık modeli anlaşılır dile çeviren deneyim" },
            ].map((item) => (
              <article key={item.label} className="card-lab flex items-start gap-5 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.09] text-primary">
                  <item.icon size={19} />
                </span>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{item.label}</p>
                  <h3 className="mt-2 font-display text-lg font-black tracking-tight">{item.value}</h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl">
          <div className="grid gap-6 border-b border-zinc-950/10 pb-8 dark:border-white/10 sm:grid-cols-[0.45fr_0.55fr] sm:items-end">
            <div>
              <p className="kicker">Ürün ilkeleri</p>
              <h2 className="mt-5 font-display text-3xl font-black tracking-[-0.03em] sm:text-5xl">Nasıl çalışıyoruz?</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:justify-self-end">
              İçerikten arayüze kadar her kararı üç temel filtreyle değerlendiriyoruz: doğruluk, açıklık ve güvenlik.
            </p>
          </div>

          <div className="grid lg:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <article key={principle.number} className="group border-b border-zinc-950/10 py-9 dark:border-white/10 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{principle.number}</span>
                  <principle.icon className="text-zinc-300 transition-colors group-hover:text-primary dark:text-zinc-700" size={24} />
                </div>
                <h3 className="mt-12 font-display text-2xl font-black tracking-tight">{principle.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/[0.07] px-7 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Açık metodoloji</p>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">Kullandığımız kaynakları saklamıyoruz.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">Hesaplayıcıların dayandığı denklemleri, kaynakları ve yorum sınırlarını bilimsel temeller sayfasında tek tek yayınlıyoruz.</p>
            </div>
            <Link href="/bilimsel-temeller" className="group inline-flex shrink-0 items-center gap-2 text-sm font-black text-primary">
              Kaynak kütüphanesi <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

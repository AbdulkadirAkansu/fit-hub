import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calculator,
  Dumbbell,
  Flame,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import OpenAssistantButton from "@/components/common/OpenAssistantButton";



const QUICK_TOOLS = [
  { title: "Kalori ihtiyacı", detail: "Günlük enerji hedefi", href: "/hesaplama/kalori", icon: Flame },
  { title: "Makro dağılımı", detail: "Protein, yağ, karbonhidrat", href: "/hesaplama/makro", icon: Calculator },
  { title: "1RM tahmini", detail: "Maksimum kaldırış", href: "/hesaplama/1rm", icon: Trophy },
  { title: "Nabız bölgeleri", detail: "Hedef antrenman aralığı", href: "/hesaplama/nabiz", icon: HeartPulse },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink dark:bg-bg-dark dark:text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[min(760px,88svh)] items-end overflow-hidden bg-bg-dark pt-16 text-white">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=88&w=2200&auto=format&fit=crop"
          alt="Spor salonunda antrenman yapan bir sporcu"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent" aria-hidden />

        {/* Ambient Cyber-Athletic Glows */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[140px]" aria-hidden />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-accent/15 blur-[120px]" aria-hidden />

        <div className="container relative mx-auto px-5 pb-14 pt-24 sm:px-6 sm:pb-16 lg:pb-20">
          <p className="kicker text-accent tracking-widest uppercase">Kişisel performans merkezi</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl tracking-tight">FitHub</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">Programını oluştur, hareketleri doğru uygula ve gelişimini tek bir sade çalışma alanında takip et.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/programlar/olusturucu" className="btn-brand px-8 py-4 text-[15px] font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50">Programımı oluştur <ArrowRight size={17} /></Link>
            <Link href="/baslangic" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-7 py-4 text-[15px] font-bold text-white transition-all duration-300 ease-spring hover:bg-white hover:text-black hover:-translate-y-1 active:scale-97">Nereden başlamalıyım?</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold text-zinc-400">
            <span className="flex items-center gap-2.5"><ShieldCheck size={18} className="text-accent" /> Bilimsel hesaplamalar</span>
            <span className="flex items-center gap-2.5"><BarChart3 size={18} className="text-accent" /> Kolay ilerleme takibi</span>
          </div>
        </div>
      </section>

      {/* Modern Bento Grid Section */}
      <section className="container mx-auto px-5 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-10">
          <div>
            <p className="kicker">Hızlı başlangıç</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Bugün ne yapmak istiyorsun?</h2>
          </div>
          <Link href="/baslangic" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary-hover transition-colors">
            Kişisel öneri al <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {/* Card 1: Program Oluştur (Bento Major) */}
          <Link href="/programlar/olusturucu" className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-zinc-950/5 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-surface md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[80px] transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/30" aria-hidden />
            <div className="relative z-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 transition-transform duration-500 ease-spring group-hover:rotate-6 group-hover:scale-110">
                <Target size={24} />
              </span>
              <h3 className="mt-10 font-display text-3xl font-black tracking-tight sm:text-4xl">Kişiselleştirilmiş Program Oluştur</h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">Hedefine, fitness geçmişine ve haftalık programına en uygun bilimsel planı sadece 2 dakikada hazırla.</p>
            </div>
            <span className="relative z-10 inline-flex items-center gap-2 text-[15px] font-black text-primary">
              Planı başlat <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
            </span>
          </Link>

          {/* Card 2: Hazır Program Bul */}
          <Link href="/programlar" className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-zinc-950/5 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-surface">
            <div className="relative z-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-transform duration-500 group-hover:scale-110">
                <Dumbbell size={22} />
              </span>
              <h3 className="mt-8 font-display text-2xl font-black tracking-tight">Hazır Program Bul</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">Seviyene göre tasarlanmış bilimsel planları incele, karşılaştır ve hemen başla.</p>
            </div>
            <span className="relative z-10 mt-8 inline-flex items-center gap-2 text-[14px] font-black text-primary">
              Programlara bak <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
            </span>
          </Link>

          {/* Card 3: Egzersizleri Öğren */}
          <Link href="/egzersizler" className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[2rem] border border-zinc-950/5 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-surface">
            <div className="relative z-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-transform duration-500 group-hover:scale-110">
                <Activity size={22} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-black tracking-tight">Hareketleri Öğren</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">Teknik detaylar, hedeflenen kas grupları ve sakatlıktan kaçınma rehberlerini incele.</p>
            </div>
            <span className="relative z-10 mt-6 inline-flex items-center gap-2 text-[14px] font-black text-primary">
              Hareketleri aç <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
            </span>
          </Link>

          {/* Card 4: Hesaplamalar Yap (Bento Wide) */}
          <Link href="/hesaplama" className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[2rem] border border-zinc-950/5 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 dark:border-white/5 dark:bg-surface md:col-span-2">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-accent/10 blur-[60px] transition-all duration-700 group-hover:scale-150" aria-hidden />
            <div className="relative z-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-500 group-hover:scale-110">
                <Calculator size={22} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-black tracking-tight">Bilimsel Hesaplamalar Yap</h3>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">Kalori, makro besin dengesi, 1RM güç tahmini ve vücut kitle indeksi gibi 10+ gelişmiş hesaplama aracını kullan.</p>
            </div>
            <span className="relative z-10 mt-6 inline-flex items-center gap-2 text-[14px] font-black text-accent">
              Araçları aç <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Program Callout Section */}
      <section className="relative overflow-hidden border-y border-zinc-950/5 bg-white dark:border-white/5 dark:bg-surface">
        <div className="container mx-auto grid lg:grid-cols-2">
          <div className="relative min-h-96 overflow-hidden lg:min-h-[600px]">
            <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=88&w=1600&auto=format&fit=crop" alt="Spor programı uygulayan bir sporcu" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent dark:from-surface dark:via-surface/20 lg:hidden" aria-hidden />
          </div>
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-16 lg:py-20 z-10">
            <p className="kicker">Programlar</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight leading-tight sm:text-5xl">Kağıtta kalan plan değil, uygulanabilir bir akış.</h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-zinc-500 dark:text-zinc-400">Planını seç, antrenmanda sıradaki harekete odaklan ve tamamladığın setleri tek ekrandan izle.</p>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {["Planı seç", "Setleri tamamla", "Gelişimi izle"].map((label, index) => (
                <li key={label} className="border-l-2 border-primary/30 pl-4 transition-colors hover:border-primary">
                  <span className="text-[11px] font-black tracking-widest text-primary">0{index + 1}</span>
                  <p className="mt-1.5 text-[15px] font-bold text-zinc-900 dark:text-white">{label}</p>
                </li>
              ))}
            </ol>
            <Link href="/programlar" className="btn-brand mt-10 w-fit px-8 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/40">Programları incele <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      {/* Quick Tools & AI Coach Section */}
      <section className="container mx-auto grid gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="kicker">Hızlı araçlar</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Ölç, sonra karar ver.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {QUICK_TOOLS.map(({ title, detail, href, icon: Icon }) => (
              <Link key={title} href={href} className="group flex items-center gap-4 rounded-3xl border border-zinc-950/5 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 dark:border-white/5 dark:bg-surface">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[15px] font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{title}</strong>
                  <span className="mt-1 block truncate text-[13px] text-zinc-500 dark:text-zinc-400">{detail}</span>
                </span>
                <ArrowRight size={16} className="shrink-0 text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary dark:text-zinc-600" />
              </Link>
            ))}
          </div>
          <Link href="/hesaplama" className="mt-8 inline-flex items-center gap-2 text-[15px] font-black text-primary hover:text-primary-hover transition-colors">Tüm hesaplamaları gör <ArrowRight size={16} /></Link>
        </div>

        <aside className="relative flex flex-col justify-center overflow-hidden rounded-[2.5rem] border border-zinc-950/5 bg-white p-10 shadow-lg dark:border-white/5 dark:bg-surface">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" aria-hidden />
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles size={24} />
          </span>
          <h2 className="mt-8 font-display text-3xl font-black tracking-tight">FitHub Koç</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">Kayıtlarına göre kısa, uygulanabilir bir sonraki adımı gör. Senin hedeflerine özel tasarlanan akıllı yönlendirmelerle çalış.</p>
          <OpenAssistantButton className="btn-brand mt-8 shadow-lg shadow-primary/20 w-fit px-8 py-3.5">Koça sor <ArrowRight size={17} /></OpenAssistantButton>
        </aside>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ArrowUpRight, BookOpen, ShieldAlert } from "lucide-react";

const LINKS = [
  { label: "Programlar", href: "/programlar" },
  { label: "Hareketler", href: "/egzersizler" },
  { label: "Hesaplamalar", href: "/hesaplama" },
  { label: "Topluluk", href: "/topluluk" },
  { label: "Bilimsel temeller", href: "/bilimsel-temeller" },
  { label: "Hakkımızda", href: "/hakkimizda" },
];

const LEGAL = [
  { label: "Gizlilik", href: "/gizlilik-politikasi" },
  { label: "Kullanım şartları", href: "/kullanim-sartlari" },
  { label: "Sağlık uyarısı", href: "/saglik-uyarisi" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-zinc-950/5 bg-white dark:border-white/5 dark:bg-surface">
      <div className="container mx-auto grid gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-2.5 text-ink dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white"><Activity size={18} /></span>
            <span className="text-lg font-bold">FitHub</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Programını seç, ölçümlerini takip et ve bir sonraki antrenmanına odaklan.</p>
          <Link href="/baslangic" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Kişisel rotanı oluştur <ArrowUpRight size={15} /></Link>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3" aria-label="Alt menü">
          {LINKS.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-600 transition-colors hover:text-primary dark:text-zinc-400">{link.label}</Link>)}
        </nav>
      </div>

      {/* ── Detaylı Sağlık Sorumluluk Reddi ve Bilimsel Referanslar ── */}
      <div className="border-y border-zinc-950/5 dark:border-white/5 bg-zinc-950/[0.02] dark:bg-bg-dark/50 py-10 px-5 sm:px-6">
        <div className="container mx-auto grid gap-6 md:grid-cols-2 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
          <div>
            <h4 className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><ShieldAlert size={12} className="text-primary" /> Sağlık Sorumluluk Reddi</h4>
            <p>FitHub üzerindeki tüm ölçüm araçları, kalori hedefleri, egzersiz yönergeleri ve koç tavsiyeleri eğitim amaçlı genel projeksiyonlardır. Tıbbi teşhis, tanı veya profesyonel klinik tedavi yerine geçmez. Kalp, damar, tansiyon rahatsızlığı olanlar, gebelik veya rehabilitasyon sürecindeki bireyler egzersiz programına başlamadan önce hekim onayı almalıdır.</p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BookOpen size={12} className="text-primary" /> Bilimsel Referanslar</h4>
            <p>Platformdaki formüller; WHO (Vücut Kitle Endeksi), Mifflin-St Jeor / Harris-Benedict (BMR enerji tüketimi), Brzycki / Epley (1RM kaldırma gücü) ve ACSM (Haftalık aktif hareket süreleri) standartlarına sadık kalınarak modellenmiştir. Detaylı formüller ve kaynak makaleler için <Link href="/bilimsel-temeller" className="text-primary hover:underline font-semibold">Bilimsel Temeller</Link> sayfamızı ziyaret edebilirsiniz.</p>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto flex flex-col gap-3 px-5 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} FitHub. Ölç, planla, takip et.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">{LEGAL.map((link) => <Link key={link.href} href={link.href} className="hover:text-primary">{link.label}</Link>)}</div>
        </div>
      </div>
    </footer>
  );
}

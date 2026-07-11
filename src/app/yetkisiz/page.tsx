import Link from "next/link";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Yetkisiz Erişim | FitHub",
  description: "Bu sayfayı görüntüleme yetkin bulunmuyor.",
  noIndex: true,
  path: "/yetkisiz",
});

export default function YetkisizPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-5 py-28 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <div className="grid-lab pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" aria-hidden />

      <div className="container relative mx-auto max-w-3xl text-center">
        <p className="text-outline reveal select-none font-display text-[clamp(7rem,26vw,15rem)] font-black leading-none tracking-[-0.06em]" aria-hidden>
          403
        </p>
        <div className="reveal reveal-2 -mt-6 flex items-center justify-center gap-2.5 sm:-mt-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <ShieldAlert size={19} />
          </span>
          <p className="kicker !text-amber-600 dark:!text-amber-400">Yetkisiz erişim</p>
        </div>
        <h1 className="reveal reveal-3 mt-6 font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Bu alan sana kilitli.
        </h1>
        <p className="reveal reveal-4 mx-auto mt-4 max-w-md leading-7 text-zinc-600 dark:text-zinc-400">
          Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsin. Yanlış hesapla giriş yaptıysan
          çıkış yapıp doğru hesabınla tekrar deneyebilirsin.
        </p>
        <div className="reveal reveal-5 mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary !py-3.5 text-sm">
            <Home size={16} /> Ana sayfa
          </Link>
          <Link href="/hesap" className="btn-outline !py-3.5 text-sm">
            <ArrowLeft size={16} /> Hesabıma dön
          </Link>
        </div>
      </div>
    </main>
  );
}

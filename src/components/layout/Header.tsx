"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, Moon, Sun, User, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const MAIN_LINKS = [
  { label: "Programlar", href: "/programlar" },
  { label: "Hareketler", href: "/egzersizler" },
  { label: "Hesaplamalar", href: "/hesaplama" },
  { label: "Topluluk", href: "/topluluk" },
  { label: "Rehberler", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-zinc-950/5 bg-white/70 backdrop-blur-2xl dark:border-white/5 dark:bg-bg-dark/70">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" onClick={() => setMenuOpen(false)} aria-label="FitHub ana sayfa" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <Activity size={18} aria-hidden />
          </span>
          <span className="text-[17px] font-black tracking-tight text-ink dark:text-white transition-colors group-hover:text-primary">FitHub</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-300",
                isActive(link.href)
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Temayı değiştir"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-950/5 dark:text-zinc-300 dark:hover:bg-white/5"
          >
            <Sun size={17} className="hidden dark:block" />
            <Moon size={17} className="dark:hidden" />
          </button>
          <Link href="/hesap" className="hidden h-9 items-center gap-2 rounded-lg border border-zinc-950/12 px-3.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary dark:border-white/15 sm:inline-flex">
            <User size={15} /> Hesabım
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-950/5 dark:text-zinc-200 dark:hover:bg-white/5 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-zinc-950/10 bg-paper dark:border-white/10 dark:bg-bg-dark lg:hidden">
          <nav className="container mx-auto px-5 py-6 sm:px-6" aria-label="Mobil menü">
            <div className="space-y-1">
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex min-h-[3.25rem] items-center rounded-xl px-5 text-[15px] font-bold transition-all duration-300",
                    isActive(link.href) ? "bg-primary text-white shadow-md shadow-primary/20" : "text-zinc-700 hover:bg-zinc-950/5 dark:text-zinc-300 dark:hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 border-t border-zinc-950/10 pt-5 dark:border-white/10">
              <Link href="/baslangic" onClick={() => setMenuOpen(false)} className="btn-brand w-full">Kişisel başlangıç</Link>
              <Link href="/hesap" onClick={() => setMenuOpen(false)} className="btn-outline mt-2 w-full"><User size={16} /> Hesabım</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

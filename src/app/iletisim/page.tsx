"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, Mail, MapPin, MessageSquare, Send } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const FIELD_CLASS = "w-full rounded-2xl border border-zinc-950/10 bg-zinc-950/[0.025] px-4 py-3.5 text-sm font-semibold text-zinc-950 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:bg-white/[0.06]";

export default function IletisimPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Teknik Destek");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }

    const mailSubject = encodeURIComponent(`[FitHub] ${subject} — ${fullName}`);
    const mailBody = encodeURIComponent(`Ad Soyad: ${fullName}\nE-posta: ${email}\nKonu: ${subject}\n\n${message}`);
    setSuccess(true);
    window.location.href = `mailto:destek@fithub.com?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <main className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <PageHeader
        kicker="İletişim"
        title="Doğru ekibe, doğrudan ulaşın."
        description="Teknik destek, geri bildirim ve iş birliği taleplerinizi bağlamıyla birlikte iletin. Genellikle bir iş günü içinde yanıtlıyoruz."
      />

      <div className="container mx-auto px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-7 text-white sm:p-9">
            <div className="grid-lab pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[90px]" aria-hidden />
            <div className="relative flex h-full flex-col">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">İletişim konsolu</p>
              <h2 className="mt-5 font-display text-3xl font-black tracking-[-0.03em]">Nasıl yardımcı olabiliriz?</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">Talebiniz ne kadar net olursa doğru bağlama o kadar hızlı ulaşırız.</p>

              <div className="mt-10 space-y-3">
                {[
                  { icon: Mail, label: "E-posta", value: "destek@fithub.com", href: "mailto:destek@fithub.com" },
                  { icon: MessageSquare, label: "Topluluk", value: "FitHub topluluğu", href: "/topluluk" },
                  { icon: MapPin, label: "Çalışma alanı", value: "Dijital · Türkiye", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-primary"><item.icon size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="mt-1 inline-flex items-center gap-1.5 truncate text-sm font-black text-white transition-colors hover:text-accent">{item.value} <ArrowUpRight size={13} /></a>
                      ) : (
                        <p className="mt-1 text-sm font-black text-white">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                  <Clock3 className="text-accent" size={18} />
                  <div>
                    <p className="text-sm font-black">Hedef yanıt süresi</p>
                    <p className="mt-0.5 text-xs text-zinc-500">1 iş günü içinde</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="card-lab p-6 sm:p-9 lg:p-11">
            <div className="flex flex-col gap-3 border-b border-zinc-950/[0.08] pb-7 dark:border-white/[0.08] sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Yeni talep</p>
                <h2 className="mt-3 font-display text-2xl font-black tracking-tight sm:text-3xl">Mesajınızı hazırlayın</h2>
              </div>
              <span className="text-xs font-semibold text-zinc-400">* Zorunlu alan</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-xs font-black text-zinc-600 dark:text-zinc-300">
                  Ad soyad *
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} className={FIELD_CLASS} placeholder="Adınız ve soyadınız" autoComplete="name" />
                </label>
                <label className="space-y-2 text-xs font-black text-zinc-600 dark:text-zinc-300">
                  E-posta *
                  <input value={email} onChange={(event) => setEmail(event.target.value)} className={FIELD_CLASS} placeholder="siz@ornek.com" type="email" autoComplete="email" />
                </label>
              </div>

              <label className="block space-y-2 text-xs font-black text-zinc-600 dark:text-zinc-300">
                Konu
                <select value={subject} onChange={(event) => setSubject(event.target.value)} className={FIELD_CLASS}>
                  <option>Teknik Destek</option>
                  <option>Öneri / Geri Bildirim</option>
                  <option>İş Birliği</option>
                  <option>Gizlilik Talebi</option>
                  <option>Diğer</option>
                </select>
              </label>

              <label className="block space-y-2 text-xs font-black text-zinc-600 dark:text-zinc-300">
                Mesajınız *
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} className={`${FIELD_CLASS} min-h-36 resize-y`} placeholder="Sorununuzu, kullandığınız sayfayı ve beklediğiniz sonucu kısaca anlatın." />
              </label>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p key="error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] p-4 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <AlertTriangle size={15} /> {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p key="success" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/[0.07] p-4 text-xs font-bold text-primary">
                    <CheckCircle2 size={15} /> E-posta uygulamanız açıldı. Göndermeden önce içeriği son kez kontrol edin.
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4 border-t border-zinc-950/[0.08] pt-6 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-zinc-400">Form, mesajı cihazınızdaki e-posta uygulamasına aktarır; siz onaylamadan gönderim yapılmaz.</p>
                <button type="submit" className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950">
                  E-postayı hazırla <Send size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

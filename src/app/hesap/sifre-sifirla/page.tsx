"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

type RecoveryState = "checking" | "ready" | "invalid" | "success";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<RecoveryState>("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const rules = [
    { label: "En az 10 karakter", valid: password.length >= 10 },
    { label: "Büyük ve küçük harf", valid: /[A-ZÇĞİÖŞÜ]/.test(password) && /[a-zçğıöşü]/.test(password) },
    { label: "En az bir rakam", valid: /\d/.test(password) },
    { label: "En az bir özel karakter", valid: /[^\p{L}\p{N}\s]/u.test(password) },
  ];

  useEffect(() => {
    let active = true;
    let recoveryEventReceived = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && active) {
        recoveryEventReceived = true;
        setState("ready");
      }
    });

    async function verifyRecoveryLink() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const callbackError = url.searchParams.get("error_description") || url.searchParams.get("error");
      const isRecoveryHash = url.hash.includes("type=recovery");

      if (callbackError) {
        if (active) setState("invalid");
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (active) setState(exchangeError ? "invalid" : "ready");
        return;
      }

      if (isRecoveryHash) {
        window.setTimeout(async () => {
          const { data } = await supabase.auth.getSession();
          if (active) setState(data.session && (recoveryEventReceived || isRecoveryHash) ? "ready" : "invalid");
        }, 700);
        return;
      }

      if (active) setState("invalid");
    }

    void verifyRecoveryLink();
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (rules.some((rule) => !rule.valid)) {
      setError("Şifre tüm güvenlik koşullarını karşılamalı.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setState("success");
      await supabase.auth.signOut({ scope: "global" });
      window.setTimeout(() => router.replace("/hesap/giris"), 2200);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message.toLowerCase() : "";
      setError(message.includes("same") ? "Yeni şifre eski şifreden farklı olmalı." : "Şifre güncellenemedi. Yeni bir sıfırlama bağlantısı iste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper px-5 pb-16 pt-28 text-zinc-950 dark:bg-bg-dark dark:text-white sm:px-6 sm:pt-32">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/[0.07] dark:border-white/[0.09] dark:bg-surface md:grid-cols-[0.8fr_1.2fr]">
        <aside className="relative overflow-hidden bg-zinc-950 p-8 text-white sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_80%_85%,rgba(190,242,100,0.18),transparent_35%)]" />
          <div className="relative flex h-full min-h-64 flex-col justify-between">
            <Link href="/" className="text-lg font-black">FitHub</Link>
            <div className="mt-16"><ShieldCheck size={30} className="text-accent" /><h1 className="mt-5 text-3xl font-black tracking-tight">Hesabını güvenle geri al.</h1><p className="mt-4 text-sm leading-6 text-zinc-400">Bağlantı yalnızca bu şifre değişikliği için ve sınırlı süreyle kullanılabilir.</p></div>
          </div>
        </aside>

        <section className="flex min-h-[540px] flex-col justify-center p-7 sm:p-10">
          {state === "checking" && <div className="text-center"><Loader2 className="mx-auto animate-spin text-primary" size={30} /><h2 className="mt-5 text-xl font-black">Bağlantı doğrulanıyor</h2><p className="mt-2 text-sm text-zinc-500">Güvenli sıfırlama oturumu hazırlanıyor.</p></div>}

          {state === "invalid" && <div className="text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600"><AlertCircle size={25} /></span><h2 className="mt-5 text-2xl font-black">Bağlantı geçersiz veya süresi dolmuş</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Güvenliğin için yeni bir şifre sıfırlama bağlantısı istemelisin.</p><Link href="/hesap/giris" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-white">Yeni bağlantı iste <ArrowRight size={15} /></Link></div>}

          {state === "success" && <div className="text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CheckCircle2 size={26} /></span><h2 className="mt-5 text-2xl font-black">Şifren güncellendi</h2><p className="mt-3 text-sm text-zinc-500">Tüm oturumların kapatıldı. Yeni şifrenle giriş sayfasına yönlendiriliyorsun.</p><Loader2 className="mx-auto mt-6 animate-spin text-primary" size={20} /></div>}

          {state === "ready" && <div><Link href="/hesap/giris" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500"><ArrowLeft size={14} /> Girişe dön</Link><span className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><KeyRound size={22} /></span><h2 className="mt-5 text-3xl font-black tracking-tight">Yeni şifreni oluştur</h2><p className="mt-2 text-sm text-zinc-500">Başka bir hesabında kullanmadığın güçlü bir şifre seç.</p>
            {error && <div className="mt-5 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</div>}
            <form onSubmit={submit} className="mt-6 space-y-5">
              <label className="block text-sm font-bold">Yeni şifre<span className="relative mt-2 block"><Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-12 text-sm font-semibold outline-none focus:border-primary dark:border-white/[0.09] dark:bg-white/[0.04]" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-zinc-400">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
              {password && <div className="grid grid-cols-2 gap-2">{rules.map((rule) => <span key={rule.label} className={`flex items-center gap-1.5 text-[11px] font-semibold ${rule.valid ? "text-primary" : "text-zinc-400"}`}><span className={`flex h-4 w-4 items-center justify-center rounded-full ${rule.valid ? "bg-primary text-white" : "border border-zinc-300 dark:border-white/20"}`}>{rule.valid && <Check size={10} strokeWidth={3} />}</span>{rule.label}</span>)}</div>}
              <label className="block text-sm font-bold">Şifreyi tekrar yaz<input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none focus:border-primary dark:border-white/[0.09] dark:bg-white/[0.04]" /></label>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-white disabled:opacity-50">{loading ? <Loader2 size={17} className="animate-spin" /> : <>Şifremi güncelle <ArrowRight size={16} /></>}</button>
            </form>
          </div>}
        </section>
      </div>
    </main>
  );
}

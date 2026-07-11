"use client";

import { Suspense, useEffect, useState } from "react";
import type { InputHTMLAttributes } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity, AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2,
  Eye, EyeOff, Loader2, Lock, Mail, RefreshCw, ShieldCheck, User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register" | "forgot";

function translateError(message: string) {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials") || text.includes("invalid credentials")) return "E-posta veya şifre hatalı.";
  if (text.includes("email not confirmed")) return "E-posta adresini onaylaman gerekiyor. Gelen kutunu kontrol et.";
  if (text.includes("already registered")) return "Bu e-posta adresiyle zaten bir hesap var.";
  if (text.includes("password should be at least")) return "Şifre en az 10 karakter olmalı.";
  if (text.includes("invalid email")) return "Geçerli bir e-posta adresi gir.";
  if (text.includes("rate limit") || text.includes("too many")) return "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar dene.";
  if (text.includes("provider") && text.includes("not enabled")) return "Bu giriş yöntemi henüz etkin değil.";
  if ((text.includes("token") || text.includes("otp")) && (text.includes("invalid") || text.includes("expired"))) return "Kod geçersiz veya süresi dolmuş. Yeni kod isteyip tekrar dene.";
  if (text.includes("weak") || text.includes("strength")) return "Daha güçlü bir şifre seçmelisin.";
  if (text.includes("signup") && text.includes("disabled")) return "Yeni hesap oluşturma geçici olarak kapalı.";
  if (text.includes("network") || text.includes("fetch")) return "Bağlantı kurulamadı. İnternet bağlantını kontrol et.";
  return "İşlem tamamlanamadı. Lütfen tekrar dene.";
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: typeof Mail;
  error?: string;
}

function Field({ label, icon: Icon, error, ...props }: FieldProps) {
  return (
    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
      {label}
      <span className="relative mt-2 block">
        <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input {...props} className={`h-12 w-full rounded-xl border bg-zinc-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-primary dark:bg-white/[0.04] ${error ? "border-rose-400" : "border-zinc-200 dark:border-white/[0.09]"}`} />
      </span>
      {error && <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-600"><AlertCircle size={12} />{error}</span>}
    </label>
  );
}

function LoginContent() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const passwordRules = [
    { label: "En az 10 karakter", valid: password.length >= 10 },
    { label: "Büyük ve küçük harf", valid: /[A-ZÇĞİÖŞÜ]/.test(password) && /[a-zçğıöşü]/.test(password) },
    { label: "En az bir rakam", valid: /\d/.test(password) },
    { label: "En az bir özel karakter", valid: /[^\p{L}\p{N}\s]/u.test(password) },
  ];

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    let active = true;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !publicKey) return;

    fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: publicKey } })
      .then((response) => response.json())
      .then((settings) => {
        if (active) setGoogleEnabled(settings?.external?.google === true);
      })
      .catch(() => {
        // E-posta ile giriş kullanılmaya devam eder.
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    async function redirectUser(user: SupabaseUser) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (!active) return;
      router.replace(profile?.role?.trim() === "admin" ? "/admin" : "/hesap");
    }

    async function checkAuth() {
      const callbackError = searchParams.get("error_description") || searchParams.get("error");
      if (callbackError) {
        setMessage({ type: "error", text: translateError(callbackError) });
        return;
      }

      const code = searchParams.get("code");
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.user) return redirectUser(data.user);
      }

      const { data } = await supabase.auth.getUser();
      if (data.user) await redirectUser(data.user);
    }

    void checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) void redirectUser(session.user);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [router, searchParams]);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setMessage(null);
    setVerificationEmail("");
    setVerificationCode("");
  };

  const continueWithGoogle = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/hesap/giris`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error && error.message.toLowerCase().includes("provider")
          ? "Google ile giriş henüz etkin değil. Lütfen e-posta ile devam et."
          : "Google ile bağlantı kurulamadı. Lütfen tekrar dene.",
      });
      setLoading(false);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (mode === "register" && (fullName.trim().split(/\s+/).length < 2 || !/^[\p{L}\s.'-]+$/u.test(fullName.trim()))) nextErrors.fullName = "Geçerli ad ve soyadını gir.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Geçerli bir e-posta adresi gir.";
    if (mode === "login" && password.length < 6) nextErrors.password = "Şifreni gir.";
    if (mode === "register" && passwordRules.some((rule) => !rule.valid)) nextErrors.password = "Şifre tüm güvenlik koşullarını karşılamalı.";
    if (mode === "register" && password !== confirmPassword) nextErrors.confirmPassword = "Şifreler eşleşmiyor.";
    if (mode === "register" && !acceptedTerms) nextErrors.terms = "Devam etmek için koşulları kabul etmelisin.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        if (data.user) {
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
          router.replace(profile?.role?.trim() === "admin" ? "/admin" : "/hesap");
        }
      }

      if (mode === "register") {
        const formattedName = fullName.trim().split(/\s+/).map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1).toLocaleLowerCase("tr-TR")).join(" ");
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(), password,
          options: { data: { full_name: formattedName }, emailRedirectTo: `${window.location.origin}/hesap/giris` },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/hesap");
          return;
        }
        setVerificationEmail(email.trim().toLowerCase());
        setResendCooldown(60);
        setMessage(null);
        setPassword("");
        setConfirmPassword("");
        setAcceptedTerms(false);
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/hesap/sifre-sifirla` });
        if (error) throw error;
        setMessage({ type: "success", text: "Şifre sıfırlama bağlantısı e-posta adresine gönderildi." });
      }
    } catch (error) {
      setMessage({ type: "error", text: translateError(error instanceof Error ? error.message : "") });
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!verificationEmail || resendCooldown > 0) return;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: verificationEmail,
        options: { emailRedirectTo: `${window.location.origin}/hesap/giris` },
      });
      if (error) throw error;
      setVerificationCode("");
      setResendCooldown(60);
      setMessage({ type: "success", text: "Doğrulama e-postası yeniden gönderildi." });
    } catch (error) {
      setMessage({ type: "error", text: translateError(error instanceof Error ? error.message : "") });
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = verificationCode.trim();
    if (code.length !== 8) {
      setMessage({ type: "error", text: "E-postadaki 8 haneli doğrulama kodunu gir." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: verificationEmail,
        token: code,
        type: "signup",
      });
      if (error) throw error;
      if (data.user) router.replace("/hesap");
    } catch (error) {
      setMessage({ type: "error", text: translateError(error instanceof Error ? error.message : "") });
    } finally {
      setLoading(false);
    }
  };

  const config = {
    login: { title: "Hesabına giriş yap", text: "Planına ve kayıtlarına kaldığın yerden devam et.", action: "Giriş yap" },
    register: { title: "Hesap oluştur", text: "İlerlemeni kaydetmek için ücretsiz hesabını oluştur.", action: "Hesap oluştur" },
    forgot: { title: "Şifreni yenile", text: "Sıfırlama bağlantısını e-posta adresine gönderelim.", action: "Bağlantı gönder" },
  }[mode];

  return (
    <main className="min-h-screen bg-paper px-5 pb-16 pt-28 text-zinc-950 dark:bg-bg-dark dark:text-white sm:px-6 sm:pt-32">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/[0.07] dark:border-white/[0.09] dark:bg-surface lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative overflow-hidden bg-zinc-950 p-8 text-white sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(91,91,240,0.38),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(201,242,75,0.18),transparent_35%)]" />
          <div className="grid-lab absolute inset-0 opacity-40" aria-hidden />
          <div className="relative flex h-full min-h-72 flex-col justify-between">
            <div className="flex items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2.5 font-black"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-950"><Activity size={18} /></span>FitHub</Link><span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300">Güvenli alan</span></div>
            <div className="mt-16">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-accent">Tek hesap, net ilerleme</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Planın ve gelişimin her zaman yanında.</h2>
              <div className="mt-7 space-y-4">
                {["Ölçüm ve hesaplama sonuçlarını saklar", "Programına kaldığın yerden devam ettirir", "Asistanın kayıtlarına göre öneri sunmasını sağlar"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-zinc-300"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-zinc-950"><Check size={12} strokeWidth={3} /></span>{item}</div>)}
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><span>Google OAuth</span><span>•</span><span>Doğrulamalı e-posta</span><span>•</span><span>RLS koruması</span></div>
          </div>
        </aside>

        <section className="p-7 sm:p-10 lg:p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white"><ArrowLeft size={14} /> Ana sayfa</Link>
          {verificationEmail ? (
            <div className="flex min-h-[520px] flex-col justify-center py-8 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Mail size={28} /></span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-primary">Son bir adım</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight">E-posta adresini doğrula</h1>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-500"><strong className="text-zinc-900 dark:text-white">{verificationEmail}</strong> adresine 8 haneli bir doğrulama kodu gönderdik.</p>
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left text-sm text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400">
                <p className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" /> Gelen kutusu ve spam klasörünü kontrol et.</p>
                <p className="mt-2 flex gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" /> Kod tek kullanımlıktır ve hesabını güvenle etkinleştirir.</p>
              </div>
              <form onSubmit={verifyEmailCode} className="mt-6">
                <label className="block text-left text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                  Doğrulama kodu
                  <input
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={8}
                    placeholder="00000000"
                    aria-label="8 haneli doğrulama kodu"
                    className="mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-center font-mono text-2xl font-black tracking-[0.45em] text-zinc-950 outline-none transition placeholder:tracking-[0.32em] placeholder:text-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-white dark:placeholder:text-zinc-600"
                  />
                </label>
                <button type="submit" disabled={loading || verificationCode.length !== 8} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Kodu doğrula ve devam et
                </button>
              </form>
              {message && <div className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === "success" ? "border-primary/25 bg-primary/5 text-primary" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"}`}>{message.text}</div>}
              <button type="button" onClick={resendVerification} disabled={loading || resendCooldown > 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3.5 text-sm font-black text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950">{loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} {resendCooldown > 0 ? `${resendCooldown} saniye sonra tekrar gönder` : "Doğrulama e-postasını tekrar gönder"}</button>
              <button type="button" onClick={() => { setVerificationEmail(""); setVerificationCode(""); setMode("register"); setMessage(null); }} className="mt-4 text-sm font-bold text-primary">E-posta adresini değiştir</button>
            </div>
          ) : (
          <>
            <h1 className="mt-8 text-3xl font-black tracking-tight sm:text-4xl">{config.title}</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{config.text}</p>

          {mode !== "forgot" && googleEnabled && (
            <>
              <button
                type="button"
                onClick={continueWithGoogle}
                disabled={loading}
                aria-label="Google hesabıyla devam et"
                className="group relative mt-7 flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 text-sm font-black text-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/10 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-55 dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:hover:bg-white/[0.1]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-100 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-white/10 dark:bg-white">
                  <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]">
                    <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.15c1.84-1.69 2.9-4.18 2.9-7.29Z" />
                    <path fill="#34A853" d="M12 21.75c2.63 0 4.83-.87 6.45-2.37L15.3 16.9c-.87.58-1.98.92-3.3.92-2.54 0-4.7-1.72-5.47-4.03H3.27v2.6A9.74 9.74 0 0 0 12 21.75Z" />
                    <path fill="#FBBC05" d="M6.53 13.79A5.86 5.86 0 0 1 6.22 12c0-.62.11-1.22.31-1.79v-2.6H3.27A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.02 4.39l3.26-2.6Z" />
                    <path fill="#EA4335" d="M12 6.18c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.27 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.73 5.36l3.26 2.6C7.3 7.9 9.46 6.18 12 6.18Z" />
                  </svg>
                </span>
                <span>Google ile devam et</span>
                <ArrowRight size={16} className="absolute right-5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-700 dark:group-hover:text-white" aria-hidden />
              </button>
              <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                <span className="h-px flex-1 bg-zinc-200 dark:bg-white/[0.08]" />
                veya e-posta ile devam et
                <span className="h-px flex-1 bg-zinc-200 dark:bg-white/[0.08]" />
              </div>
            </>
          )}

          {mode !== "forgot" && <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-white/[0.05]"><button type="button" onClick={() => changeMode("login")} className={`rounded-lg py-2.5 text-sm font-bold ${mode === "login" ? "bg-white shadow-sm dark:bg-white/[0.09]" : "text-zinc-500"}`}>Giriş</button><button type="button" onClick={() => changeMode("register")} className={`rounded-lg py-2.5 text-sm font-bold ${mode === "register" ? "bg-white shadow-sm dark:bg-white/[0.09]" : "text-zinc-500"}`}>Yeni hesap</button></div>}

          {message && <div className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === "success" ? "border-primary/25 bg-primary/5 text-primary" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"}`}>{message.text}</div>}

          <form onSubmit={submit} className="mt-6 space-y-5">
            {mode === "register" && <Field label="Ad soyad" icon={User} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" error={errors.fullName} />}
            <Field label="E-posta" icon={Mail} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" error={errors.email} />
            {mode !== "forgot" && <div><div className="relative"><Field label="Şifre" icon={Lock} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} error={errors.password} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} className="absolute right-3 top-9 flex h-9 w-9 items-center justify-center text-zinc-400">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{mode === "register" && password && <div className="mt-3 grid grid-cols-2 gap-2">{passwordRules.map((rule) => <span key={rule.label} className={`flex items-center gap-1.5 text-[11px] font-semibold ${rule.valid ? "text-primary" : "text-zinc-400"}`}><span className={`flex h-4 w-4 items-center justify-center rounded-full ${rule.valid ? "bg-primary text-white" : "border border-zinc-300 dark:border-white/20"}`}>{rule.valid && <Check size={10} strokeWidth={3} />}</span>{rule.label}</span>)}</div>}</div>}
            {mode === "register" && <Field label="Şifreyi tekrar yaz" icon={Lock} type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" error={errors.confirmPassword} />}
            {mode === "register" && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 text-sm leading-6 text-zinc-600 dark:border-white/[0.08] dark:text-zinc-400"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-primary" /><span><Link href="/kullanim-sartlari" target="_blank" className="font-bold text-zinc-950 underline dark:text-white">Kullanım şartlarını</Link> ve <Link href="/gizlilik-politikasi" target="_blank" className="font-bold text-zinc-950 underline dark:text-white">gizlilik politikasını</Link> okudum, kabul ediyorum.</span></label>}
            {mode === "register" && errors.terms && <p className="-mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600"><AlertCircle size={12} />{errors.terms}</p>}
            {mode === "login" && <button type="button" onClick={() => changeMode("forgot")} className="text-sm font-bold text-primary">Şifremi unuttum</button>}
            {mode === "forgot" && <button type="button" onClick={() => changeMode("login")} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500"><ArrowLeft size={14} /> Girişe dön</button>}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-white disabled:opacity-50">{loading ? <Loader2 size={17} className="animate-spin" /> : <>{config.action}<ArrowRight size={16} /></>}</button>
          </form>
            {mode !== "register" && <p className="mt-6 text-center text-xs leading-5 text-zinc-500">Giriş yaparak <Link href="/kullanim-sartlari" className="font-bold underline">kullanım şartlarını</Link> ve <Link href="/gizlilik-politikasi" className="font-bold underline">gizlilik politikasını</Link> kabul etmiş olursun.</p>}
          </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-paper dark:bg-bg-dark"><Loader2 className="animate-spin text-primary" /></div>}><LoginContent /></Suspense>;
}

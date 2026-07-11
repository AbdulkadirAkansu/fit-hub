"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SaveResultButtonProps {
  type: string;
  result: Record<string, unknown> | unknown;
  inputs: Record<string, unknown> | unknown;
  onSuccess?: () => void;
}

export default function SaveResultButton({ type, result, inputs, onSuccess }: SaveResultButtonProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (err) {
        console.warn("Auth check warning (offline?):", err);
      }
    };
    checkAuth();
  }, []);

  const handleSave = async () => {
    if (isLoggedIn === false) {
      router.push("/hesap/giris");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsLoggedIn(false);
        router.push("/hesap/giris");
        return;
      }

      const { error: insertError } = await supabase
        .from('saved_calculations')
        .insert([
          {
            user_id: session.user.id,
            type,
            result,
            inputs
          }
        ]);

      if (insertError) throw insertError;

      setSaved(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kaydedilirken bir hata oluştu.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleSave}
        disabled={loading || saved}
        className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 ${
          saved
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 hover:shadow-xl dark:bg-white dark:text-zinc-950 dark:shadow-white/10"
        }`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : saved ? (
          <>
            <CheckCircle2 size={16} /> BAŞARIYLA KAYDEDİLDİ
          </>
        ) : isLoggedIn === false ? (
          <>
            <Save size={16} /> GİRİŞ YAP VE KAYDET
          </>
        ) : (
          <>
            <Save size={16} /> SONUCU PROFİLİME KAYDET
          </>
        )}
      </button>
      {error && <p className="text-[10px] text-rose-500 font-bold mt-2 text-center">{error}</p>}
    </div>
  );
}

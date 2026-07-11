"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthSessionContextValue {
  session: Session | null;
  status: AuthStatus;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const initialized = useRef(false);

  useEffect(() => {
    let active = true;

    const applySession = (nextSession: Session | null) => {
      if (!active) return;
      initialized.current = true;
      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "anonymous");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession) => {
        if (
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED" ||
          event === "PASSWORD_RECOVERY"
        ) {
          applySession(nextSession);
        }
      },
    );

    // INITIAL_SESSION normalde ilk kaynağımızdır. Bu çağrı yalnızca ağ/SDK
    // koşullarında event gecikirse arayüzün sonsuza kadar beklememesi için fallback'tir.
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active || initialized.current) return;
      if (error) {
        console.warn("Supabase oturumu doğrulanamadı:", error.message);
        applySession(null);
        return;
      }
      applySession(data.session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session, status }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error("useAuthSession, AuthSessionProvider içinde kullanılmalıdır.");
  return context;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabasePublicKey) {
  // Surface a clear, actionable message instead of cryptic runtime failures.
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL ve publishable/anon anahtarı tanımlı değil. ' +
      '.env.local dosyanızı kontrol edin.'
  );
}

// Vercel build aşamasında değişkenler yoksa uygulamanın çökmemesi için geçici değerler.
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabasePublicKey || 'placeholder-key';

/**
 * Global Supabase client with built-in network error resilience.
 * The `Failed to fetch` errors are suppressed at the client level
 * using a custom fetch wrapper that catches network-level failures
 * before they bubble up to the browser console.
 */
const resilientFetch: typeof fetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch (err: unknown) {
    // Swallow transient network / offline errors silently.
    // Supabase's auth-js retry logic will handle re-attempts.
    if (
      err instanceof TypeError &&
      (err.message === 'Failed to fetch' ||
        err.message.includes('network') ||
        err.message.includes('fetch'))
    ) {
      // Return a mock 503 response so the SDK can handle retries gracefully
      return new Response(
        JSON.stringify({ error: 'network_unavailable', message: 'Failed to fetch' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    throw err;
  }
};

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    debug: false,
    autoRefreshToken: true,
    detectSessionInUrl: true, // PKCE flow için şifre sıfırlama token'ını URL'den otomatik yakala
  },
  global: {
    fetch: resilientFetch,
  },
});

/**
 * Stale / geçersiz refresh token gürültüsünü bastırır.
 *
 * Senaryo: localStorage'da süresi dolmuş bir oturum kalmış ve sunucudaki refresh
 * token artık geçerli değil (Supabase projesi değişmiş, oturum iptal edilmiş veya
 * eski bir kalıntı). Bu durumda auth-js (GoTrueClient `_recoverAndRefresh`)
 * `console.error(error)` ile "Invalid Refresh Token: Refresh Token Not Found"
 * hatasını basar — HEMEN ARDINDAN oturumu otomatik olarak temizler. Yani hata
 * zararsızdır; kullanıcı zaten çıkış yapmış sayılır.
 *
 * Next.js dev overlay her `console.error`'ı kırmızı bir hata olarak gösterdiğinden
 * bu beklenen/zararsız durumu cerrahi olarak filtreliyoruz. Diğer tüm hatalar
 * olduğu gibi geçer.
 */
function installAuthNoiseSuppression() {
  if (typeof window === 'undefined') return;
  if ((window as unknown as { __fithubAuthPatch?: boolean }).__fithubAuthPatch) return;
  (window as unknown as { __fithubAuthPatch?: boolean }).__fithubAuthPatch = true;

  const isBenignRefreshError = (arg: unknown): boolean => {
    const msg =
      typeof arg === 'string'
        ? arg
        : arg && typeof arg === 'object' && 'message' in arg
        ? String((arg as { message?: unknown }).message ?? '')
        : '';
    const lc = msg.toLowerCase();
    return (
      lc.includes('refresh token not found') ||
      lc.includes('invalid refresh token') ||
      lc.includes('refresh_token_not_found')
    );
  };

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (args.some(isBenignRefreshError)) return; // benign — already handled by sign-out
    originalError(...args);
  };
}

installAuthNoiseSuppression();

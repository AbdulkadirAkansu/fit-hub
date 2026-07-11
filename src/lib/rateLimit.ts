/**
 * Basit bellek-içi (in-memory) sabit pencereli rate limiter.
 *
 * Not: Sunucu süreci yeniden başladığında veya birden fazla instance/serverless
 * fonksiyon kopyası çalıştığında sayaç paylaşılmaz — tek-instance/uzun-ömürlü
 * süreç (örn. `next start`) için tam koruma sağlar, çok-instance serverless
 * dağıtımda (Vercel gibi) ek bir kötüye kullanım engeli katmanı olarak çalışır,
 * tam garanti değildir. Kalıcı/paylaşımlı limit için Upstash/Redis önerilir.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  request: Request,
  { limit, windowMs, scope }: { limit: number; windowMs: number; scope: string }
): { allowed: boolean; retryAfterSeconds: number } {
  const key = `${scope}:${getClientKey(request)}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

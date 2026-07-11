import type { NextConfig } from "next";

// Tüm yanıtlara uygulanan güvenlik header'ları (clickjacking, MIME-sniffing,
// referrer sızıntısı ve istenmeyen tarayıcı API erişimlerine karşı sertleştirme).
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // HSTS yalnızca HTTPS üzerinde anlam taşır; üretimde tarayıcıyı HTTPS'e kilitler.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Görseller harici kaynaklardan (Unsplash, Supabase Storage ve admin
    // tarafından girilen serbest URL'ler) gelebildiğinden tüm HTTPS host'larına
    // izin veriyoruz. İçerik sitesi için kabul edilebilir; yine de yalnızca
    // HTTPS ile sınırlı.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

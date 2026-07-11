/**
 * Tek doğruluk kaynağı: sitenin genel (canonical) kök adresi.
 *
 * Öncelik sırası:
 *  1. NEXT_PUBLIC_SITE_URL  → yayına aldığın gerçek alan adı (ör. https://fithub.app)
 *  2. VERCEL_PROJECT_PRODUCTION_URL → Vercel üretim dağıtımı otomatik verir
 *  3. localhost              → yerel geliştirme
 *
 * SEO (canonical/OG), sitemap ve robots buradan beslenir; böylece yanlış bir
 * placeholder alan adı sızmaz. Yayın öncesi .env.local içine
 * NEXT_PUBLIC_SITE_URL=https://senin-alanin.com eklemen yeterli.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** metadataBase için hazır URL nesnesi. */
export const SITE_URL_OBJECT = new URL(SITE_URL);

/** Marka sabitleri — tek yerden. */
export const SITE_NAME = "FitHub";
export const SITE_DESCRIPTION =
  "Hedefine göre kalori, makro, antrenman ve pilates planını ücretsiz oluştur. Ölç, planla, uygula — bilimsel temelli modern fitness rehberi.";

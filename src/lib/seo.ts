import { Metadata } from "next";
import { SITE_URL_OBJECT, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const DEFAULT_TITLE = "FitHub | Modern Fitness & Pilates Rehberi";

export function constructMetadata({
  title = DEFAULT_TITLE,
  description = SITE_DESCRIPTION,
  // Boş bırakılırsa Next, app/opengraph-image.tsx tarafından üretilen görseli
  // otomatik kullanır. Sadece özel bir görsel gerektiğinde image geç.
  image,
  noIndex = false,
  path = "/",
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  path?: string;
} = {}): Metadata {
  const openGraphImages = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    metadataBase: SITE_URL_OBJECT,
    alternates: {
      canonical: path,
    },
    applicationName: SITE_NAME,
    openGraph: {
      title,
      description,
      url: path,
      ...(openGraphImages ? { images: openGraphImages } : {}),
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

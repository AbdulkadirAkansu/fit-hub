import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Egzersiz Kütüphanesi | FitHub",
  description: "Tüm kas grupları için detaylı egzersiz rehberi. Doğru form, animasyonlar ve kas anatomisi.",
  
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

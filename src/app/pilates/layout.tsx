import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Pilates Hareketleri ve Reformer Egzersizleri | FitHub",
  description: "Evde veya salonda yapabileceğiniz pilates hareketleri, seviye testleri ve esneklik rutinleri.",
  
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Fitness Topluluğu ve Soru Cevap | FitHub",
  description: "Diğer sporcularla yardımlaşın, sorular sorun ve fitness yolculuğunuzu paylaşın.",
  
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

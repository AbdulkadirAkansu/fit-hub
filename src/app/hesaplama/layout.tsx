import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Kalori, Makro ve Vücut Kitle İndeksi Hesaplama Aracı | FitHub",
  description: "Bilimsel formüllerle günlük kalori ihtiyacınızı, makro besin dağılımınızı ve vücut kitle indeksinizi hesaplayın.",
  
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

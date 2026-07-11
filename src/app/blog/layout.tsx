import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Fitness, Beslenme ve Sağlık Blogu | FitHub",
  description: "Sağlıklı yaşam, beslenme tüyoları ve antrenman bilimi hakkında en güncel makaleler.",
  
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Antrenman ve Fitness Programları | FitHub",
  description: "Hedefinize ve seviyenize uygun ücretsiz antrenman, hipertrofi ve zayıflama programları oluşturun.",
  
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

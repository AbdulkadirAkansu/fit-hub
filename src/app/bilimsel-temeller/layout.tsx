import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Bilimsel Temeller | FitHub",
  description: "FitHub hesaplama araçlarının ve antrenman programlarının dayandığı bilimsel formüller, denklemler ve akademik kaynaklar.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

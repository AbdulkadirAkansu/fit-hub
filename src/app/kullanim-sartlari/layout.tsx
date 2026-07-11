import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Kullanım Şartları | FitHub",
  description: "FitHub kullanım şartları ve hizmet koşulları. Platformu kullanmadan önce lütfen okuyun.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

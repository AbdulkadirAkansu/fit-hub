import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Sağlık Sorumluluk Reddi | FitHub",
  description: "FitHub'daki bilgiler eğitim amaçlıdır ve tıbbi tavsiye yerine geçmez. Sağlık kararlarınız için mutlaka bir uzmana danışın.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

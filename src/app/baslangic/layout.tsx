import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kişisel Fitness Rotanı Oluştur | FitHub",
  description: "Hedefinizi, deneyim düzeyinizi ve haftalık uygunluğunuzu seçerek size özel ölçüm ve antrenman başlangıç rotası oluşturun.",
};

export default function BaslangicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

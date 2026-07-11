import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "İletişim | FitHub",
  description: "FitHub ekibiyle iletişime geçin. Soru, öneri ve iş birliği talepleriniz için bize ulaşın.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

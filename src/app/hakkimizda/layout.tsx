import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Hakkımızda | FitHub",
  description: "FitHub'ın bilimsel fitness misyonu, veriye dayalı sağlıklı yaşam yaklaşımımız ve ekibimiz hakkında bilgi edinin.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

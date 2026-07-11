import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Gizlilik Politikası | FitHub",
  description: "FitHub gizlilik politikası: kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında detaylı bilgi.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

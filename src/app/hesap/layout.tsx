import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Hesabım ve Biyometrik Laboratuvar | FitHub",
  description: "Kişisel fitness asistanınız ve biyometrik gelişim laboratuvarınız.",
  noIndex: true
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

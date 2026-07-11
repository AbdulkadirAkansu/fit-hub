import { ShieldAlert } from "lucide-react";
import PolicyDocument, { type PolicySection } from "@/components/common/PolicyDocument";

const SECTIONS: PolicySection[] = [
  {
    id: "tibbi-tavsiye-degil",
    title: "Tıbbi tavsiye değildir",
    body: [
      "FitHub'daki hesaplamalar, içerikler ve programlar genel eğitim amacı taşır. Hiçbir sonuç tanı, tedavi, reçete veya doktor önerisi olarak yorumlanmamalıdır. Bir ölçümün referans aralığı dışında görünmesi tek başına hastalık anlamına gelmez.",
    ],
  },
  {
    id: "uzmana-danisin",
    title: "Başlamadan önce uzmana danışın",
    body: [
      "Kronik hastalığınız, yakın zamanda geçirilmiş bir operasyonunuz, devam eden ağrınız, hamileliğiniz veya düzenli kullandığınız ilaçlar varsa yeni bir egzersiz ya da beslenme düzenine başlamadan önce hekiminize danışın.",
    ],
    bullets: ["Kalp-damar veya solunum rahatsızlığı", "Kontrolsüz tansiyon ya da metabolik hastalık", "Yeni veya açıklanamayan ağrı", "Hamilelik ve doğum sonrası dönem"],
  },
  {
    id: "uyari-isaretleri",
    title: "Aktiviteyi ne zaman durdurmalısınız",
    body: [
      "Göğüs ağrısı, bayılma hissi, olağan dışı nefes darlığı, düzensiz kalp atımı, keskin eklem ağrısı veya ani güç kaybı yaşarsanız aktiviteyi hemen durdurun. Belirtiler ciddi veya devam ediyorsa yerel acil sağlık hizmetine başvurun.",
    ],
  },
  {
    id: "tahmin-sinirlari",
    title: "Tahminlerin sınırları",
    body: [
      "Kalori, vücut yağ oranı, hedef nabız ve benzeri çıktılar nüfus temelli denklemlerden üretilir. Ölçüm tekniği, biyolojik farklılıklar ve günlük koşullar nedeniyle gerçek değerden sapabilir. Tek bir sonuca değil, aynı koşullarda oluşan zaman içindeki eğilime odaklanın.",
    ],
  },
  {
    id: "kisisel-sorumluluk",
    title: "Kişisel sorumluluk",
    body: [
      "Egzersiz yoğunluğunu kendi deneyiminize ve güncel durumunuza göre ayarlayın. Hareket tekniğinden emin değilseniz yetkin bir antrenörden destek alın. FitHub'ın sunduğu bilgileri uygulama kararı ve bu kararın sonuçları kullanıcıya aittir.",
    ],
  },
];

export default function SaglikUyarisiPage() {
  return (
    <PolicyDocument
      kicker="Güvenlik protokolü"
      title="Önce güvenlik. Her zaman."
      description="Vücudunuz bir veri noktası değildir. Araçları bilinçli kullanın, belirtileri ciddiye alın ve gerektiğinde profesyonel destek alın."
      label="Sağlık sorumluluk reddi"
      updated="05 Temmuz 2026"
      sections={SECTIONS}
      icon={ShieldAlert}
      danger
      notice="Acil bir belirti yaşıyorsanız bu sayfadaki bilgileri beklemeyin; bulunduğunuz yerdeki acil sağlık hizmetine başvurun."
    />
  );
}

import { 
  Scale, 
  Utensils, 
  Dumbbell, 
  Activity
} from "lucide-react";

export const CALCULATION_CATEGORIES = [
  {
    id: "vucut",
    title: "Vücut Hesaplamaları",
    description: "Fiziksel durumunuzu analiz edin.",
    icon: Scale,
    items: [
      { title: "VKİ Hesaplama", href: "/hesaplama/vki", desc: "Vücut kitle endeksinizi öğrenin." },
      { title: "İdeal Kilo", href: "/hesaplama/ideal-kilo", desc: "Boyunuza göre ideal kilonuz." },
      { title: "Bel-Kalça Oranı", href: "/hesaplama/bel-kalca", desc: "Yağ dağılımı risk analizi." },
      { title: "Bel-Boy Oranı", href: "/hesaplama/bel-boy", desc: "Abdominal yağlanma riskini ölçün." },
      { title: "Vücut Kompozisyonu", href: "/hesaplama/vucut-kompozisyonu", desc: "Çevre ölçümleriyle yağ ve yağsız kütle tahmini." },
    ]
  },
  {
    id: "beslenme",
    title: "Beslenme Hesaplamaları",
    description: "Diyet ve enerji dengenizi planlayın.",
    icon: Utensils,
    items: [
      { title: "Kalori İhtiyacı", href: "/hesaplama/kalori", desc: "Günlük yakmanız gereken enerji." },
      { title: "Makro Hesaplama", href: "/hesaplama/makro", desc: "Protein, yağ, karbonhidrat dengesi." },
      { title: "Su İhtiyacı", href: "/hesaplama/su", desc: "Günlük içmeniz gereken su miktarı." },
      { title: "Diyet Planlayıcı", href: "/hesaplama/diyet-plani", desc: "Kişiselleştirilmiş 7 günlük öğün reçetesi." },
    ]
  },
  {
    id: "fitness",
    title: "Fitness Hesaplamaları",
    description: "Antrenman verimliliğinizi artırın.",
    icon: Dumbbell,
    items: [
      { title: "1RM Hesaplama", href: "/hesaplama/1rm", desc: "Tekrarda kaldırabileceğiniz max ağırlık." },
      { title: "Plaka Hesaplama", href: "/hesaplama/plaka", desc: "Barın her bir yanına takılacak ağırlıklar." },
      { title: "Antrenman Hacmi", href: "/hesaplama/antrenman-hacmi", desc: "Toplam antrenman yükünüzü (Volume) ölçün." },
      { title: "Nabız Bölgeleri", href: "/hesaplama/nabiz", desc: "Hedef antrenman nabız aralıklarınız." },
      { title: "Kardiyo Kalori", href: "/hesaplama/kardiyo-kalori", desc: "Aktiviteye göre yakılan kalori tahmini." },
    ]
  },
  {
    id: "pilates",
    title: "Pilates Hesaplamaları",
    description: "Esneklik ve core gücü takibi.",
    icon: Activity,
    items: [
      { title: "Seviye Testi", href: "/pilates/seviye-testi", desc: "Hangi seviyeden başlamalısınız?" },
    ]
  }
];

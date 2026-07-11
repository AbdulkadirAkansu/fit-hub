"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MeasurementAnalysis from "./MeasurementAnalysis";
import { MeasurementAnalysisKey } from "@/constants/measurementAnalysis";

const ANALYSIS_BY_PATH: Record<string, MeasurementAnalysisKey> = {
  "/hesaplama/vki": "vki",
  "/hesaplama/kalori": "calorie",
  "/hesaplama/makro": "macro",
  "/hesaplama/1rm": "oneRm",
  "/hesaplama/nabiz": "heartRate",
  "/hesaplama/su": "water",
  "/hesaplama/ideal-kilo": "idealWeight",
  "/hesaplama/bel-boy": "waistHeight",
  "/hesaplama/bel-kalca": "waistHip",
  "/hesaplama/kardiyo-kalori": "cardio",
  "/hesaplama/antrenman-hacmi": "volume",
  "/hesaplama/plaka": "plates",
  "/hesaplama/vucut-kompozisyonu": "bodyComposition",
};

const NEXT_ACTIONS: Record<string, Array<{ title: string; description: string; href: string }>> = {
  "/hesaplama/vki": [
    { title: "Bel-boy oranını tamamla", description: "Merkezi yağlanmayı boya göre değerlendir.", href: "/hesaplama/bel-boy" },
    { title: "Vücut kompozisyonunu ölç", description: "Ağırlığı yağ ve yağsız kütle bileşenlerine ayır.", href: "/hesaplama/vucut-kompozisyonu" },
  ],
  "/hesaplama/kalori": [
    { title: "Makro hedefini oluştur", description: "Enerji hedefini protein, yağ ve karbonhidrata dönüştür.", href: "/hesaplama/makro" },
    { title: "Beslenme planına geç", description: "Hedefi uygulanabilir öğün planına dönüştür.", href: "/hesaplama/diyet-plani" },
  ],
  "/hesaplama/makro": [
    { title: "Diyet planını oluştur", description: "Makro hedeflerini porsiyonlanmış öğünlere çevir.", href: "/hesaplama/diyet-plani" },
    { title: "Sonucu hesabına ekle", description: "Beslenme ve gelişim takibini tek yerde sürdür.", href: "/hesap" },
  ],
  "/hesaplama/1rm": [
    { title: "Antrenman hacmini planla", description: "Çalışma yükünü set ve tekrarlarla birlikte değerlendir.", href: "/hesaplama/antrenman-hacmi" },
    { title: "Programını oluştur", description: "Kuvvet seviyene uygun haftalık yapı kur.", href: "/programlar/olusturucu" },
  ],
  "/hesaplama/nabiz": [
    { title: "Kardiyo harcamasını hesapla", description: "Süre ve aktiviteye göre enerji tahmini oluştur.", href: "/hesaplama/kardiyo-kalori" },
    { title: "Antrenman programına geç", description: "Nabız bölgelerini haftalık plana yerleştir.", href: "/programlar/olusturucu" },
  ],
  "/hesaplama/bel-boy": [
    { title: "Bel-kalça oranını karşılaştır", description: "Yağ dağılımını ikinci bir çevre metriğiyle tamamla.", href: "/hesaplama/bel-kalca" },
    { title: "Vücut kompozisyonuna geç", description: "Çevre ölçümlerinden yağ oranı tahmini oluştur.", href: "/hesaplama/vucut-kompozisyonu" },
  ],
  "/hesaplama/bel-kalca": [
    { title: "Bel-boy oranını kontrol et", description: "Merkezi yağlanmayı boya göre karşılaştır.", href: "/hesaplama/bel-boy" },
    { title: "Gelişimini kaydet", description: "Çevre ölçümlerini zaman içinde takip et.", href: "/hesap" },
  ],
  "/hesaplama/su": [
    { title: "Günlük takibe ekle", description: "Su hedefini beslenme günlüğünde takip et.", href: "/hesap" },
    { title: "Enerji ihtiyacını belirle", description: "Hidrasyon hedefini günlük enerji planıyla tamamla.", href: "/hesaplama/kalori" },
  ],
  "/hesaplama/ideal-kilo": [
    { title: "Vücut kompozisyonunu ölç", description: "Tek ağırlık hedefini yağ ve yağsız kütleyle anlamlandır.", href: "/hesaplama/vucut-kompozisyonu" },
    { title: "Enerji rotasını oluştur", description: "Hedef ağırlığa uygun enerji başlangıcını belirle.", href: "/hesaplama/kalori" },
  ],
  "/hesaplama/kardiyo-kalori": [
    { title: "Nabız bölgelerini belirle", description: "Kardiyo yoğunluğunu kişisel nabız aralıklarıyla yönet.", href: "/hesaplama/nabiz" },
    { title: "Haftalık program oluştur", description: "Kardiyoyu kuvvet ve toparlanmayla dengele.", href: "/programlar/olusturucu" },
  ],
  "/hesaplama/antrenman-hacmi": [
    { title: "1RM değerini kontrol et", description: "Çalışma ağırlıklarını kuvvet kapasitesiyle karşılaştır.", href: "/hesaplama/1rm" },
    { title: "Programını kaydet", description: "Hacim hedefini haftalık plana dönüştür.", href: "/programlar/olusturucu" },
  ],
  "/hesaplama/plaka": [
    { title: "1RM yüzdelerini belirle", description: "Yüklenecek ağırlığı antrenman amacına göre seç.", href: "/hesaplama/1rm" },
    { title: "Hacmi hesapla", description: "Set, tekrar ve ağırlığın toplam yükünü gör.", href: "/hesaplama/antrenman-hacmi" },
  ],
  "/hesaplama/vucut-kompozisyonu": [
    { title: "Enerji ihtiyacını belirle", description: "Kompozisyon hedefini günlük enerji planına bağla.", href: "/hesaplama/kalori" },
    { title: "Gelişimi hesabında izle", description: "Aynı ölçümü düzenli kaydederek eğilimi görün.", href: "/hesap" },
  ],
};

export default function MeasurementAnalysisRoute() {
  const pathname = usePathname();
  const analysisType = ANALYSIS_BY_PATH[pathname];
  const actions = NEXT_ACTIONS[pathname] || [];
  if (!analysisType) return null;

  return (
    <>
      <MeasurementAnalysis analysisType={analysisType} />
      {actions.length > 0 && (
        <section className="mt-6 rounded-[2rem] border border-zinc-200 bg-white p-6 dark:border-white/[0.07] dark:bg-surface sm:p-8">
          <div className="mb-5"><p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">Analiz zinciri</p><h2 className="mt-2 text-xl font-black">Bu sonuçtan sonra ne yapmalısınız?</h2></div>
          <div className="grid gap-3 md:grid-cols-2">
            {actions.map((action, index) => (
              <Link key={action.href} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-zinc-200 p-5 transition-colors hover:border-primary/30 hover:bg-primary/[0.03] dark:border-white/[0.07]">
                <span className="font-mono text-[10px] font-bold text-zinc-400">0{index + 1}</span>
                <div className="min-w-0 flex-1"><h3 className="text-sm font-black">{action.title}</h3><p className="mt-1 text-xs font-medium text-zinc-500">{action.description}</p></div>
                <ArrowRight size={16} className="shrink-0 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

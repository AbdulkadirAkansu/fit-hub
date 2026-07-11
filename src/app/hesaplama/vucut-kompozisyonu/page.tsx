"use client";

import CalculatorLayout from "@/components/common/CalculatorLayout";
import GenderToggle from "@/components/ui/GenderToggle";
import RangeSlider from "@/components/ui/RangeSlider";
import ScientificBasis from "@/components/common/ScientificBasis";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import SaveResultButton from "@/components/common/SaveResultButton";
import { useBodyCompositionCalculator } from "@/hooks/useBodyCompositionCalculator";
import { usePDF } from "@/hooks/usePDF";
import { AlertTriangle, Download, ScanLine } from "lucide-react";

export default function BodyCompositionPage() {
  const model = useBodyCompositionCalculator();
  const { downloadPDF, isGenerating } = usePDF();
  const { result } = model;

  return (
    <CalculatorLayout title="Vücut Kompozisyonu" description="Çevre ölçümlerinden yağ oranı, yağ kütlesi ve yağsız kütle için tekrarlanabilir saha tahmini.">
      {result && <ProfessionalPDFTemplate id="body-composition-pdf" analysisType="bodyComposition" title="Vücut Kompozisyonu Raporu" results={[
        { label: "TAHMİNİ YAĞ ORANI", value: `%${result.bodyFatPercent}`, subValue: "Çevre ölçümü modeli" },
        { label: "YAĞ KÜTLESİ", value: `${result.fatMassKg} KG` },
        { label: "YAĞSIZ KÜTLE", value: `${result.leanMassKg} KG` },
        { label: "VÜCUT AĞIRLIĞI", value: `${model.weight} KG` },
      ]} recommendations={["Ölçümleri her seferinde aynı anatomik noktadan ve benzer koşullarda alın.", "Tek ölçüm yerine 3-4 haftalık eğilimi değerlendirin.", "Sonucu klinik tanı veya kesin yağ oranı olarak kullanmayın."]} scientificNote="US Navy çevre denklemi bir saha tahminidir; bireysel hata payı ve ölçüm tekniği sonucu etkiler." />}

      <div className="grid lg:grid-cols-12 gap-10 mt-12">
        <section className="lg:col-span-7 bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-10">
          <GenderToggle value={model.gender} onChange={model.setGender} />
          <RangeSlider label="VÜCUT AĞIRLIĞI" value={model.weight} unit="KG" min={35} max={200} onChange={model.setWeight} />
          <RangeSlider label="BOY" value={model.height} unit="CM" min={130} max={220} onChange={model.setHeight} />
          <RangeSlider label="BEL ÇEVRESİ" value={model.waist} unit="CM" min={45} max={180} onChange={model.setWaist} />
          <RangeSlider label="BOYUN ÇEVRESİ" value={model.neck} unit="CM" min={20} max={65} onChange={model.setNeck} />
          {model.gender === "kadin" && <RangeSlider label="KALÇA ÇEVRESİ" value={model.hip} unit="CM" min={55} max={190} onChange={model.setHip} />}
        </section>

        <section className="lg:col-span-5 bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col min-h-[520px]">
          <div className="flex items-center gap-3 text-primary"><ScanLine /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Canlı Tahmin</span></div>
          <div className="flex-1 flex flex-col justify-center text-center">
            {result ? <><p className="text-8xl font-black tracking-tighter">%{result.bodyFatPercent}</p><p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">Tahmini vücut yağ oranı</p><div className="grid grid-cols-2 gap-3 mt-10"><div className="rounded-2xl bg-zinc-950/[0.03] dark:bg-white/5 p-5"><strong className="text-2xl">{result.fatMassKg} kg</strong><span className="block text-[9px] text-zinc-500 mt-1">YAĞ KÜTLESİ</span></div><div className="rounded-2xl bg-zinc-950/[0.03] dark:bg-white/5 p-5"><strong className="text-2xl">{result.leanMassKg} kg</strong><span className="block text-[9px] text-zinc-500 mt-1">YAĞSIZ KÜTLE</span></div></div></> : <div className="text-amber-500"><AlertTriangle className="mx-auto mb-3" /><p className="font-bold">Ölçümleri kontrol edin.</p></div>}
          </div>
          {result && <div className="space-y-3"><button disabled={isGenerating} onClick={() => downloadPDF("body-composition-pdf", "fithub-vucut-kompozisyonu")} className="w-full rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-4 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"><Download className="inline mr-2" size={15} />{isGenerating ? "Hazırlanıyor" : "PDF Raporu"}</button><SaveResultButton type="vucut-kompozisyonu" result={result} inputs={{ gender: model.gender, weight: model.weight, height: model.height, waist: model.waist, neck: model.neck, hip: model.hip }} /></div>}
        </section>
      </div>
      <div className="mt-16"><ScientificBasis referenceKey="bodyComposition" /></div>
    </CalculatorLayout>
  );
}

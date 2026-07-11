"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Droplets, GlassWater, Zap } from "lucide-react";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWaterCalculator } from "@/hooks/useWaterCalculator";
import RangeSlider from "@/components/ui/RangeSlider";

export default function SuIhtiyaciPage() {
  const { weight, setWeight, activity, setActivity, result, glasses } = useWaterCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Hidrasyon Laboratuvarı"
      description="Vücut ağırlığınız ve aktivite seviyenize göre optimize edilmiş günlük su ihtiyacınızı hesaplayın."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="water-pdf-template"
          analysisType="water"
          title="Günlük Hidrasyon Analiz Raporu"
          results={[
            { label: "GÜNLÜK SU İHTİYACI", value: `${result} LİTRE`, subValue: "Minimum Hedef" },
            { label: "BARDAK SAYISI", value: `${glasses} BARDAK`, subValue: "200ml Standart Bardak" },
            { label: "VÜCUT AĞIRLIĞI", value: `${weight} KG`, subValue: "Hesaplama Parametresi" },
            { label: "EGZERSİZ SÜRESİ", value: `${activity} DK`, subValue: "Günlük Ortalama" }
          ]}
          recommendations={[
            "Günlük su tüketiminizi gün içine dengeli bir şekilde yayın.",
            "Egzersiz sırasında kaybettiğiniz sıvıyı telafi etmek için ekstra su tüketin.",
            "Çay ve kahve gibi diüretik içecekler su ihtiyacınızı artırabilir.",
            "İdrar renginizin açık sarı olması, yeterli hidrasyonun en iyi göstergesidir."
          ]}
          scientificNote="Bu hesaplama, vücut ağırlığı ve fiziksel aktiviteye dayalı genel hidrasyon gereksinimlerini yansıtır."
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-12">
        
        {/* INTERACTIVE CONTROLS */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-12"
        >
          <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
             {/* Subtle Glow */}
             <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[100%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Droplets size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Ölçüm Parametreleri</h3>
             </div>

             <div className="space-y-16">
                <RangeSlider label="KİLONUZ" value={weight} unit="KG" min={30} max={200} onChange={setWeight} />
                <RangeSlider label="GÜNLÜK EGZERSİZ SÜRESİ" value={activity} unit="DAKİKA" min={0} max={180} step={15} onChange={setActivity} />
             </div>

             <div className="mt-16 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Antrenman yoğunluğu ve ortam sıcaklığı su ihtiyacınızı burada hesaplanandan daha fazla artırabilir.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="water-result" 
          className="lg:col-span-5 bg-white dark:bg-surface rounded-[2.5rem] p-10 md:p-14 text-zinc-950 dark:text-white relative overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col items-center text-center h-full justify-between min-h-[500px]">
              
              <div className="flex items-center gap-2 mb-10 bg-zinc-950/5 dark:bg-white/10 px-4 py-2 rounded-full border border-zinc-950/10 dark:border-white/10 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-950 dark:text-white">Canlı Veri Analizi</span>
              </div>
              
              {result && (
                <div className="flex-grow flex flex-col items-center justify-center w-full">
                  <div className="flex items-center justify-center mb-6">
                     <Droplets className="text-primary animate-pulse mr-4" size={48} />
                     <motion.span 
                       key={result}
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="text-[80px] md:text-[100px] font-black leading-[0.8] tracking-tighter text-zinc-950 dark:text-white"
                     >
                       {result}<span className="text-3xl ml-2 font-black text-zinc-950 dark:text-white">L</span>
                     </motion.span>
                  </div>
                  
                  <span className="text-xl font-black tracking-widest text-primary uppercase">
                    GÜNLÜK HEDEF
                  </span>

                  {/* Visual Aid */}
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2.5rem] w-full mt-10 mb-8 text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {Array.from({ length: Math.min(glasses, 15) }).map((_, i) => (
                        <GlassWater key={i} size={20} className="text-primary" />
                      ))}
                      {glasses > 15 && <span className="text-primary font-black ml-2">...</span>}
                    </div>
                    <p className="text-xs font-medium text-zinc-400">
                      Yaklaşık <span className="text-zinc-950 dark:text-white font-black">{glasses} standart bardak</span> su içmelisiniz.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("water-pdf-template", "fithub-su-ihtiyaci-analizi")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="su-ihtiyaci"
                      result={{ waterLiters: result, glasses }}
                      inputs={{ weight, activity }}
                   />
                 )}
                 <Link href="/hesaplama" className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors group">
                    <Zap size={14} className="group-hover:text-primary transition-colors" /> DİĞER MODÜLLER
                 </Link>
              </div>
           </div>
        </motion.div>

      </div>

      <div className="mt-16">
        <ScientificBasis referenceKey="waterIntake" />
      </div>
    </CalculatorLayout>
  );
}

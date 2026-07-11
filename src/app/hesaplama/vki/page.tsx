"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import { useVkiCalculator } from "@/hooks/useVkiCalculator";
import RangeSlider from "@/components/ui/RangeSlider";

export default function VKIPage() {
  const { weight, setWeight, height, setHeight, result } = useVkiCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="VKİ Analizi"
      description="Vücut kitle endeksinizi (BMI) anlık olarak ölçün, fizyolojik risk faktörlerinizi klinik düzeyde analiz edin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="bmi-pdf-template"
          analysisType="vki"
          title="Vücut Kitle Endeksi Analizi"
          results={[
            { label: "VKİ SKORUNUZ", value: result.vki.toString(), subValue: result.status },
            { label: "GÜNCEL KİLO", value: `${weight} KG` },
            { label: "BOY UZUNLUĞU", value: `${height} CM` },
            { label: "DURUM ANALİZİ", value: result.status }
          ]}
          recommendations={[
            "Düzenli fiziksel aktiviteyi yaşam tarzınızın bir parçası haline getirin.",
            "Beslenme programınızda işlenmiş gıdalardan uzak durmaya özen gösterin.",
            "Günlük su tüketiminizi kilonuza uygun seviyede tutun.",
            "Sonuçların daha detaylı analizi için bir beslenme uzmanına danışabilirsiniz."
          ]}
          scientificNote="Vücut Kitle Endeksi (VKİ), yetişkinlerde boy ve kilo değerlerini kullanarak vücut yağ oranını tahmin eden uluslararası bir standarttır."
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
                  <Activity size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Ölçüm Parametreleri</h3>
             </div>

             <div className="space-y-16">
                <RangeSlider label="BOYUNUZ" value={height} unit="CM" min={120} max={230} onChange={setHeight} />
                <RangeSlider label="KİLONUZ" value={weight} unit="KG" min={30} max={200} onChange={setWeight} />
             </div>

             <div className="mt-16 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Parametreleri kaydırarak VKİ skorunuzun anlık değişimini ve risk faktörü bölgesini gözlemleyebilirsiniz.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="bmi-result" 
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
                  <motion.span 
                    key={result.vki}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter mb-6 text-zinc-950 dark:text-white"
                  >
                    {result.vki}
                  </motion.span>
                  
                  <motion.span 
                    key={result.status}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn("text-2xl font-black tracking-[0.2em] uppercase px-6 py-2 rounded-xl bg-zinc-950/5 dark:bg-white/5 border border-zinc-950/10 dark:border-white/10", result.color)}
                  >
                    {result.status}
                  </motion.span>

                  {/* Dynamic Scale */}
                  <div className="w-full mt-16 mb-12">
                     <div className="w-full h-2 bg-zinc-950/10 dark:bg-white/10 rounded-full relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.percent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-primary to-rose-500 rounded-full"
                        />
                     </div>
                     <div className="flex justify-between mt-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2">
                        <span>Zayıf</span>
                        <span>İdeal</span>
                        <span>Kilolu</span>
                        <span>Obez</span>
                     </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("bmi-pdf-template", "fithub-vki-analiz-raporu")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="vki"
                      result={{ vki: result.vki, status: result.status }}
                      inputs={{ weight, height }}
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
         <ScientificBasis referenceKey="vki" />
      </div>
    </CalculatorLayout>
  );
}

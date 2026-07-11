"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWaistHeightCalculator } from "@/hooks/useWaistHeightCalculator";
import RangeSlider from "@/components/ui/RangeSlider";

export default function BelBoyPage() {
  const { waist, setWaist, height, setHeight, result } = useWaistHeightCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Bel-Boy Endeksi"
      description="Bel çevrenizin boyunuza oranını hesaplayarak abdominal yağlanma ve sağlık risklerinizi ölçün."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="whtr-pdf-template"
          analysisType="waistHeight"
          title="Bel-Boy Oranı Analiz Raporu"
          results={[
            { label: "BEL-BOY ORANI", value: result.ratio.toString(), subValue: result.status },
            { label: "BEL ÇEVRESİ", value: `${waist} CM` },
            { label: "BOY UZUNLUĞU", value: `${height} CM` },
            { label: "DURUM ANALİZİ", value: result.status }
          ]}
          recommendations={[
            "Bel-boy oranı, VKİ'den daha hassas bir sağlık göstergesi olarak kabul edilir.",
            "İdeal bir sağlık için bel çevreniz boyunuzun yarısından az olmalıdır.",
            "Eğer 'Kilolu' veya 'Obez' kategorisindeyseniz, bel çevresini azaltmaya yönelik bir program izleyin.",
            "Düzenli yürüyüşler ve dengeli beslenme bu oranı düşürmede en etkili yollardır."
          ]}
          scientificNote="Bilimsel araştırmalar, 0.50 ve üzeri bel-boy oranının kalp damar hastalıkları riskini artırdığını göstermektedir."
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
             
             <div className="space-y-12">
               <RangeSlider label="BOYUNUZ" value={height} unit="CM" min={130} max={230} onChange={setHeight} />
               <RangeSlider label="BEL ÇEVRESİ" value={waist} unit="CM" min={40} max={180} onChange={setWaist} />
             </div>

             <div className="mt-12 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Bel-boy oranı, vücut kütle endeksinden (VKİ) bağımsız olarak en sağlıklı yağlanma göstergesidir.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="whtr-result" 
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
                  <div className="mb-4">
                    <Activity className={cn("mx-auto mb-4", result.color)} size={48} />
                    <motion.span 
                      key={result.ratio}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[100px] md:text-[120px] font-black leading-none tracking-tighter text-zinc-950 dark:text-white"
                    >
                      {result.ratio}
                    </motion.span>
                  </div>
                  <span className={cn("text-2xl font-black tracking-widest mb-4 uppercase", result.color)}>
                    {result.status}
                  </span>
                  <p className="text-zinc-500 text-sm font-bold mb-12 uppercase tracking-wide">{result.desc}</p>

                  {/* Intensity Visualizer */}
                  <div className="w-full h-1.5 bg-zinc-950/10 dark:bg-white/10 rounded-full mb-12 relative mt-4">
                     <motion.div 
                       className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-zinc-950 shadow-xl transition-all duration-500"
                       style={{ left: `${Math.min(Math.max((result.ratio - 0.3) * 200, 0), 100)}%` }}
                     />
                     <div className="flex justify-between mt-4 text-[8px] font-black text-zinc-500 uppercase tracking-widest px-2">
                        <span>Zayıf</span>
                        <span>Normal</span>
                        <span>Obez</span>
                     </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("whtr-pdf-template", "fithub-bel-boy-analizi")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="bel-boy"
                      result={result}
                      inputs={{ waist, height }}
                   />
                 )}
                 <Link href="/hesaplama" className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors group">
                    <Zap size={14} className="group-hover:text-primary transition-colors" /> DİĞER MODÜLLER
                 </Link>
              </div>
           </div>
        </motion.div>

      </div>

      <div className="mt-24">
        <ScientificBasis referenceKey="waistToHeight" />
      </div>
    </CalculatorLayout>
  );
}

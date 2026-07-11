"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Scale, Target, Zap } from "lucide-react";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useIdealWeightCalculator } from "@/hooks/useIdealWeightCalculator";
import RangeSlider from "@/components/ui/RangeSlider";
import GenderToggle from "@/components/ui/GenderToggle";

export default function IdealKiloPage() {
  const { height, setHeight, gender, setGender, result, range } = useIdealWeightCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="İdeal Fizik Analizi"
      description="Boyunuz ve genetik faktörlerinize göre bilimsel Devine formülü ile ideal ağırlığınızı belirleyin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="ideal-weight-pdf-template"
          analysisType="idealWeight"
          title="İdeal Kilo ve Fiziksel Hedef Raporu"
          results={[
            { label: "İDEAL KİLO HEDEFİ", value: `${result} KG`, subValue: "Devine Formülü" },
            { label: "SAĞLIKLI ARALIK", value: `${(result - 4).toFixed(1)} - ${(result + 4).toFixed(1)} KG`, subValue: "+/- 4 KG Tolerans" },
            { label: "BOY UZUNLUĞU", value: `${height} CM`, subValue: "Hesaplama Parametresi" },
            { label: "CİNSİYET", value: gender.toUpperCase(), subValue: "Genetik Faktör" }
          ]}
          recommendations={[
            "İdeal kilo, genel bir referans noktasıdır; asıl önemli olan vücut yağ oranınızdır.",
            "Düzenli direnç antrenmanları ile kas kütlenizi koruyarak ideal kilonuza odaklanın.",
            "Sağlıklı aralık içinde kalmak, kronik hastalık risklerini minimize eder.",
            "Beslenme ve egzersiz düzeninizi bu hedef doğrultusunda optimize edebilirsiniz."
          ]}
          scientificNote="Bu rapor, tıp dünyasında yaygın olarak kullanılan Devine denklemi baz alınarak hazırlanmıştır."
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
               <GenderToggle value={gender} onChange={setGender} />
               <RangeSlider label="BOYUNUZ" value={height} unit="CM" min={120} max={230} onChange={setHeight} />
             </div>

             <div className="mt-12 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  İdeal kilo, kemik yoğunluğu ve kas kütlesi gibi bireysel farklılıklara göre değişiklik gösterebilir.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="ideal-weight-result" 
          className="lg:col-span-5 bg-white dark:bg-surface rounded-[2.5rem] p-10 md:p-14 text-zinc-950 dark:text-white relative overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col items-center text-center h-full justify-between min-h-[500px]">
              <div className="flex items-center gap-2 mb-10 bg-zinc-950/5 dark:bg-white/10 px-4 py-2 rounded-full border border-zinc-950/10 dark:border-white/10 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-950 dark:text-white">Canlı Veri Analizi</span>
              </div>
              
              {result !== null && (
                <div className="flex-grow flex flex-col items-center justify-center w-full">
                  <div className="mb-12 flex flex-col items-center text-center">
                    <Scale className="text-primary mb-4" size={48} />
                    <motion.span 
                      key={result}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[90px] font-black leading-none tracking-tighter text-zinc-950 dark:text-white"
                    >
                      {result}<span className="text-3xl ml-2">KG</span>
                    </motion.span>
                    <span className="text-xl font-black tracking-widest text-primary mt-4">
                      İDEAL KİLO HEDEFİ
                    </span>
                  </div>

                  {/* Recommendation Box */}
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2rem] w-full mb-12 text-left">
                    <div className="flex items-center gap-4 mb-3">
                       <Target className="text-primary" size={18} />
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">SAĞLIKLI ARALIK ÖNERİSİ</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-950 dark:text-white leading-relaxed">
                       Bilimsel verilere göre sizin için sağlıklı kilo aralığı <span className="text-primary">{(result - 4).toFixed(1)} - {(result + 4).toFixed(1)} kg</span> olarak öngörülmektedir.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("ideal-weight-pdf-template", "fithub-ideal-kilo-analizi")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result !== null && (
                   <SaveResultButton 
                      type="ideal-kilo"
                      result={{ idealWeight: result, range }}
                      inputs={{ height, gender }}
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
        <ScientificBasis referenceKey="idealWeight" />
      </div>
    </CalculatorLayout>
  );
}

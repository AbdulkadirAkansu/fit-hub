"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Trophy, Zap } from "lucide-react";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useOneRepMaxCalculator } from "@/hooks/useOneRepMaxCalculator";
import RangeSlider from "@/components/ui/RangeSlider";

export default function OneRMPage() {
  const { weight, setWeight, reps, setReps, result, percentages } = useOneRepMaxCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="1RM Analiz Laboratuvarı"
      description="Kaldırdığınız ağırlık ve tekrar sayısına göre teorik maksimum gücünüzü bilimsel verilerle keşfedin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="1rm-pdf-template"
          analysisType="oneRm"
          title="Maksimum Güç (1RM) Analiz Raporu"
          results={[
            { label: "TAHMİNİ 1RM", value: `${result} KG`, subValue: "Tek Tekrar Maksimum" },
            { label: "GÜÇ ANTRENMANI (85%)", value: `${Math.round(result * 0.85)} KG`, subValue: "1-5 Tekrar Aralığı" },
            { label: "HİPERTROFİ (75%)", value: `${Math.round(result * 0.75)} KG`, subValue: "8-12 Tekrar Aralığı" },
            { label: "DAYANIKLILIK (65%)", value: `${Math.round(result * 0.65)} KG`, subValue: "15+ Tekrar Aralığı" }
          ]}
          recommendations={[
            "1RM değeriniz, antrenman programınızdaki ağırlıkları belirlemek için temel taşıdır.",
            "Güç kazanımı için 1RM'nizin %85 ve üzeri ağırlıklarıyla çalışın.",
            "Kas gelişimi (hipertrofi) için %70-80 aralığında setler planlayın.",
            "Her 4-6 haftada bir 1RM değerinizi güncelleyerek ilerlemenizi takip edin."
          ]}
          scientificNote="Bu hesaplama Brzycki formülü kullanılarak yapılmıştır. 1-12 tekrar arası verilerde en yüksek doğruluğu sağlar."
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
                  <Trophy size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Güç Parametreleri</h3>
             </div>

             <div className="space-y-16">
                <RangeSlider label="KALDIRILAN AĞIRLIK" value={weight} unit="KG" min={1} max={300} onChange={setWeight} />
                <RangeSlider label="TEKRAR SAYISI" value={reps} unit="TEKRAR" min={1} max={12} onChange={setReps} />
             </div>

             <div className="mt-16 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  1RM (One-Rep Max) hesabı 1-12 tekrar arası setlerde en yüksek doğruluğu verir.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="1rm-result" 
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
                  <div className="flex flex-col items-center mb-8">
                     <motion.span 
                       key={result}
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="text-[80px] md:text-[100px] font-black leading-[0.8] tracking-tighter text-zinc-950 dark:text-white"
                     >
                       {result}<span className="text-3xl ml-2 font-black text-zinc-950 dark:text-white">KG</span>
                     </motion.span>
                     <span className="text-xl font-black tracking-widest mt-4 text-primary">
                       TAHMİNİ 1RM
                     </span>
                  </div>

                  {/* Intensity Grid */}
                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    {percentages.map((p, idx) => (
                      <div key={idx} className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-5 rounded-2xl text-center group hover:border-primary transition-colors">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{p.label}</p>
                        <p className="text-2xl font-black text-zinc-950 dark:text-white">{p.value} kg</p>
                        <p className="text-[8px] font-bold text-primary uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("1rm-pdf-template", "fithub-1rm-analiz-raporu")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="1rm"
                      result={{ oneRM: result, percentages }}
                      inputs={{ weight, reps }}
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
        <ScientificBasis referenceKey="oneRM" />
      </div>
    </CalculatorLayout>
  );
}

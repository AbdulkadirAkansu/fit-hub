"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHeartRateCalculator } from "@/hooks/useHeartRateCalculator";

export default function NabizPage() {
  const { age, setAge, restHR, setRestHR, result } = useHeartRateCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Nabız Analiz Laboratuvarı"
      description="Kardiyovasküler verilerinizi kullanarak antrenman hedeflerinize uygun bilimsel nabız aralıklarınızı belirleyin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="heart-rate-pdf-template"
          analysisType="heartRate"
          title="Hedef Nabız Bölgeleri Raporu"
          results={result.map(z => ({
            label: z.zone.toUpperCase(),
            value: z.range,
            subValue: z.desc
          }))}
          recommendations={[
            "Yağ yakımı hedefliyorsanız antrenman sürenizin çoğunu Bölge 2'de geçirin.",
            "Kondisyon artışı için Bölge 3 ve Bölge 4 çalışmalarını programınıza ekleyin.",
            "Bölge 5 nabız değerleri çok yüksek yoğunlukludur, sadece kısa sürelerle uygulanmalıdır.",
            "Antrenman sırasında nabız bandı kullanmak, hesaplanan bölgelerde kalmanızı kolaylaştırır."
          ]}
          scientificNote="Bu rapor, Tanaka denklemi ve Karvonen (Nabız Rezervi) yöntemi kullanılarak kişiselleştirilmiştir."
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
                  <Heart size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Nabız Parametreleri</h3>
             </div>

             <div className="space-y-16">
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">YAŞINIZ</label>
                     <div className="flex items-baseline gap-1">
                       <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{age}</span>
                       <span className="text-sm font-bold text-zinc-400">YIL</span>
                     </div>
                  </div>
                  <div className="relative pt-4">
                     <input 
                       type="range" 
                       min="10" 
                       max="90" 
                       value={age}
                       onChange={(e) => setAge(parseInt(e.target.value))}
                       style={{ "--range-progress": `${((age - 10) / 80) * 100}%` } as React.CSSProperties} className="w-full"
                     />
                  </div>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">DİNLENİK NABIZ</label>
                     <div className="flex items-baseline gap-1">
                       <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{restHR}</span>
                       <span className="text-sm font-bold text-zinc-400">BPM</span>
                     </div>
                  </div>
                  <div className="relative pt-4">
                     <input 
                       type="range" 
                       min="30" 
                       max="120" 
                       value={restHR}
                       onChange={(e) => setRestHR(parseInt(e.target.value))}
                       style={{ "--range-progress": `${((restHR - 30) / 90) * 100}%` } as React.CSSProperties} className="w-full"
                     />
                  </div>
                </div>
             </div>

             <div className="mt-16 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Karvonen formülü ile dinlenik nabzınızın hesaba katılması, nabız bölgelerinizin doğruluk oranını ciddi ölçüde artırır.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="heart-rate-result" 
          className="lg:col-span-5 bg-white dark:bg-surface rounded-[2.5rem] p-10 md:p-14 text-zinc-950 dark:text-white relative overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col items-center text-center h-full justify-between min-h-[500px] w-full">
              
              <div className="flex items-center gap-2 mb-8 bg-zinc-950/5 dark:bg-white/10 px-4 py-2 rounded-full border border-zinc-950/10 dark:border-white/10 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-950 dark:text-white">Canlı Veri Analizi</span>
              </div>
              
              {result && (
                <div className="flex-grow flex flex-col items-center justify-center w-full">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 block text-center">BÖLGESEL NABIZ ARALIKLARI</span>
                  
                  {/* Zones List */}
                  <div className="space-y-3 w-full mb-8">
                    {result.map((z, idx) => {
                      const Icon = z.icon;
                      return (
                        <div key={idx} className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-4 rounded-2xl flex justify-between items-center group hover:border-primary transition-all text-left">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl bg-zinc-950/5 dark:bg-white/5 flex items-center justify-center border border-zinc-950/10 dark:border-white/10", z.color)}>
                              <Icon size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-zinc-950 dark:text-white">{z.zone}</p>
                              <p className="text-[9px] font-bold text-zinc-400 leading-none mt-1">{z.desc}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn("text-sm font-black", z.color)}>{z.range}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("heart-rate-pdf-template", "fithub-hedef-nabiz-analizi")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="nabiz"
                      result={result}
                      inputs={{ age, restHR }}
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
        <ScientificBasis referenceKey="heartRate" />
      </div>
    </CalculatorLayout>
  );
}

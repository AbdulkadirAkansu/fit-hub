"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Flame, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCardioCalculator } from "@/hooks/useCardioCalculator";
import RangeSlider from "@/components/ui/RangeSlider";

export default function KardiyoKaloriPage() {
  const { weight, setWeight, duration, setDuration, selectedActivity, setSelectedActivity, activities, result } = useCardioCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Kardiyo Verimlilik Analizi"
      description="Farklı fiziksel aktivitelerin vücut ağırlığınıza ve sürenize göre tahmini enerji maliyetini hesaplayın."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="cardio-pdf-template"
          analysisType="cardio"
          title="Kardiyo ve Aktivite Raporu"
          results={[
            { label: "YAKILAN KALORİ", value: `${result} KCAL`, subValue: "Tahmini Enerji" },
            { label: "AKTİVİTE", value: selectedActivity.label, subValue: selectedActivity.desc },
            { label: "SÜRE", value: `${duration} DAKİKA` },
            { label: "VÜCUT AĞIRLIĞI", value: `${weight} KG` }
          ]}
          recommendations={[
            "Yağ yakımı için antrenman yoğunluğunu (MET) zamanla artırmaya odaklanın.",
            "Kalori yakımı sadece antrenman süresine değil, yoğunluğa da bağlıdır.",
            "Kardiyo çalışmalarını direnç antrenmanları ile birleştirmek metabolik hızı artırır.",
            "Düzenli kardiyo, kalp sağlığı ve dayanıklılık için hayati önem taşır."
          ]}
          scientificNote="Bu hesaplama, aktivitelerin metabolik eşdeğeri olan MET (Metabolic Equivalent of Task) değerleri baz alınarak yapılmıştır."
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
             
             <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Activity size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Aktivite Parametreleri</h3>
             </div>

             <div className="space-y-12">
                {/* Activity Grid */}
                <div className="space-y-6 relative z-10">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">AKTİVİTE TÜRÜ</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {activities.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => setSelectedActivity(act)}
                        className={cn(
                          "p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all text-center",
                          selectedActivity.id === act.id 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400 hover:border-primary/30"
                        )}
                      >
                        <Activity size={16} />
                        <span className="text-[8px] font-black leading-tight uppercase">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <RangeSlider label="KİLONUZ" value={weight} unit="KG" min={40} max={180} onChange={setWeight} />
                <RangeSlider label="SÜRE" value={duration} unit="DAKİKA" min={5} max={180} step={5} onChange={setDuration} />
             </div>

             <div className="mt-16 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  MET değerleri, bir aktivitenin dinlenme halindeki enerji harcamasına oranını ifade eder.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="cardio-result" 
          className="lg:col-span-5 bg-white dark:bg-surface rounded-[2.5rem] p-10 md:p-14 text-zinc-950 dark:text-white relative overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col items-center text-center h-full justify-between min-h-[500px] w-full">
              
              <div className="flex items-center gap-2 mb-10 bg-zinc-950/5 dark:bg-white/10 px-4 py-2 rounded-full border border-zinc-950/10 dark:border-white/10 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-950 dark:text-white">Canlı Veri Analizi</span>
              </div>
              
              {result && (
                <div className="flex-grow flex flex-col items-center justify-center w-full">
                  <div className="mb-8">
                    <Flame className="text-primary mx-auto mb-4 animate-pulse" size={48} />
                    <motion.span 
                      key={result}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[80px] md:text-[100px] font-black leading-[0.8] tracking-tighter text-zinc-950 dark:text-white block animate-in fade-in zoom-in-50 duration-500"
                    >
                      {result}
                    </motion.span>
                    <span className="text-xl font-black tracking-widest text-primary mt-4 uppercase">
                      TOPLAM KALORİ (KCAL)
                    </span>
                  </div>

                  {/* Context Info */}
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2.5rem] w-full mb-6">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">Aktivite Özeti</p>
                    <p className="text-base font-bold text-zinc-950 dark:text-white leading-relaxed">
                       <span className="text-primary uppercase">{selectedActivity.label}</span> ile {duration} dakikada yaklaşık <span className="text-primary">{result} kcal</span> yakacaksınız.
                    </p>
                    <p className="text-[10px] font-medium text-zinc-400 mt-3">{selectedActivity.desc}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("cardio-pdf-template", "fithub-kardiyo-analizi")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="kardiyo"
                      result={{ calories: result, activity: selectedActivity.label, duration }}
                      inputs={{ weight, duration, activity: selectedActivity.id }}
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
        <ScientificBasis referenceKey="cardioMET" />
      </div>
    </CalculatorLayout>
  );
}

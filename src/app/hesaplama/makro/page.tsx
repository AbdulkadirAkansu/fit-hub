"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Utensils, Zap, Target, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMacroCalculator } from "@/hooks/useMacroCalculator";

export default function MakroPage() {
  const { goal, setGoal, proteinRatio, setProteinRatio, tdee, setTdee, weight, setWeight, result } = useMacroCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Makro Besin Analizi"
      description="Hedeflerinize göre almanız gereken protein, karbonhidrat ve yağ dengesini bilimsel olarak optimize edin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="macro-pdf-template"
          analysisType="macro"
          title="Makro Besin Dağılım Raporu"
          results={[
            { label: "HEDEF KALORİ", value: `${result.calories} KCAL`, subValue: goal.toUpperCase() },
            { label: "GÜNLÜK PROTEİN", value: `${result.protein} GRAM`, subValue: `${result.protein * 4} Kcal` },
            { label: "GÜNLÜK YAĞ", value: `${result.fat} GRAM`, subValue: `${result.fat * 9} Kcal` },
            { label: "GÜNLÜK KARBONHİDRAT", value: `${result.carbs} GRAM`, subValue: `${result.carbs * 4} Kcal` }
          ]}
          recommendations={[
            "Protein alımı kas onarımı ve tokluk hissi için hayati önem taşır.",
            "Sağlıklı yağlar hormon dengesi ve beyin fonksiyonları için gereklidir.",
            "Karbonhidratlar antrenman performansınız için temel enerji kaynağıdır.",
            "Besinleri tartarak takip etmek, hedeflerinize ulaşma hızınızı artıracaktır."
          ]}
          scientificNote="Makro besin hesaplamaları, seçtiğiniz hedefe ve protein tercihine göre dinamik olarak optimize edilmiştir."
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
             
             {/* Goal Selection */}
             <div className="space-y-6 mb-12">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">ANA HEDEFİNİZ</label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 {([
                   { id: "kilo-verme", label: "YAĞ YAKIMI", icon: Flame },
                   { id: "koruma", label: "DENGE", icon: Target },
                   { id: "kas-kazanma", label: "GÜÇ & HACİM", icon: Zap }
                 ] as const).map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setGoal(item.id)}
                     className={cn(
                       "p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2",
                       goal === item.id 
                         ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                         : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400 hover:border-primary/30"
                     )}
                   >
                     <item.icon size={20} />
                     <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-8 mb-12">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">VÜCUT AĞIRLIĞI</label>
                  <span className="text-3xl font-black text-primary">{weight} <span className="text-xs uppercase">kg</span></span>
               </div>
               <input type="range" min="35" max="200" step="1" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} style={{ "--range-progress": `${((weight - 35) / 165) * 100}%` } as React.CSSProperties} className="w-full" />
             </div>

             {/* TDEE Slider */}
             <div className="space-y-8 mb-12">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">GÜNLÜK KALORİ HEDEFİ (TDEE)</label>
                  <span className="text-3xl font-black text-primary">{tdee} <span className="text-xs uppercase">kcal</span></span>
               </div>
               <input 
                 type="range" 
                 min="1200" 
                 max="5000" 
                 step="50"
                 value={tdee}
                 onChange={(e) => setTdee(parseInt(e.target.value))}
                 style={{ "--range-progress": `${((tdee - 1200) / 3800) * 100}%` } as React.CSSProperties} className="w-full"
               />
             </div>

             {/* Protein Ratio */}
             <div className="space-y-6">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">PROTEİN TERCİHİ</label>
               <div className="flex gap-2">
                 {([
                   { id: "dusuk", label: "STANDART" },
                   { id: "orta", label: "DENGELİ" },
                   { id: "yuksek", label: "YÜKSEK PROTEİN" }
                 ] as const).map((r) => (
                   <button
                     key={r.id}
                     onClick={() => setProteinRatio(r.id)}
                     className={cn(
                       "flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2",
                       proteinRatio === r.id ? "bg-zinc-950 border-zinc-950 text-white shadow-xl shadow-zinc-950/20" : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400 hover:border-primary/30"
                     )}
                   >
                     {r.label}
                   </button>
                 ))}
               </div>
             </div>

             <div className="mt-12 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  TDEE değerinizi bilmiyorsanız, önce &quot;Kalori İhtiyacı&quot; aracını kullanmanızı öneririz.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="macro-result" 
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
                  <div className="mb-12 flex flex-col items-center text-center">
                    <Utensils className="text-primary mb-4" size={48} />
                    <motion.span 
                      key={result.calories}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[80px] font-black leading-none tracking-tighter text-zinc-950 dark:text-white"
                    >
                      {result.calories}<span className="text-2xl ml-2 uppercase">Kcal</span>
                    </motion.span>
                    <span className="text-xl font-black tracking-widest text-primary mt-4">
                      TOPLAM HEDEF
                    </span>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
                    <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2rem] text-center group hover:border-primary transition-colors">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">PROTEİN</p>
                      <p className="text-3xl font-black text-zinc-950 dark:text-white">{result.protein}g</p>
                      <p className="text-[8px] font-bold text-primary mt-1 uppercase">Kas Onarımı</p>
                    </div>
                    <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2rem] text-center group hover:border-primary transition-colors">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">YAĞ</p>
                      <p className="text-3xl font-black text-zinc-950 dark:text-white">{result.fat}g</p>
                      <p className="text-[8px] font-bold text-primary mt-1 uppercase">Hormon Sağlığı</p>
                    </div>
                    <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2rem] text-center group hover:border-primary transition-colors">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">KARBONHİDRAT</p>
                      <p className="text-3xl font-black text-zinc-950 dark:text-white">{result.carbs}g</p>
                      <p className="text-[8px] font-bold text-primary mt-1 uppercase">Enerji</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("macro-pdf-template", "fithub-makro-analiz-raporu")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="makro"
                      result={result}
                      inputs={{ goal, proteinRatio, tdee, weight }}
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
        <ScientificBasis referenceKey="macros" />
      </div>
    </CalculatorLayout>
  );
}

"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import ScientificBasis from "@/components/common/ScientificBasis";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCalorieCalculator } from "@/hooks/useCalorieCalculator";

export default function KaloriPage() {
  const { gender, setGender, age, setAge, height, setHeight, weight, setWeight, activity, setActivity, result } = useCalorieCalculator();
  const { downloadPDF } = usePDF();

  const activityOptions = [
    { value: "1.2", label: "SEDANTER", desc: "Masa başı iş, az egzersiz" },
    { value: "1.375", label: "HAFİF", desc: "Haftada 1-3 gün spor" },
    { value: "1.55", label: "ORTA", desc: "Haftada 3-5 gün spor" },
    { value: "1.725", label: "AĞIR", desc: "Haftada 6-7 gün spor" },
    { value: "1.9", label: "EKSTREM", desc: "Günde 2 kez spor" },
  ];

  return (
    <CalculatorLayout
      title="Enerji Metabolizması"
      description="Bazal metabolizma hızınızı ve günlük aktivitenize göre yakmanız gereken toplam kaloriyi bilimsel hassasiyetle hesaplayın."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="calorie-pdf-template"
          analysisType="calorie"
          title="Kalori ve Metabolizma Analizi"
          results={[
            { label: "GÜNLÜK TDEE", value: `${result.tdee} KCAL`, subValue: "Kilonuzu korumak için" },
            { label: "BAZAL METABOLİZMA (BMR)", value: `${result.bmr} KCAL`, subValue: "Minimum hayati enerji" },
            { label: "YAĞ YAKIMI HEDEFİ", value: `${Math.round(result.tdee * 0.85)} KCAL`, subValue: "%15 Kalori Açığı" },
            { label: "KAS KAZANIMI HEDEFİ", value: `${Math.round(result.tdee + 300)} KCAL`, subValue: "+300 Kalori Fazlası" }
          ]}
          recommendations={[
            "Hesaplanan TDEE değeriniz mevcut kilonuzu korumak için gereken miktardır.",
            "Sağlıklı yağ yakımı için günlük kalorinizden 300-500 kcal açık oluşturun.",
            "Kas gelişimi (bulking) için TDEE üzerine 200-400 kcal temiz enerji ekleyin.",
            "Kalori takibi kadar makro besin dengesi (protein/yağ/karb) de kritiktir."
          ]}
          scientificNote="Bu rapor modern spor biliminde altın standart kabul edilen Mifflin-St Jeor denklemi kullanılarak oluşturulmuştur."
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
             
             {/* Gender & Activity */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">CİNSİYET</label>
                 <div className="flex gap-2">
                   {(["erkek", "kadin"] as const).map((g) => (
                     <button
                       key={g}
                       onClick={() => setGender(g)}
                       className={cn(
                         "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                         gender === g ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400 hover:border-primary/30"
                       )}
                     >
                       {g === "erkek" ? "ERKEK" : "KADIN"}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">AKTİVİTE</label>
                 <select 
                   value={activity} 
                   onChange={(e) => setActivity(e.target.value)}
                   className="w-full bg-white dark:bg-surface border-2 border-zinc-100 dark:border-white/5 rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none"
                 >
                   {activityOptions.map(opt => (
                     <option key={opt.value} value={opt.value}>{opt.label}</option>
                   ))}
                 </select>
               </div>
             </div>

             {/* Sliders */}
             <div className="space-y-10">
               <div className="space-y-8 relative z-10">
                 <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">YAŞINIZ</label>
                   <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{age}</span>
                     <span className="text-sm font-bold text-zinc-400">YIL</span>
                   </div>
                 </div>
                 <div className="relative pt-4">
                   <input type="range" min="15" max="80" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={{ "--range-progress": `${((age - 15) / 65) * 100}%` } as React.CSSProperties} className="w-full" />
                 </div>
               </div>

               <div className="space-y-8 relative z-10">
                 <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">BOYUNUZ</label>
                   <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{height}</span>
                     <span className="text-sm font-bold text-zinc-400">CM</span>
                   </div>
                 </div>
                 <div className="relative pt-4">
                   <input type="range" min="140" max="220" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} style={{ "--range-progress": `${((height - 140) / 80) * 100}%` } as React.CSSProperties} className="w-full" />
                 </div>
               </div>

               <div className="space-y-8 relative z-10">
                 <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">KİLONUZ</label>
                   <div className="flex items-baseline gap-1">
                     <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{weight}</span>
                     <span className="text-sm font-bold text-zinc-400">KG</span>
                   </div>
                 </div>
                 <div className="relative pt-4">
                   <input type="range" min="40" max="180" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} style={{ "--range-progress": `${((weight - 40) / 140) * 100}%` } as React.CSSProperties} className="w-full" />
                 </div>
               </div>
             </div>

             <div className="mt-12 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Mifflin-St Jeor formülü, modern spor biliminde en güvenilir kalori hesaplama yöntemi olarak kabul edilir.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="calorie-result" 
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
                    <Flame className="text-primary animate-pulse mb-4" size={48} />
                    <motion.span 
                      key={result.tdee}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[80px] font-black leading-none tracking-tighter text-zinc-950 dark:text-white"
                    >
                      {result.tdee}<span className="text-2xl ml-2 uppercase">Kcal</span>
                    </motion.span>
                    <span className="text-xl font-black tracking-widest text-primary mt-4">
                      GÜNLÜK TDEE
                    </span>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 w-full mb-12">
                    <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2rem] text-center">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">BMR (Bazal)</p>
                      <p className="text-2xl font-black text-zinc-950 dark:text-white">{result.bmr}</p>
                    </div>
                    <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-6 rounded-[2rem] text-center">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">HEDEF (%-15)</p>
                      <p className="text-2xl font-black text-primary">{Math.round(result.tdee * 0.85)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("calorie-pdf-template", "fithub-kalori-analiz-raporu")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="kalori"
                      result={result}
                      inputs={{ gender, age, height, weight, activity }}
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
        <ScientificBasis referenceKey="bmr" />
      </div>
    </CalculatorLayout>
  );
}

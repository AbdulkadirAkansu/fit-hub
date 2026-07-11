"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Download, Plus, Trash2, Dumbbell, TrendingUp, Zap } from "lucide-react";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { useVolumeCalculator } from "@/hooks/useVolumeCalculator";

export default function HacimPage() {
  const { exercises, result, addExercise, removeExercise, updateExercise } = useVolumeCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Hacim Analiz Laboratuvarı"
      description="Antrenman yükünüzü (Volume Load) bilimsel olarak takip ederek aşamalı aşırı yüklenme (Progressive Overload) stratejinizi yönetin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="volume-pdf-template"
          analysisType="volume"
          title="Antrenman Hacmi Analiz Raporu"
          results={[
            { label: "TOPLAM HACİM", value: `${result.total.toLocaleString('tr-TR')} KG`, subValue: "Volume Load" },
            { label: "EGZERSİZ SAYISI", value: `${exercises.length} HAREKET` },
            ...result.detail.map((ex, i) => ({
              label: (ex.name || `EGZERSİZ ${i+1}`).toUpperCase(),
              value: `${ex.vol.toLocaleString('tr-TR')} KG`,
              subValue: `${ex.sets} SET x ${ex.reps} TEKRAR x ${ex.weight} KG`
            }))
          ]}
          recommendations={[
            "Kas gelişimi için haftalık hacminizi kademeli olarak (%2-5) artırmayı hedefleyin.",
            "Çok yüksek hacim her zaman iyi değildir; toparlanma kapasitenizi göz önünde bulundurun.",
            "Büyük kas grupları için haftalık 10-20 set arası hacim genellikle optimaldir.",
            "Hacim takibini sadece ağırlık olarak değil, 'zorlayıcı set' sayısı olarak da yapabilirsiniz."
          ]}
          scientificNote="Volume Load (Set x Tekrar x Ağırlık), mekanik gerilimi ve dolayısıyla hipertrofi sinyalini ölçmek için kullanılan temel bir metriktir."
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-12">
        
        {/* INTERACTIVE CONTROLS */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
             {/* Subtle Glow */}
             <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[100%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="flex items-center gap-3 mb-10 relative z-10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Dumbbell size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Egzersiz Günlüğü</h3>
             </div>

             <div className="space-y-6 relative z-10">
                {exercises.map((ex, index) => (
                  <div key={ex.id} className="p-6 bg-paper dark:bg-bg-dark border border-zinc-200 dark:border-white/5 rounded-2xl relative group animate-in fade-in duration-300">
                     <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1 space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-2">EGZERSİZ</label>
                           <input 
                             value={ex.name}
                             onChange={(e) => updateExercise(index, 'name', e.target.value)}
                             placeholder="Örn: Bench Press"
                             className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-2">SET</label>
                           <input 
                             type="number"
                             min="0"
                             value={ex.sets}
                             onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                             className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs font-black focus:ring-1 focus:ring-primary outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-2">TEKRAR</label>
                           <input 
                             type="number"
                             min="0"
                             value={ex.reps}
                             onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                             className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs font-black focus:ring-1 focus:ring-primary outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-2">AĞIRLIK (KG)</label>
                           <input 
                             type="number"
                             min="0"
                             value={ex.weight}
                             onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                             className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs font-black focus:ring-1 focus:ring-primary outline-none"
                           />
                        </div>
                     </div>
                     {exercises.length > 1 && (
                       <button 
                         onClick={() => removeExercise(ex.id)}
                         className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-xl z-20"
                       >
                         <Trash2 size={12} />
                       </button>
                     )}
                  </div>
                ))}
             </div>

             <button 
               onClick={addExercise}
               className="w-full flex items-center justify-center gap-3 py-4 mt-6 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all relative z-10"
             >
               <Plus size={16} /> YENİ EGZERSİZ EKLE
             </button>
          </div>

          <div className="p-8 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
             <TrendingUp className="text-primary shrink-0" size={24} />
             <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
               Aynı hacmi koruyarak ağırlığı veya tekrarı artırmak, kaslarınızın aşamalı olarak daha fazla mekanik gerilime maruz kalmasını sağlar.
             </p>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="volume-result" 
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
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4 block">HACİM ANALİZİ ÖZETİ</span>
                  
                  <div className="text-center mb-8">
                     <span className="text-[60px] md:text-[80px] font-black leading-none tracking-tighter text-zinc-950 dark:text-white block">
                       {result.total.toLocaleString('tr-TR')}
                     </span>
                     <span className="text-xl font-black tracking-widest text-primary uppercase block mt-2">VOLUME LOAD (KG)</span>
                  </div>

                  {/* Detail List */}
                  <div className="space-y-3 w-full max-h-[220px] overflow-y-auto pr-2 custom-scrollbar mb-6 text-left">
                    {result.detail.map((ex, i) => (
                      <div key={i} className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-tight truncate max-w-[120px]">{ex.name || `Egzersiz ${i+1}`}</p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase mt-0.5">{ex.sets} Set x {ex.reps} Tekrar</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-zinc-950 dark:text-white">{ex.vol.toLocaleString('tr-TR')} kg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("volume-pdf-template", "fithub-hacim-analizi")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && (
                   <SaveResultButton 
                      type="hacim"
                      result={result}
                      inputs={{ exercises }}
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
        <ScientificBasis referenceKey="trainingVolume" />
      </div>
    </CalculatorLayout>
  );
}

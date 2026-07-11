"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { Info, Download, Weight, Dumbbell, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePlateCalculator } from "@/hooks/usePlateCalculator";
import RangeSlider from "@/components/ui/RangeSlider";

export default function PlakaPage() {
  const { targetWeight, setTargetWeight, barWeight, setBarWeight, result } = usePlateCalculator();
  const { downloadPDF } = usePDF();

  return (
    <CalculatorLayout
      title="Plaka Yükleme Analizi"
      description="Hedef ağırlığınız için barın her bir yanına takmanız gereken plakaları bilimsel hassasiyetle belirleyin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="plates-pdf-template"
          analysisType="plates"
          title="Plaka Yükleme Raporu"
          results={[
            { label: "TOPLAM HEDEF", value: `${targetWeight} KG`, subValue: `Bar: ${barWeight} KG` },
            { label: "HER BİR YAN", value: `${Math.max(0, (targetWeight - barWeight) / 2)} KG`, subValue: "Sadece Plakalar" },
            ...result.needed.map(p => ({
              label: `${p.weight} KG PLAKA`,
              value: `${p.count} ADET`,
              subValue: "Her bir yan için"
            })),
            ...(result.residual > 0 ? [{
              label: "KARŞILANAMAYAN",
              value: `${result.residual} KG`,
              subValue: "Toplam artık ağırlık"
            }] : [])
          ]}
          recommendations={[
            "Plakaları her zaman barın iki yanına eşit ve simetrik olarak yerleştirin.",
            "Güvenliğiniz için her zaman ağırlık klipslerini (collar) kullanın.",
            "Ağır setlerden önce barın ve plakaların sağlam olduğundan emin olun.",
            "Daha hassas artışlar için mikro plakalar (1.25kg ve altı) kullanabilirsiniz."
          ]}
          scientificNote="Bu hesaplama standart olimpik ve teknik bar ağırlıkları baz alınarak simetrik yükleme prensibine göre yapılmıştır."
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
                  <Dumbbell size={20} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Bar ve Ağırlık Seçimi</h3>
             </div>

             <div className="space-y-16">
                <RangeSlider label="HEDEF AĞIRLIK" value={targetWeight} unit="KG" min={10} max={400} step={2.5} onChange={setTargetWeight} />

                <div className="space-y-8 relative z-10">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">BAR SEÇİMİ</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { val: 20, label: "OLİMPİK (20KG)" },
                      { val: 15, label: "KADIN (15KG)" },
                      { val: 10, label: "Z-BAR (10KG)" },
                      { val: 0, label: "BARSIZ (0KG)" }
                    ].map((b) => (
                      <button
                        key={b.val}
                        onClick={() => setBarWeight(b.val)}
                        className={cn(
                          "py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2",
                          barWeight === b.val 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400"
                        )}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
             </div>

             <div className="mt-16 p-8 bg-paper dark:bg-bg-dark rounded-3xl border border-zinc-200 dark:border-white/5 flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Hesaplanan plaka sayıları barın **sadece tek bir tarafı** içindir. Simetri sağlamak amacıyla her iki tarafa da aynı plakalar yüklenmelidir.
                </p>
             </div>
          </div>
        </motion.div>

        {/* INTERACTIVE RESULT BOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          id="plates-result" 
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
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 block">PLAKA YÜKLEME PLANI</span>
                  
                  {result.status === "underweight" && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl text-center w-full my-6">
                      <p className="text-rose-500 font-black uppercase text-xs">Hedef ağırlık bar ağırlığından düşük olamaz.</p>
                    </div>
                  )}

                  {result.status === "only-bar" && (
                    <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl text-center w-full my-6">
                      <p className="text-primary font-black uppercase text-xs mb-2">Sadece Bar Yeterlidir</p>
                      <p className="text-xs text-zinc-400 font-bold leading-relaxed">Barın yanlarına ekstra plaka eklenmesine gerek yoktur.</p>
                    </div>
                  )}

                  {(result.status === "success" || result.status === "residual") && (
                    <div className="space-y-4 w-full my-6">
                      {result.needed.map((p, idx) => (
                        <div key={idx} className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-5 rounded-2xl flex justify-between items-center group hover:border-primary transition-all text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-black text-sm shadow-lg shrink-0">
                              {p.weight}
                            </div>
                            <div>
                              <p className="text-xl font-black text-zinc-950 dark:text-white">{p.count} ADET</p>
                              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Her bir yan için</p>
                            </div>
                          </div>
                          <Weight className="text-zinc-800 group-hover:text-primary/20 transition-colors" size={28} />
                        </div>
                      ))}

                      {result.status === "residual" && (
                        <div className="bg-amber-500/10 border border-amber-500/25 p-5 rounded-2xl flex gap-3 text-left items-start">
                          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                          <div>
                            <p className="text-xs font-black text-amber-400 uppercase tracking-wider">Artık Ağırlık Uyarısı</p>
                            <p className="text-[10px] text-zinc-400 font-medium mt-1 leading-normal">
                              Mevcut plakalarla toplam <span className="text-zinc-950 dark:text-white font-black">{result.residual} kg</span> karşılanamamaktadır. En yakın ağırlığı tercih edin.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-4 w-full mt-auto">
                 <button 
                   onClick={() => downloadPDF("plates-pdf-template", "fithub-plaka-yukleme-plani")}
                   className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                   disabled={result?.status === "underweight"}
                 >
                   <Download size={16} /> Raporu İndir
                 </button>
                 {result && result.status !== "underweight" && (
                   <SaveResultButton 
                      type="plaka"
                      result={result.needed}
                      inputs={{ targetWeight, barWeight }}
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
        <ScientificBasis referenceKey="plateWeight" />
      </div>
    </CalculatorLayout>
  );
}

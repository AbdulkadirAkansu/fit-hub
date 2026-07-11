"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import { CheckCircle2, ChevronRight, Activity, Star, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import ScientificBasis from "@/components/common/ScientificBasis";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ProfessionalPDFTemplate from "@/components/common/ProfessionalPDFTemplate";

const QUESTIONS = [
  {
    id: 1,
    question: "Daha önce Pilates deneyiminiz oldu mu?",
    options: [
      { label: "Hiç yapmadım", score: 1 },
      { label: "Birkaç kez denedim", score: 2 },
      { label: "Düzenli olarak yapıyorum (6+ ay)", score: 3 },
      { label: "Uzun yıllardır profesyonel seviyede yapıyorum", score: 4 }
    ]
  },
  {
    id: 2,
    question: "Core (merkez bölge) gücünüzü nasıl değerlendirirsiniz?",
    options: [
      { label: "Zayıf (Plank yapmakta zorlanıyorum)", score: 1 },
      { label: "Orta (30-60 sn plank yapabiliyorum)", score: 2 },
      { label: "Güçlü (Karın hareketlerinde kontrolüm tam)", score: 3 },
      { label: "Çok Güçlü (İleri seviye denge hareketlerini yapabiliyorum)", score: 4 }
    ]
  },
  {
    id: 3,
    question: "Esneklik seviyeniz nedir?",
    options: [
      { label: "Kısıtlı (Eğildiğimde dizlerime zor ulaşıyorum)", score: 1 },
      { label: "Normal (Ayak parmak uçlarıma dokunabiliyorum)", score: 2 },
      { label: "İyi (Zeminle temas edebiliyorum)", score: 3 },
      { label: "Çok İyi (Tam esneklik ve hareket açıklığı)", score: 4 }
    ]
  },
  {
    id: 4,
    question: "Egzersiz sırasında nefes kontrolünüz nasıl?",
    options: [
      { label: "Nefesimi sık sık tutuyorum", score: 1 },
      { label: "Hatırlatıldığında odaklanabiliyorum", score: 2 },
      { label: "Hareketle nefesi senkronize edebiliyorum", score: 3 },
      { label: "Lateral torasik nefesi mükemmel uyguluyorum", score: 4 }
    ]
  },
  {
    id: 5,
    question: "Omurga mobilizasyonu (hareketliliği) durumunuz?",
    options: [
      { label: "Sertlik hissediyorum", score: 1 },
      { label: "Temel roll-up hareketini yapabiliyorum", score: 2 },
      { label: "Omurgamı boğum boğum hareket ettirebiliyorum", score: 3 },
      { label: "Tam kontrol ve akıcılığa sahibim", score: 4 }
    ]
  }
];

const LEVELS = [
  { 
    id: "beginner", 
    title: "BAŞLANGIÇ (BEGINNER)", 
    minScore: 0, 
    maxScore: 8,
    color: "text-primary",
    desc: "Pilates prensiplerini ve temel hareketleri öğrenme aşamasındasınız.",
    recs: ["Temel mat pilates hareketlerine odaklanın.", "Nefes ve core aktivasyonunu öğrenmeye öncelik verin.", "Haftada 2-3 gün düzenli pratik yapın."]
  },
  { 
    id: "intermediate", 
    title: "ORTA SEVİYE (INTERMEDIATE)", 
    minScore: 9, 
    maxScore: 15,
    color: "text-primary",
    desc: "Temel prensiplere hakimsiniz, hareket akıcılığınız gelişiyor.",
    recs: ["Hareketlerin yoğunluğunu ve süresini artırın.", "Daha karmaşık koordinasyon hareketlerine geçiş yapın.", "Direnç bantları veya küçük toplar ekleyebilirsiniz."]
  },
  { 
    id: "advanced", 
    title: "İLERİ SEVİYE (ADVANCED)", 
    minScore: 16, 
    maxScore: 20,
    color: "text-primary",
    desc: "Vücut farkındalığınız yüksek, ileri seviye serileri uygulayabilirsiniz.",
    recs: ["Eksantrik kontrole ve tam vücut entegrasyonuna odaklanın.", "Zorlayıcı denge ve kuvvet serilerini deneyin.", "Hareketteki mükemmeliyeti ve zihin-vücut bütünlüğünü hedefleyin."]
  }
];

export default function PilatesSeviyePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<typeof LEVELS[0] | null>(null);
  const { downloadPDF } = usePDF();

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
    const level = LEVELS.find(l => totalScore >= l.minScore && totalScore <= l.maxScore) || LEVELS[0];
    setResult(level);
  };

  const resetTest = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Pilates Yetkinlik Analizi"
      description="Fiziksel kapasitenizi ve Pilates tecrübenizi değerlendirerek size en uygun başlangıç noktasını belirleyin."
    >
      {/* Hidden Professional Template for PDF */}
      {result && (
        <ProfessionalPDFTemplate 
          id="pilates-pdf-template"
          title="Pilates Seviye Tespit Raporu"
          results={[
            { label: "BELİRLENEN SEVİYE", value: result.title, subValue: result.desc },
            { label: "TOPLAM SKOR", value: `${answers.reduce((a, b) => a + b, 0)} / 20` },
            { label: "ANAKATEGORİ", value: "PİLATES" }
          ]}
          recommendations={result.recs}
          scientificNote="Bu değerlendirme Joseph Pilates'in temel prensipleri ve PMA (Pilates Method Alliance) standartları göz önünde bulundurularak hazırlanmıştır."
        />
      )}

      <div className="max-w-4xl mx-auto">
        {!result ? (
          <div className="space-y-12">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-500" 
                 style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
               />
            </div>

            <div className="text-center space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">SORU {currentStep + 1} / {QUESTIONS.length}</span>
               <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-tight">
                 {QUESTIONS[currentStep].question}
               </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {QUESTIONS[currentStep].options.map((opt, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleAnswer(opt.score)}
                   className="group p-8 bg-white dark:bg-surface border-2 border-zinc-100 dark:border-white/5 rounded-[2rem] text-left hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all flex justify-between items-center"
                 >
                    <span className="font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{opt.label}</span>
                    <ChevronRight size={20} className="text-zinc-300 group-hover:text-primary transition-colors" />
                 </button>
               ))}
            </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in zoom-in-95 duration-700">
             {/* RESULT BOARD */}
             <div id="pilates-result" className="bg-zinc-900 dark:bg-surface rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col items-center">
                   <Activity className="text-primary mb-8" size={64} />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4 block">ANALİZ TAMAMLANDI</span>
                   <h3 className={cn("text-5xl font-black tracking-tighter mb-6", result.color)}>
                     {result.title}
                   </h3>
                   <p className="text-zinc-400 font-medium mb-12 max-w-xl mx-auto">
                     {result.desc}
                   </p>

                   {/* Recommendation Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
                      {result.recs.map((rec, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                           <CheckCircle2 size={16} className="text-primary mx-auto mb-3" />
                           <p className="text-[9px] font-bold text-zinc-300 uppercase leading-relaxed">{rec}</p>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-col md:flex-row gap-4 w-full">
                      <button 
                        onClick={() => downloadPDF("pilates-pdf-template", "fithub-pilates-seviye-raporu")}
                        className="flex-1 flex items-center justify-center gap-3 py-5 bg-white text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-100 transition-all"
                      >
                        <Download size={16} /> ANALİZİ İNDİR (PDF)
                      </button>
                      <SaveResultButton 
                        type="pilates-seviye"
                        result={{ level: result.id, title: result.title }}
                        inputs={{ answers }}
                      />
                      <button 
                        onClick={resetTest}
                        className="flex-1 py-5 border-2 border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white hover:border-white transition-all"
                      >
                        TESTİ TEKRARLA
                      </button>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-zinc-100 dark:bg-zinc-800/50 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                   <Star size={32} />
                </div>
                <div>
                   <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Seviyenize Uygun Programlar Hazır!</h4>
                   <p className="text-sm text-zinc-500 font-medium">Size özel hazırladığımız Pilates programlarına göz atarak gelişiminizi bir üst seviyeye taşıyabilirsiniz.</p>
                </div>
                <button className="md:ml-auto px-8 py-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                  PROGRAMLARI GÖR
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="mt-24">
        <ScientificBasis referenceKey="pilatesLevel" />
      </div>
    </CalculatorLayout>
  );
}

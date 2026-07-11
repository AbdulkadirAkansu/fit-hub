"use client";

import React from "react";
import CalculatorLayout from "@/components/common/CalculatorLayout";
import {
  Download, Flame, Zap, Target, Activity, Utensils,
  Check, Loader2, Sparkles,
  Coins, DollarSign, Gem, GlassWater, Clock, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import SaveResultButton from "@/components/common/SaveResultButton";
import { usePDF } from "@/hooks/usePDF";
import ScientificBasis from "@/components/common/ScientificBasis";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDietPlanner } from "@/hooks/useDietPlanner";
import type { BudgetTier } from "@/types/diet";

export default function DiyetPlaniPage() {
  const {
    gender, setGender, age, setAge, height, setHeight, weight, setWeight,
    activity, setActivity, goal, setGoal, dietStyle, setDietStyle,
    mealCount, setMealCount, budgetPreference, setBudgetPreference,
    allergens, toggleAllergen,
    isLoggedIn, isGenerating, generationStep, synthesisMode, setSynthesisMode, result,
    activeDayTab, setActiveDayTab, activeAnalysisSubTab, setActiveAnalysisSubTab,
    toastMessage, handleGeneratePlan,
  } = useDietPlanner();

  const { downloadPDF } = usePDF();

  const activityOptions = [
    { value: "1.2", label: "SEDANTER", desc: "Masa başı iş, sıfır spor" },
    { value: "1.375", label: "HAFİF AKTİF", desc: "Haftada 1-3 gün spor" },
    { value: "1.55", label: "ORTA AKTİF", desc: "Haftada 3-5 gün spor" },
    { value: "1.725", label: "ÇOK AKTİF", desc: "Haftada 6-7 gün ağır spor" },
    { value: "1.9", label: "EKSTREM AKTİF", desc: "Günde çift idman veya ağır fiziksel iş" },
  ];

  const allergenOptions = [
    { value: "gluten", label: "Gluten Hassasiyeti" },
    { value: "lactose", label: "Laktoz Hassasiyeti" },
    { value: "nuts", label: "Kuruyemiş Alerjisi" },
    { value: "fish", label: "Deniz Ürünleri" }
  ];

  return (
    <CalculatorLayout
      title="Gelişmiş Algoritma Destekli Diyet Planlayıcı"
      description="Biyometrik verilerinize, bütçenize, diyet tercihlerinize ve alerjenlerinize göre porsiyonlanmış 7 günlük bilimsel beslenme programı."
    >
      {/* Hidden PDF print template */}
      {result && (
        <div style={{ height: 0, overflow: "hidden", position: "relative", clear: "both" }}>
          <div 
            id="diet-plan-pdf-template" 
            data-pdf-title="7 Günlük Kişiselleştirilmiş Beslenme Raporu"
            className="bg-white text-zinc-900 p-16 font-sans leading-relaxed pointer-events-none"
            style={{ width: "800px", minHeight: "1131px", backgroundColor: "#ffffff" }}
          >
            <div data-pdf-section className="flex justify-between items-start border-b-4 border-blue-600 pb-10 mb-12">
              <div>
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <Activity size={32} strokeWidth={3} />
                  <span className="text-3xl font-black tracking-tighter uppercase">FITHUB LAB</span>
                </div>
                <p className="text-zinc-500 font-bold text-xs tracking-widest uppercase">KİŞİSELLEŞTİRİLMİŞ BİLİMSEL BESLENME PROGRAMI</p>
              </div>
              <div className="text-right text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                <div>TARİH: {new Date().toLocaleDateString("tr-TR")}</div>
                <div>BÜTÇE SINIFI: {budgetPreference.toUpperCase()}</div>
                <div>DİYET TARZI: {dietStyle.toUpperCase()}</div>
              </div>
            </div>

            <div data-pdf-section className="mb-10">
              <h1 className="text-4xl font-black text-zinc-950 mb-2 uppercase tracking-tighter">BİYOMETRİK BESLENME RAPORU</h1>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Bu beslenme reçetesi, Mifflin-St Jeor metabolizma formülü ve makro dağılım algoritmaları kullanılarak tamamen yerel performans sentez motorumuz tarafından üretilmiştir.
              </p>
            </div>

            {/* Metrikler */}
            <div data-pdf-section className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">GÜNLÜK HEDEF</p>
                <p className="text-xl font-black text-blue-600">{result.targetCalories} kcal</p>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">PROTEİN</p>
                <p className="text-xl font-black text-zinc-950">{result.protein}g</p>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">KARBONHİDRAT</p>
                <p className="text-xl font-black text-zinc-950">{result.carbs}g</p>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">YAĞ</p>
                <p className="text-xl font-black text-zinc-950">{result.fat}g</p>
              </div>
            </div>

            {/* Scientific details */}
            <div data-pdf-section className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mb-10 text-xs">
              <h3 className="font-black text-blue-600 uppercase tracking-wide mb-3">BİLİMSEL BİYOMETRİK DEĞERLENDİRME</h3>
              <ul className="space-y-2 text-zinc-700 font-medium">
                <li>• <b>Bazal Hız (BMR):</b> {result.bmr} kcal | <b>Aktif İhtiyaç (TDEE):</b> {result.tdee} kcal</li>
                <li>• <b>Günlük Su Hedefi:</b> {result.scientificAnalysis.waterTarget} Litre (Performans ve hidrasyon dengesi)</li>
                <li>• <b>Lif Tüketim Hedefi:</b> {result.scientificAnalysis.fiberTarget}g (Mikrobiyom ve sindirim koruyucu)</li>
                <li>• <b>Öğün Zamanlaması:</b> {result.scientificAnalysis.timingTip}</li>
                <li>• <b>Önerilen Gıda Takviyeleri:</b> {result.scientificAnalysis.supplements.join(", ")}</li>
              </ul>
            </div>

            {/* 7 Günlük Tablo */}
            <div className="space-y-12">
              {result.weeklyPlan.map((dayPlan, dIdx) => (
                <div key={dIdx} className="border-t border-zinc-200 pt-8 page-break-inside-avoid">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">{dayPlan.day} PLANLAYICI</h3>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {dayPlan.totalCalories} kcal | P: {dayPlan.totalProtein}g | K: {dayPlan.totalCarbs}g | Y: {dayPlan.totalFat}g
                    </div>
                  </div>

                  <div className="space-y-4">
                    {dayPlan.meals.map((meal, mIdx) => (
                      <div key={mIdx} className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 text-xs">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-blue-600 uppercase tracking-wide">{meal.name} ({meal.time})</span>
                          <span className="font-bold text-zinc-600">{meal.caloriesTarget} kcal</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-zinc-800 font-medium mb-3">
                          {meal.items.map((it, itIdx) => (
                            <li key={itIdx}>
                              <span className="font-bold">{it.grams}g</span> {it.food.name} 
                              <span className="text-[10px] text-zinc-400 ml-1">
                                (P: {Math.round((it.grams * it.food.protein)/100)}g, K: {Math.round((it.grams * it.food.carb)/100)}g, Y: {Math.round((it.grams * it.food.fat)/100)}g)
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-zinc-500 text-[10px] leading-relaxed border-l-2 border-zinc-200 pl-3">
                          {meal.recipe}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-zinc-100 text-center text-zinc-400 text-[8px] font-bold uppercase tracking-widest leading-relaxed">
              Bu rapor FitHub gelişmiş sentez algoritması tarafından tamamen ücretsiz olarak üretilmiş bir bilimsel simülasyondur.<br />
              <strong className="text-rose-500">ÖNEMLİ UYARI:</strong> Bu diyet programı <strong>uzman hekim veya diyetisyen tavsiyesi yerine geçmez</strong>. Kesinlikle tıbbi bir reçete değildir. Herhangi bir sağlık sorunu veya kronik hastalığı olan bireylerin bu planı uygulamadan önce mutlaka yetkili bir sağlık profesyoneline danışması gereklidir.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-12">
        
        {/* LEFT PANEL - CONFIGURATION FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 space-y-10"
        >
          <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[100%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Auto-fill Status */}
            <div className="mb-8">
              {isLoggedIn ? (
                <div className="bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl flex items-center gap-3 text-xs font-bold">
                  <Check size={16} />
                  <span>Laboratuvar ölçümleri profilinizden otomatik yüklendi.</span>
                </div>
              ) : (
                <div className="bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl flex items-center gap-3 text-xs font-bold">
                  <Sparkles size={16} className="animate-pulse" />
                  <span>Profil verilerinizle otomatik doldurmak için giriş yapın.</span>
                </div>
              )}
            </div>

            {/* Bütçe Seçimi */}
            <div className="space-y-6 mb-10 pb-8 border-b border-zinc-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">BESLENME BÜTÇESİ</label>
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">ÖNEMLİ KRİTER</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "ekonomik", label: "EKONOMİK", desc: "Öğrenci / Bütçe Dostu", icon: Coins, color: "hover:border-primary/30" },
                  { id: "standart", label: "STANDART", desc: "Klasik Fitness Diyeti", icon: DollarSign, color: "hover:border-primary/30" },
                  { id: "premium", label: "PREMIUM", desc: "Gurme / Biftek & Somon", icon: Gem, color: "hover:border-primary/30" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBudgetPreference(tier.id as BudgetTier)}
                    className={cn(
                      "p-5 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 text-center",
                      budgetPreference === tier.id 
                        ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                        : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400",
                      tier.color
                    )}
                  >
                    <tier.icon size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{tier.label}</span>
                    <span className="text-[7px] text-zinc-500 dark:text-zinc-400 font-bold uppercase leading-tight line-clamp-1">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-8">
              1. BİYOMETRİK PARAMETRELER
            </h2>

            {/* Gender and Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">CİNSİYET</label>
                <div className="flex gap-2">
                  {["erkek", "kadin"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={cn(
                        "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                        gender === g 
                          ? "bg-zinc-950 dark:bg-white border-zinc-950 dark:border-white text-white dark:text-zinc-950 shadow-xl" 
                          : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400 hover:border-primary/30"
                      )}
                    >
                      {g === "erkek" ? "ERKEK" : "KADIN"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">AKTİVİTE DERECESİ</label>
                <select 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-white dark:bg-surface border-2 border-zinc-100 dark:border-white/5 rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none text-zinc-700 dark:text-zinc-300"
                >
                  {activityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-6 mb-10">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">ANA FİZİKSEL HEDEF</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "kilo-verme", label: "YAĞ YAKIMI", icon: Flame },
                  { id: "koruma", label: "DENGE / FORM", icon: Target },
                  { id: "kas-kazanma", label: "GÜÇ & HACİM", icon: Zap }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
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

            {/* Sliders */}
            <div className="space-y-10 mb-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">YAŞINIZ</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{age}</span>
                    <span className="text-xs font-bold text-zinc-400">YIL</span>
                  </div>
                </div>
                <input type="range" min="15" max="80" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={{ "--range-progress": `${((age - 15) / 65) * 100}%` } as React.CSSProperties} className="w-full" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">BOYUNUZ</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{height}</span>
                    <span className="text-xs font-bold text-zinc-400">CM</span>
                  </div>
                </div>
                <input type="range" min="140" max="220" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} style={{ "--range-progress": `${((height - 140) / 80) * 100}%` } as React.CSSProperties} className="w-full" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">MEVCUT KİLO</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{weight}</span>
                    <span className="text-xs font-bold text-zinc-400">KG</span>
                  </div>
                </div>
                <input type="range" min="40" max="180" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} style={{ "--range-progress": `${((weight - 40) / 140) * 100}%` } as React.CSSProperties} className="w-full" />
              </div>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-8 pt-4">
              2. DİYET & ALERJEN TERCİHLERİ
            </h2>

            {/* Diet Style & Meal Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">BESLENME EKOLÜ</label>
                <select 
                  value={dietStyle} 
                  onChange={(e) => setDietStyle(e.target.value)}
                  className="w-full bg-white dark:bg-surface border-2 border-zinc-100 dark:border-white/5 rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none text-zinc-700 dark:text-zinc-300"
                >
                  <option value="klasik">KLASİK BESLENME</option>
                  <option value="vejetaryen">VEJETARYEN DIŞI ETSIZ</option>
                  <option value="keto">KETOJENİK (DÜŞÜK KARB)</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">ÖĞÜN SIKLIĞI</label>
                <div className="flex gap-2">
                  {[3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMealCount(num)}
                      className={cn(
                        "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                        mealCount === num 
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xl" 
                          : "bg-white dark:bg-surface border-zinc-100 dark:border-white/5 text-zinc-400 hover:border-zinc-300"
                      )}
                    >
                      {num} ÖĞÜN
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-4 mb-10">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 block">SAKINCALI ALERJENLER</label>
              <div className="grid grid-cols-2 gap-3">
                {allergenOptions.map(opt => {
                  const active = allergens.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleAllergen(opt.value)}
                      className={cn(
                        "p-4 rounded-xl text-left border text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-between",
                        active 
                          ? "border-amber-500/40 bg-amber-500/5 text-amber-500" 
                          : "border-zinc-100 dark:border-white/5 bg-white dark:bg-surface text-zinc-400"
                      )}
                    >
                      {opt.label}
                      {active && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sentez Modu Seçimi */}
            <div className="space-y-4 mb-10 pb-8 border-b border-zinc-100 dark:border-white/5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 block">SENTEZ MOTORU</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "local", label: "Lokal Formül", desc: "Çevrimdışı / Bilimsel Algoritma", icon: Activity },
                  { id: "ai", label: "FitHub Pro (Akıllı Motor)", desc: "Kişiselleştirilmiş Gurme Diyet", icon: Sparkles }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSynthesisMode(mode.id as "local" | "ai")}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all flex flex-col gap-1",
                      synthesisMode === mode.id
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-zinc-200 dark:border-white/5 bg-paper dark:bg-bg-dark/50 text-zinc-400 hover:border-zinc-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <mode.icon size={14} className={cn(synthesisMode === mode.id ? "text-primary" : "text-zinc-500 dark:text-zinc-400")} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{mode.label}</span>
                    </div>
                    <span className="text-[8px] opacity-80 uppercase leading-tight font-medium">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-80"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>OPTIMİZE EDİLİYOR...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>DİYET PROGRAMINI SENTEZLE</span>
                </>
              )}
            </button>
          </div>
        </motion.div>        {/* RIGHT PANEL - DETAILED DYNAMIC PLAN DASHBOARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 space-y-12"
        >
          {isGenerating ? (
            <div className="bg-white dark:bg-surface rounded-[2.5rem] p-16 text-zinc-950 dark:text-white text-center min-h-[500px] flex flex-col items-center justify-center border border-zinc-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <Loader2 size={64} className="text-primary animate-spin mb-8" />
              <h3 className="text-2xl font-black uppercase tracking-tight text-primary mb-4 animate-pulse">
                METABOLİK REÇETE ANALİZİ
              </h3>
              
              <div className="max-w-md w-full bg-zinc-950/[0.03] dark:bg-white/5 p-6 rounded-2xl border border-zinc-950/10 dark:border-white/10 relative z-10">
                <p className="text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">AŞAMA {generationStep + 1} / 5</p>
                <p className="text-sm font-bold text-zinc-950 dark:text-white">
                  {[
                    "Biyometrik parametreler ve TDEE analiz ediliyor...",
                    "Bütçe kısıtlamalarına göre gıdalar filtreleniyor...",
                    "Alerjen ve diyet tarzı korumaları taranıyor...",
                    "Öğün başı bilimsel makrolar ve porsiyonlar çözülüyor...",
                    "Sirkadiyen ritim ve mikrobesin raporu derleniyor..."
                  ][generationStep]}
                </p>
                <div className="w-full bg-zinc-950/10 dark:bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(generationStep + 1) * 20}%` }}
                  />
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="bg-white dark:bg-surface rounded-[2.5rem] p-10 md:p-14 text-zinc-950 dark:text-white border border-zinc-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full min-h-[500px]">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-950/10 dark:border-white/10">
                  <div className="flex items-center gap-2 bg-zinc-950/5 dark:bg-white/10 px-4 py-2 rounded-full border border-zinc-950/10 dark:border-white/10 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-950 dark:text-white">REÇETE HAZIR</span>
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">
                    Bütçe: {budgetPreference === "ekonomik" ? "Ekonomik" : budgetPreference === "standart" ? "Standart" : "Premium"}
                  </span>
                </div>

                {/* Macro Target Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-5 rounded-[2rem] text-center">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">GÜNLÜK KALORİ</p>
                    <p className="text-2xl font-black text-primary leading-none">{result.targetCalories}<span className="text-[10px] ml-1 uppercase">kcal</span></p>
                  </div>
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-5 rounded-[2rem] text-center group hover:border-primary transition-colors">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">PROTEİN</p>
                    <p className="text-xl font-black text-zinc-950 dark:text-white">{result.protein}g</p>
                  </div>
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-5 rounded-[2rem] text-center group hover:border-primary transition-colors">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">KARB</p>
                    <p className="text-xl font-black text-zinc-950 dark:text-white">{result.carbs}g</p>
                  </div>
                  <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 p-5 rounded-[2rem] text-center group hover:border-primary transition-colors">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">YAĞ</p>
                    <p className="text-xl font-black text-zinc-950 dark:text-white">{result.fat}g</p>
                  </div>
                </div>

                {/* Scientific Analysis Panel (New Features) */}
                <div className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-[2.5rem] p-6 mb-8">
                  <div className="flex gap-2 border-b border-zinc-950/10 dark:border-white/5 pb-4 mb-4 overflow-x-auto no-scrollbar">
                    {[
                      { id: "su", label: "Hidrasyon & Lif", icon: GlassWater },
                      { id: "mikro", label: "Mikrobesin & Takviye", icon: ShieldCheck },
                      { id: "zamanlama", label: "Sirkadiyen Düzen", icon: Clock }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveAnalysisSubTab(tab.id as "su" | "mikro" | "zamanlama")}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                          activeAnalysisSubTab === tab.id 
                            ? "bg-zinc-950/5 dark:bg-white/10 text-zinc-950 dark:text-white border border-zinc-950/10 dark:border-white/10" 
                            : "text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-300"
                        )}
                      >
                        <tab.icon size={12} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {activeAnalysisSubTab === "su" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-zinc-950/10 dark:border-white/5">
                          <span className="text-zinc-500 font-bold uppercase text-[9px]">GÜNLÜK HASSAS SU İHTİYACI</span>
                          <span className="text-primary font-black text-sm">{result.scientificAnalysis.waterTarget} L</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-zinc-950/10 dark:border-white/5">
                          <span className="text-zinc-500 font-bold uppercase text-[9px]">GÜNLÜK HEDEF LİF ALIMI</span>
                          <span className="text-zinc-950 dark:text-white font-black text-sm">{result.scientificAnalysis.fiberTarget} g</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-2">
                          * Yüksek proteinli beslenmede böbrek süzme yükünü dengelemek için su hedefi hayati önem taşır. Lif miktarı ise lif/kcal oranına (14g/1000kcal) göre hesaplanmıştır.
                        </p>
                      </div>
                    )}
                    {activeAnalysisSubTab === "mikro" && (
                      <div className="space-y-3">
                        <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">ÖNERİLEN KLİNİK TAKVİYELER</h5>
                        <ul className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                          {result.scientificAnalysis.supplements.map((sup, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span className="text-[11px] font-medium leading-relaxed">{sup}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activeAnalysisSubTab === "zamanlama" && (
                      <div className="space-y-2">
                        <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">METABOLİK ÖĞÜN ZAMANLAMASI</h5>
                        <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {result.scientificAnalysis.timingTip}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-2">
                          * Sabah kortizol zirvesi sonrasında ilk beslenmeyi planlamak ve sirkadiyen saate uyumlu akşam yemeği bitişi, insülin duyarlılığını zirvede tutar.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7-Day Tab Selector */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 bg-zinc-950/[0.03] dark:bg-white/5 p-2 rounded-2xl border border-zinc-950/10 dark:border-white/5">
                  {result.weeklyPlan.map((dayPlan, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDayTab(idx)}
                      className={cn(
                        "px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        activeDayTab === idx 
                          ? "bg-primary text-white shadow-lg" 
                          : "text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                      )}
                    >
                      {dayPlan.day.substring(0, 3)}
                    </button>
                  ))}
                </div>

                {/* Day Macro Details */}
                <div className="mb-6 flex justify-between items-center bg-zinc-950/[0.03] dark:bg-white/5 px-6 py-3 rounded-xl border border-zinc-950/10 dark:border-white/5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>{result.weeklyPlan[activeDayTab].day} PLAN TOPLAMI:</span>
                  <span className="text-zinc-950 dark:text-white">
                    {result.weeklyPlan[activeDayTab].totalCalories} KCAL | P: {result.weeklyPlan[activeDayTab].totalProtein}G | K: {result.weeklyPlan[activeDayTab].totalCarbs}G
                  </span>
                </div>

                {/* Meals List */}
                <div className="space-y-6 flex-grow">
                  {result.weeklyPlan[activeDayTab].meals.map((meal, mIdx) => (
                    <div 
                      key={mIdx}
                      className="bg-zinc-950/[0.03] dark:bg-white/5 border border-zinc-950/10 dark:border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl text-primary flex items-center justify-center">
                            <Utensils size={18} />
                          </div>
                          <div>
                            <h4 className="text-md font-black uppercase leading-none text-zinc-950 dark:text-white">{meal.name}</h4>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{meal.time}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-primary bg-zinc-950/[0.03] dark:bg-white/5 px-3 py-1.5 rounded-full border border-zinc-950/10 dark:border-white/5">
                          {meal.caloriesTarget} kcal
                        </span>
                      </div>

                      {/* Ingredients */}
                      <ul className="space-y-2 mb-6 border-b border-zinc-950/10 dark:border-white/5 pb-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {meal.items.map((it, itIdx) => (
                          <li key={itIdx} className="flex justify-between items-center bg-zinc-950/[0.03] dark:bg-white/5 px-4 py-2.5 rounded-xl border border-zinc-950/10 dark:border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-primary font-black text-sm">{it.grams}g</span>
                              <span className="text-zinc-950 dark:text-white">{it.food.name}</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                              P: {Math.round((it.grams * it.food.protein) / 100)}g | K: {Math.round((it.grams * it.food.carb) / 100)}g
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Recipe Instructions */}
                      <div className="bg-zinc-950/[0.03] dark:bg-white/5 p-4 rounded-xl border border-zinc-950/10 dark:border-white/5 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">HAZIRLANIŞI</span>
                        {meal.recipe}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 w-full mt-10">
                  <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-center">
                    <p className="text-rose-400 text-[10px] font-bold leading-relaxed">
                      <strong className="block text-xs mb-1">ÖNEMLİ UYARI</strong>
                      Bu diyet programı FitHub sentez algoritması tarafından oluşturulmuş bir bilimsel simülasyondur. Kesinlikle tıbbi bir tavsiye veya uzman diyetisyen reçetesi yerine geçmez. Sağlık sorunlarınız varsa uygulamadan önce hekiminize danışınız.
                    </p>
                  </div>

                  <button 
                    onClick={() => downloadPDF("diet-plan-pdf-template", `fithub-diyet-plani`)}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                  >
                    <Download size={16} /> 7 Günlük PDF Raporu İndir
                  </button>

                  <SaveResultButton 
                    type="diyet_plani"
                    result={{
                      targetCalories: result.targetCalories,
                      protein: result.protein,
                      carbs: result.carbs,
                      fat: result.fat,
                      weeklyPlan: result.weeklyPlan,
                      scientificAnalysis: result.scientificAnalysis
                    }}
                    inputs={{
                      gender, age, height, weight, activity, goal, dietStyle, mealCount, budgetPreference, allergens
                    }}
                  />
                  
                  <Link href="/hesaplama" className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors group">
                    <Zap size={14} className="group-hover:text-primary transition-colors" /> DIŞ EKRANA DÖN
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface rounded-[2.5rem] p-16 text-zinc-950 dark:text-white text-center min-h-[500px] flex flex-col items-center justify-center border border-zinc-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <Utensils className="text-zinc-600 mb-6" size={64} />
              <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300 mb-4">
                REÇETENİZ HAZIR DEĞİL
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold leading-relaxed max-w-sm">
                Sol panelde bulunan biyometrik verilerinizi, bütçenizi, diyet hedefinizi ve alerjen tercihlerinizi girdikten sonra planınızı oluşturun.
              </p>
            </div>
          )}
        </motion.div>

      </div>

      <div className="mt-24">
        <ScientificBasis referenceKey="macros" />
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-white dark:bg-surface text-zinc-950 dark:text-white border border-zinc-200 dark:border-white/10 px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest animate-bounce">
          <Activity className="text-primary" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </CalculatorLayout>
  );
}

import { useEffect, useState } from "react";
import { DietService } from "@/services/diet.service";
import type { BudgetTier, DietPlanInputs, DietPlanResult } from "@/types/diet";

/**
 * Diyet planlayıcı ViewModel'i.
 * Form state'ini, kullanıcı varsayılanlarının yüklenmesini ve plan üretim
 * orkestrasyonunu (yerel/Motor + adım göstergesi + toast) yönetir. Saf hesaplama
 * ve veri erişimi DietService'e (Model) delege edilir.
 */
export function useDietPlanner() {
  // Girdi state'leri
  const [gender, setGender] = useState("erkek");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("koruma");
  const [dietStyle, setDietStyle] = useState("klasik");
  const [mealCount, setMealCount] = useState(3);
  const [budgetPreference, setBudgetPreference] = useState<BudgetTier>("ekonomik");
  const [allergens, setAllergens] = useState<string[]>([]);

  // Sistem state'leri
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [synthesisMode, setSynthesisMode] = useState<"local" | "ai">("local");
  const [result, setResult] = useState<DietPlanResult | null>(null);

  const [activeDayTab, setActiveDayTab] = useState(0);
  const [activeAnalysisSubTab, setActiveAnalysisSubTab] = useState<"su" | "mikro" | "zamanlama">("su");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Giriş yapmış kullanıcı varsayılanlarını otomatik doldur.
  useEffect(() => {
    (async () => {
      try {
        const { loggedIn, defaults } = await DietService.fetchUserDefaults();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          if (defaults.weight !== undefined) setWeight(defaults.weight);
          if (defaults.height !== undefined) setHeight(defaults.height);
          if (defaults.age !== undefined) setAge(defaults.age);
          if (defaults.gender !== undefined) setGender(defaults.gender);
          if (defaults.activity !== undefined) setActivity(defaults.activity);
          if (defaults.goal !== undefined) setGoal(defaults.goal);
          showToast("Kişisel ölçüm ve hedefleriniz laboratuvardan yüklendi.");
        }
      } catch (err) {
        console.warn("Kullanıcı verileri yüklenirken bir hata oluştu (offline?):", err);
      }
    })();
  }, []);

  const toggleAllergen = (val: string) => {
    setAllergens((prev) => (prev.includes(val) ? prev.filter((a) => a !== val) : [...prev, val]));
  };

  const buildInputs = (): DietPlanInputs => ({
    gender, age, height, weight, activity, goal, dietStyle, mealCount, budgetPreference, allergens,
  });

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const inputs = buildInputs();

    try {
      if (synthesisMode === "ai") {
        setGenerationStep(0);
        await sleep(350);
        setGenerationStep(1);
        await sleep(350);
        setGenerationStep(2);

        const data = await DietService.generateAiPlan(inputs);

        setGenerationStep(3);
        await sleep(350);
        setGenerationStep(4);

        setResult(data);
        setIsGenerating(false);
        showToast("Diyet programınız SentezMotoru Motor tarafından sentezlendi.");
      } else {
        for (let i = 0; i < 5; i++) {
          setGenerationStep(i);
          await sleep(200);
        }
        setResult(DietService.generateLocalPlan(inputs));
        setIsGenerating(false);
        showToast("Diyet programınız yerel bilimsel motorla sentezlendi.");
      }
    } catch (error) {
      console.error("Diyet sentezlenirken hata:", error);
      showToast("Akıllı Motor Bağlantı Hatası! Temel Motora Geçiş Yapılıyor...");

      await sleep(1000);
      setGenerationStep(3);
      await sleep(200);
      setGenerationStep(4);

      setResult(DietService.generateLocalPlan(inputs));
      setIsGenerating(false);
    }
  };

  return {
    // girdiler
    gender, setGender, age, setAge, height, setHeight, weight, setWeight,
    activity, setActivity, goal, setGoal, dietStyle, setDietStyle,
    mealCount, setMealCount, budgetPreference, setBudgetPreference,
    allergens, toggleAllergen,
    // sistem
    isLoggedIn, isGenerating, generationStep, synthesisMode, setSynthesisMode, result,
    activeDayTab, setActiveDayTab, activeAnalysisSubTab, setActiveAnalysisSubTab,
    toastMessage,
    // eylemler
    handleGeneratePlan,
  };
}

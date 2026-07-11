import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DashboardService } from "@/services/dashboard.service";
import { 
  ProfileData, 
  Measurement, 
  UserProgram, 
  SavedCalculation, 
  WorkoutSession,
  NutritionLog,
  DashboardInsight,
  DevelopmentProfile,
} from "@/types/dashboard";
import { BADGES_DATA } from "@/constants/badges";
import { buildAvatarToken, parseAvatarToken } from "@/lib/avatar";

export function useDashboard() {
  const router = useRouter();
  
  // Tabs & UI state
  const [activeTab, setActiveTab] = useState("rota");
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileError, setProfileError] = useState<{ message: string } | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [programs, setPrograms] = useState<UserProgram[]>([]);
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  
  // Form & Modals state
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [selectedChartMetric, setSelectedChartMetric] = useState("weight");
  const [isCorrelationMode, setIsCorrelationMode] = useState(false);
  const [correlationMetricB, setCorrelationMetricB] = useState("waist");
  const [mForm, setMForm] = useState({
    weight: "", neck: "", shoulder: "", chest: "", waist: "", hips: "", biceps: "", thigh: ""
  });
  const [nameInput, setNameInput] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("💪");
  const [avatarHue, setAvatarHue] = useState("orange");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [targetWeight, setTargetWeight] = useState<string>("75");
  const [targetCalories, setTargetCalories] = useState<string>("2200");
  const [developmentProfile, setDevelopmentProfile] = useState<DevelopmentProfile>({
    age: "", height: "", gender: "", activity: "1.55", goal: "", weeklyGoal: "3"
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false, message: "", type: "success"
  });

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  const fetchData = useCallback(async (userId: string) => {
    try {
      const data = await DashboardService.fetchAllData(userId);
      setMeasurements(data.measurements);
      setPrograms(data.programs);
      setCalculations(data.calculations);
      setSessions(data.sessions);
      setNutritionLogs(data.nutritionLogs);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/hesap/giris"); return; }
      
      const { data: fetchedProfile, error: profileErr } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      let profileData = fetchedProfile;

      if (profileErr) {
        console.error("Profile Fetch Error (RLS?):", profileErr.message || profileErr);
        setProfileError(profileErr);
      }
      
      // Self-heal: profil yoksa otomatik oluştur (trigger çalışmamış olabilir)
      if (!profileData) {
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Kullanıcı";
        const { error: upsertErr } = await supabase.from("profiles").upsert({
          id: session.user.id,
          full_name: fullName,
          role: "user",
        }, { onConflict: "id" });
        
        if (upsertErr) {
          console.error("Self-heal Upsert Error:", upsertErr.message || upsertErr);
        }

        const { data: newProfile, error: newErr } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (newErr) {
          console.error("After Upsert Fetch Error:", newErr.message || newErr);
        }
        profileData = newProfile;
      }

      if (profileData) {
        setProfile(profileData);
        setNameInput(profileData.full_name || "");
        const avatar = parseAvatarToken(profileData.avatar_url);
        if (avatar) {
          setAvatarEmoji(avatar.emoji);
          setAvatarHue(avatar.hue.id);
        }
      } else {
        const fallbackName = session.user.user_metadata?.full_name || "Sporcu";
        setProfile({ full_name: fallbackName, role: "user" });
        setNameInput(fallbackName);
      }
      
      const savedWeight = localStorage.getItem(`fithub_target_weight_${session.user.id}`);
      const savedCalories = localStorage.getItem(`fithub_target_calories_${session.user.id}`);
      const savedDevelopmentProfile = localStorage.getItem(`fithub_development_profile_${session.user.id}`);
      const startingRoute = localStorage.getItem("fithub_starting_route");
      if (savedWeight) setTargetWeight(savedWeight);
      if (savedCalories) setTargetCalories(savedCalories);
      const remoteDevelopmentProfile = session.user.user_metadata?.development_profile as Partial<DevelopmentProfile> | undefined;
      if (remoteDevelopmentProfile) {
        setDevelopmentProfile(prev => ({ ...prev, ...remoteDevelopmentProfile }));
        if (remoteDevelopmentProfile.targetWeight) setTargetWeight(remoteDevelopmentProfile.targetWeight);
        if (remoteDevelopmentProfile.targetCalories) setTargetCalories(remoteDevelopmentProfile.targetCalories);
      } else if (savedDevelopmentProfile) {
        try {
          setDevelopmentProfile(prev => ({ ...prev, ...JSON.parse(savedDevelopmentProfile) }));
        } catch {
          localStorage.removeItem(`fithub_development_profile_${session.user.id}`);
        }
      } else if (startingRoute) {
        try {
          const parsedRoute = JSON.parse(startingRoute) as { goal?: string; weeklyGoal?: string };
          setDevelopmentProfile(prev => ({
            ...prev,
            goal: parsedRoute.goal || prev.goal,
            weeklyGoal: parsedRoute.weeklyGoal || prev.weeklyGoal,
          }));
        } catch {
          localStorage.removeItem("fithub_starting_route");
        }
      }

      await fetchData(session.user.id);
    } catch (err) { 
      console.warn("Profile fetch warning (offline?):", err); 
    } finally { 
      setLoading(false); 
    }
  }, [router, fetchData]);

  const handleRefresh = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchData(session.user.id);
    } catch (err) {
      console.warn("Refresh error (offline?):", err);
    }
  }, [fetchData]);

  const handleDeleteCalculation = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const { error } = await DashboardService.deleteCalculation(id);
    if (!error) handleRefresh();
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Programı çıkarmak istediğinize emin misiniz?")) return;
    const { error } = await DashboardService.deleteProgram(id);
    if (!error) handleRefresh();
  };

  const handleDeleteMeasurement = async (id: string) => {
    if (!confirm("Ölçümü silmek istediğinize emin misiniz?")) return;
    const { error } = await DashboardService.deleteMeasurement(id);
    if (!error) handleRefresh();
  };

  const handleUpdateProfile = async () => {
    if (!nameInput.trim()) { showToast("İsim alanı boş bırakılamaz.", "error"); return; }
    setIsSavingProfile(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const avatarToken = buildAvatarToken(avatarEmoji, avatarHue);
      const { error } = await DashboardService.updateProfile(session.user.id, nameInput, avatarToken);
      const { error: developmentError } = await DashboardService.updateDevelopmentProfile(developmentProfile, targetWeight, targetCalories);
      localStorage.setItem(`fithub_target_weight_${session.user.id}`, targetWeight);
      localStorage.setItem(`fithub_target_calories_${session.user.id}`, targetCalories);
      localStorage.setItem(`fithub_development_profile_${session.user.id}`, JSON.stringify(developmentProfile));
      if (error || developmentError) {
        showToast("Bu cihazda kaydedildi; bulut eşitlemesi tamamlanamadı.", "error");
      } else {
        showToast("Profil başarıyla güncellendi.");
        setProfile(prev => prev ? { ...prev, full_name: nameInput, avatar_url: avatarToken } : null);
      }
    } catch {
      showToast("Bir hata oluştu.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { error } = await DashboardService.addMeasurement(session.user.id, mForm);
    if (!error) {
      setIsAddingMeasurement(false);
      setMForm({ weight: "", waist: "", hips: "", chest: "", biceps: "", neck: "", shoulder: "", thigh: "" });
      handleRefresh();
      showToast("Ölçüm başarıyla kaydedildi.");
    } else {
      showToast("Ölçüm kaydedilemedi.", "error");
    }
    setLoading(false);
  };

  const handleAddNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const form = e.target as HTMLFormElement;
    const calories = parseInt((form.elements.namedItem('calories') as HTMLInputElement).value);
    const protein = parseInt((form.elements.namedItem('protein') as HTMLInputElement).value);
    const water = parseFloat((form.elements.namedItem('water') as HTMLInputElement).value);

    const { error } = await DashboardService.addNutrition(session.user.id, calories, protein, water);
    if (!error) {
      handleRefresh();
      form.reset();
      showToast("Beslenme kaydı eklendi.");
    } else {
      showToast("Beslenme kaydı eklenemedi.", "error");
    }
    setLoading(false);
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    router.push("/hesap/giris"); 
  };

  const getMuscleDistribution = useCallback(() => {
    const distribution: Record<string, number> = { "Göğüs": 0, "Sırt/Bacak": 0, "Bacak": 0, "Core": 0, "Omuz/Kol": 0 };
    sessions.forEach(session => {
      if (session.title.toLowerCase().includes('hipertrofi')) {
        distribution["Göğüs"] += session.total_volume * 0.3;
        distribution["Sırt/Bacak"] += session.total_volume * 0.4;
        distribution["Omuz/Kol"] += session.total_volume * 0.3;
      } else if (session.title.toLowerCase().includes('pilates')) {
        distribution["Core"] += session.total_volume * 0.7;
        distribution["Bacak"] += session.total_volume * 0.3;
      } else {
        distribution["Bacak"] += session.total_volume * 0.4;
        distribution["Göğüs"] += session.total_volume * 0.3;
        distribution["Sırt/Bacak"] += session.total_volume * 0.3;
      }
    });
    const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(distribution).map(([name, val]) => ({ name, percent: Math.round((val / total) * 100) })).sort((a, b) => b.percent - a.percent);
  }, [sessions]);

  // Bilim skoru — efekt/setState zinciri yerine türetilmiş değer.
  const scienceScore = useMemo(() => {
    let score = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklySessions = sessions.filter(s => new Date(s.completed_at) > oneWeekAgo).length;
    score += Math.min(weeklySessions * 7.5, 30);
    const weeklyNutrition = nutritionLogs.filter(n => new Date(n.log_date) > oneWeekAgo).length;
    score += Math.min(weeklyNutrition * 3, 20);
    const hasWeeklyMeasurement = measurements.some(m => new Date(m.created_at) > oneWeekAgo);
    if (hasWeeklyMeasurement) score += 15;
    const uniqueCalculations = new Set(calculations.map(c => c.type)).size;
    score += Math.min(uniqueCalculations * 5, 15);
    if (sessions.length >= 2) {
      if (sessions[0].total_volume >= sessions[1].total_volume) score += 20;
      else score += 10;
    } else if (sessions.length === 1) score += 15;
    return Math.round(score);
  }, [sessions, measurements, calculations, nutritionLogs]);

  const getAwardedBadges = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const stats = {
      workoutCount: sessions.length,
      totalVolume: sessions.reduce((acc, s) => acc + (Number(s.total_volume) || 0), 0),
      weeklySessions: sessions.filter(s => new Date(s.completed_at) > oneWeekAgo).length,
      uniqueCalculations: new Set(calculations.map(c => c.type)).size,
      scienceScore,
      weeklyNutrition: nutritionLogs.filter(n => new Date(n.log_date) > oneWeekAgo).length,
      weeklyMeasurement: measurements.some(m => new Date(m.created_at) > oneWeekAgo)
    };
    return BADGES_DATA.filter(badge => badge.check(stats));
  }, [sessions, calculations, scienceScore, nutritionLogs, measurements]);

  // Biyometrik rapor + içgörüler — türetilmiş değer (efekt/setState zinciri yok).
  const { biometricReport, aiInsights, assistantChecklist } = useMemo(() => {
    const insights: DashboardInsight[] = [];
    const checklist: string[] = [];

    let height = parseFloat(developmentProfile.height) || 175;
    let gender = developmentProfile.gender || "erkek";
    let age = parseInt(developmentProfile.age) || 25;
    let activity = developmentProfile.activity || "1.55";
    let goal = developmentProfile.goal || "";

    for (const c of calculations) {
      if (c.inputs) {
        if (c.inputs.height && !developmentProfile.height) height = parseFloat(c.inputs.height as string);
        if (c.inputs.gender && !developmentProfile.gender) gender = c.inputs.gender as "erkek" | "kadin";
        if (c.inputs.age && !developmentProfile.age) age = parseInt(c.inputs.age as string);
        if (c.inputs.activity && !developmentProfile.activity) activity = c.inputs.activity as string;
        if (c.inputs.goal && !goal) goal = c.inputs.goal as string;
      }
    }

    if (!goal && programs.length > 0) {
      goal = programs[0].goal || programs[0].title || "";
    }

    const currentWeight = measurements[0]?.weight || (calculations.find(c => c.inputs?.weight)?.inputs.weight as number) || 75;
    const currentWaist = measurements[0]?.waist || 0;
    const currentHips = measurements[0]?.hips || 0;
    const currentNeck = measurements[0]?.neck || 0;

    const hMeters = height / 100;
    const bmiVal = currentWeight / (hMeters * hMeters);
    let bmiStatus = "Normal";
    let bmiClass = "normal";
    let bmiColor = "text-primary";
    let bmiBg = "bg-primary/10";
    let bmiBorder = "border-primary/20";
    let bmiPercent = 50;
    let bmiMessage = "";

    if (bmiVal < 16) {
      bmiStatus = "Ciddi Zayıflık"; bmiClass = "underweight"; bmiColor = "text-rose-400"; bmiBg = "bg-rose-500/10"; bmiBorder = "border-rose-500/20"; bmiPercent = 10;
      bmiMessage = "Kritik düşük BMI."; checklist.push("Kalori alımını acilen artır.");
    } else if (bmiVal < 18.5) {
      bmiStatus = "Hafif Zayıflık"; bmiClass = "underweight"; bmiColor = "text-amber-300"; bmiBg = "bg-amber-500/10"; bmiBorder = "border-amber-500/20"; bmiPercent = 25;
      bmiMessage = "Düşük kilo. Kuvvet antrenmanı ile kas kazanmaya odaklanın.";
    } else if (bmiVal < 25) {
      bmiStatus = "İdeal Ağırlık"; bmiClass = "normal"; bmiColor = "text-primary"; bmiBg = "bg-primary/10"; bmiBorder = "border-primary/20"; bmiPercent = 50;
      bmiMessage = "İdeal sınırlar içerisindesiniz.";
    } else if (bmiVal < 30) {
      bmiStatus = "Fazla Kilolu"; bmiClass = "overweight"; bmiColor = "text-amber-400"; bmiBg = "bg-amber-500/10"; bmiBorder = "border-amber-500/20"; bmiPercent = 65;
      bmiMessage = "Hafif kilo fazlalığı. Hafif kalori açığına yönelmek iyi olur."; checklist.push("İşlenmiş gıdaları sınırla.");
    } else {
      bmiStatus = "Obezite"; bmiClass = "obese1"; bmiColor = "text-rose-500"; bmiBg = "bg-rose-500/10"; bmiBorder = "border-rose-500/20"; bmiPercent = 78;
      bmiMessage = "Kontrollü yağ kaybı ve sürdürülebilir diyet planlaması gereklidir."; checklist.push("Orta yoğunluklu kardiyo planla.");
    }

    let bodyFatVal: number | null = null;
    let lbm = 0; let fatMass = 0;
    if (currentWaist > 0 && currentNeck > 0 && currentWaist > currentNeck) {
      if (gender === "erkek") {
        const bf = 495 / (1.0324 - 0.19077 * Math.log10(currentWaist - currentNeck) + 0.15456 * Math.log10(height)) - 450;
        if (bf > 2 && bf < 60) bodyFatVal = parseFloat(bf.toFixed(1));
      } else if (gender === "kadin" && currentHips > 0) {
        const bf = 495 / (1.29579 - 0.35004 * Math.log10(currentWaist + currentHips - currentNeck) + 0.22100 * Math.log10(height)) - 450;
        if (bf > 2 && bf < 60) bodyFatVal = parseFloat(bf.toFixed(1));
      }
      if (bodyFatVal !== null) {
        lbm = parseFloat((currentWeight * (1 - bodyFatVal / 100)).toFixed(1));
        fatMass = parseFloat((currentWeight - lbm).toFixed(1));
      }
    }

    if (measurements.length >= 2) {
      const weightDiff = measurements[0].weight - measurements[1].weight;
      if (Math.abs(weightDiff) > 0.2) {
        insights.push({ category: "fizik", title: weightDiff > 0 ? "Ağırlık Artışı" : "Ağırlık Azalışı", message: `Son ölçüme göre ağırlığınız ${Math.abs(weightDiff).toFixed(1)} kg ${weightDiff > 0 ? 'arttı' : 'azaldı'}.`, status: "info" });
      }
    }

    const bmr = Math.round(10 * currentWeight + 6.25 * height - 5 * age) + (gender === "erkek" ? 5 : -161);
    const tdee = Math.round(bmr * parseFloat(activity));
    const targetCaloriesValue = parseInt(targetCalories) || (goal === "kilo-verme" ? tdee - 350 : goal === "kas-kazanma" ? tdee + 250 : tdee);
    const latestNutrition = nutritionLogs[0] || null;
    const actualCalories = latestNutrition?.calories || 0;
    const actualProtein = latestNutrition?.protein || 0;
    const actualWater = latestNutrition?.water_liters || 0;
    const proteinTargetGrams = Math.round(currentWeight * (goal === "kas-kazanma" ? 1.9 : 1.6));
    const waterTargetLiters = parseFloat((currentWeight * 0.035).toFixed(1));
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentSessions = sessions.filter(s => new Date(s.completed_at) > oneWeekAgo);
    const previousRecentSessions = sessions.filter(s => {
      const completedAt = new Date(s.completed_at);
      const twoWeeksAgo = new Date(oneWeekAgo);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
      return completedAt <= oneWeekAgo && completedAt > twoWeeksAgo;
    });
    const recentVolume = recentSessions.reduce((acc, session) => acc + (Number(session.total_volume) || 0), 0);
    const previousVolume = previousRecentSessions.reduce((acc, session) => acc + (Number(session.total_volume) || 0), 0);
    const volumeDiff = recentVolume - previousVolume;
    const consistencyScore = recentSessions.length;
    const weeklyGoalValue = parseInt(developmentProfile.weeklyGoal || "3") || 3;
    const consistencyLabel =
      consistencyScore >= weeklyGoalValue
        ? "Hedefte"
        : consistencyScore > 0
          ? "Devam ediyor"
          : "Baslangic";
    const consistencyColor =
      consistencyScore >= weeklyGoalValue
        ? "text-primary"
        : consistencyScore > 0
          ? "text-amber-500"
          : "text-zinc-400";
    const volumeTrend =
      recentSessions.length === 0 && previousRecentSessions.length === 0
        ? "insufficient_data"
        : volumeDiff > 0
          ? "up"
          : volumeDiff < 0
            ? "down"
            : "stable";
    const volumeTrendLabel =
      volumeTrend === "up"
        ? "Yukselen hacim"
        : volumeTrend === "down"
          ? "Azalan hacim"
          : volumeTrend === "stable"
            ? "Dengeli hacim"
            : "Yetersiz veri";
    const volumeTrendColor =
      volumeTrend === "up"
        ? "text-primary"
        : volumeTrend === "down"
          ? "text-amber-500"
          : "text-zinc-400";
    const volumeTrendMessage =
      volumeTrend === "up"
        ? "Son 7 gunluk toplam hacim onceki haftaya gore artmis durumda."
        : volumeTrend === "down"
          ? "Son 7 gunluk toplam hacim onceki haftaya gore daha dusuk."
          : volumeTrend === "stable"
            ? "Antrenman hacmi iki haftada benzer seyrediyor."
            : "Antrenman trendi yorumu icin daha fazla seans gerekli.";
    const calorieDiff = actualCalories - targetCaloriesValue;
    const caloricStatusLabel =
      actualCalories === 0
        ? "Kayit yok"
        : Math.abs(calorieDiff) <= 150
          ? "Hedefe yakin"
          : calorieDiff > 0
            ? "Hedef ustu"
            : "Hedef alti";
    const calorieMessage =
      actualCalories === 0
        ? "Enerji dengesi yorumu icin gunluk beslenme ozeti girilmeli."
        : Math.abs(calorieDiff) <= 150
          ? "Gunluk enerji alimi hedefe yakin seyrediyor."
          : calorieDiff > 0
            ? "Gunluk enerji alimi hedefin belirgin uzerinde."
            : "Gunluk enerji alimi hedefin altinda kalmis.";
    const calorieColor =
      actualCalories === 0
        ? "text-zinc-400"
        : Math.abs(calorieDiff) <= 150
          ? "text-primary"
          : "text-amber-500";

    const report = {
      userProfile: { height, weight: currentWeight, gender, age, activity: parseFloat(activity), goal, lbm, fatMass, bmr, tdee },
      bmi: { value: parseFloat(bmiVal.toFixed(1)), status: bmiStatus, class: bmiClass, percent: bmiPercent, message: bmiMessage, color: bmiColor, bg: bmiBg, border: bmiBorder },
      bodyFat: bodyFatVal !== null ? { value: bodyFatVal } : null,
      whtr: null,
      whr: null,
      energy: {
        bmr,
        tdee,
        targetCalories: targetCaloriesValue,
        actualCalories,
        calorieDiff,
        caloricStatusLabel,
        message: calorieMessage,
        color: calorieColor,
      },
      macros: {
        proteinTargetGrams,
        proteinActualGrams: actualProtein,
        proteinStatusLabel: actualProtein === 0 ? "Kayit yok" : actualProtein >= proteinTargetGrams ? "Hedefte" : "Eksik",
        proteinPerKg: parseFloat((actualProtein / currentWeight).toFixed(2)),
      },
      hydration: {
        waterTargetLiters,
        waterActualLiters: actualWater,
      },
      training: {
        consistencyScore,
        consistencyLabel,
        consistencyColor,
        volumeTrend,
        volumeTrendLabel,
        volumeTrendColor,
        volumeTrendMessage,
        volumeDiff,
        strengthToWeightRatio: null,
      }
    };

    return {
      biometricReport: report,
      assistantChecklist: checklist.slice(0, 4),
      aiInsights: insights.length
        ? insights
        : [{ category: "genel", title: "Laboratuvar Aktif", message: "Verileriniz analiz ediliyor.", status: "info" }],
    };
  }, [calculations, measurements, programs, developmentProfile, nutritionLogs, sessions, targetCalories]);

  const profileCompletion = useMemo(() => {
    const required = [developmentProfile.age, developmentProfile.height, developmentProfile.gender, developmentProfile.goal, targetWeight];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [developmentProfile, targetWeight]);

  useEffect(() => {
    const task = window.setTimeout(() => { void getProfile(); }, 0);
    return () => window.clearTimeout(task);
  }, [getProfile]);

  return {
    activeTab, setActiveTab,
    loading,
    profile, setProfile, profileError,
    measurements, programs, calculations, sessions, nutritionLogs,
    scienceScore, aiInsights, assistantChecklist, biometricReport,
    isAddingMeasurement, setIsAddingMeasurement,
    selectedChartMetric, setSelectedChartMetric,
    isCorrelationMode, setIsCorrelationMode,
    correlationMetricB, setCorrelationMetricB,
    mForm, setMForm,
    nameInput, setNameInput,
    avatarEmoji, setAvatarEmoji,
    avatarHue, setAvatarHue,
    isSavingProfile,
    targetWeight, setTargetWeight,
    targetCalories, setTargetCalories,
    developmentProfile, setDevelopmentProfile, profileCompletion,
    toast, showToast,
    handleRefresh, handleDeleteCalculation, handleDeleteProgram, handleDeleteMeasurement,
    handleUpdateProfile, handleAddMeasurement, handleAddNutrition, handleLogout,
    getMuscleDistribution, getAwardedBadges
  };
}

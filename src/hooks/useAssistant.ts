import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { processAssistantQuery as processAssistantQueryEngine } from "@/lib/assistantEngine";
import { DashboardService } from "@/services/dashboard.service";
import { ProfileData, Measurement, UserProgram, SavedCalculation, WorkoutSession, NutritionLog, BiometricReport } from "@/types/dashboard";

export interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  action?: { label: string; tab: string; isRoute?: boolean };
  timestamp: Date;
  unmatched?: boolean;
}

const CHAT_STORAGE_PREFIX = "fithub_chat_";

function loadPersistedChat(userId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_PREFIX + userId);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    // Tarihleri canlandır + son 50 mesajı tut.
    return parsed.slice(-50).map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

export function useAssistant() {
  const { session, status: authStatus } = useAuthSession();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantTab, setAssistantTab] = useState<"sohbet" | "genel" | "biyometri" | "beslenme" | "antrenman">("sohbet");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [programs, setPrograms] = useState<UserProgram[]>([]);
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);

  const [scienceScore, setScienceScore] = useState(0);
  const [assistantChecklist, setAssistantChecklist] = useState<string[]>([]);
  const [biometricReport, setBiometricReport] = useState<BiometricReport | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const loadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleToggle = () => setIsAssistantOpen(prev => !prev);
    window.addEventListener("toggle-global-assistant", handleToggle);
    return () => window.removeEventListener("toggle-global-assistant", handleToggle);
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
    setLoadingData(true);
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile({ full_name: "Sporcu", role: "user" });
      }

      const data = await DashboardService.fetchAllData(userId);
      setMeasurements(data.measurements);
      setPrograms(data.programs);
      setCalculations(data.calculations);
      setSessions(data.sessions);
      setNutritionLogs(data.nutritionLogs);

    } catch (err) {
      console.error("Global assistant data fetch error:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "loading") return;

    if (session) {
      if (loadedUserIdRef.current === session.user.id) return;
      loadedUserIdRef.current = session.user.id;
      const task = window.setTimeout(() => {
        setChatMessages(loadPersistedChat(session.user.id));
        void fetchUserData(session.user.id);
      }, 0);
      return () => window.clearTimeout(task);
    }

    loadedUserIdRef.current = null;
    const task = window.setTimeout(() => {
      setProfile(null);
      setMeasurements([]);
      setPrograms([]);
      setSessions([]);
      setNutritionLogs([]);
      setCalculations([]);
      setScienceScore(0);
      setBiometricReport(null);
      setAssistantChecklist([]);
      setChatMessages([]);
      setAssistantTab("sohbet");
    }, 0);
    return () => window.clearTimeout(task);
  }, [authStatus, fetchUserData, session]);

  // Sohbeti kullanıcıya özel olarak sakla (kapatma/gezinme sonrası sürsün).
  useEffect(() => {
    if (session && chatMessages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_PREFIX + session.user.id, JSON.stringify(chatMessages.slice(-50)));
      } catch {
        /* storage dolu/erişilemez — sessizce geç */
      }
    }
  }, [chatMessages, session]);

  useEffect(() => {
    if (!session) return;

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
    
    const calculatedScore = Math.round(score);
    setTimeout(() => setScienceScore(calculatedScore), 0);

    let height = 175;
    let gender = "erkek";
    let age = 25;
    let activity = "1.55";
    let goal = "";

    for (const c of calculations) {
      if (c.inputs) {
        if (c.inputs.height && height === 175) height = parseFloat(c.inputs.height as string);
        if (c.inputs.gender && gender === "erkek") gender = c.inputs.gender as string;
        if (c.inputs.age && age === 25) age = parseInt(c.inputs.age as string);
        if (c.inputs.activity && activity === "1.55") activity = c.inputs.activity as string;
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
    let bmiMessage = "Vücut ağırlığınız boyunuza göre ideal sınırlar içerisindedir.";

    if (bmiVal < 18.5) {
      bmiStatus = "Zayıf";
      bmiClass = "underweight";
      bmiColor = "text-amber-400";
      bmiBg = "bg-amber-500/10";
      bmiBorder = "border-amber-500/20";
      bmiPercent = 25;
      bmiMessage = "Kilonuz ideal aralığın altındadır. Sağlıklı kas kazanımı hedeflemelisiniz.";
    } else if (bmiVal >= 25 && bmiVal < 30) {
      bmiStatus = "Kilolu";
      bmiClass = "overweight";
      bmiColor = "text-amber-400";
      bmiBg = "bg-amber-500/10";
      bmiBorder = "border-amber-500/20";
      bmiPercent = 65;
      bmiMessage = "Hafif kilo fazlanız bulunuyor. Yağ yakımı ve aktif egzersiz önerilir.";
    } else if (bmiVal >= 30) {
      bmiStatus = "Obezite";
      bmiClass = "obese";
      bmiColor = "text-rose-500";
      bmiBg = "bg-rose-500/10";
      bmiBorder = "border-rose-500/20";
      bmiPercent = 85;
      bmiMessage = "Klinik düzeyde kilo yüksekliği. Kalp ve eklem sağlığı için kalori kontrolü şarttır.";
    }

    let bodyFatVal: number | null = null;
    let bodyFatStatus: string | null = null;
    let bodyFatColor = "text-zinc-400";
    const bodyFatBg = "bg-white/5";
    const bodyFatBorder = "border-white/5";
    let bodyFatMessage: string | null = null;
    let lbm = 0;
    let fatMass = 0;

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
        
        if (gender === "erkek") {
          if (bodyFatVal < 14) {
            bodyFatStatus = "Atletik";
            bodyFatColor = "text-primary";
            bodyFatMessage = "Mükemmel vücut yağ oranı. Kas belirginliğiniz üst seviyede.";
          } else if (bodyFatVal < 25) {
            bodyFatStatus = "Ortalama";
            bodyFatColor = "text-amber-400";
            bodyFatMessage = "Sağlıklı limitlerdesiniz. Kas tonusu için yağ oranını %15'e çekebilirsiniz.";
          } else {
            bodyFatStatus = "Yüksek Yağ";
            bodyFatColor = "text-rose-400";
            bodyFatMessage = "Sağlıksız seviyede yağ kütlesi. Diyet ve kardiyo programı yapmalısınız.";
          }
        } else {
          if (bodyFatVal < 21) {
            bodyFatStatus = "Atletik";
            bodyFatColor = "text-primary";
            bodyFatMessage = "Mükemmel kas tonusu ve düşük yağ oranı.";
          } else if (bodyFatVal < 32) {
            bodyFatStatus = "Ortalama";
            bodyFatColor = "text-amber-400";
            bodyFatMessage = "Kadınlar için sağlıklı bir vücut kompozisyonu.";
          } else {
            bodyFatStatus = "Yüksek Yağ";
            bodyFatColor = "text-rose-400";
            bodyFatMessage = "Karın ve kalça bölgesi yağlanması yüksek. Kalori açığı önerilir.";
          }
        }
      }
    }

    let whtrVal: number | null = null;
    let whtrStatus: string | null = null;
    let whtrColor = "text-zinc-400";
    let whtrMessage: string | null = null;
    if (currentWaist > 0) {
      whtrVal = currentWaist / height;
      if (whtrVal < 0.5) {
        whtrStatus = "Optimal / Sağlıklı";
        whtrColor = "text-primary";
        whtrMessage = "İç organ yağlanması (viseral) düşük ve sağlıklıdır.";
      } else {
        whtrStatus = "Artmış Risk";
        whtrColor = "text-rose-400";
        whtrMessage = "Abdominal bölgede yağlanma. Bel çevresini inceltmelisiniz.";
      }
    }

    let bmr = Math.round(10 * currentWeight + 6.25 * height - 5 * age);
    if (gender === "erkek") bmr += 5; else bmr -= 161;
    const tdee = Math.round(bmr * parseFloat(activity));
    let targetCalories = tdee;
    
    const isBulking = goal.toLowerCase().includes("kas") || goal.toLowerCase().includes("hacim") || goal.toLowerCase().includes("bulk") || goal.toLowerCase().includes("hipertrofi");
    const isCutting = goal.toLowerCase().includes("yag") || goal.toLowerCase().includes("kilo") || goal.toLowerCase().includes("definasyon") || goal.toLowerCase().includes("cut");

    if (isBulking) targetCalories = tdee + 300;
    else if (isCutting) targetCalories = tdee - 450;

    const latestNut = nutritionLogs[0];
    const actualCalories = latestNut?.calories || 0;
    const calorieDiff = actualCalories - targetCalories;
    let caloricStatusLabel = "Denge";
    if (actualCalories > 0) {
      if (actualCalories - tdee > 150) caloricStatusLabel = "Kalori Fazlası";
      else if (actualCalories - tdee < -150) caloricStatusLabel = "Kalori Açığı";
    }

    const actualProtein = latestNut?.protein || 0;
    const proteinTargetGrams = Math.round(currentWeight * 1.8);
    const proteinPerKg = currentWeight > 0 ? parseFloat((actualProtein / currentWeight).toFixed(2)) : 0;
    let proteinStatusLabel = "Yetersiz";
    if (proteinPerKg >= 1.4) proteinStatusLabel = "Optimal";

    const actualWater = latestNut?.water_liters || 0;
    const waterTargetLiters = parseFloat((currentWeight * 0.035).toFixed(1));

    let volumeTrend = 'insufficient_data';
    let volumeTrendLabel = "Veri Yetersiz";
    let volumeTrendColor = "text-zinc-500";
    let volumeTrendMessage = "Aşamalı overload analizi için en az 3 antrenman kaydı gereklidir.";
    let volumeDiff = 0;
    let strengthToWeightRatio: number | null = null;

    if (sessions.length >= 3) {
      const latestVol = Number(sessions[0].total_volume) || 0;
      const prevVolAvg = ((Number(sessions[1].total_volume) || 0) + (Number(sessions[2].total_volume) || 0)) / 2;
      volumeDiff = latestVol - prevVolAvg;

      if (currentWeight > 0 && latestVol > 0) {
        strengthToWeightRatio = parseFloat((latestVol / currentWeight).toFixed(1));
      }

      if (volumeDiff > latestVol * 0.05) {
        volumeTrend = 'overload';
        volumeTrendLabel = "Aşamalı Aşırı Yüklenme (Optimal)";
        volumeTrendColor = "text-primary";
        volumeTrendMessage = `Harika! Son seans hacminiz önceki ortalamanızdan %${((volumeDiff / prevVolAvg) * 100).toFixed(0)} daha yüksek.`;
      } else if (volumeDiff < -latestVol * 0.05) {
        volumeTrend = 'plateau';
        volumeTrendLabel = "Plateau / Hacim Düşüşü";
        volumeTrendColor = "text-rose-400";
        volumeTrendMessage = `Son antrenman hacminiz ortalamanın gerisinde kaldı. CNS yorgunluğu olabilir.`;
      } else {
        volumeTrend = 'maintenance';
        volumeTrendLabel = "Stabil Hacim";
        volumeTrendColor = "text-amber-400";
        volumeTrendMessage = `Hacminiz stabil seyrediyor. Yeni gelişim için direnci artırın.`;
      }
    }

    const report = {
      userProfile: { height, weight: currentWeight, gender, age, activity: parseFloat(activity), goal, lbm, fatMass },
      bmi: { value: parseFloat(bmiVal.toFixed(1)), status: bmiStatus, class: bmiClass, percent: bmiPercent, message: bmiMessage, color: bmiColor, bg: bmiBg, border: bmiBorder },
      bodyFat: bodyFatVal !== null ? { value: bodyFatVal, status: bodyFatStatus, message: bodyFatMessage, color: bodyFatColor, bg: bodyFatBg, border: bodyFatBorder } : null,
      whtr: whtrVal !== null ? { value: parseFloat(whtrVal.toFixed(2)), status: whtrStatus, message: whtrMessage, color: whtrColor } : null,
      energy: actualCalories > 0 ? { bmr, tdee, targetCalories, actualCalories, calorieDiff, caloricStatusLabel, message: "", color: "text-primary" } : null,
      macros: actualProtein > 0 ? { proteinTargetGrams, proteinActualGrams: actualProtein, proteinStatusLabel, proteinPerKg } : null,
      hydration: actualWater > 0 ? { waterTargetLiters, waterActualLiters: actualWater } : null,
      training: { consistencyScore: weeklySessions, consistencyLabel: weeklySessions >= 3 ? "Optimal" : "Yetersiz", volumeTrend, volumeTrendLabel, volumeTrendColor, volumeTrendMessage, volumeDiff, strengthToWeightRatio }
    };

    const checklist: string[] = [];
    if (calculatedScore < 80) {
      if (measurements.length === 0) checklist.push("Analizlerin başlaması için ilk vücut ölçümünü gir.");
      if (nutritionLogs.length === 0) checklist.push("Kalori durumunu izlemek için bugünkü beslenmeni kaydet.");
      if (weeklySessions === 0) checklist.push("Aktif gelişim sinyalleri için bu hafta antrenman kaydı ekle.");
      if (uniqueCalculations < 3) checklist.push("Biyometrik durumunu tam anlamak için vkí, kalori ve makro hesaplarını tamamla.");
    } else {
      checklist.push("Mükemmel disiplin! Günlük kalori/protein dengesini korumaya devam edin.");
      checklist.push("Bir sonraki antrenmanda set arası dinlenmeyi optimize et.");
    }
    const task = window.setTimeout(() => {
      setBiometricReport(report);
      setAssistantChecklist(checklist.slice(0, 4));
    }, 0);
    return () => window.clearTimeout(task);

  }, [session, sessions, measurements, calculations, nutritionLogs, programs]);

  useEffect(() => {
    let initialMessage: ChatMessage | null = null;
    if (session && profile && chatMessages.length === 0) {
      initialMessage = {
        sender: "assistant",
        text: `Merhaba ${profile.full_name?.split(' ')[0] || "Sporcu"}. Ölçüm, beslenme ve antrenman kayıtlarına göre kısa ve uygulanabilir öneriler sunabilirim.\n\nBaşlamak için “Bugün ne yapmalıyım?” diye sorabilirsin.`,
        timestamp: new Date()
      };
    } else if (authStatus === "anonymous" && !session && chatMessages.length === 0) {
      initialMessage = {
        sender: "assistant",
        text: "Kişisel öneriler verebilmem için hesabındaki ölçüm ve antrenman kayıtlarına erişmem gerekir. Giriş yaptıktan sonra sana özel bir özet hazırlayabilirim.",
        action: { label: "Giriş yap veya hesap oluştur", tab: "/hesap/giris", isRoute: true },
        timestamp: new Date()
      };
    }
    if (!initialMessage) return;
    const task = window.setTimeout(() => setChatMessages([initialMessage]), 0);
    return () => window.clearTimeout(task);
  }, [authStatus, session, profile, chatMessages.length]);

  useEffect(() => {
    const container = chatScrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [chatMessages, isAssistantOpen, assistantTab, isTyping]);

  const processAssistantQuery = useCallback((text: string): ChatMessage => {
    return processAssistantQueryEngine(text, biometricReport, profile, measurements, assistantChecklist, scienceScore);
  }, [biometricReport, profile, measurements, assistantChecklist, scienceScore]);

  // Motor route'una gönderilecek kompakt biyometrik bağlam.
  const buildContext = useCallback(() => {
    const up = biometricReport?.userProfile;
    return {
      name: profile?.full_name,
      scienceScore,
      weight: up?.weight,
      height: up?.height,
      age: up?.age,
      gender: up?.gender,
      goal: up?.goal,
      bmi: biometricReport?.bmi ? { value: biometricReport.bmi.value, status: biometricReport.bmi.status } : undefined,
      bodyFat: biometricReport?.bodyFat ? { value: biometricReport.bodyFat.value, status: biometricReport.bodyFat.status } : null,
      training: biometricReport?.training
        ? { consistencyScore: biometricReport.training.consistencyScore, volumeTrendLabel: biometricReport.training.volumeTrendLabel }
        : undefined,
    };
  }, [biometricReport, profile, scienceScore]);

  // SentezMotoru destekli yanıt; anahtar yoksa/hata olursa null döner (yerel fallback kullanılır).
  const askAI = useCallback(async (text: string, history: ChatMessage[]): Promise<string | null> => {
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: buildContext(),
          history: history.slice(-8).map((m) => ({ role: m.sender, text: m.text })),
        }),
      });
      const data = await res.json();
      return typeof data?.text === "string" ? data.text : null;
    } catch {
      return null;
    }
  }, [buildContext]);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;

    if (authStatus === "loading") return;

    if (!session) {
      setChatMessages(prev => [
        ...prev,
        { sender: "user", text, timestamp: new Date() },
        {
          sender: "assistant",
          text: "Üzgünüm, mesajlarınıza cevap verebilmem ve biyometrik verilerinizi analiz edebilmem için sisteme giriş yapmalısınız! 🔐",
          action: { label: "Giriş Yap / Üye Ol", tab: "/hesap/giris", isRoute: true },
          timestamp: new Date()
        }
      ]);
      setChatInput("");
      return;
    }

    const userMsg: ChatMessage = { sender: "user", text, timestamp: new Date() };
    const historySnapshot = [...chatMessages, userMsg];
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // 1) Yerel motor: bilinen 50 konu için anında, çevrimdışı, deterministik yanıt (+ aksiyon butonu).
    const local = processAssistantQuery(text);

    if (!local.unmatched) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, local]);
        setIsTyping(false);
      }, 450);
      return;
    }

    // 2) Eşleşme yok → SentezMotoru Motor'a sor (biyometrik bağlamla). Başarısızsa yerel fallback mesajı.
    (async () => {
      const aiText = await askAI(text, historySnapshot);
      setChatMessages(prev => [
        ...prev,
        aiText
          ? { sender: "assistant", text: aiText, timestamp: new Date() }
          : local,
      ]);
      setIsTyping(false);
    })();
  }, [authStatus, session, isTyping, chatMessages, processAssistantQuery, askAI]);

  return {
    isAssistantOpen, setIsAssistantOpen,
    assistantTab, setAssistantTab,
    session, authStatus, profile, loadingData,
    scienceScore, assistantChecklist, biometricReport,
    chatMessages, chatInput, setChatInput, chatScrollRef,
    isTyping,
    handleSendMessage
  };
}

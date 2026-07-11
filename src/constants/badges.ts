import { Award, Zap, Flame, Activity, ShieldCheck, Trophy } from "lucide-react";
import { BadgeStats } from "@/types";

export const BADGES_DATA = [
  {
    id: "first_workout",
    title: "İlk Kıvılcım",
    desc: "Sistemde ilk antrenmanını tamamla.",
    icon: Zap,
    color: "text-amber-500",
    check: (stats: BadgeStats) => stats.workoutCount >= 1
  },
  {
    id: "volume_1000",
    title: "1 Ton Kulübü",
    desc: "Toplam kaldırılan hacim 1000 kg'a ulaştı.",
    icon: Trophy,
    color: "text-primary",
    check: (stats: BadgeStats) => stats.totalVolume >= 1000
  },
  {
    id: "consistency_3",
    title: "Disiplin Abidesi",
    desc: "Son 7 günde 3 veya daha fazla antrenman yap.",
    icon: Flame,
    color: "text-red-500",
    check: (stats: BadgeStats) => stats.weeklySessions >= 3
  },
  {
    id: "scientist",
    title: "Veri Bilimci",
    desc: "3 farklı bilimsel analiz kaydet.",
    icon: Activity,
    color: "text-secondary",
    check: (stats: BadgeStats) => stats.uniqueCalculations >= 3
  },
  {
    id: "elite_score",
    title: "Elit Atlet",
    desc: "Science-Score 90 ve üzerine ulaşsın.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    check: (stats: BadgeStats) => stats.scienceScore >= 90
  },
  {
    id: "perfect_week",
    title: "Kusursuz Hafta",
    desc: "Bir hafta içinde hem antrenman hem beslenme hem ölçüm verisi gir.",
    icon: Award,
    color: "text-purple-500",
    check: (stats: BadgeStats) => stats.weeklySessions >= 1 && stats.weeklyNutrition >= 1 && stats.weeklyMeasurement
  }
];

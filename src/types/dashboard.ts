// DB satır tipleri tek kaynaktan (types/index.ts) yeniden dışa aktarılır;
// burada yalnızca dashboard'a özgü türetilmiş/görünüm tipleri tanımlanır.
export type {
  Measurement,
  UserProgram,
  SavedCalculation,
  WorkoutSession,
  NutritionLog,
} from "./index";

export interface ProfileData {
  full_name: string;
  role: string;
  avatar_url?: string | null;
}

export interface DevelopmentProfile {
  age: string;
  height: string;
  gender: "" | "erkek" | "kadin";
  activity: string;
  goal: string;
  weeklyGoal: string;
  targetWeight?: string;
  targetCalories?: string;
}

/** Dashboard'da gösterilen türetilmiş içgörü kartı. */
export interface DashboardInsight {
  category: string;
  title: string;
  message: string;
  status: string;
}

/**
 * Kullanıcının ölçüm + hesaplama verilerinden türetilen biyometrik rapor.
 * Asistan paneli ve dashboard bu yapıyı tüketir. Veri yetersizse alt bölümler null olur.
 */
export interface BiometricReport {
  userProfile: {
    height: number;
    weight: number;
    gender: string;
    age: number;
    activity: number;
    goal: string;
    lbm: number;
    fatMass: number;
    bmr?: number;
    tdee?: number;
  };
  bmi: {
    value: number; status: string; class: string; percent: number;
    message: string; color: string; bg: string; border: string;
  };
  bodyFat: { value: number; status?: string | null; message?: string | null; color?: string | null; bg?: string | null; border?: string | null } | null;
  whtr: { value: number; status?: string | null; message?: string | null; color?: string | null } | null;
  whr?: { value: number; status?: string | null; message?: string | null; color?: string | null } | null;
  energy: {
    bmr: number; tdee: number; targetCalories: number; actualCalories: number;
    calorieDiff: number; caloricStatusLabel: string; message: string; color: string;
  } | null;
  macros: { proteinTargetGrams: number; proteinActualGrams: number; proteinStatusLabel: string; proteinPerKg: number } | null;
  hydration: { waterTargetLiters: number; waterActualLiters: number } | null;
  training: {
    consistencyScore: number; consistencyLabel: string; consistencyColor?: string;
    volumeTrend: string; volumeTrendLabel: string; volumeTrendColor: string; volumeTrendMessage: string;
    volumeDiff?: number | null; strengthToWeightRatio?: number | null;
  };
}

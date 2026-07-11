/**
 * Saf hesaplama (Model) katmanı.
 *
 * Supabase / DOM / React bağımlılığı YOKTUR — her metot deterministik bir
 * girdi → çıktı dönüşümüdür ve izole test edilebilir. Sunum kararları
 * (Tailwind renkleri, Türkçe etiketler, ikonlar) bu katmana ait değildir;
 * onları ilgili `useXCalculator` ViewModel hook'u eşler.
 *
 * Sayfalardaki (View) hesaplama mantığı buraya taşınır; böylece formüller
 * tek bir kaynakta toplanır ve View ince kalır.
 */

export type Gender = "erkek" | "kadin";

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export interface BmiResult {
  /** Vücut Kitle Endeksi (kg/m²), 1 ondalık. */
  value: number;
  category: BmiCategory;
  /** 0–100 arası gösterge çubuğu konumu. */
  percent: number;
}

export type RiskLevel = "low" | "medium" | "high";

export interface RatioResult {
  /** Oran, 2 ondalık. */
  value: number;
  level: RiskLevel;
}

export type WhtrCategory = "lean" | "healthy" | "overweight" | "obese";

export interface WhtrResult {
  value: number;
  category: WhtrCategory;
}

export type Goal = "koruma" | "kilo-verme" | "kas-kazanma";
export type ProteinRatio = "dusuk" | "orta" | "yuksek";

export interface EnergyResult {
  /** Bazal Metabolizma Hızı (kcal). */
  bmr: number;
  /** Toplam Günlük Enerji Harcaması (kcal). */
  tdee: number;
}

export interface MacroResult {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  proteinPerKg: number;
}

export interface HeartRateZone {
  /** 1–5 yoğunluk seviyesi. */
  level: number;
  /** Alt sınır (BPM). */
  low: number;
  /** Üst sınır (BPM). */
  high: number;
}

export interface HeartRateResult {
  maxHr: number;
  zones: HeartRateZone[];
}

export interface BodyCompositionResult {
  bodyFatPercent: number;
  fatMassKg: number;
  leanMassKg: number;
}

export type PlateStatus = "success" | "only-bar" | "underweight" | "residual";

export interface PlatePlan {
  /** Barın TEK yanına takılacak plakalar. */
  needed: { weight: number; count: number }[];
  /** İki yanda yerleştirilemeyen toplam artık ağırlık (kg). */
  residual: number;
  status: PlateStatus;
}

export class CalculationsService {
  /**
   * Vücut Kitle Endeksi (BMI) — WHO yetişkin sınıflandırması.
   * @param weightKg Kilo (kg)
   * @param heightCm Boy (cm)
   */
  static bmi(weightKg: number, heightCm: number): BmiResult {
    const h = heightCm / 100;
    const raw = h > 0 ? weightKg / (h * h) : 0;
    const value = parseFloat(raw.toFixed(1));

    let category: BmiCategory;
    let percent: number;

    if (raw < 18.5) {
      category = "underweight";
      percent = Math.min((raw / 18.5) * 25, 25);
    } else if (raw < 25) {
      category = "normal";
      percent = 25 + ((raw - 18.5) / 6.5) * 25;
    } else if (raw < 30) {
      category = "overweight";
      percent = 50 + ((raw - 25) / 5) * 25;
    } else {
      category = "obese";
      percent = 75 + Math.min(((raw - 30) / 10) * 25, 25);
    }

    return { value, category, percent: Math.round(percent) };
  }

  /**
   * İdeal kilo — Devine formülü. 152.4 cm (5 ft) altında hedef-BMI'ye düşer.
   * @returns İdeal ağırlık (kg), 1 ondalık.
   */
  static idealWeight(heightCm: number, gender: Gender): number {
    let ideal: number;
    if (heightCm < 152.4) {
      const hMeters = heightCm / 100;
      const targetBmi = gender === "erkek" ? 22.0 : 21.7;
      ideal = targetBmi * (hMeters * hMeters);
    } else {
      const inchesOver5Foot = heightCm / 2.54 - 60;
      ideal = (gender === "erkek" ? 50 : 45.5) + 2.3 * inchesOver5Foot;
    }
    return parseFloat(ideal.toFixed(1));
  }

  /** Bel-Kalça oranı (WHR) — cinsiyete göre risk eşikleri. */
  static waistHipRatio(waistCm: number, hipCm: number, gender: Gender): RatioResult {
    const raw = hipCm > 0 ? waistCm / hipCm : 0;
    const [mid, high] = gender === "erkek" ? [0.9, 1.0] : [0.8, 0.85];
    let level: RiskLevel;
    if (raw < mid) level = "low";
    else if (raw < high) level = "medium";
    else level = "high";
    return { value: parseFloat(raw.toFixed(2)), level };
  }

  /** Bel-Boy oranı (WHtR) — WHO sınır çizgileri (0.40 / 0.50 / 0.60). */
  static waistHeightRatio(waistCm: number, heightCm: number): WhtrResult {
    const raw = heightCm > 0 ? waistCm / heightCm : 0;
    let category: WhtrCategory;
    if (raw < 0.4) category = "lean";
    else if (raw < 0.5) category = "healthy";
    else if (raw < 0.6) category = "overweight";
    else category = "obese";
    return { value: parseFloat(raw.toFixed(2)), category };
  }

  /**
   * US Navy çevre ölçümü denklemiyle vücut yağ oranı tahmini.
   * Klinik tanı değildir; ölçüm tekniğine duyarlı bir saha tahminidir.
   */
  static bodyComposition(weightKg: number, heightCm: number, waistCm: number, neckCm: number, gender: Gender, hipCm?: number): BodyCompositionResult | null {
    if ([weightKg, heightCm, waistCm, neckCm].some(v => !Number.isFinite(v) || v <= 0) || waistCm <= neckCm) return null;
    let density: number;
    if (gender === "erkek") {
      density = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
    } else {
      if (!hipCm || hipCm <= 0 || waistCm + hipCm <= neckCm) return null;
      density = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm);
    }
    const rawBodyFat = 495 / density - 450;
    if (!Number.isFinite(rawBodyFat) || rawBodyFat < 2 || rawBodyFat > 65) return null;
    const bodyFatPercent = Number(rawBodyFat.toFixed(1));
    const fatMassKg = Number((weightKg * bodyFatPercent / 100).toFixed(1));
    return { bodyFatPercent, fatMassKg, leanMassKg: Number((weightKg - fatMassKg).toFixed(1)) };
  }

  /** Bazal Metabolizma Hızı — Mifflin-St Jeor denklemi (kcal). */
  static bmr(weightKg: number, heightCm: number, age: number, gender: Gender): number {
    const raw = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "erkek" ? 5 : -161);
    return Math.round(raw);
  }

  /**
   * Enerji metabolizması — BMR (Mifflin-St Jeor) + aktivite faktörüyle TDEE.
   * TDEE yuvarlanmamış BMR üzerinden hesaplanır (tek yuvarlama).
   */
  static energy(weightKg: number, heightCm: number, age: number, gender: Gender, activityFactor: number): EnergyResult {
    const rawBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "erkek" ? 5 : -161);
    return { bmr: Math.round(rawBmr), tdee: Math.round(rawBmr * activityFactor) };
  }

  /**
   * Makro besin dağılımı. Hedefe göre kalori ayarlanır (kilo-verme −500,
   * kas-kazanma +300); protein tercihi enerji oranını belirler (yağ sabit %25).
   */
  static macros(tdee: number, weightKg: number, goal: Goal, proteinRatio: ProteinRatio): MacroResult {
    const safeTdee = Math.max(800, tdee);
    const safeWeight = Math.max(30, weightKg);
    const calorieMultiplier = goal === "kilo-verme" ? 0.85 : goal === "kas-kazanma" ? 1.1 : 1;
    const calories = Math.round(safeTdee * calorieMultiplier);

    // ISSN aralığıyla uyumlu ağırlık-temelli hedefler: 1.4–2.0 g/kg/gün.
    const proteinPerKg = proteinRatio === "dusuk" ? 1.4 : proteinRatio === "yuksek" ? 2 : 1.6;
    const protein = Math.round(safeWeight * proteinPerKg);
    const fat = Math.round((calories * 0.25) / 9);
    const remainingCalories = Math.max(0, calories - protein * 4 - fat * 9);

    return {
      calories,
      protein,
      fat,
      carbs: Math.round(remainingCalories / 4),
      proteinPerKg,
    };
  }

  /**
   * Günlük su ihtiyacı (litre) — kg başına 0.033 L + her 30 dk egzersiz için 0.5 L.
   */
  static waterIntake(weightKg: number, activityMinutes: number): number {
    const base = weightKg * 0.033;
    const extra = (activityMinutes / 30) * 0.5;
    return parseFloat((base + extra).toFixed(1));
  }

  /** Tahmini 1RM — Brzycki formülü (1–12 tekrar aralığında en doğru). */
  static oneRepMax(weightKg: number, reps: number): number {
    if (reps >= 37) return 0;
    return Math.round(weightKg * (36 / (37 - reps)));
  }

  /**
   * Hedef nabız bölgeleri — maxHR için Tanaka (208 − 0.7·yaş),
   * bölgeler için Karvonen (HR rezervi) yöntemi.
   */
  static heartRateZones(age: number, restHr: number): HeartRateResult {
    const maxHr = 208 - 0.7 * age;
    const reserve = maxHr - restHr;
    const bounds = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const zones: HeartRateZone[] = [];
    for (let i = 0; i < 5; i++) {
      zones.push({
        level: i + 1,
        low: Math.round(restHr + reserve * bounds[i]),
        high: Math.round(restHr + reserve * bounds[i + 1]),
      });
    }
    return { maxHr: Math.round(maxHr), zones };
  }

  /**
   * Plaka yükleme — hedef ağırlığı barın iki yanına eşit dağıtır.
   * Standart plakalar: 25, 20, 15, 10, 5, 2.5, 1.25 kg.
   */
  static platesPerSide(targetWeightKg: number, barWeightKg: number): PlatePlan {
    const totalPlatesWeight = targetWeightKg - barWeightKg;
    if (totalPlatesWeight < 0) return { needed: [], residual: 0, status: "underweight" };
    if (totalPlatesWeight === 0) return { needed: [], residual: 0, status: "only-bar" };

    let remaining = totalPlatesWeight / 2;
    const available = [25, 20, 15, 10, 5, 2.5, 1.25];
    const needed: { weight: number; count: number }[] = [];

    for (const plate of available) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        needed.push({ weight: plate, count });
        remaining = parseFloat((remaining - count * plate).toFixed(2));
      }
    }

    const residual = parseFloat((remaining * 2).toFixed(2));
    return { needed, residual, status: residual > 0 ? "residual" : "success" };
  }

  /** Antrenman hacmi (Volume Load) — set × tekrar × ağırlık. Negatif girdiler 0'a indirgenir. */
  static volumeLoad(sets: number, reps: number, weightKg: number): number {
    return Math.max(0, sets) * Math.max(0, reps) * Math.max(0, weightKg);
  }

  /**
   * Kardiyo kalori harcaması — MET formülü: (MET × 3.5 × kg) / 200 × dakika.
   */
  static cardioCalories(met: number, weightKg: number, durationMinutes: number): number {
    return Math.round((met * 3.5 * weightKg) / 200 * durationMinutes);
  }
}

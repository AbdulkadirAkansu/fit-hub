import { useMemo, useState } from "react";
import { CalculationsService, type BmiCategory } from "@/services/calculations.service";

/** VKİ ekranının tükettiği, sunuma hazır sonuç. */
export interface VkiViewResult {
  vki: number;
  status: string;
  color: string;
  percent: number;
}

/** Kategori → sunum eşlemesi (etiket + renk). Sunum kararı ViewModel'e aittir. */
const BMI_DISPLAY: Record<BmiCategory, { status: string; color: string }> = {
  underweight: { status: "DÜŞÜK KİLO", color: "text-amber-500" },
  normal: { status: "İDEAL SEVİYE", color: "text-primary" },
  overweight: { status: "FAZLA KİLO", color: "text-amber-500" },
  obese: { status: "OBEZİTE RİSKİ", color: "text-rose-500" },
};

/**
 * VKİ hesaplama ViewModel'i.
 * Girdi state'ini tutar, Model (CalculationsService) ile türetir ve
 * View'a sunuma hazır `result` döndürür. Hesaplama içermeyen ince View hedeflenir.
 */
export function useVkiCalculator(initialWeight = 75, initialHeight = 175) {
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);

  const result = useMemo<VkiViewResult>(() => {
    const { value, category, percent } = CalculationsService.bmi(weight, height);
    return { vki: value, percent, ...BMI_DISPLAY[category] };
  }, [weight, height]);

  return { weight, setWeight, height, setHeight, result };
}

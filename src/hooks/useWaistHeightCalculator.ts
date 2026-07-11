import { useMemo, useState } from "react";
import { CalculationsService, type WhtrCategory } from "@/services/calculations.service";

export interface WaistHeightViewResult {
  ratio: number;
  status: string;
  color: string;
  desc: string;
}

/** WHtR kategorisi → sunum eşlemesi. */
const WHTR_DISPLAY: Record<WhtrCategory, { status: string; color: string; desc: string }> = {
  lean: { status: "ZAYIF", color: "text-amber-500", desc: "Bel çevreniz boyunuza göre oldukça düşük." },
  healthy: { status: "SAĞLIKLI", color: "text-primary", desc: "İdeal yağ dağılımı ve düşük metabolik risk." },
  overweight: { status: "KİLOLU", color: "text-amber-500", desc: "Abdominal yağlanma riskli seviyeye yaklaşıyor." },
  obese: { status: "OBEZ", color: "text-rose-500", desc: "Yüksek abdominal yağlanma ve sağlık riski." },
};

/** Bel-Boy oranı (WHtR) ViewModel'i. */
export function useWaistHeightCalculator(initialWaist = 85, initialHeight = 175) {
  const [waist, setWaist] = useState(initialWaist);
  const [height, setHeight] = useState(initialHeight);

  const result = useMemo<WaistHeightViewResult>(() => {
    const { value, category } = CalculationsService.waistHeightRatio(waist, height);
    return { ratio: value, ...WHTR_DISPLAY[category] };
  }, [waist, height]);

  return { waist, setWaist, height, setHeight, result };
}

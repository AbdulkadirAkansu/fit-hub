import { useMemo, useState } from "react";
import { CalculationsService, type Gender, type RiskLevel } from "@/services/calculations.service";

export interface WaistHipViewResult {
  ratio: number;
  status: string;
  color: string;
  riskLevel: string;
}

/** Risk seviyesi → sunum eşlemesi (etiket + renk + açıklama). */
const RISK_DISPLAY: Record<RiskLevel, { status: string; color: string; riskLevel: string }> = {
  low: { status: "DÜŞÜK RİSK", color: "text-primary", riskLevel: "Sağlıklı yağ dağılımı." },
  medium: { status: "ORTA RİSK", color: "text-amber-500", riskLevel: "Dikkat edilmesi gereken seviye." },
  high: { status: "YÜKSEK RİSK", color: "text-rose-500", riskLevel: "Abdominal yağlanma riski yüksek." },
};

/** Bel-Kalça oranı (WHR) ViewModel'i. */
export function useWaistHipCalculator(initialWaist = 85, initialHip = 100, initialGender: Gender = "erkek") {
  const [waist, setWaist] = useState(initialWaist);
  const [hip, setHip] = useState(initialHip);
  const [gender, setGender] = useState<Gender>(initialGender);

  const result = useMemo<WaistHipViewResult>(() => {
    const { value, level } = CalculationsService.waistHipRatio(waist, hip, gender);
    return { ratio: value, ...RISK_DISPLAY[level] };
  }, [waist, hip, gender]);

  return { waist, setWaist, hip, setHip, gender, setGender, result };
}

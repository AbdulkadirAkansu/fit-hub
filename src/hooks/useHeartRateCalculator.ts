import { useMemo, useState } from "react";
import { Activity, Flame, Zap, Target, Shield, type LucideIcon } from "lucide-react";
import { CalculationsService } from "@/services/calculations.service";

export interface HeartRateZoneView {
  zone: string;
  range: string;
  desc: string;
  color: string;
  icon: LucideIcon;
}

/** Seviye (1–5) → sunum eşlemesi (etiket, açıklama, renk, ikon). */
const ZONE_META: Omit<HeartRateZoneView, "range">[] = [
  { zone: "Bölge 1 (Toparlanma)", desc: "Hafif aktivite ve ısınma.", color: "text-primary", icon: Activity },
  { zone: "Bölge 2 (Yağ Yakımı)", desc: "Maksimum yağ yakım alanı.", color: "text-primary", icon: Flame },
  { zone: "Bölge 3 (Aerobik)", desc: "Kardiyovasküler kapasite artışı.", color: "text-primary", icon: Zap },
  { zone: "Bölge 4 (Anaerobik)", desc: "Hız ve dayanıklılık geliştirme.", color: "text-primary", icon: Target },
  { zone: "Bölge 5 (Maksimum)", desc: "Kısa süreli patlayıcı güç.", color: "text-primary", icon: Shield },
];

/** Hedef nabız bölgeleri ViewModel'i (Tanaka + Karvonen). */
export function useHeartRateCalculator(initialAge = 25, initialRestHr = 65) {
  const [age, setAge] = useState(initialAge);
  const [restHR, setRestHR] = useState(initialRestHr);

  const result = useMemo<HeartRateZoneView[]>(() => {
    const { zones } = CalculationsService.heartRateZones(age, restHR);
    return zones.map((z) => ({
      ...ZONE_META[z.level - 1],
      range: `${z.low} - ${z.high} BPM`,
    }));
  }, [age, restHR]);

  return { age, setAge, restHR, setRestHR, result };
}

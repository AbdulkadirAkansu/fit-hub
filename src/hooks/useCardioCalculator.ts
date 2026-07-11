import { useMemo, useState } from "react";
import { CalculationsService } from "@/services/calculations.service";

export interface CardioActivity {
  id: string;
  label: string;
  met: number;
  desc: string;
}

/** Kardiyo aktivite kataloğu (MET değerleri — domain config). */
export const CARDIO_ACTIVITIES: CardioActivity[] = [
  { id: "kosu-yavas", label: "KOŞU (YAVAŞ)", met: 8, desc: "8 km/sa hızda koşu" },
  { id: "kosu-orta", label: "KOŞU (ORTA)", met: 11.5, desc: "10-12 km/sa hızda koşu" },
  { id: "kosu-hizli", label: "KOŞU (HIZLI)", met: 15, desc: "15+ km/sa hızda koşu" },
  { id: "yuruyus-orta", label: "YÜRÜYÜŞ", met: 3.5, desc: "5 km/sa tempolu yürüyüş" },
  { id: "bisiklet-orta", label: "BİSİKLET", met: 8, desc: "20 km/sa hızda sürüş" },
  { id: "yuzme-orta", label: "YÜZME", met: 7, desc: "Orta tempo serbest stil" },
  { id: "hiit", label: "HIIT / CROSSFIT", met: 12, desc: "Yüksek yoğunluklu antrenman" },
  { id: "ip-atlama", label: "İP ATLAMA", met: 10, desc: "Orta tempo sürekli" },
];

/** Kardiyo kalori ViewModel'i. */
export function useCardioCalculator() {
  const [weight, setWeight] = useState(75);
  const [duration, setDuration] = useState(30);
  const [selectedActivity, setSelectedActivity] = useState<CardioActivity>(CARDIO_ACTIVITIES[1]);

  const result = useMemo(
    () => CalculationsService.cardioCalories(selectedActivity.met, weight, duration),
    [selectedActivity, weight, duration]
  );

  return {
    weight, setWeight,
    duration, setDuration,
    selectedActivity, setSelectedActivity,
    activities: CARDIO_ACTIVITIES,
    result,
  };
}

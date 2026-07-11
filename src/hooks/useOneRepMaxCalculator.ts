import { useMemo, useState } from "react";
import { CalculationsService } from "@/services/calculations.service";

export interface OneRepMaxPercentage {
  label: string;
  value: number;
  desc: string;
}

/** 1RM ViewModel'i. Brzycki 1RM + yaygın çalışma yüzdeleri (presentation). */
export function useOneRepMaxCalculator(initialWeight = 80, initialReps = 5) {
  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(initialReps);

  const result = useMemo(() => CalculationsService.oneRepMax(weight, reps), [weight, reps]);

  const percentages = useMemo<OneRepMaxPercentage[]>(
    () => [
      { label: "100% (1RM)", value: result, desc: "Maksimum Güç" },
      { label: "85%", value: Math.round(result * 0.85), desc: "Güç/Hipertrofi" },
      { label: "75%", value: Math.round(result * 0.75), desc: "Hipertrofi" },
      { label: "65%", value: Math.round(result * 0.65), desc: "Dayanıklılık" },
    ],
    [result]
  );

  return { weight, setWeight, reps, setReps, result, percentages };
}

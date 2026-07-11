import { useMemo, useState } from "react";
import { CalculationsService } from "@/services/calculations.service";

/** Günlük su ihtiyacı ViewModel'i. `glasses` (200 ml bardak) türetilir. */
export function useWaterCalculator() {
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState(30);

  const result = useMemo(() => CalculationsService.waterIntake(weight, activity), [weight, activity]);
  const glasses = useMemo(() => Math.round(result * 5), [result]);

  return { weight, setWeight, activity, setActivity, result, glasses };
}

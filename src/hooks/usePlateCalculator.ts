import { useMemo, useState } from "react";
import { CalculationsService, type PlatePlan } from "@/services/calculations.service";

/** Plaka yükleme ViewModel'i. */
export function usePlateCalculator(initialTarget = 100, initialBar = 20) {
  const [targetWeight, setTargetWeight] = useState(initialTarget);
  const [barWeight, setBarWeight] = useState(initialBar);

  const result = useMemo<PlatePlan>(
    () => CalculationsService.platesPerSide(targetWeight, barWeight),
    [targetWeight, barWeight]
  );

  return { targetWeight, setTargetWeight, barWeight, setBarWeight, result };
}

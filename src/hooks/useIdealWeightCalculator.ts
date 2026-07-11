import { useMemo, useState } from "react";
import { CalculationsService, type Gender } from "@/services/calculations.service";

/**
 * İdeal kilo ViewModel'i. Devine formülünü Model'den türetir; View yalnızca
 * `result` (kg) ve ±4 kg sağlıklı aralığı görüntüler.
 */
export function useIdealWeightCalculator(initialHeight = 175, initialGender: Gender = "erkek") {
  const [height, setHeight] = useState(initialHeight);
  const [gender, setGender] = useState<Gender>(initialGender);

  const result = useMemo(() => CalculationsService.idealWeight(height, gender), [height, gender]);

  /** Sağlıklı aralık (±4 kg), sunuma hazır string. */
  const range = useMemo(
    () => `${(result - 4).toFixed(1)} - ${(result + 4).toFixed(1)}`,
    [result]
  );

  return { height, setHeight, gender, setGender, result, range };
}

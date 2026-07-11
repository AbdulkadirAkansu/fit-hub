import { useMemo, useState } from "react";
import { CalculationsService, type Gender } from "@/services/calculations.service";

export function useBodyCompositionCalculator() {
  const [gender, setGender] = useState<Gender>("erkek");
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [waist, setWaist] = useState(85);
  const [neck, setNeck] = useState(38);
  const [hip, setHip] = useState(100);
  const result = useMemo(
    () => CalculationsService.bodyComposition(weight, height, waist, neck, gender, hip),
    [weight, height, waist, neck, gender, hip]
  );
  return { gender, setGender, weight, setWeight, height, setHeight, waist, setWaist, neck, setNeck, hip, setHip, result };
}

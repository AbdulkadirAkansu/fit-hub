import { useMemo, useState } from "react";
import { CalculationsService, type Goal, type MacroResult, type ProteinRatio } from "@/services/calculations.service";

/** Makro besin dağılımı ViewModel'i. */
export function useMacroCalculator() {
  const [goal, setGoal] = useState<Goal>("koruma");
  const [proteinRatio, setProteinRatio] = useState<ProteinRatio>("orta");
  const [tdee, setTdee] = useState(2500);
  const [weight, setWeight] = useState(75);

  const result = useMemo<MacroResult>(
    () => CalculationsService.macros(tdee, weight, goal, proteinRatio),
    [tdee, weight, goal, proteinRatio]
  );

  return { goal, setGoal, proteinRatio, setProteinRatio, tdee, setTdee, weight, setWeight, result };
}

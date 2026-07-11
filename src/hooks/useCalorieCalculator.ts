import { useMemo, useState } from "react";
import { CalculationsService, type EnergyResult, type Gender } from "@/services/calculations.service";

/**
 * Kalori (enerji metabolizması) ViewModel'i — BMR + TDEE.
 * `activity` select bileşeniyle uyumlu olması için string tutulur; Model'e
 * sayıya çevrilerek geçilir.
 */
export function useCalorieCalculator() {
  const [gender, setGender] = useState<Gender>("erkek");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState("1.55");

  const result = useMemo<EnergyResult>(
    () => CalculationsService.energy(weight, height, age, gender, parseFloat(activity)),
    [weight, height, age, gender, activity]
  );

  return { gender, setGender, age, setAge, height, setHeight, weight, setWeight, activity, setActivity, result };
}

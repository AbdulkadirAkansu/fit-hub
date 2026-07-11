import { useMemo, useState } from "react";
import { CalculationsService } from "@/services/calculations.service";

export interface VolumeExercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
  weight: string;
  vol: number;
}

const newRow = (): VolumeExercise => ({ id: Date.now(), name: "", sets: "3", reps: "10", weight: "60", vol: 0 });

/**
 * Antrenman hacmi ViewModel'i. Egzersiz listesini yönetir (ekle/sil/güncelle)
 * ve toplam Volume Load'ı Model üzerinden türetir.
 */
export function useVolumeCalculator() {
  const [exercises, setExercises] = useState<VolumeExercise[]>([
    { id: 1, name: "", sets: "3", reps: "10", weight: "60", vol: 0 },
  ]);

  const result = useMemo(() => {
    const detail = exercises.map((ex) => ({
      ...ex,
      vol: CalculationsService.volumeLoad(parseFloat(ex.sets) || 0, parseFloat(ex.reps) || 0, parseFloat(ex.weight) || 0),
    }));
    const total = detail.reduce((sum, ex) => sum + ex.vol, 0);
    return { total, detail };
  }, [exercises]);

  const addExercise = () => setExercises((prev) => [...prev, newRow()]);

  const removeExercise = (id: number) =>
    setExercises((prev) => (prev.length > 1 ? prev.filter((ex) => ex.id !== id) : prev));

  const updateExercise = (index: number, field: keyof VolumeExercise, value: string) => {
    setExercises((prev) => {
      const next = [...prev];
      let parsed = value;
      if (field === "sets" || field === "reps" || field === "weight") {
        if (parseFloat(value) < 0) parsed = "0";
      }
      next[index] = { ...next[index], [field]: parsed };
      return next;
    });
  };

  return { exercises, result, addExercise, removeExercise, updateExercise };
}

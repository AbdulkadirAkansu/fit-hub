import { supabase } from "@/lib/supabase";
import {
  Measurement,
  UserProgram,
  SavedCalculation,
  WorkoutSession,
  NutritionLog
} from "@/types/dashboard";
import type { DevelopmentProfile } from "@/types/dashboard";

/** Ölçüm formundan gelen ham (string) girdiler. */
export type MeasurementInput = {
  weight?: string;
  waist?: string;
  hips?: string;
  chest?: string;
  biceps?: string;
  neck?: string;
  shoulder?: string;
  thigh?: string;
};

export class DashboardService {
  /**
   * Kullanıcının dashboard verilerini toplu olarak çeker.
   */
  static async fetchAllData(userId: string) {
    const [mRes, pRes, cRes, sRes, nRes] = await Promise.all([
      supabase.from('measurements').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('user_programs').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('saved_calculations').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('workout_sessions').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(10),
      supabase.from('nutrition_logs').select('*').eq('user_id', userId).order('log_date', { ascending: false }).limit(7)
    ]);

    return {
      measurements: (mRes.data || []) as Measurement[],
      programs: (pRes.data || []) as UserProgram[],
      calculations: (cRes.data || []) as SavedCalculation[],
      sessions: (sRes.data || []) as WorkoutSession[],
      nutritionLogs: (nRes.data || []) as NutritionLog[]
    };
  }

  static async deleteCalculation(id: string) {
    return supabase.from('saved_calculations').delete().eq('id', id);
  }

  static async deleteProgram(id: string) {
    return supabase.from('user_programs').delete().eq('id', id);
  }

  static async deleteMeasurement(id: string) {
    return supabase.from('measurements').delete().eq('id', id);
  }

  static async updateProfile(userId: string, fullName: string, avatarToken?: string | null) {
    const patch: Record<string, string | null> = {
      full_name: fullName,
      updated_at: new Date().toISOString(),
    };
    if (avatarToken !== undefined) patch.avatar_url = avatarToken;
    return supabase.from('profiles').update(patch).eq('id', userId);
  }

  static async updateDevelopmentProfile(data: DevelopmentProfile, targetWeight: string, targetCalories: string) {
    return supabase.auth.updateUser({ data: { development_profile: { ...data, targetWeight, targetCalories } } });
  }

  static async addMeasurement(userId: string, data: MeasurementInput) {
    // Boş/geçersiz string → null (NUMERIC kolonları temiz tutar).
    const num = (v?: string) => {
      const n = parseFloat(v ?? "");
      return Number.isNaN(n) ? null : n;
    };
    return supabase.from('measurements').insert([{
      user_id: userId,
      weight: num(data.weight),
      waist: num(data.waist),
      hips: num(data.hips),
      chest: num(data.chest),
      biceps: num(data.biceps),
      neck: num(data.neck),
      shoulder: num(data.shoulder),
      thigh: num(data.thigh)
    }]);
  }

  static async addNutrition(userId: string, calories: number, protein: number, water_liters: number) {
    return supabase.from('nutrition_logs').upsert(
      {
        user_id: userId,
        calories,
        protein,
        water_liters,
        log_date: new Date().toISOString().split('T')[0]
      },
      // Günde tek kayıt: (user_id, log_date) çakışmasında mevcut satırı günceller.
      { onConflict: 'user_id,log_date' }
    );
  }
}

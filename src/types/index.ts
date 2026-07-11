import type { LucideIcon } from "lucide-react";

/** JSONB kolonları için (saved_calculations.result, programs.schedule vb.). */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  role: 'admin' | 'user';
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description?: string;
  category: string;
  content: string;
  image_url?: string;
  author: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  target_muscle: string;
  difficulty: string;
  equipment: string;
  image_url?: string;
  category: string;
  instructions: string;
  steps?: string[] | Record<string, unknown>[];
  biomechanics?: string;
  breathing?: string;
  risk_factors?: string;
  created_at?: string;
}

export interface WorkoutItem {
  name: string;
  sets: string;
  reps: string;
  rest?: string;
}

export interface Program {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  days_per_week: number;
  image: string;
  desc: string;
  scientific_rationale?: string;
  progressive_overload_tip?: string;
  workout: WorkoutItem[];
  created_at?: string;
}

export interface CustomExercise {
  name: string;
  sets: string;
  reps: string;
  rest?: string;
}

export interface CustomDay {
  day: string;
  type: string;
  status: 'Antrenman' | 'Dinlenme';
  exercises: CustomExercise[];
}

export interface CustomProgram {
  title: string;
  location: string;
  schedule: CustomDay[];
}

/** Kullanıcının kaydettiği kişisel program (user_programs tablosu). */
export interface UserProgram {
  id: string;
  user_id?: string;
  title: string;
  goal: string;
  level: string;
  location: string;
  schedule: CustomDay[];
  created_at: string;
}

export interface Measurement {
  id: string;
  user_id: string;
  weight: number;
  neck?: number;
  shoulder?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thigh?: number;
  created_at: string;
}

export interface SavedCalculation {
  id: string;
  user_id: string;
  type: string;
  result: Record<string, unknown>;
  inputs: Record<string, unknown>;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  title: string;
  duration: number;
  total_volume: number;
  completed_at: string;
}

export interface WorkoutLog {
  id: string;
  session_id: string;
  exercise_name: string;
  set_number: number;
  reps: number;
  weight: number;
  is_completed: boolean;
  created_at?: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  water_liters: number;
  log_date: string;
}

export interface ScientificReference {
  title: string;
  description: string;
  formula: string;
  source: string;
  link: string;
}

export interface BadgeStats {
  workoutCount: number;
  totalVolume: number;
  weeklySessions: number;
  uniqueCalculations: number;
  scienceScore: number;
  weeklyNutrition: number;
  weeklyMeasurement: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  condition: string;
  color: string;
  check: (stats: BadgeStats) => boolean;
}

export type ScheduleDay = CustomDay;

/** site_settings tablosu (global admin kontrolleri). */
export interface SiteSettings {
  id?: string;
  maintenance_mode: boolean;
  announcement_text: string;
  announcement_active: boolean;
  announcement_type?: string;
  updated_at?: string;
}

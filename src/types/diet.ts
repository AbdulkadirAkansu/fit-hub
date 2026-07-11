/** Diyet planlayıcı domain tipleri (Model katmanı tarafından üretilir/tüketilir). */

export type DietMainCategory = "protein" | "carb" | "fat";
export type BudgetTier = "ekonomik" | "standart" | "premium";
export type DietStyle = "klasik" | "vejetaryen" | "keto";
export type DietGoal = "kilo-verme" | "koruma" | "kas-kazanma";
export type Allergen = "gluten" | "lactose" | "nuts" | "fish";

export interface Food {
  name: string;
  mainCategory: DietMainCategory;
  protein: number; // 100g başına
  carb: number; // 100g başına
  fat: number; // 100g başına
  calories: number; // 100g başına
  unit: string;
  allergens: string[]; // 'gluten', 'lactose', 'nuts', 'fish'
  tags: string[]; // 'meat', 'dairy', 'egg', 'veg', 'keto-friendly'
  budgetTier: BudgetTier;
}

export interface PortionResult {
  food: Food;
  grams: number;
}

export interface Meal {
  name: string;
  time: string;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  caloriesTarget: number;
  items: PortionResult[];
  recipe: string;
}

export interface DailyPlan {
  day: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

/** Plan üretimi için kullanıcı girdileri (View state'inden derlenir). */
export interface DietPlanInputs {
  gender: string;
  age: number;
  height: number;
  weight: number;
  activity: string;
  goal: string;
  dietStyle: string;
  mealCount: number;
  budgetPreference: BudgetTier;
  allergens: string[];
}

/** Üretilen 7 günlük plan + bilimsel analiz. Motor ve yerel motor aynı şekli döndürür. */
export interface DietPlanResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  weeklyPlan: DailyPlan[];
  scientificAnalysis: {
    waterTarget: string;
    fiberTarget: number;
    timingTip: string;
    supplements: string[];
  };
}

/** Giriş yapmış kullanıcıdan otomatik doldurma için çekilen varsayılanlar. */
export interface DietUserDefaults {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activity?: string;
  goal?: string;
}

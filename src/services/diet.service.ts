import { supabase } from "@/lib/supabase";
import { FOODS } from "@/constants/foods";
import type {
  BudgetTier,
  DailyPlan,
  DietMainCategory,
  DietPlanInputs,
  DietPlanResult,
  DietUserDefaults,
  Food,
  Meal,
  PortionResult,
} from "@/types/diet";

/**
 * Diyet planlama Model katmanı.
 *
 * Saf plan üretim mantığı (porsiyon çözücü, gıda filtresi, tarif derleyici,
 * 7 günlük yerel motor) + Motor uç noktası çağrısı + giriş yapmış kullanıcı
 * varsayılanlarının çekilmesi. UI state'i ViewModel'e (useDietPlanner) aittir.
 */
export class DietService {
  /** Öğüne göre bilimsel pişirme/tarif açıklaması derler (saf). */
  static compileRecipe(proteinName: string, carbName: string, fatName: string, mealName: string): string {
    const p = proteinName.toLowerCase();
    const c = carbName ? carbName.toLowerCase() : "";
    const f = fatName ? fatName.toLowerCase() : "";

    if (mealName.includes("Kahvaltı")) {
      if (p.includes("yumurta") && (c.includes("yulaf") || c.includes("tam buğday"))) {
        return "Yulafı su veya bitkisel süt ile lapa kıvamına getirin. Yumurtaları protein yapısını bozmadan rafadan haşlama veya teflon tavada peçete ile silinmiş çok az yağda (poşe tarzı) pişirin. Yağ kaynağınızı (zeytin/tohum) kahvaltı tabağınıza garnitür olarak ekleyin.";
      }
      if (p.includes("tofu") || p.includes("bezelye") || p.includes("çökelek")) {
        return "Tofuyu veya çökeleği karabiber, zerdeçal ve kekik ile soteleyerek (scramble) hazırlayın. Karbonhidrat kaynağı eşliğinde glisemik indeksi dengelemek için bol yeşillik ve salatalıkla servis edin.";
      }
      if (p.includes("lor") && c.includes("karabuğday")) {
        return "Karabuğdayı (greçka) haşlayın, suyunu çektikten sonra lor peyniri, maydanoz ve az karabiber ile harmanlayarak fonksiyonel bir öğün elde edin.";
      }
      return "Kahvaltılık malzemelerinizi, glisemik yükü düşük tutmak adına mevsim yeşillikleri ile zenginleştirerek tüketin. Yağ kaynaklarını (zeytin, badem vs.) çiğ olarak ekleyin.";
    }

    if (mealName.includes("Ara Öğün")) {
      if (f.includes("fıstık") || f.includes("badem") || f.includes("ceviz") || f.includes("kabak") || f.includes("kaju")) {
        return `Sağlıklı yağ kaynağınızı kavrulmamış (çiğ) olarak tüketin ki omega ve faydalı asit zincirleri bozulmasın. Lif oranı yüksek olan meyveleri porsiyon kontrolü dahilinde çiğnemek sindirimi rahatlatır.`;
      }
      return "Bu ara öğünü metabolizmayı yormadan, sindirimi kolay ve glisemik dalgalanma yaratmayacak formda yavaş çiğneyerek tüketin.";
    }

    let desc = "";
    if (p.includes("tavuk") || p.includes("biftek") || p.includes("hindi") || p.includes("kuzu") || p.includes("antrikot")) {
      desc += "Proteini besin değerini kaybetmemesi için airfryer'da (180 derece) veya döküm tavada mühürleyerek (içi sulu kalacak şekilde) pişirin. Asla derinden yağda kızartmayın. ";
    } else if (p.includes("somon") || p.includes("levrek") || p.includes("ton") || p.includes("çipura") || p.includes("kalamar")) {
      desc += "Omega-3 zincirini kırmamak için balığı fırında 170 derecede folyoya sararak ya da buharda, taze biberiye ve limon dilimleriyle pişirin. ";
    } else if (p.includes("tofu") || p.includes("tempeh") || p.includes("mercimek")) {
      desc += "Bitkisel protein kaynağını, sindirimi kolaylaştırmak için ılık suda bekleterek asitliğini alın ve az su ile ağır ateşte pişirin. ";
    } else {
      desc += "Protein kaynağını aşırı ısıya maruz bırakmadan fırında veya ızgarada hazırlayın. ";
    }

    if (c.includes("pirinç") || c.includes("kinoa") || c.includes("karabuğday") || c.includes("bulgur") || c.includes("amarant")) {
      desc += `Karbonhidrat kaynağını kavurmadan, direkt kaynar su ilave ederek haşlama (absorpsiyon) yöntemiyle pişirin. Bu durum dirençli nişasta oranını artırır. `;
    } else if (c.includes("patates") || c.includes("nohut")) {
      desc += `Glisemik indeksi düşürmek için patatesi haşladıktan sonra soğumaya bırakıp tüketebilir veya airfryer'da yağsız elma dilimi şeklinde pişirebilirsiniz. `;
    }

    if (f.includes("zeytinyağı") || f.includes("avokado yağı")) {
      desc += "Soğuk sıkım yağı, dumanlanma noktasına (oksidasyon) ulaşmaması için asla pişirmeyin; yemeğiniz tabaktayken çiğ olarak üzerine gezdirin. ";
    } else if (f.includes("avokado") || f.includes("zeytin")) {
      desc += "Avokadoyu limon sıkarak oksidasyonu önleyin ve yemeğinize lif kaynağı olarak dahil edin. ";
    } else if (f !== "") {
      desc += "Yağ kaynağını (tohum/kuruyemiş) yemeğin üzerine serperek veya yanında bütün formda çiğ olarak tüketin. ";
    }

    desc += "Mikrobiyota sağlığı için her ana öğünün yanında limonlu ve sirkeli (yağsız) bol lifli yeşil salata tüketmeyi ihmal etmeyin.";
    return desc;
  }

  /** Hedef makrolara göre porsiyonları üst sınırlarla (cap) çözen sezgisel çözücü (saf). */
  static solveMealPortions(
    pTarget: number,
    cTarget: number,
    fTarget: number,
    proteinFood: Food,
    carbFood: Food | null,
    fatFood: Food,
    dietStyle: string
  ): PortionResult[] {
    let w_prot = Math.round((pTarget / proteinFood.protein) * 100);

    let maxProtWeight = 250; // et/balık için varsayılan
    if (proteinFood.name.includes("Lor Peyniri") || proteinFood.name.includes("Tofu") || proteinFood.name.includes("Tempeh")) {
      maxProtWeight = 200;
    } else if (proteinFood.name.includes("Yumurta")) {
      maxProtWeight = 150; // ~3 yumurta
    } else if (proteinFood.name.includes("Proteini")) {
      maxProtWeight = 50; // toz protein max 50g
    }
    w_prot = Math.max(20, Math.min(maxProtWeight, w_prot));

    const c_from_prot = (w_prot * proteinFood.carb) / 100;
    const f_from_prot = (w_prot * proteinFood.fat) / 100;

    let w_carb = 0;
    let p_from_carb = 0;
    let f_from_carb = 0;

    if (carbFood && dietStyle !== "keto") {
      const remainingCarb = Math.max(0, cTarget - c_from_prot);
      w_carb = Math.round((remainingCarb / carbFood.carb) * 100);

      let maxCarbWeight = 200; // pirinç/tahıl için varsayılan
      if (carbFood.name.includes("Patates")) {
        maxCarbWeight = 300;
      } else if (carbFood.name.includes("Muz")) {
        maxCarbWeight = 150;
      }
      w_carb = Math.max(0, Math.min(maxCarbWeight, w_carb));

      p_from_carb = (w_carb * carbFood.protein) / 100;
      f_from_carb = (w_carb * carbFood.fat) / 100;

      if (p_from_carb > 2) {
        const adjustedPTarget = Math.max(5, pTarget - p_from_carb);
        w_prot = Math.round((adjustedPTarget / proteinFood.protein) * 100);
        w_prot = Math.max(20, Math.min(maxProtWeight, w_prot));
      }
    }

    const remainingFat = Math.max(0, fTarget - f_from_prot - f_from_carb);
    let w_fat = Math.round((remainingFat / fatFood.fat) * 100);

    let maxFatWeight = 30; // yağlar için varsayılan
    if (fatFood.name.includes("Avokado")) {
      maxFatWeight = 150;
    } else if (
      fatFood.name.includes("Fıstığı") ||
      fatFood.name.includes("Badem") ||
      fatFood.name.includes("Ceviz") ||
      fatFood.name.includes("Çekirdeği") ||
      fatFood.name.includes("Ezmesi")
    ) {
      maxFatWeight = 50;
    }
    w_fat = Math.max(0, Math.min(maxFatWeight, w_fat));

    const results: PortionResult[] = [{ food: proteinFood, grams: w_prot }];

    if (carbFood && w_carb > 0 && dietStyle !== "keto") {
      results.push({ food: carbFood, grams: w_carb });
    }

    if (w_fat > 0) {
      results.push({ food: fatFood, grams: w_fat });
    }

    return results;
  }

  /** mainCategory'yi katı şekilde uygulayan, alerjen/diyet/bütçe filtreli gıda seçici (saf). */
  static getFilteredFood(
    category: DietMainCategory,
    dayIndex: number,
    style: string,
    allgns: string[],
    budget: BudgetTier
  ): Food {
    let candidates = FOODS.filter((food) => {
      if (food.mainCategory !== category) return false;

      const hasAllergen = food.allergens.some((a) => allgns.includes(a));
      if (hasAllergen) return false;

      if (style === "vejetaryen" && food.tags.includes("meat")) return false;
      if (style === "keto" && !food.tags.includes("keto-friendly")) return false;

      if (budget === "ekonomik") {
        if (food.budgetTier !== "ekonomik") return false;
      } else if (budget === "standart") {
        if (food.budgetTier === "premium") return false;
      }

      return true;
    });

    // Aday yoksa: bütçe/keto kısıtını gevşet (alerjen + vejetaryen korunur).
    if (candidates.length === 0) {
      candidates = FOODS.filter((food) => {
        if (food.mainCategory !== category) return false;
        const hasAllergen = food.allergens.some((a) => allgns.includes(a));
        if (hasAllergen) return false;
        if (style === "vejetaryen" && food.tags.includes("meat")) return false;
        return true;
      });
    }

    // Son çare: yalnızca kategoriye göre (kategori sızıntısı olmaması garanti).
    if (candidates.length === 0) {
      candidates = FOODS.filter((f) => f.mainCategory === category);
    }

    // Gün/kategori bazlı asal sayı hash'i ile çeşitli dağılım.
    const hash = dayIndex * 17 + (category === "protein" ? 3 : category === "carb" ? 7 : 11);
    const idx = hash % candidates.length;
    return candidates[idx] || candidates[0];
  }

  /** Biyometri + tercihlere göre 7 günlük bilimsel plan üretir (saf, deterministik). */
  static generateLocalPlan(inputs: DietPlanInputs): DietPlanResult {
    const { gender, age, height, weight, activity, goal, dietStyle, mealCount, budgetPreference, allergens } = inputs;

    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += gender === "erkek" ? 5 : -161;

    const tdee = Math.round(bmr * parseFloat(activity));
    let targetCalories = tdee;
    if (goal === "kilo-verme") targetCalories = Math.max(1200, Math.round(tdee - 500));
    if (goal === "kas-kazanma") targetCalories = Math.round(tdee + 350);

    const proteinGrams = Math.round(weight * 2.1);
    let fatGrams = 0;
    let carbGrams = 0;

    if (dietStyle === "keto") {
      carbGrams = 30;
      const pKcal = proteinGrams * 4;
      const cKcal = carbGrams * 4;
      const remainingKcal = Math.max(400, targetCalories - pKcal - cKcal);
      fatGrams = Math.round(remainingKcal / 9);
    } else {
      const fatKcal = targetCalories * 0.25;
      fatGrams = Math.round(fatKcal / 9);
      const remainingKcal = targetCalories - proteinGrams * 4 - fatKcal;
      carbGrams = Math.round(remainingKcal / 4);
    }

    const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const weeklyPlan: DailyPlan[] = [];

    days.forEach((day, dayIdx) => {
      const meals: Meal[] = [];
      let fractions: number[] = [];
      let mealNames: { name: string; time: string }[] = [];

      if (mealCount === 3) {
        fractions = [0.3, 0.4, 0.3];
        mealNames = [
          { name: "Kahvaltı", time: "08:30" },
          { name: "Öğle Yemeği", time: "13:00" },
          { name: "Akşam Yemeği", time: "19:00" },
        ];
      } else if (mealCount === 4) {
        fractions = [0.25, 0.35, 0.1, 0.3];
        mealNames = [
          { name: "Kahvaltı", time: "08:30" },
          { name: "Öğle Yemeği", time: "13:00" },
          { name: "Ara Öğün", time: "16:30" },
          { name: "Akşam Yemeği", time: "19:00" },
        ];
      } else {
        fractions = [0.25, 0.1, 0.3, 0.1, 0.25];
        mealNames = [
          { name: "Kahvaltı", time: "08:30" },
          { name: "1. Ara Öğün", time: "11:00" },
          { name: "Öğle Yemeği", time: "14:00" },
          { name: "2. Ara Öğün", time: "17:00" },
          { name: "Akşam Yemeği", time: "20:00" },
        ];
      }

      mealNames.forEach((mInfo, mealIdx) => {
        const frac = fractions[mealIdx];
        const pTarget = proteinGrams * frac;
        const cTarget = carbGrams * frac;
        const fTarget = fatGrams * frac;
        const calTarget = targetCalories * frac;

        const pFood = this.getFilteredFood("protein", dayIdx + mealIdx, dietStyle, allergens, budgetPreference);
        const cFood = this.getFilteredFood("carb", dayIdx + mealIdx + 1, dietStyle, allergens, budgetPreference);
        const fFood = this.getFilteredFood("fat", dayIdx + mealIdx + 2, dietStyle, allergens, budgetPreference);

        const items = this.solveMealPortions(pTarget, cTarget, fTarget, pFood, cFood, fFood, dietStyle);

        meals.push({
          name: mInfo.name,
          time: mInfo.time,
          proteinTarget: Math.round(pTarget),
          carbTarget: Math.round(cTarget),
          fatTarget: Math.round(fTarget),
          caloriesTarget: Math.round(calTarget),
          items,
          recipe: this.compileRecipe(pFood.name, cFood.name, fFood.name, mInfo.name),
        });
      });

      let dayCal = 0;
      let dayProt = 0;
      let dayCarb = 0;
      let dayFat = 0;

      meals.forEach((m) => {
        m.items.forEach((it) => {
          dayProt += (it.grams * it.food.protein) / 100;
          dayCarb += (it.grams * it.food.carb) / 100;
          dayFat += (it.grams * it.food.fat) / 100;
          dayCal += (it.grams * it.food.calories) / 100;
        });
      });

      weeklyPlan.push({
        day,
        meals,
        totalCalories: Math.round(dayCal),
        totalProtein: Math.round(dayProt),
        totalCarbs: Math.round(dayCarb),
        totalFat: Math.round(dayFat),
      });
    });

    const baseWater = (weight * 35) / 1000;
    const extraWater = parseFloat(activity) >= 1.55 ? 0.75 : 0;
    const waterTarget = (baseWater + extraWater).toFixed(1);
    const fiberTarget = Math.round((targetCalories / 1000) * 14);

    let timingTip = "";
    if (mealCount === 3) {
      timingTip = "Kahvaltı (08:30) | Öğle Yemeği (13:00) | Akşam Yemeği (19:00). Öğünler arasında en az 4.5 saat bırakılarak sindirim sisteminin dinlenmesi ve MMC (Migrating Motor Complex) aktivasyonu hedeflenmiştir.";
    } else if (mealCount === 4) {
      timingTip = "Kahvaltı (08:30) | Öğle Yemeği (13:00) | Ara Öğün (16:30) | Akşam Yemeği (19:00). Ara öğünde glisemik indeksi düşük besinler tercih edilerek insülin dalgalanmaları ve açlık krizleri önlenmiştir.";
    } else {
      timingTip = "Kahvaltı (08:30) | 1. Ara Öğün (11:00) | Öğle Yemeği (14:00) | 2. Ara Öğün (17:00) | Akşam Yemeği (20:00). 5 öğünlük sık beslenme şeması, kas protein sentezini (MPS) gün boyunca uyarır ve yüksek kalori tüketimini kolaylaştırır.";
    }

    const supplements: string[] = [];
    if (dietStyle === "keto") {
      supplements.push("Sodyum, Potasyum ve Magnezyum (Keto gribini önlemek ve elektrolit dengesini korumak için elzemdir).");
    }
    if (dietStyle === "vejetaryen") {
      supplements.push("Vitamin B12, Demir (C Vitamini ile birlikte emilimi artırılabilir) ve Çinko desteği.");
    }
    if (allergens.includes("gluten")) {
      supplements.push("B Grubu Vitaminleri ve Lif takviyesi (Erişilebilir tahıl kısıtından dolayı kinoa/karabuğday desteği ile).");
    }
    if (allergens.includes("lactose")) {
      supplements.push("Kalsiyum ve D3 Vitamini (Süt ürünü tüketilmediği durumlarda kemik yoğunluğu için).");
    }
    supplements.push("Omega-3 (Balık Yağı - Günlük 1000mg EPA/DHA kalp ve eklem sağlığı için önerilir).");
    supplements.push("D3 Vitamini (Hücresel sağlık, bağışıklık sistemi ve hormon dengesi için günlük 1000-2000 IU).");

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      weeklyPlan,
      scientificAnalysis: { waterTarget, fiberTarget, timingTip, supplements },
    };
  }

  /** Motor (SentezMotoru) uç noktasından plan ister; sunucu hatasında fırlatır. */
  static async generateAiPlan(inputs: DietPlanInputs): Promise<DietPlanResult> {
    const response = await fetch("/api/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    if (!response.ok) {
      throw new Error("Motor generation failed on server");
    }
    return response.json();
  }

  /** Giriş yapmış kullanıcının ölçüm + son hesaplama girdilerinden varsayılanları çeker. */
  static async fetchUserDefaults(): Promise<{ loggedIn: boolean; defaults: DietUserDefaults }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { loggedIn: false, defaults: {} };

    const defaults: DietUserDefaults = {};

    const { data: measurementsData } = await supabase
      .from("measurements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    if (measurementsData && measurementsData.length > 0 && measurementsData[0].weight) {
      defaults.weight = Number(measurementsData[0].weight);
    }

    const { data: calcData } = await supabase
      .from("saved_calculations")
      .select("*")
      .in("type", ["kalori", "makro", "vki"])
      .order("created_at", { ascending: false })
      .limit(8);

    if (calcData && calcData.length > 0) {
      for (const calc of calcData) {
        const inputs = calc.inputs;
        if (!inputs) continue;
        if (defaults.height === undefined && inputs.height) defaults.height = Number(inputs.height);
        if (defaults.age === undefined && inputs.age) defaults.age = Number(inputs.age);
        if (defaults.gender === undefined && inputs.gender) defaults.gender = inputs.gender;
        if (defaults.activity === undefined && inputs.activity) defaults.activity = inputs.activity;
        if (defaults.goal === undefined && inputs.goal) defaults.goal = inputs.goal;
      }
    }

    return { loggedIn: true, defaults };
  }
}

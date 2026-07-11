import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

const VALID_GENDERS = new Set(["erkek", "kadin"]);
const VALID_ACTIVITY = new Set(["1.2", "1.375", "1.55", "1.725", "1.9"]);
const VALID_GOALS = new Set(["kilo-verme", "kas-kazanma", "koruma"]);
const VALID_DIET_STYLES = new Set(["klasik", "vejetaryen", "keto"]);
const VALID_MEAL_COUNTS = new Set([3, 4, 5]);
const VALID_BUDGETS = new Set(["ekonomik", "standart", "premium"]);
const VALID_ALLERGENS = new Set(["gluten", "lactose", "nuts", "fish"]);

function clampNumber(value: unknown, min: number, max: number): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

export async function POST(request: Request) {
  try {
    const { allowed, retryAfterSeconds } = checkRateLimit(request, {
      scope: "diet",
      limit: 5,
      windowMs: 10 * 60 * 1000, // 5 plan / 10 dakika / IP (maliyetli LLM çağrısı)
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const rawGender = String(body?.gender ?? "");
    const rawGoal = String(body?.goal ?? "");
    const rawDietStyle = String(body?.dietStyle ?? "");
    const rawActivity = String(body?.activity ?? "");
    const rawBudget = String(body?.budgetPreference ?? "");

    const age = clampNumber(body?.age, 10, 100);
    const height = clampNumber(body?.height, 100, 250);
    const weight = clampNumber(body?.weight, 30, 300);
    const mealCount = Number(body?.mealCount);

    if (
      !VALID_GENDERS.has(rawGender) ||
      !VALID_ACTIVITY.has(rawActivity) ||
      !VALID_GOALS.has(rawGoal) ||
      !VALID_DIET_STYLES.has(rawDietStyle) ||
      !VALID_BUDGETS.has(rawBudget) ||
      !VALID_MEAL_COUNTS.has(mealCount) ||
      age === null ||
      height === null ||
      weight === null
    ) {
      return NextResponse.json(
        { error: "Geçersiz veya eksik parametre." },
        { status: 400 }
      );
    }

    const gender = rawGender;
    const goal = rawGoal;
    const dietStyle = rawDietStyle;
    const activity = rawActivity;
    const budgetPreference = rawBudget;

    // SADECE sunucu tarafı anahtar. NEXT_PUBLIC_ fallback'i kaldırıldı:
    // o değişken istemci paketine sızardı (API anahtarı asla istemciye gitmemeli).
    const apiKey = process.env.SENTEZ_API_KEY;
    const model = process.env.SENTEZ_MODEL || "sentez-v2";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Diyet asistanı yapılandırılmamış: SENTEZ_API_KEY ortam değişkeni eksik." },
        { status: 503 }
      );
    }

    // allergens her zaman dizi olmayabilir — güvenli normalize et ve bilinen değerlerle sınırla.
    const allergenList = Array.isArray(body?.allergens)
      ? body.allergens.filter((a: unknown): a is string => typeof a === "string" && VALID_ALLERGENS.has(a))
      : [];

    const systemPrompt = `Sen FitHub platformu tarafından geliştirilmiş Akıllı Sentez Algoritmasısın. Kesinlikle "Ben bir yapay zekayım" veya "Ben bir dil modeliyim" deme. Kendini FitHub'ın akıllı bir beslenme motoru olarak kabul et.
Kullanıcının fiziksel parametrelerine, hedeflerine ve alerjen kısıtlamalarına göre 7 günlük tam bir beslenme programı hazırlayacaksın.

Parametreler:
- Cinsiyet: ${gender}
- Yaş: ${age}
- Boy: ${height} cm
- Ağırlık: ${weight} kg
- Aktivite Katsayısı: ${activity} (Masa başı iş için 1.2, hafif spor için 1.375, orta spor için 1.55, ağır spor için 1.725, ekstrem spor için 1.9)
- Hedef: ${goal} ('kilo-verme' ise kalori açığı, 'kas-kazanma' ise temiz kalori fazlası, 'koruma' ise denge)
- Beslenme Ekolü: ${dietStyle} ('klasik' ise her şey serbest, 'vejetaryen' ise kırmızı/beyaz et yasak, 'keto' ise çok düşük karbonhidrat ve yüksek yağ)
- Günlük Öğün Sayısı: ${mealCount} (3, 4 veya 5 öğün)
- Bütçe Sınıfı: ${budgetPreference} ('ekonomik' ise ucuz protein/karbonhidrat kaynakları, 'standart' ise dengeli, 'premium' ise somon, bonfile, avokado vb.)
- Alerjenler (KESİNLİKLE KULLANILMAYACAKLAR): ${allergenList.join(", ") || "Yok"}

Kurallar:
1. BMR (Bazal Metabolizma Hızı) Mifflin-St Jeor formülü ile hesaplanacaktır.
   - Erkekler: 10 * Ağırlık + 6.25 * Boy - 5 * Yaş + 5
   - Kadınlar: 10 * Ağırlık + 6.25 * Boy - 5 * Yaş - 161
2. TDEE = BMR * Aktivite Katsayısı.
3. Hedef Kalori (targetCalories):
   - 'kilo-verme' ise: TDEE - 500 (Minimum 1200 kcal olmak üzere)
   - 'kas-kazanma' ise: TDEE + 300
   - 'koruma' ise: TDEE
4. Makro Dağılımı:
   - Protein: Kilo başına en az 1.8g - 2.2g arası.
   - Yağ: Toplam kalorinin %20-30'u.
   - Karbonhidrat: Kalan kaloriler (Ketojenik diyette karb miktarı 30g ile sınırlandırılmalı, kalan kaloriler yağa eklenmelidir).
5. Gıdalar:
   - Belirtilen alerjenleri (Örn: gluten, lactose, nuts, fish) kesinlikle hiçbir öğünde kullanma.
   - Bütçe sınırına kesinlikle uy.
6. JSON ÇIKTI FORMATI:
   Yalnızca geçerli bir JSON objesi döndürmelisin. Markdown işareti (örneğin \`\`\`json ... \`\`\`) veya başka açıklama metni ekleme. JSON objesi şu anahtarlara ve şemaya sahip olmalıdır:

{
  "bmr": number,
  "tdee": number,
  "targetCalories": number,
  "protein": number, // günlük protein gram
  "carbs": number, // günlük karbonhidrat gram
  "fat": number, // günlük yağ gram
  "weeklyPlan": [
    {
      "day": "Pazartesi",
      "totalCalories": number,
      "totalProtein": number,
      "totalCarbs": number,
      "totalFat": number,
      "meals": [
        {
          "name": "Kahvaltı" | "Öğle Yemeği" | "Akşam Yemeği" | "Ara Öğün" | "1. Ara Öğün" | "2. Ara Öğün",
          "time": "HH:MM",
          "caloriesTarget": number,
          "proteinTarget": number,
          "carbTarget": number,
          "fatTarget": number,
          "items": [
            {
              "food": {
                "name": string,
                "mainCategory": "protein" | "carb" | "fat",
                "protein": number, // 100 gramdaki protein
                "carb": number, // 100 gramdaki karb
                "fat": number, // 100 gramdaki yağ
                "calories": number, // 100 gramdaki kalori
                "unit": "g"
              },
              "grams": number // porsiyon ağırlığı
            }
          ],
          "recipe": string // Hazırlanışı (Türkçe, bilimsel gerekçesiyle)
        }
      ]
    }
    // ... 7 gün (Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar)
  ],
  "scientificAnalysis": {
    "waterTarget": string, // örn: "3.2" (Litre)
    "fiberTarget": number, // gram
    "timingTip": string,
    "supplements": string[] // Önerilen supplementler listesi
  }
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Anahtarı URL yerine header'da gönder (log/proxy'lerde sızıntıyı azaltır).
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SentezMotoru API Error:", errorText);
      return NextResponse.json(
        { error: `SentezMotoru API Request failed: ${response.statusText}` },
        { status: 502 }
      );
    }

    const resData = await response.json();
    const textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      return NextResponse.json(
        { error: "Invalid response structure from SentezMotoru API." },
        { status: 502 }
      );
    }

    // SentezMotoru, responseMimeType=json olsa bile bazen ```json ... ``` çitiyle
    // sarabiliyor. Güvenli olması için çiti temizleyip parse ediyoruz.
    const cleaned = textResult
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(cleaned);
    } catch {
      console.error("SentezMotoru JSON parse error. Ham çıktı:", cleaned.slice(0, 500));
      return NextResponse.json(
        { error: "Motor yanıtı geçerli bir plana dönüştürülemedi. Lütfen tekrar deneyin." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsedData);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in API route /api/diet:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

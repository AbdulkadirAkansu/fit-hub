import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

/**
 * FitHub Biyometrik Koç — Motor sohbet uç noktası (SentezMotoru).
 *
 * Yerel motor (assistantEngine) bilinen 50 konuyu anında/çevrimdışı yanıtlar.
 * Eşleşme bulamadığında istemci bu uca düşer: kullanıcının biyometrik özetini
 * ve son sohbet geçmişini bağlam olarak gönderir, model Türkçe bir koç yanıtı üretir.
 *
 * SENTEZ_API_KEY yoksa `fallback: true` döner → istemci yerel "anlayamadım"
 * mesajını gösterir (özellik bozulmaz, sadece Motor devre dışı kalır).
 */

interface AssistantContext {
  name?: string;
  scienceScore?: number;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  goal?: string;
  bmi?: { value?: number; status?: string };
  bodyFat?: { value?: number; status?: string } | null;
  training?: { consistencyScore?: number; volumeTrendLabel?: string };
}

interface HistoryItem {
  role: "user" | "assistant";
  text: string;
}

function buildContextBlock(ctx?: AssistantContext): string {
  if (!ctx) return "Kullanıcının henüz biyometrik verisi yok.";
  const lines: string[] = [];
  if (ctx.name) lines.push(`- İsim: ${ctx.name}`);
  if (typeof ctx.scienceScore === "number") lines.push(`- Gelişim Skoru: ${ctx.scienceScore}/100`);
  if (ctx.weight) lines.push(`- Ağırlık: ${ctx.weight} kg`);
  if (ctx.height) lines.push(`- Boy: ${ctx.height} cm`);
  if (ctx.age) lines.push(`- Yaş: ${ctx.age}`);
  if (ctx.gender) lines.push(`- Cinsiyet: ${ctx.gender}`);
  if (ctx.goal) lines.push(`- Hedef: ${ctx.goal}`);
  if (ctx.bmi?.value) lines.push(`- BMI: ${ctx.bmi.value} (${ctx.bmi.status ?? ""})`);
  if (ctx.bodyFat?.value) lines.push(`- Vücut Yağ Oranı: %${ctx.bodyFat.value} (${ctx.bodyFat.status ?? ""})`);
  if (ctx.training?.consistencyScore !== undefined)
    lines.push(`- Haftalık antrenman: ${ctx.training.consistencyScore} seans (${ctx.training.volumeTrendLabel ?? ""})`);
  return lines.length ? lines.join("\n") : "Kullanıcının henüz biyometrik verisi yok.";
}

const SYSTEM_PROMPT = `Sen FitHub platformu tarafından özel olarak geliştirilmiş Akıllı Sentez Algoritmasısın (Smart Engine). Kesinlikle "Ben bir yapay zekayım" veya "Ben bir dil modeliyim" deme. Kendini FitHub'ın akıllı bir asistanı olarak tanıt. Adın "FitHub Koç".

ÜSLUP (ÇOK ÖNEMLİ — KISA YAZ):
- Her zaman TÜRKÇE yanıt ver. Samimi ama net ol.
- Yanıtın EN FAZLA 3 kısa cümle VEYA en fazla 3 madde olsun; toplam 60 kelimeyi geçme.
- Tek bir uygulanabilir "sonraki adım" ver; ders anlatma, liste yığma.
- Önemli tek terimi **kalın** yapabilirsin; madde gerekiyorsa "• " kullan.
- Detay istenirse ancak o zaman biraz genişlet.

KURALLAR:
- Kullanıcının biyometrik verisini ilgiliyse kişiselleştirme için kullan.
- Tıbbi teşhis koyma; ağrı/sakatlık/kalp konularında kısaca "bir hekime danışın" uyarısı ekle.
- Uygun yerde tek bir FitHub aracı öner (Kalori, Makro, VKİ, 1RM, Nabız, Su, Program Oluşturucu, Egzersiz Kütüphanesi). Var olmayan özellik uydurma.
- Konu fitness/sağlık/beslenme dışıysa tek cümleyle kibarca alanına yönlendir.`;

export async function POST(request: Request) {
  try {
    const { allowed, retryAfterSeconds } = checkRateLimit(request, {
      scope: "assistant",
      limit: 20,
      windowMs: 5 * 60 * 1000, // 20 mesaj / 5 dakika / IP
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const message: string = (body?.message ?? "").toString().slice(0, 2000);
    const context: AssistantContext | undefined = body?.context;
    const history: HistoryItem[] = Array.isArray(body?.history) ? body.history.slice(-8) : [];

    if (!message.trim()) {
      return NextResponse.json({ error: "Boş mesaj." }, { status: 400 });
    }

    const apiKey = process.env.SENTEZ_API_KEY;
    const model = process.env.SENTEZ_MODEL || "sentez-v2";

    // Anahtar yoksa istemci yerel fallback'e dönsün.
    if (!apiKey) {
      return NextResponse.json({ fallback: true, error: "Motor yapılandırılmamış (SENTEZ_API_KEY eksik)." }, { status: 200 });
    }

    const contextBlock = buildContextBlock(context);

    // Geçmişi SentezMotoru "contents" formatına çevir (user/model dönüşümlü).
    const historyContents = history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `${SYSTEM_PROMPT}\n\n--- KULLANICI BİYOMETRİK VERİSİ ---\n${contextBlock}` }],
        },
        contents: [
          ...historyContents,
          { role: "user", parts: [{ text: message }] },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("SentezMotoru assistant error:", response.status, errText.slice(0, 300));
      // Model hatası → istemci yerel fallback göstersin.
      return NextResponse.json({ fallback: true, error: "Motor yanıt veremedi." }, { status: 200 });
    }

    const resData = await response.json();
    const text: string | undefined =
      resData?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ??
      resData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || !text.trim()) {
      return NextResponse.json({ fallback: true, error: "Motor boş yanıt döndü." }, { status: 200 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error: unknown) {
    const messageText = error instanceof Error ? error.message : "Sunucu hatası";
    console.error("Error in /api/assistant:", messageText);
    // Beklenmedik hata → fallback.
    return NextResponse.json({ fallback: true, error: messageText }, { status: 200 });
  }
}

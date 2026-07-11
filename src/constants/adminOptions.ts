/**
 * Admin içerik formları için kanonik seçenek listeleri.
 *
 * ÖNEMLİ: Bu değerler public sayfalardaki filtrelerle BİREBİR uyumludur
 * (egzersizler/programlar/blog). Admin'in elle metin girmesi yerine bu
 * listelerden seçim yapması, eklenen içeriğin site filtrelerinde doğru
 * görünmesini garanti eder.
 */

// ─── Blog ────────────────────────────────────────────────────────────────────
export const BLOG_CATEGORIES = [
  "Beslenme",
  "Antrenman",
  "Gelişim",
  "Rehber",
  "Supplement",
  "Sağlık",
  "Motivasyon",
] as const;

// ─── Egzersiz ────────────────────────────────────────────────────────────────
// Public filtre: ["Fitness", "Pilates"]
export const EXERCISE_CATEGORIES = ["Fitness", "Pilates"] as const;

// Public filtre: ["Başlangıç", "Orta", "İleri"]
export const DIFFICULTY_LEVELS = ["Başlangıç", "Orta", "İleri"] as const;

// Public kas filtresi target_muscle alanında bu anahtarları arar.
export const MUSCLE_GROUPS = [
  "Göğüs",
  "Sırt",
  "Bacak",
  "Omuz",
  "Kol",
  "Core",
  "Karın",
  "Kalça",
] as const;

export const EQUIPMENT_OPTIONS = [
  "Vücut Ağırlığı",
  "Dumbbell",
  "Barbell",
  "Makine",
  "Kablo (Cable)",
  "Kettlebell",
  "Dirençli Bant",
  "Smith Machine",
  "Sehpa",
  "Pilates Reformer",
  "Mat",
] as const;

// ─── Program ─────────────────────────────────────────────────────────────────
// Public filtre: ["Fitness", "Pilates"]
export const PROGRAM_CATEGORIES = ["Fitness", "Pilates", "Kardiyo", "Güç", "Esneklik"] as const;

export const PROGRAM_DURATIONS = ["4 Hafta", "6 Hafta", "8 Hafta", "12 Hafta"] as const;

export const DAYS_PER_WEEK_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

// ─── Site Ayarları: Duyuru türü ──────────────────────────────────────────────
export const ANNOUNCEMENT_TYPES = [
  { value: "info", label: "Bilgi (Mavi)" },
  { value: "success", label: "Başarı (Yeşil)" },
  { value: "warning", label: "Uyarı (Turuncu)" },
] as const;

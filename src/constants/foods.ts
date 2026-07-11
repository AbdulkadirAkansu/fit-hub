import type { Food } from "@/types/diet";

/**
 * Besin veritabanı — `mainCategory` ile katı protein/karb/yağ ayrımı yapılır.
 * Değerler 100 g başınadır. Diyet planlayıcı (DietService) bu listeyi filtreler.
 */
export const FOODS: Food[] = [
  // --- PROTEİNLER (mainCategory: "protein") ---
  // Ekonomik
  { name: "Izgara Tavuk Göğsü", mainCategory: "protein", protein: 31, carb: 0, fat: 1.5, calories: 140, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Lor Peyniri (Yağsız)", mainCategory: "protein", protein: 13, carb: 3, fat: 1.5, calories: 80, unit: "g", allergens: ["lactose"], tags: ["dairy", "veg"], budgetTier: "ekonomik" },
  { name: "Haşlanmış Bütün Yumurta", mainCategory: "protein", protein: 13, carb: 1, fat: 11, calories: 155, unit: "g", allergens: [], tags: ["egg", "veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Tavada Yumurta Beyazı", mainCategory: "protein", protein: 11, carb: 0.7, fat: 0.2, calories: 50, unit: "g", allergens: [], tags: ["egg", "veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Bezelye Proteini (Toz)", mainCategory: "protein", protein: 80, carb: 5, fat: 3, calories: 370, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Haşlanmış Yeşil Mercimek", mainCategory: "protein", protein: 9, carb: 20, fat: 0.4, calories: 116, unit: "g", allergens: [], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Çökelek Peyniri", mainCategory: "protein", protein: 16, carb: 2, fat: 2, calories: 90, unit: "g", allergens: ["lactose"], tags: ["dairy", "veg", "keto-friendly"], budgetTier: "ekonomik" },
  // Standart
  { name: "Konserve Ton Balığı (Süzülmüş)", mainCategory: "protein", protein: 24, carb: 0, fat: 5, calories: 145, unit: "g", allergens: ["fish"], tags: ["meat", "keto-friendly"], budgetTier: "standart" },
  { name: "Hindi Füme (Dilimli)", mainCategory: "protein", protein: 18, carb: 1, fat: 1, calories: 85, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "standart" },
  { name: "Fırınlanmış Levrek", mainCategory: "protein", protein: 19, carb: 0, fat: 2.5, calories: 100, unit: "g", allergens: ["fish"], tags: ["meat", "keto-friendly"], budgetTier: "standart" },
  { name: "Yarım Yağlı Süzme Peynir", mainCategory: "protein", protein: 12, carb: 2.5, fat: 12, calories: 170, unit: "g", allergens: ["lactose"], tags: ["dairy", "veg", "keto-friendly"], budgetTier: "standart" },
  { name: "Hindi Göğüs Sote", mainCategory: "protein", protein: 29, carb: 0, fat: 1.5, calories: 130, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "standart" },
  { name: "Yağsız Kıyma Kavurma", mainCategory: "protein", protein: 21, carb: 0, fat: 5, calories: 137, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "standart" },
  { name: "Izgara Çipura", mainCategory: "protein", protein: 20, carb: 0, fat: 4, calories: 120, unit: "g", allergens: ["fish"], tags: ["meat", "keto-friendly"], budgetTier: "standart" },
  // Premium
  { name: "Izgara Dana Bonfile (Biftek)", mainCategory: "protein", protein: 26, carb: 0, fat: 6, calories: 160, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "premium" },
  { name: "Fırında Somon Fileto", mainCategory: "protein", protein: 20, carb: 0, fat: 13, calories: 200, unit: "g", allergens: ["fish"], tags: ["meat", "keto-friendly"], budgetTier: "premium" },
  { name: "Organik Sote Tofu", mainCategory: "protein", protein: 8, carb: 2, fat: 4, calories: 76, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
  { name: "Doğal Tempeh", mainCategory: "protein", protein: 19, carb: 9, fat: 11, calories: 193, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },
  { name: "Kuzu Pirzola (Izgara)", mainCategory: "protein", protein: 25, carb: 0, fat: 15, calories: 240, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "premium" },
  { name: "Izgara Kalamar", mainCategory: "protein", protein: 15, carb: 3, fat: 1.5, calories: 90, unit: "g", allergens: ["fish"], tags: ["meat", "keto-friendly"], budgetTier: "premium" },
  { name: "Dana Antrikot", mainCategory: "protein", protein: 22, carb: 0, fat: 14, calories: 215, unit: "g", allergens: [], tags: ["meat", "keto-friendly"], budgetTier: "premium" },

  // --- KARBONHİDRATLAR (mainCategory: "carb") ---
  // Ekonomik
  { name: "Beyaz Pirinç (Pilavlık)", mainCategory: "carb", protein: 7.5, carb: 78, fat: 0.5, calories: 350, unit: "g", allergens: [], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Haşlanmış Patates", mainCategory: "carb", protein: 2, carb: 17, fat: 0.1, calories: 87, unit: "g", allergens: [], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Yulaf Ezmesi", mainCategory: "carb", protein: 13, carb: 68, fat: 7, calories: 389, unit: "g", allergens: ["gluten"], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Durum Buğdayı Makarna", mainCategory: "carb", protein: 12, carb: 74, fat: 1.2, calories: 355, unit: "g", allergens: ["gluten"], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Nohut (Haşlanmış)", mainCategory: "carb", protein: 8, carb: 27, fat: 2.5, calories: 164, unit: "g", allergens: [], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Tam Buğday Ekmek", mainCategory: "carb", protein: 9, carb: 43, fat: 2, calories: 240, unit: "g", allergens: ["gluten"], tags: ["veg"], budgetTier: "ekonomik" },
  { name: "Elma (Orta Boy)", mainCategory: "carb", protein: 0.3, carb: 14, fat: 0.2, calories: 52, unit: "g", allergens: [], tags: ["veg"], budgetTier: "ekonomik" },
  // Standart
  { name: "Karabuğday (Greçka)", mainCategory: "carb", protein: 13, carb: 72, fat: 3.4, calories: 343, unit: "g", allergens: [], tags: ["veg"], budgetTier: "standart" },
  { name: "İnce Bulgur", mainCategory: "carb", protein: 12, carb: 70, fat: 1.5, calories: 340, unit: "g", allergens: ["gluten"], tags: ["veg"], budgetTier: "standart" },
  { name: "Yerli Muz (Orta Boy)", mainCategory: "carb", protein: 1.1, carb: 23, fat: 0.3, calories: 89, unit: "g", allergens: [], tags: ["veg"], budgetTier: "standart" },
  { name: "Basmati Pirinç (Kuru)", mainCategory: "carb", protein: 8, carb: 78, fat: 1, calories: 350, unit: "g", allergens: [], tags: ["veg"], budgetTier: "standart" },
  { name: "Firik Bulguru", mainCategory: "carb", protein: 14, carb: 65, fat: 2, calories: 330, unit: "g", allergens: ["gluten"], tags: ["veg"], budgetTier: "standart" },
  { name: "Esmer Pirinç (Haşlanmış)", mainCategory: "carb", protein: 2.6, carb: 23, fat: 0.9, calories: 112, unit: "g", allergens: [], tags: ["veg"], budgetTier: "standart" },
  { name: "Siyah Üzüm", mainCategory: "carb", protein: 0.7, carb: 18, fat: 0.2, calories: 69, unit: "g", allergens: [], tags: ["veg"], budgetTier: "standart" },
  // Premium
  { name: "Fırın Tatlı Patates", mainCategory: "carb", protein: 1.6, carb: 20, fat: 0.1, calories: 86, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },
  { name: "Organik Kinoa (Haşlanmış)", mainCategory: "carb", protein: 4.4, carb: 21, fat: 1.9, calories: 120, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },
  { name: "Yaban Mersini (Taze)", mainCategory: "carb", protein: 0.7, carb: 14, fat: 0.3, calories: 57, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },
  { name: "Böğürtlen (Taze)", mainCategory: "carb", protein: 1.4, carb: 10, fat: 0.5, calories: 43, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },
  { name: "Amarant (Haşlanmış)", mainCategory: "carb", protein: 4, carb: 19, fat: 1.6, calories: 102, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },
  { name: "Siyah Pirinç (Beluga)", mainCategory: "carb", protein: 8, carb: 72, fat: 2.5, calories: 335, unit: "g", allergens: [], tags: ["veg"], budgetTier: "premium" },

  // --- SAĞLIKLI YAĞLAR (mainCategory: "fat") ---
  // Ekonomik
  { name: "Yerli Sızma Zeytinyağı", mainCategory: "fat", protein: 0, carb: 0, fat: 100, calories: 900, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Tuzsuz Yer Fıstığı", mainCategory: "fat", protein: 26, carb: 16, fat: 49, calories: 567, unit: "g", allergens: ["nuts"], tags: ["veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Kabak Çekirdeği İçi", mainCategory: "fat", protein: 30, carb: 15, fat: 49, calories: 559, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Ayçiçek Çekirdeği İçi", mainCategory: "fat", protein: 21, carb: 20, fat: 51, calories: 584, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "ekonomik" },
  { name: "Siyah Zeytin (Doğal)", mainCategory: "fat", protein: 1, carb: 6, fat: 11, calories: 115, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "ekonomik" },
  // Standart
  { name: "Doğal Fıstık Ezmesi (Şekersiz)", mainCategory: "fat", protein: 25, carb: 20, fat: 50, calories: 588, unit: "g", allergens: ["nuts"], tags: ["veg", "keto-friendly"], budgetTier: "standart" },
  { name: "Ceviz İçi", mainCategory: "fat", protein: 15, carb: 14, fat: 65, calories: 654, unit: "g", allergens: ["nuts"], tags: ["veg", "keto-friendly"], budgetTier: "standart" },
  { name: "Sade Tereyağı (Sade Yağ)", mainCategory: "fat", protein: 0.3, carb: 0, fat: 99, calories: 890, unit: "g", allergens: ["lactose"], tags: ["dairy", "veg", "keto-friendly"], budgetTier: "standart" },
  { name: "Keten Tohumu (Öğütülmüş)", mainCategory: "fat", protein: 18, carb: 29, fat: 42, calories: 534, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "standart" },
  { name: "Chia Tohumu", mainCategory: "fat", protein: 16, carb: 42, fat: 31, calories: 486, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "standart" },
  // Premium
  { name: "Avokado (Taze)", mainCategory: "fat", protein: 2, carb: 9, fat: 15, calories: 160, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
  { name: "Çiğ Badem (İthal)", mainCategory: "fat", protein: 21, carb: 22, fat: 49, calories: 579, unit: "g", allergens: ["nuts"], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
  { name: "Soğuk Sıkım Hindistan Cevizi Yağı", mainCategory: "fat", protein: 0, carb: 0, fat: 100, calories: 900, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
  { name: "Macadamia Cevizi", mainCategory: "fat", protein: 8, carb: 14, fat: 76, calories: 718, unit: "g", allergens: ["nuts"], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
  { name: "Avokado Yağı", mainCategory: "fat", protein: 0, carb: 0, fat: 100, calories: 900, unit: "g", allergens: [], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
  { name: "Çiğ Kaju Fıstığı", mainCategory: "fat", protein: 18, carb: 30, fat: 44, calories: 553, unit: "g", allergens: ["nuts"], tags: ["veg", "keto-friendly"], budgetTier: "premium" },
];

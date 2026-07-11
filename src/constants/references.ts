export const SCIENTIFIC_REFERENCES = {
  vki: {
    title: "Vücut Kitle İndeksi (VKİ)",
    formula: "Kilo (kg) / Boy² (m²)",
    source: "Dünya Sağlık Örgütü (WHO)",
    link: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index-bmi",
    description: "VKİ, yetişkinlerde düşük kilolu, fazla kilolu ve obeziteyi sınıflandırmak için kullanılan basit bir boy-kilo indeksidir."
  },
  bmr: {
    title: "Bazal Metabolizma Hızı (BMR)",
    formula: "Mifflin-St Jeor Denklemi",
    source: "American Journal of Clinical Nutrition",
    link: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    description: "Mifflin-St Jeor denklemi, günümüzdeki en doğru BMR tahmin yöntemlerinden biri olarak kabul edilmektedir."
  },
  oneRM: {
    title: "1RM (Tek Tekrar Maksimum)",
    formula: "Brzycki Formülü: Ağırlık / (1.0278 - (0.0278 × Tekrar Sayısı))",
    source: "National Strength and Conditioning Association (NSCA)",
    link: "https://www.nsca.com/",
    description: "Brzycki formülü, alt-maksimal yüklenmelerden 1RM tahmin etmek için yaygın olarak kullanılan güvenilir bir yöntemdir."
  },
  heartRate: {
    title: "Hedef Nabız Bölgeleri",
    formula: "Tanaka Denklemi: 208 - (0.7 × Yaş)",
    source: "Journal of the American College of Cardiology",
    link: "https://www.jacc.org/doi/full/10.1016/S0735-1097(00)01054-8",
    description: "Tanaka denklemi, geleneksel '220-yaş' formülüne göre özellikle yaş ilerledikçe daha doğru sonuçlar vermektedir."
  },
  idealWeight: {
    title: "Referans Vücut Ağırlığı",
    formula: "Devine Formülü",
    source: "American Journal of Hospital Pharmacy",
    link: "https://pubmed.ncbi.nlm.nih.gov/6829450/",
    description: "Devine denklemi ilaç dozlaması için geliştirilmiş yaklaşık bir referanstır; estetik, sağlık veya kişisel 'ideal kilo' tanısı değildir."
  },
  waistToHip: {
    title: "Bel-Kalça Oranı",
    formula: "Bel Çevresi / Kalça Çevresi",
    source: "Dünya Sağlık Örgütü (WHO)",
    link: "https://www.who.int/publications/i/item/9789241501491",
    description: "Bel-kalça oranı, abdominal yağlanma ve buna bağlı kronik hastalık riskini değerlendirmek için önemli bir biyobelirteçtir."
  },
  bodyComposition: {
    title: "Vücut Kompozisyonu Tahmini",
    formula: "US Navy çevre ölçümü denklemi",
    source: "Hodgdon & Beckett çevre ölçümü modeli",
    link: "https://apps.dtic.mil/sti/citations/ADA143018",
    description: "Boyun, bel ve gerektiğinde kalça çevresinden vücut yağ oranını tahmin eder. Ölçüm hatasına duyarlıdır ve DXA gibi klinik yöntemlerin yerine geçmez."
  },
  macros: {
    title: "Makro Besin Dağılımı",
    formula: "Protein: 1.4–2.0 g/kg; yağ: enerjinin %25'i; kalan enerji: karbonhidrat",
    source: "International Society of Sports Nutrition (ISSN)",
    link: "https://pubmed.ncbi.nlm.nih.gov/28642676/",
    description: "Egzersiz yapan çoğu sağlıklı yetişkin için protein hedefi vücut ağırlığına göre hesaplanır. Kalan dağılım hedefe, tercihe ve toplam enerjiye göre kişiselleştirilir."
  },
  trainingVolume: {
    title: "Antrenman Hacmi (Volume)",
    formula: "Set × Tekrar × Ağırlık",
    source: "American College of Sports Medicine (ACSM)",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/",
    description: "2026 ACSM pozisyon bildirisi, sağlıklı yetişkinlerde tüm büyük kas gruplarını haftada en az iki kez yüksek eforla çalıştırmayı; hipertrofi hedefinde yaklaşık 10 haftalık set/kas grubu hacmini pratik başlangıç noktası olarak vurgular."
  },
  waistToHeight: {
    title: "Bel-Boy Oranı",
    formula: "Bel Çevresi / Boy",
    source: "Journal of Clinical Epidemiology",
    link: "https://pubmed.ncbi.nlm.nih.gov/27895689/",
    description: "Bel-boy oranı kardiyometabolik risk için basit bir tarama göstergesidir. 0.50 sınırı yaygın bir başlangıç eşiğidir; tek başına tanı koymaz."
  },
  waterIntake: {
    title: "Günlük Su İhtiyacı",
    formula: "Kilo (kg) × 0.033 L",
    source: "Pratik planlama tahmini; NASEM hidrasyon ilkeleri",
    link: "https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate",
    description: "33 ml/kg uygulama içi bir başlangıç tahminidir; NASEM'in resmi yeterli alım değeri değildir. Gerçek ihtiyaç terleme, iklim, besinlerle alınan su, hastalık ve ilaçlara göre değişir."
  },
  plateWeight: {
    title: "Plaka Hesaplama",
    formula: "(Toplam Ağırlık - Bar Ağırlığı) / 2",
    source: "General Fitness Standards",
    link: "https://en.wikipedia.org/wiki/Free_weight",
    description: "Standart Olimpik bar 20kg ağırlığındadır. Plaka hesaplama, barın her iki yanına eşit ağırlık yüklenerek mekanik dengenin sağlanması için kritiktir."
  },
  cardioMET: {
    title: "Kardiyo Kalori Harcaması",
    formula: "(MET × 3.5 × Kilo) / 200 × Dakika",
    source: "Compendium of Physical Activities",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/",
    description: "2024 Adult Compendium MET değerleri toplum düzeyinde tahmin üretir. Bireysel enerji harcaması kondisyon, yaş ve hareket ekonomisine göre değişebileceğinden sonuç yaklaşık değerdir."
  },
  pilatesLevel: {
    title: "Pilates Seviye Değerlendirmesi",
    formula: "Hareket kontrolü + dayanıklılık + mobilite öz değerlendirmesi",
    source: "FitHub eğitim amaçlı tarama modeli",
    link: "/saglik-uyarisi",
    description: "Bu seviye testi doğrulanmış klinik bir ölçek değildir. Başlangıç programı seçimini kolaylaştıran eğitim amaçlı bir öz değerlendirmedir."
  }
};

export interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  action?: { label: string; tab: string; isRoute?: boolean };
  timestamp: Date;
  /** Yerel motor güçlü bir eşleşme bulamadığında true → istemci Motor'a düşebilir. */
  unmatched?: boolean;
}

// Normalize Turkish characters and stem suffixes to find the base word
export function stemWord(word: string): string {
  let w = word.toLowerCase().trim()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u');

  // Common Turkish suffixes to strip (only if the remaining stem is at least 3 characters)
  const suffixes = [
    /^(.*?)(lar|ler)$/, // plural (kitap-lar)
    /^(.*?)(imiz|imiz|umuz|umuz|iniz|iniz|leri|lari)$/, // plural possessive
    /^(.*?)(in|in|un|un|im|im|um|um|niz|niz|n)$/, // singular possessive (kol-um, boy-un)
    /^(.*?)(dan|den|tan|ten)$/, // ablative (ev-den, antrenman-dan)
    /^(.*?)(da|de|ta|te)$/, // locative (sporda, evde)
    /^(.*?)(yi|yi|yu|yu|yu|yu|a|e|ya|ye)$/, // accusative / dative (kreatin-e, spora)
    /^(.*?)(la|le)$/, // instrumental (hiz-la, spor-la)
    /^(.*?)(dir|dir|dur|dur|tir|tir|tur|tur)$/, // copula (iyidir)
    /^(.*?)(mi|mi|mu|mu)$/ // question particle (degil mi)
  ];

  for (const regex of suffixes) {
    const match = w.match(regex);
    if (match && match[1].length >= 3) {
      w = match[1];
    }
  }

  return w;
}

// Tokenize a sentence and return its stemmed words
export function getTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\"']/g, " ")
    .split(/\s+/)
    .filter(token => token.length > 0);
}

// Calculate Jaccard Similarity between two token lists
export function calculateJaccard(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

// 50-topic Knowledge Base
interface KBItem {
  id: string;
  keywords: string[];
  title?: string;
  weight: number;
  text: string;
  action?: { label: string; tab: string; isRoute?: boolean };
}

function resolveAssistantQuery(
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  biometricReport: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  measurements: any[],
  assistantChecklist: string[],
  scienceScore: number
): ChatMessage {
  const query = text.toLowerCase().trim();
  const queryTokens = getTokens(query).map(stemWord);
  
  const kb: KBItem[] = [
    // 1. Greetings
    {
      id: "greetings",
      keywords: ["merhaba", "selam", "hey", "selamlar", "merhabalar", "gunaydin", "tunaydin", "iyi aksamlar", "iyi geceler", "naber", "slm", "mrb", "hey koc", "kocum"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 2. Thanks
    {
      id: "thanks",
      keywords: ["tesekkur", "saogol", "sagol", "cansin", "eyvallah", "harikasin", "supersin", "mukemmel", "tesekkurler", "sag olasin", "tesekkur ederim", "tsk", "eyv"],
      weight: 1.0,
      text: "Rica ederim! 🏋️‍♂️ Gelişiminizi bilimsel verilerle desteklemek için her zaman buradayım. Bilimsel hedeflerinize ulaşmanız için çalışıyorum.\n\nAntrenmanlarınızı, günlük beslenme detaylarınızı ve ölçümlerinizi düzenli girmeyi unutmayın ki analizlerimiz hep en güncel seviyede kalsın. Başka bir konuda yardıma ihtiyacınız var mı?"
    },
    // 3. Bot Identity
    {
      id: "bot_identity",
      keywords: ["sen kimsin", "adin ne", "bot musun", "gercek misin", "kimsin sen", "kim yazdi", "koc asistani", "kimsin", "ismin ne"],
      weight: 1.5,
      text: "Ben FitHub platformunun akıllı analiz motoruyum. 🧬\n\nSisteme girdiğiniz gerçek bilimsel değerleri (kilo, ölçü, antrenman hacmi, kalori, protein vb.) klinik spor biyolojisi formülleri (US Navy, Mifflin-St Jeor, Robinson, Epley, WHtR) süzgecinden geçirerek tamamen size özel gelişim analizleri hazırlarım. Harici bir entegrasyon olmadan, FitHub'ın kendi geliştirdiği lokal bilimsel sentez motoruyla çalışırım."
    },
    // 4. How are you
    {
      id: "how_are_you",
      keywords: ["nasilsin", "iyi misin", "keyifler nasil", "nasil gidiyor", "ne yapiyorsun", "nasil gidiyo", "nasi"],
      weight: 1.2,
      text: "Harika gidiyor! Gelişim verilerinizi analiz etmek ve antrenman hacminizle beslenme makrolarınızı kontrol altında tutmak için sabırsızlanıyorum. ⚡ Birlikte yeni hedefler koymaya hazır mıyız?"
    },
    // 5. Love/Appreciation
    {
      id: "love_motivation",
      keywords: ["seni seviyorum", "seviyorum", "koc seni seviyorum", "adamsin", "kral", "helal", "seviyoruz", "en iyisi", "cansin koc"],
      weight: 1.2,
      text: "Çok teşekkürler! Sizinle birlikte bu gelişim yolculuğunda olmak benim için bir ayrıcalık. Başarı tesadüf değildir, disipline sadık kalalım! 🏋️‍♂️ Mutlaka her seti ve her öğünü kaydetmeye devam edin!"
    },
    // 6. Joke Motivation
    {
      id: "joke_motivation",
      keywords: ["espri", "saka", "fikra", "komik", "guldur", "eglendir", "saka yap", "espri yap", "fikra anlat"],
      weight: 1.5,
      text: "" // Dynamically handled below (random joke)
    },
    // 7. Laziness
    {
      id: "laziness_motivation",
      keywords: ["useniyorum", "gitmek istemiyorum", "usendim", "canim istemiyor", "motivasyonum yok", "keyifsizim", "yorgunum", "antrenmana gitmek", "isteksizim", "usenmek", "motivasyon", "hevesim yok"],
      weight: 1.3,
      text: "Bugün antrenmana gitmek istemiyor, üşeniyor veya yorgun hissediyor olabilirsiniz. Bu son derece insani bir durumdur. 🧠\n\n**Koç Tavsiyesi:**\n• **10 Dakika Kuralı:** Kendinize sadece 10 dakika egzersiz yapma sözü verin ve başlayın. 10 dakika sonra hala devam etmek istemiyorsanız antrenmanı bırakabilirsiniz. (Genelde %90 oranında vücut ısınır ve antrenman tamamlanır).\n• **Disiplin vs Motivasyon:** Motivasyon gelip geçicidir, gelişimi getiren ise motivasyonun bittiği yerde başlayan disiplindir. En kötü antrenman, yapılmayan antrenmandır.\n• **Hafifletilmiş Seans:** Çok yorgunsanız ağır kaldırmayın. Set sayılarını yarıya indirip hareketliliğe odaklanın (aktif dinlenme seansı). Bu, zihinsel alışkanlığınızı korur.",
      action: { label: "Hafif Egzersiz Seç 🏋️‍♂️", tab: "/egzersizler", isRoute: true }
    },
    // 8. General Status
    {
      id: "general_status",
      keywords: ["durumum nasil", "sence nasilim", "gelisiyor muyum", "analiz et", "biyometrik durumum", "nasilim", "analizim", "gelisim durumum", "skorum nasil", "ozetle"],
      weight: 1.5,
      text: "" // Dynamically handled below
    },
    // 9. Weight Loss
    {
      id: "weight_loss",
      keywords: ["kilo ver", "zayifla", "yag yak", "definasyon", "cut", "kiloluyum", "yag oranim yuksek", "kilo kaybet", "nasil zayiflarim", "diyet", "yag eritme", "gobek", "kilo dusmek", "kilo vermek", "yag yakmak"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 10. Muscle Gain
    {
      id: "muscle_gain",
      keywords: ["kas yap", "kas kazan", "kilo al", "hacim", "bulk", "hipertrofi", "buyumek", "kutle", "kaslanmak", "guclen", "agirlik artirma", "iri", "kas kutlesi"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 11. Protein & Nutrition
    {
      id: "protein_nutrition",
      keywords: ["protein", "karbonhidrat", "yag", "ne yemeliyim", "makro", "kalori", "besin", "yemek", "diyet", "ogun", "beslenme", "kaloriler", "yiyecek", "tarif", "karb"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 12. Supplements General
    {
      id: "supplements",
      keywords: ["supplement", "takviye", "protein tozu", "whey", "kreatin", "creatine", "preworkout", "l-karnitin", "bcaa", "gainer", "vitamin", "aminoasit", "kafein", "b12"],
      weight: 1.2,
      text: "Supplementler (Gıda Takviyeleri), temel beslenme ve antrenman düzeniniz doğru kurulduğunda gelişiminize son %5-10'luk bir katkı sağlar. 💊\n\n**En Etkili Supplementler:**\n1. **Kreatin Monohidrat:** Güç artışı ve ATP sentezi için günde 3-5g.\n2. **Whey Protein:** Günlük protein hedefine katı gıdalarla ulaşılamadığında hızlı sindirilen ek protein desteği.\n3. **Kafein:** Antrenmandan 30 dk önce odaklanma ve güç çıkışı sağlamak için.\n4. **Vitamin D3 & Omega 3:** Genel eklem sağlığı, bağışıklık ve hormonal sentez için elzemdir.\n\n**Tavsiye:** Kreatin veya kafein kullanımı hakkında daha detaylı bilgi için doğrudan 'kreatin' veya 'kafein' yazabilirsiniz."
    },
    // 13. Hydration
    {
      id: "hydration",
      keywords: ["su", "litre", "bardak", "dehidrasyon", "susuzluk", "su tuketimi", "su icmek", "hidrasyon", "su iciyorum"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 14. Overload & Plateau
    {
      id: "overload",
      keywords: ["overload", "agirlik artmiyor", "plato", "tikanmak", "gelisemiyorum", "hacim artmiyor", "guclenemedim", "ilerleyemiyorum", "tikaniklik", "over load"],
      weight: 1.2,
      text: "Antrenmanlarınızda ağırlık artıramıyor veya tıkanma (plato) yaşıyorsanız, vücudunuz mevcut strese adapte olmuş demektir. 📈\n\n**Platoyu Aşmak ve Progressive Overload İçin 4 Strateji:**\n1. **Hacim Artışı (Volume):** Ağırlığı artıramıyorsanız set sayısını veya tekrar sayısını artırın (Örn: 8 tekrar yerine 10 tekrar).\n2. **Dinlenme Süresi:** Set arası dinlenmenizi biraz artırın (1.5 dakikadan 2.5-3 dakikaya). Bu, ATP depolarının %95+ dolmasını sağlar.\n3. **Deload Haftası:** 8-12 haftalık ağır antrenman döneminden sonra 1 hafta ağırlıkları %40 düşürerek merkezi sinir sistemini dinlendirin.\n4. **Mikro Yükleme:** Ağırlıkları 5'er kg artırmak yerine 1'er veya 1.25'er kg'lık küçük plakalarla mikro yükleme yapın.",
      action: { label: "Antrenman Hacmi Hesaplama 🏋️‍♂️", tab: "/hesaplama/antrenman-hacmi", isRoute: true }
    },
    // 15. Workout Program
    {
      id: "workout_program",
      keywords: ["program", "split", "full body", "antrenman programi", "bro split", "ppl", "push pull", "rutin", "bolunme", "haftalik program", "antrenman plani"],
      weight: 1.0,
      text: "En iyi antrenman programı, hayat tarzınıza ve haftalık ayırabileceğiniz gün sayısına en sürdürülebilir olanıdır. 🗓️\n\n**Popüler Antrenman Bölünmeleri (Splits):**\n• **Full Body (Tüm Vücut):** Haftada 3 gün tüm kasları çalıştırma. Yeni başlayanlar ve zamanı kısıtlı olanlar için harikadır.\n• **Push/Pull/Legs (PPL):** İtiş (Göğüs-Omuz-Triceps), Çekiş (Sırt-Biceps) ve Bacak-Karın bölünmesi. Haftada 3 veya 6 gün için uygundur.\n• **Upper/Lower (Üst/Alt):** Vücudu ikiye bölerek haftada 4 gün antrenman. Güç ve hipertrofi dengesi mükemmeldir.\n\nPlatformumuzda hedeflerinize uygun kişiselleştirilmiş bir program tasarlamak için program mimarını kullanabilirsiniz.",
      action: { label: "Kişisel Programını Tasarla 🛠️", tab: "/programlar/olusturucu", isRoute: true }
    },
    // 16. Cardio
    {
      id: "cardio",
      keywords: ["kardiyo", "kosu", "yuruyus", "hiit", "liss", "kosmak", "yurumek", "bisiklet", "cardio", "tempolu"],
      weight: 1.0,
      text: "Kardiyo antrenmanları kalp-damar sağlığını korumak, mitokondri yoğunluğunu artırmak ve kalori harcamasını desteklemek için vazgeçilmezdir. 🏃‍♂️\n\n**Kardiyo Yöntemleri:**\n• **LISS (Düşük Yoğunluklu Kardiyo):** Tempolu yürüyüş veya hafif bisiklet (Nabız %60-70). Yağ yakımı ve toparlanma (recovery) için idealdir.\n• **HIIT (Yüksek Yoğunluklu Kardiyo):** 30 sn depar - 30 sn yürüyüş döngüleri. Kısa sürede yüksek kalori yakımı ve kondisyon kazandırır.\n\nBeslenmenize ek olarak kardiyo ile yaktığınız kaloriyi hesaplamak için kardiyo kalori aracımızı kullanabilirsiniz.",
      action: { label: "Kardiyo Kalori Hesaplayıcı 🏃‍♂️", tab: "/hesaplama/kardiyo-kalori", isRoute: true }
    },
    // 17. Heart Rate Zones
    {
      id: "heart_rate",
      keywords: ["nabiz", "bpm", "kalp", "kardiyo nabzi", "aerobik nabiz", "atis hizi", "kalp atisim", "kalbim"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 18. Ideal Weight
    {
      id: "ideal_weight",
      keywords: ["ideal kilo", "ideal kilom", "kac kilo olmaliyim", "ideal agirlik", "boy kilo orani", "ideal kilom nedir"],
      weight: 1.2,
      text: "" // Dynamically handled below
    },
    // 19. One Rep Max
    {
      id: "one_rep_max",
      keywords: ["1rm", "one rep max", "tek tekrar", "maksimum kaldirma", "guc siniri", "maks kaldirma", "one rep"],
      weight: 1.2,
      text: "**1RM (One Rep Max)**, bir egzersizde teknik formunuzu bozmadan tek bir tekrarda kaldırabileceğiniz maksimum ağırlıktır. 🏋️‍♂️\n\nGelişiminizi planlarken antrenman yoğunlukları (%70, %80 1RM gibi) bu değere göre belirlenir. Epley formülü ile tahmin edilebilir:\n`1RM = Kaldırılan Ağırlık x (1 + Tekrar Sayısı / 30)`\n\nÖrnek: Bench Press'te 80 kg ile 6 tekrar yapabiliyorsanız, tahmini 1RM değeriniz ~96 kg'dır. Kendi maksimumlarınızı hesaplamak için 1RM aracımızı kullanabilirsiniz.",
      action: { label: "1RM Güç Hesaplayıcı 🏋️‍♂️", tab: "/hesaplama/1rm", isRoute: true }
    },
    // 20. Plate Calc
    {
      id: "plate_calc",
      keywords: ["plaka", "bar agirligi", "bara ne takmaliyim", "plaka hesapla", "bar plakasi", "plakalar"],
      weight: 1.2,
      text: "Hedeflediğiniz antrenman ağırlığını bara dengeli yerleştirmek, sakatlıkları önlemek ve stabiliteyi korumak için önemlidir. 🏋️\n\nÖrnek: Standart 20 kg Olimpik bar kullanarak toplam 90 kg kaldırmak istiyorsanız, barın her iki yanına 35'er kg plaka takmalısınız. Bu da her iki tarafa birer adet 20 kg, birer adet 10 kg ve birer adet 5 kg plaka takmak anlamına gelir.\n\nBara takmanız gereken plakaları hatasız hesaplamak için Plaka Hesaplayıcımızı kullanabilirsiniz.",
      action: { label: "Plaka Hesaplayıcıyı Aç 🏋️", tab: "/hesaplama/plaka", isRoute: true }
    },
    // 21. Sleep & Recovery
    {
      id: "sleep_recovery",
      keywords: ["uyku", "dinlenme", "recovery", "toparlanma", "overtraining", "surantrene", "dinlenmek", "cns", "sinir sistemi", "kas dinlenmesi"],
      weight: 1.0,
      text: "Kaslarınız antrenman yaparken uyarılır ve mikro yırtıklar oluşur; büyüme ve gelişim ise dinlenirken ve uykuda gerçekleşir. 😴\n\n**Toparlanma (Recovery) İlkeleri:**\n1. **Hormonal Salınım:** Her gece 7-9 saat uyuyun. Derin uyku (NREM) esnasında büyüme hormonu (GH) salınımı zirve yapar ve doku onarımını sağlar.\n2. **Overtraining (Sürantrene) Belirtileri:** Dinlenme nabzında artış, kronik eklem ağrıları, antrenman motivasyonunun sıfırlanması ve uyku bozuklukları yaşıyorsanız vücudunuz tükenmiş olabilir. Bu durumda 1 deload (hafif yüklenme) haftası planlayın.\n3. **Aktif Toparlanma:** Antrenman dışı günlerde LISS (hafif tempolu yürüyüşler) veya esneme egzersizleri kan akışını artırarak kaslardaki laktik asit birikimini ve DOMS ağrısını azaltır."
    },
    // 22. Pain & DOMS
    {
      id: "pain_doms",
      keywords: ["agri", "kas agrisi", "doms", "hamlik", "sakatlik", "kramp", "agriyor", "agrim var", "dizim", "omzum", "belim", "dirsegim"],
      weight: 1.0,
      text: "Antrenmandan 24-48 saat sonra ortaya çıkan kas ağrıları genel olarak **DOMS (Delayed Onset Muscle Soreness - Gecikmiş Kas Ağrısı)** olarak adlandırılır. 🩹\n\n**DOMS Hakkında Klinik Gerçekler:**\n• Kas ağrısı her zaman kasın büyüdüğü anlamına gelmez; sadece kas liflerinin yeni bir harekete veya alışılmadık bir gerilime maruz kaldığını gösterir.\n• Ağrılı kas grubunu tamamen hareketsiz bırakmak yerine, hafif egzersizler ve esneme (stretching) hareketleriyle kan dolaşımını hızlandırıp ağrıyı hafifletebilirsiniz.\n• **KRİTİK UYARI:** Eklemlerinizde (omuz, diz, dirsek) batma veya keskin bir ağrı varsa, bu kas ağrısı değil sakatlık belirtisi olabilir. Keskin eklem ağrılarında antrenmanı durdurup bir hekime danışmalısınız. Egzersiz formlarınızı düzeltmek için Egzersiz Kütüphanemizi inceleyin.",
      action: { label: "Egzersiz Kütüphanesine Git 🏋️‍♂️", tab: "/egzersizler", isRoute: true }
    },
    // 23. Warmup & Cooldown
    {
      id: "warmup_stretch",
      keywords: ["isinma", "esneme", "stretching", "esnetme", "mobilite", "isinmak", "soguma", "esneklik", "acma germe"],
      weight: 1.0,
      text: "Sakatlıkları önlemek, eklem hareket açıklığını (ROM) maksimize etmek ve kaldırılan ağırlığı artırmak için doğru bir ısınma/soğuma protokolü şarttır. 🧘‍♂️\n\n**Antrenman Öncesi (Dinamik Isınma):**\n• Hafif tempo 5-10 dk kardiyo ile kan akışını artırın.\n• Çalışacağınız eklemleri (örneğin omuz veya kalça) dairesel hareketlerle ısıtın (Dinamik esneme).\n• İlk egzersize hafif kilolarla başlayarak (ısınma setleri) sinir sistemini hazırlayın. **Statik (beklemeli) esnemeleri antrenman öncesinde yapmayın**, güç kaybına yol açar.\n\n**Antrenman Sonrası (Statik Esneme):**\n• Kasları gevşetmek ve esnekliği artırmak için statik esnemeleri bu fazda yapın. Nabzın normale dönmesini sağlayın. Esneklik ve derin core direnci için Pilates seviye testimizi uygulayabilirsiniz.",
      action: { label: "Pilates Seviye Testini Aç 🤸‍♀️", tab: "/pilates/seviye-testi", isRoute: true }
    },
    // 24. Pilates
    {
      id: "pilates",
      keywords: ["pilates", "esneklik", "core", "omurga", "durus", "postur", "mat", "reformer"],
      weight: 1.0,
      text: "Pilates, derin kas gruplarını (core), omurga stabilitesini ve eklem mobilitesini hedef alan klinik bir hareket metodolojisidir. 🧘‍♀️\n\nVücuttaki kas dengesizliklerini gidermek, duruş bozukluklarını düzeltmek ve omurgayı korumak için antrenman rutininize ekleyebilirsiniz. Seviyenizi belirlemek için pilates testini uygulayabilirsiniz.",
      action: { label: "Pilates Seviye Testi 🤸‍♀️", tab: "/pilates/seviye-testi", isRoute: true }
    },
    // 25. Help Menu
    {
      id: "help_menu",
      keywords: ["yardim", "menu", "ne yapabilirsin", "komutlar", "destek", "yardim et", "secenekler", "yardim al", "kilavuz"],
      weight: 1.0,
      text: "Ben FitHub Biyometrik Koçuyum. 🧬 Size şu konularda bilimsel rehberlik yapabilirim:\n\n1. **Yağ Yakımı & Kilo Verme** ('kilo ver', 'yağ yak')\n2. **Kas Yapma & Hacim** ('kas yap', 'bulk', 'overload')\n3. **Beslenme & Protein** ('protein', 'kalori', 'beslenme')\n4. **Su & Hidrasyon** ('su tüketimi', 'dehidrasyon')\n5. **Bölünmeler & Programlar** ('hangi program', 'split')\n6. **Ölçüm & Biyometri** ('yağ oranım', 'bmi')\n7. **Kardiyo & Kalori** ('kardiyo', 'koşu')\n8. **Nabız Bölgeleri** ('nabız', 'bpm')\n9. **İdeal Kilo Analizi** ('ideal kilo')\n10. **Antrenman Teknikleri** ('ısınma', '1rm', 'plaka', 'recovery')\n\nHazır soruları alt kısımdan seçebilir veya bana serbestçe yazabilirsiniz!"
    },
    
    // ==========================================
    // FOODS & NUTRITION (26-30)
    // ==========================================
    {
      id: "food_egg",
      keywords: ["yumurta", "egg", "albumin", "sarisi", "beyazi"],
      title: "Yumurta: Biyolojik Altın Protein 🥚",
      weight: 1.2,
      text: "Yumurta, anne sütünden sonra biyolojik değeri en yüksek (%100 sindirilebilir albümin içeren) tam proteindir. Sarısı kolesterol (steroid hormonları sentezi için kritik), A, D, E, B12 vitaminleri ile sağlıklı doymuş/doymamış yağ asitlerini barındırır. Beyazı ise sıfır yağ içeren saf albümin proteinidir. Günde 3-5 adet tam yumurta yemek, sporcular için hormonal dengeyi destekleyen bir altın standarttır."
    },
    {
      id: "food_oat",
      keywords: ["yulaf", "oat", "yulaf ezmesi", "kompleks karbonhidrat"],
      title: "Yulaf Ezmesi ve Kompleks Karbonhidratlar 🥣",
      weight: 1.2,
      text: "Yulaf ezmesi, yavaş sindirilen (düşük glisemik indeksli), lif oranı (özellikle çözünebilir lif beta-glukan) zengin bir kompleks karbonhidrattır. İnsülin seviyesini sabit tutarak antrenman esnasında tükenmeyen, stabil bir glikojen salınımı sağlar. Egzersizden 1.5 - 2 saat önce tüketildiğinde antrenman performansını maksimize eder."
    },
    {
      id: "food_chicken",
      keywords: ["tavuk", "tavuk gogsu", "kumes hayvani", "tavuk eti"],
      title: "Tavuk Göğsü: Sporcunun Klasik Yakıtı 🍗",
      weight: 1.1,
      text: "Tavuk göğsü (derisiz ve kemiksiz), 100 gramında yaklaşık 23-25 gram yüksek kaliteli protein içerirken yağ oranı 1-2 gramı geçmeyen mükemmel bir yağsız protein kaynağıdır. Lösin gibi kas protein sentezini (MPS) başlatan esansiyel amino asitler bakımından zengindir. Definasyon döneminde kalori yönetimini kolaylaştırmak için bir numaralı tercihtir."
    },
    {
      id: "food_meat",
      keywords: ["kirmizi et", "bonfile", "kiyma", "dana", "kuzu", "antrikot", "et yemek"],
      title: "Kırmızı Et ve Doğal Kreatin Deposu 🥩",
      weight: 1.1,
      text: "Kırmızı et (dana bonfile, yağsız kıyma vb.), sadece biyolojik değeri yüksek protein sunmakla kalmaz; aynı zamanda hücre içi ATP üretimini artıran doğal **kreatin**, demir emilimini artıran **hem-demir**, l-karnitin ve çinko bakımından oldukça zengindir. Kas kütlesi ve testosteron üretimini desteklemek için haftalık beslenme planına 2-3 öğün yağsız kırmızı et eklenmesi önerilir."
    },
    {
      id: "food_fish",
      keywords: ["balik", "somon", "ton baligi", "omega3", "uskumru"],
      title: "Somon & Ton Balığı: Esansiyel Yağlar ve Hücresel Sağlık 🐟",
      weight: 1.1,
      text: "Somon, ton balığı, uskumru gibi yağlı balıklar; proteinin yanı sıra vücudun üretemediği esansiyel **Omega-3 (EPA & DHA)** yağ asitlerini yüksek miktarda içerir. Omega-3 yağ asitleri, antrenman sonrası gelişen kas içi inflamasyonu azaltarak recovery (toparlanma) sürecini kısaltır ve eklem sağlığını korur. Haftada en az 2 gün tüketilmesi biyometrik performans için elzemdir."
    },

    // ==========================================
    // SUPPLEMENT PROTOCOLS (31-40)
    // ==========================================
    {
      id: "supp_creatine",
      keywords: ["kreatin", "creatine", "monohidrat", "kreatin kullanimi", "su tutmasi"],
      title: "Kreatin Monohidrat Kullanım Protokolü 💊",
      weight: 1.3,
      text: "Kreatin Monohidrat, spor biliminde hakkında en çok araştırma yapılmış, gücü ve kas içi hidrasyonu (ATP depolarını yenileyerek) artıran takviyedir. Günde 3-5 gram düzenli olarak, günün herhangi bir saatinde alınması kas depolarını doldurmak için yeterlidir. Yükleme yapılması (günde 20g) şart değildir. Hücre içinde su tuttuğu için böbrek hasarı yapmaz ancak bol su tüketimi gerektirir."
    },
    {
      id: "supp_caffeine",
      keywords: ["kafein", "kahve", "caffeine", "espresso", "pre-workout", "uyarici"],
      title: "Kafein: Odaklanma ve Güç Çıkışı Protokolü ☕",
      weight: 1.2,
      text: "Kafein, adenozin reseptörlerini bloke ederek yorgunluğu geciktiren ve adrenalin salınımını artıran güçlü bir ergojenik yardımcıdır. Antrenmandan 30-45 dakika önce kg başına 3-5 mg (Örn: 80 kg sporcu için 240-400 mg) kullanımı patlayıcı gücü ve ağrı eşiğini yükseltir. Uyku kalitesini bozmamak adına yatmadan önceki 6-8 saat içinde kullanılmamalıdır."
    },
    {
      id: "supp_preworkout",
      keywords: ["preworkout", "antrenman oncesi", "no3", "pump", "sitrulin", "arginin"],
      title: "Pre-Workout (Antrenman Öncesi Nitrik Oksit) Takviyeleri ⚡",
      weight: 1.2,
      text: "Pre-Workout ürünleri genelde kafein (odaklanma), L-Sitrülin/Arjinin (damar genişlemesi ve nitrik oksit artışı ile kaslara daha fazla oksijen gitmesi - PUMP etkisi) ve Beta-Alanin (kas asiditesini tamponlama) içerir. Antrenmana başlamadan 30 dakika önce aç karnına alınması sindirimi kolaylaştırır. Kronik kalp rahatsızlığı veya tansiyon hassasiyeti olanlar doktora danışmalıdır."
    },
    {
      id: "supp_bcaa",
      keywords: ["bcaa", "aminoasit", "loysin", "valin", "izoloysin", "amino asit"],
      title: "BCAA (Dallı Zincirli Amino Asitler) Analizi 🧪",
      weight: 1.1,
      text: "BCAA'lar (Lösin, İzolösin, Valin) esansiyel amino asitlerdir. Kas protein sentezini (MPS) başlatan anahtar Lösin'dir. Ancak, eğer günlük protein ihtiyacınızı katı gıdalarla veya Whey protein takviyesi ile karşılıyorsanız, ekstra BCAA kullanımı gereksizdir. Sadece çok uzun süreli açlık antrenmanlarında kas yıkımını (katabolizmayı) önlemek için tercih edilebilir."
    },
    {
      id: "supp_gainer",
      keywords: ["gainer", "karbonhidrat tozu", "hacim tozu", "kilo aldirici"],
      title: "Gainer: Yüksek Kalorili Hacim Desteği 🥤",
      weight: 1.1,
      text: "Gainer (Kilo aldırıcılar), porsiyon başına 800-1200 kalori ve yüksek oranda karbonhidrat/protein sunan pratik gıda takviyeleridir. Ektomorf (hızlı metabolizmalı) vücut tipine sahip olup katı gıdalarla kalori fazlası yaratmakta zorlanan sporcular için uygundur. Yağlanmayı önlemek adına porsiyonlar bölünerek antrenman sonrasında tüketilebilir."
    },
    {
      id: "supp_carnitine",
      keywords: ["l-karnitin", "carnitine", "cla", "l carnitine", "yag yakici"],
      title: "L-Karnitin & CLA Yağ Yakım Analizi 🔥",
      weight: 1.2,
      text: "L-Karnitin, yağ asitlerinin enerji olarak yakılmak üzere mitokondriye taşınmasını sağlar. Egzersiz öncesi 1500-2000 mg kullanımı kardiyo performansını artırır ve yağ oksidasyonunu destekler. CLA ise yağ hücrelerinin depolanmasını önlemeyi hedefler. Ancak her iki takviye de bir 'kalori açığı' diyet planı olmadan tek başına yağ yakamaz. Mucizevi yağ yakıcı diye bir şey yoktur."
    },
    {
      id: "supp_beta_alanine",
      keywords: ["beta alanin", "karincalanma", "beta alanine", "kas asitligi"],
      title: "Beta-Alanine ve Kas Dayanıklılığı 🧪",
      weight: 1.2,
      text: "Beta-Alanin, kaslarda karnozin seviyesini artırarak laktik asit birikimini ve hidrojen iyonlarını tamponlar. Bu sayede 60-240 saniye aralığındaki yüksek yoğunluklu setlerde (Örn: yüksek tekrarlı bacak antrenmanları) tükenişi geciktirir. Günde 3-6g kullanımı etkilidir. Alındıktan hemen sonra ciltte hissettiğiniz geçici 'karıncalanma' (parestazi) tamamen zararsız bir sinirsel yan etkidir."
    },
    {
      id: "supp_zma",
      keywords: ["zma", "cinko", "magnezyum", "b6", "testosteron"],
      title: "ZMA: Derin Uyku ve Hormonal Destek 🌙",
      weight: 1.2,
      text: "ZMA; Çinko (hücresel büyüme ve testosteron sentezi), Magnezyum (kas gevşemesi ve sinir sistemi toparlanması) ve Vitamin B6 kombinasyonudur. Yatmadan 30-60 dakika önce boş mideye alınması uyku kalitesini (özellikle derin ve REM uykusunu) artırır, sabahları daha zinde uyanmanızı sağlar ve eksik mineralleri tamamlayarak serbest testosteronu destekler."
    },
    {
      id: "supp_omega3",
      keywords: ["balikyagi", "omega 3", "balik yagi", "dha", "epa"],
      title: "Omega-3 (Balık Yağı) Hücresel Performans 🐟",
      weight: 1.1,
      text: "Omega-3 yağ asitleri (özellikle EPA ve DHA), hücre zarlarının esnekliğini artırır, kalp-damar sağlığını korur ve antrenman stresinden kaynaklanan kronik inflamasyonu azaltır. Ağır antrenman yapan bireylerde eklem ağrılarını hafiflettiği ve protein sentezini optimize ettiği klinik olarak kanıtlanmıştır. Günde en az 1000-2000 mg kombine EPA/DHA tüketilmesi önerilir."
    },
    {
      id: "supp_vitamins",
      keywords: ["vitamin", "d3", "b12", "multivitamin", "mineral"],
      title: "Vitamin D3, B12 ve Multivitamin İhtiyacı 💊",
      weight: 1.1,
      text: "Sporcular için Vitamin D3 (kas gücü, kalsiyum emilimi ve bağışıklık) ve Vitamin B12 (kırmızı kan hücresi üretimi ve sinir sistemi sağlığı) kritiktir. Kapalı alanda çalışan ve ağır antrenman yapan bireylerde D3 eksikliği sık görülür. Kan tahlili sonuçlarına göre günlük 2000-5000 IU D3 vitamini ile B12 takviyesi, genel güç çıkışını doğrudan korur."
    },

    // ==========================================
    // SCIENCE & RECOVERY METHODOLOGY (41-43)
    // ==========================================
    {
      id: "science_circadian",
      keywords: ["sirkadiyen", "melatonin", "derin uyku", "uyku hijyeni", "circadian"],
      title: "Sirkadiyen Ritim ve Uyku Hijyeni 🧠",
      weight: 1.2,
      text: "Sirkadiyen Ritim, vücudumuzun 24 saatlik biyolojik saatidir. Uyku kalitesi, kas onarımı (büyüme hormonu salınımı) ve stres hormonu kortizol dengesi için kritiktir.\n\n**Uyku Hijyeni Protokolü:**\n1. Her gün aynı saatte uyanın (Hafta sonu dahil).\n2. Yatağa girmeden en az 1 saat önce telefon/mavi ışık maruziyetini kesin (Mavi ışık melatonin salınımını bloke eder).\n3. Yatak odasının tamamen karanlık ve serin (18-20 derece) olmasını sağlayın."
    },
    {
      id: "science_rpe",
      keywords: ["rpe", "rir", "tukenis", "zorluk derecesi", "tukenise gitmek"],
      title: "RPE & RIR: Antrenman Şiddeti Ölçümü 📊",
      weight: 1.3,
      text: "Merkezi Sinir Sistemini (CNS) aşırı yıpratmadan hipertrofiyi tetiklemek için set şiddetini doğru ayarlamalısınız.\n\n• **RIR (Reps in Reserve):** Sette tükenişe kalan tahmini tekrar sayısıdır. (Örn: RIR 2 = Sette 2 tekrar daha yapabilirdim ama bıraktım).\n• **RPE (Rate of Perceived Exertion):** 1-10 arası algılanan zorluk derecesidir. (RPE 8 = RIR 2, yani set oldukça ağırdı).\n\nGelişim için ana egzersiz setlerinizi genelde RPE 7-9 (RIR 1-3) aralığında tutun. Her seti mutlak tükenişe (RPE 10) götürmek toparlanma sürenizi aşırı uzatabilir."
    },
    {
      id: "science_deload",
      keywords: ["deload", "deload haftasi", "aktif dinlenme", "antrenman hafifletme"],
      title: "Deload: Stratejik Geri Çekilme Haftası 📉",
      weight: 1.2,
      text: "Sürekli ağır yüklenme (Progressive Overload), eklemlerde, tendonlarda ve sinir sisteminde (CNS) kronik mikro hasarlar biriktirir. 8-12 haftalık sert antrenman periyodunun ardından 1 deload haftası planlanmalıdır.\n\n**Deload Protokolü:**\n• **Hacim Düşüşü:** Kaldırdığınız ağırlıkları değiştirmeden set sayılarını %50 oranında azaltın.\n• **Yoğunluk Düşüşü:** Veya set sayılarını koruyarak kaldırdığınız ağırlıkları %30-40 oranında düşürün.\n\nBu süreç kas kaybı yaptırmaz; tam tersine süper-adaptasyon (supercompensation) ile bir sonraki döngüde daha ağır kaldırmanızı sağlar."
    },

    // ==========================================
    // ATHLETIC MYTHS DEBUNKED (44-48)
    // ==========================================
    {
      id: "myth_spot_reduction",
      keywords: ["bolgesel zayiflama", "bolgesel yag yakma", "gobek eritme", "bolgesel"],
      title: "MİT: Bölgesel Yağ Yakımı Mümkün mü? ❌",
      weight: 1.3,
      text: "Hayır, belirli bir bölgeyi (örneğin sadece göbeği veya baseni) çalıştırarak o bölgeden yağ yakmak fizyolojik olarak **mümkün değildir**. Yağ hücreleri, enerji açığı oluştuğunda tüm vücuttan sistemik olarak (hormonlar aracılığıyla) kana salınarak yakılır. Karın egzersizleri (mekik vb.) karın kaslarınızı güçlendirir ama üzerindeki yağ tabakasını eritmez. Çözüm: Kalori açığı yaratarak sabırla toplam yağ oranını düşürmektir."
    },
    {
      id: "myth_fasted_cardio",
      keywords: ["ac kardiyo", "aclik kardiyosu", "ac karnina kardiyo", "fasted cardio"],
      title: "MİT: Aç Karnına Kardiyo Daha Fazla Yağ Yakar mı? 🏃‍♂️",
      weight: 1.2,
      text: "Aç karnına yapılan kardiyo antrenmanlarında, egzersiz esnasında yağ oksidasyonu (yağ yakımı) hafifçe daha yüksek olsa da, vücut 24 saatlik döngüde bunu dengelemek için günün geri kalanındaki yağ yakımını azaltır. Klinik araştırmalar, gün sonunda kalori açığı eşit olduğu sürece tok veya aç kardiyo yapmanın yağ kaybı açısından **hiçbir farkı olmadığını** göstermiştir. Hangisinde kendinizi daha enerjik hissediyorsanız onu tercih edin."
    },
    {
      id: "myth_late_eating",
      keywords: ["gece yemek", "gece yemek yemek", "saat 8 den sonra", "gece yemek kilo aldirir"],
      title: "MİT: Gece Saat 8'den Sonra Yemek Yemek Kilo Aldırır mı? 🌙",
      weight: 1.2,
      text: "Vücudumuz saat 20:00'dan sonra aldığımız kalorileri sihirli bir şekilde doğrudan yağa dönüştürmez. Kilo alımı veya kaybı, gün boyunca aldığınız toplam kalori miktarı ile harcadığınız kalori miktarı arasındaki dengeye bağlıdır. Gece geç saatte yemek yemenin tek dezavantajı, sindirim sisteminin aktif kalması nedeniyle derin uyku kalitesini (REM) bozması ve dolaylı olarak kortizolü artırabilmesidir. Uykudan 2-3 saat önce yemeyi kesmek idealdir."
    },
    {
      id: "myth_detox",
      keywords: ["detoks", "detox", "su diyeti", "vucut temizleme", "detoks suyu"],
      title: "MİT: Detoks Diyetleri Vücudu Toksinlerden Temizler mi? 🍏",
      weight: 1.1,
      text: "Özel bitki çayları, meyve suları veya su diyetleri vücudu toksinlerden temizlemez. İnsan vücudunun mükemmel çalışan, 24 saat aktif iki devasa doğal detoks organı vardır: **Karaciğer ve Böbrekler**. Detoks suları içtiğinizde hızlı kilo verdiğinizi görmenizin sebebi toksin atılması değil, düşük kalori ve karbonhidrat alımına bağlı olarak vücuttaki glikojen depolarının ve suyun (ödem) atılmasıdır. Sağlıklı beslenin, böbreklerinizi yormayın."
    },
    {
      id: "myth_egg_yolk",
      keywords: ["yumurta sarisi", "kolesterol", "sarisi zararli", "yolk", "yumurta kolesterolu"],
      title: "MİT: Yumurta Sarısı Zararlı ve Kolesterolü Yükseltir mi? 🍳",
      weight: 1.2,
      text: "Yıllarca yumurta sarısının yüksek kolesterol içerdiği için kalp krizine yol açtığı iddia edilmiştir. Ancak güncel klinik çalışmalar, besinlerden alınan kolesterolün sağlıklı bireylerde kan kolesterol seviyelerini doğrudan olumsuz etkilemediğini, karaciğerin besin alımına göre kendi kolesterol üretimini dengelediğini kanıtlamıştır. Yumurta sarısı; kolin (beyin sağlığı), lutein, sağlıklı yağlar ve testosteron sentezinde kullanılan ham maddeleri içerir. Günde 3-4 adet tam yumurta tüketimi güvenlidir."
    },

    // ==========================================
    // EMOTIONAL STATE & MOTIVATION (49-50)
    // ==========================================
    {
      id: "emotional_sad",
      keywords: ["mutsuzum", "moralim bozuk", "depresyon", "modum dusuk", "halsizim", "yorgunum", "biktam", "canim sikkin"],
      title: "Koçtan Zihinsel Destek ve Toparlanma Tavsiyesi 🧠",
      weight: 1.3,
      text: "Bugün zihinsel olarak yorgun, halsiz veya motivasyonsuz hissetmeniz son derece normal. Biyolojik süreçler sadece kaslardan ibaret değildir; hormonal dalgalanmalar, stres (kortizol), düzensiz uyku veya zihinsel yorgunluk doğrudan fiziksel modunuzu düşürür.\n\n**Bugün İçin Koç Önerisi:**\n1. Kendinizi ağır kaldırmak için zorlamayın. Ağır bir antrenman yerine sadece 20-30 dakika hafif tempolu bir yürüyüş (LISS) yapın. Açık hava ve hareket, dopamin ve serotonin salınımını tetikler.\n2. Yeterli su içtiğinizden emin olun; hafif dehidrasyon bile beyin fonksiyonlarını yavaşlatıp kronik yorgunluk hissi verir.\n3. Unutmayın: Disiplin, sadece harika hissettiğimizde değil, en isteksiz olduğumuz günlerde de kendimize verdiğimiz sözü tutmaktır. Yarın daha güçlü döneceğiz!"
    },
    {
      id: "social_wishes",
      keywords: ["gunaydin", "iyi geceler", "iyi uykular", "tatli ruyalar"],
      weight: 1.1,
      text: "Harika bir gün/gece dilerim! 🧬 Biyolojik saatinizi (sirkadiyen ritim) korumak adına uyku ve uyanma saatlerinizi stabil tutmaya özen gösterin. Kas sentezi, büyüme hormonu ve zihinsel tazelenme uykuda gerçekleşir. Kendinize iyi bakın, disiplinli kalmaya devam edin!"
    }
  ];

  // 1. Calculate matching score for each KB item
  let bestItem: KBItem | null = null;
  let maxScore = 0;

  for (const item of kb) {
    let keywordHits = 0;
    const stemmedKeywords = getTokens(item.keywords.join(" ")).map(stemWord);
    
    // Count direct keyword token matches
    for (const token of queryTokens) {
      if (stemmedKeywords.includes(token)) {
        keywordHits += 1.0;
      }
    }
    
    // Calculate structural token similarity
    const jaccard = calculateJaccard(queryTokens, stemmedKeywords);
    
    // Combined score
    const totalScore = (jaccard * 10) + (keywordHits * item.weight);
    
    if (totalScore > maxScore) {
      maxScore = totalScore;
      bestItem = item;
    }
  }

  // Define threshold for minimum match confidence
  const MATCH_THRESHOLD = 0.55;

  if (bestItem && maxScore >= MATCH_THRESHOLD) {
    // -------------------------------------------------------------
    // DYNAMIC & PERSONALIZED RESPONSE INJECTIONS
    // -------------------------------------------------------------
    
    // 1. Greetings
    if (bestItem.id === "greetings") {
      const greetingName = profile?.full_name?.split(' ')[0] || "Sporcu";
      return {
        sender: "assistant",
        text: `Merhaba ${greetingName}! Harika bir gün geçirmenizi dilerim. 🧬 Ben FitHub Biyometrik Koçunuz.\n\nAntrenman seanslarınızı, beslenme makrolarınızı ve vücut ölçülerinizi girdikçe gelişim trendlerinizi analiz eder, size bilimsel performans tavsiyeleri sunarım.\n\nBugün hangi konuyu detaylandıralım? Bana kilo kontrolü, yağ yakımı, kas kütlesi kazanımı, su tüketimi, kardiyo nabız bölgeleri veya gelişim skorunuz hakkında sorular sorabilirsiniz. Tüm başlıkları görmek için 'yardım' yazabilirsiniz!`,
        timestamp: new Date()
      };
    }

    // 6. Joke Motivation
    if (bestItem.id === "joke_motivation") {
      const jokes = [
        "Kaslarım ve ben bugün antrenmana gitmemek için 40 farklı bilimsel bahane ürettik ama yerçekimi yine de kazandı. 🏋️‍♂️",
        "Neden Bench Press yaparken gözlerinizi kapatırsınız? Çünkü acı gerçekleri görmek istemezsiniz! 🤫",
        "Kardiyo yaparken zamanın ne kadar yavaş aktığını fark ettiniz mi? Albert Einstein görelilik kuramını koşu bandında bulmuş olabilir. 🏃‍♂️",
        "Spor salonunun en zor hareketi hangisidir bilir misiniz? Çantayı hazırlayıp kapıdan dışarı adım atmak! O adımı attıysanız gerisi kolay."
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        sender: "assistant",
        text: `Spor disiplini ciddiyet gerektirir ama arada gülmek de kortizol seviyesini düşürür! 😄 İşte sizin için:\n\n"${randomJoke}"`,
        timestamp: new Date()
      };
    }

    // 8. General Status
    if (bestItem.id === "general_status") {
      let advice = `Biyometrik laboratuvar verileriniz üzerinde yaptığım durum analizi 📊:\n\n`;
      if (biometricReport) {
        advice += `• **Gelişim Skoru (Science Score):** **${scienceScore}/100** (${scienceScore >= 80 ? 'Zirve Disiplin' : scienceScore >= 50 ? 'Gelişim Modu' : 'Başlangıç Aşaması'})\n`;
        advice += `• **Vücut Ağırlığı:** ${biometricReport.userProfile.weight} kg (Son Ölçüm)\n`;
        if (biometricReport.bodyFat) {
          advice += `• **Yağ Oranı:** %${biometricReport.bodyFat.value} (${biometricReport.bodyFat.status})\n`;
        }
        if (biometricReport.training) {
          advice += `• **Haftalık Seans Sıklığı:** ${biometricReport.training.consistencyScore} antrenman\n`;
          if (biometricReport.training.volumeTrend !== 'insufficient_data') {
            advice += `• **Aşırı Yüklenme (Overload) Trendi:** ${biometricReport.training.volumeTrendLabel}\n`;
          }
        }
        advice += `\n**Biyometrik Değerlendirme:**\n`;
        if (scienceScore >= 80) {
          advice += `Süreciniz mükemmel gidiyor. Ölçüm sıklığınız, antrenman hacminiz ve beslenme disiplininiz optimal seviyede. Form koruma veya kontrollü büyüme hedefinize bağlı kalarak devam edin.`;
        } else if (scienceScore >= 40) {
          advice += `Aktif bir gelişim sürecindesiniz ancak potansiyelinizi maksimize etmek için eksiklerinizi tamamlayabilirsiniz. Özellikle su tüketimi ve haftalık egzersiz sıklığını artırmaya odaklanın.`;
        } else {
          advice += `Laboratuvar veri akışınız zayıf görünüyor. Daha tutarlı gelişim puanı almak ve analizleri doğrulamak için haftalık ölçüm girmeyi ve antrenman seanslarınızı kaydetmeyi unutmayın.`;
        }
      } else {
        advice += `Sistemde henüz biyometrik kaydınız bulunmuyor. Lütfen gelişim panelinden ilk ölçümlerinizi ve profil ayarlarınızı girin.`;
      }
      return {
        sender: "assistant",
        text: advice,
        action: { label: "Gelişim Sayfasına Git 📊", tab: "/hesap", isRoute: true },
        timestamp: new Date()
      };
    }

    // 9. Weight Loss
    if (bestItem.id === "weight_loss") {
      let advice = `Yağ yakımı (definasyon) temel bir matematik prensibine dayanır: **Kalori Açığı (Caloric Deficit)**. 📉\n\n`;
      if (biometricReport?.userProfile?.weight > 0) {
        const { weight, bmr, tdee, targetCalories } = biometricReport.energy || {
          weight: biometricReport.userProfile.weight,
          bmr: Math.round(10 * biometricReport.userProfile.weight + 6.25 * biometricReport.userProfile.height - 5 * biometricReport.userProfile.age + 5),
          tdee: Math.round((10 * biometricReport.userProfile.weight + 6.25 * biometricReport.userProfile.height - 5 * biometricReport.userProfile.age + 5) * 1.55),
          targetCalories: Math.round((10 * biometricReport.userProfile.weight + 6.25 * biometricReport.userProfile.height - 5 * biometricReport.userProfile.age + 5) * 1.55) - 450
        };
        advice += `Biyometrik verilerinize göre analizimiz:\n`;
        advice += `• Güncel Kilonuz: **${weight} kg**\n`;
        advice += `• Bazal Metabolizma Hızınız (BMR): **${bmr} kcal**\n`;
        advice += `• Günlük Harcamanız (TDEE): **${tdee} kcal**\n`;
        advice += `• Yağ Yakımı İçin Alınması Gereken Kalori: **${targetCalories} kcal** (Günlük ~450 kcal açık).\n\n`;
      } else {
        advice += `Vücut ölçümleriniz girilmediği için tam kalori hesabı yapamadım. Yağ yakımı için günlük aktif kalori harcamanızın (TDEE) yaklaşık 400-500 kcal altında beslenmelisiniz.\\n\\n`;
      }
      advice += `**Altın Kurallar:**\n`;
      advice += `1. Kas kaybını önlemek için kilo başına en az **1.8 - 2.0g protein** alın.\n`;
      advice += `2. Ağırlık antrenmanlarını bırakmayın, mekanik tansiyonu koruyun.\n`;
      advice += `3. Günlük su alımını yüksek tutarak metabolik atıkları temizleyin.`;
      
      return {
        sender: "assistant",
        text: advice,
        action: { label: "Kalori İhtiyacını Hesapla 📊", tab: "/hesaplama/kalori", isRoute: true },
        timestamp: new Date()
      };
    }

    // 10. Muscle Gain
    if (bestItem.id === "muscle_gain") {
      let advice = `Kas kütlesi kazanımı ve hacimlenme (hipertrofi) süreci **Kalori Fazlası (Caloric Surplus)** ve **Aşamalı Aşırı Yükleme (Progressive Overload)** gerektirir. 🏋️‍♂️\n\n`;
      if (biometricReport?.userProfile?.weight > 0) {
        const bmr = Math.round(10 * biometricReport.userProfile.weight + 6.25 * biometricReport.userProfile.height - 5 * biometricReport.userProfile.age + 5);
        const tdee = Math.round(bmr * 1.55);
        const bulkCal = tdee + 300;
        advice += `Biyometrik verilerinize göre analizimiz:\n`;
        advice += `• Bazal Metabolizma Hızınız (BMR): **${bmr} kcal**\n`;
        advice += `• Günlük Harcamanız (TDEE): **${tdee} kcal**\n`;
        advice += `• Kas Kazanımı (Clean Bulk) Hedefiniz: **${bulkCal} kcal** (Günlük ~300 kcal kontrollü fazlalık).\n\n`;
      }
      advice += `**Kas Kazanım İlkeleri:**\n`;
      advice += `1. **Sürekli Overload:** Antrenmanlarda setleri, tekrarları veya kaldırılan ağırlıkları (hacmi) her hafta az da olsa artırın.\n`;
      advice += `2. **MPS (Kas Sentezi):** Gün boyunca 3-4 öğüne dağıtılmış kaliteli protein tüketin.\n`;
      advice += `3. **Toparlanma:** Kaslar antrenmanda uyarılır, dinlenirken ve uykuda büyür. 7-8 saat kaliteli uyku şarttır.`;

      return {
        sender: "assistant",
        text: advice,
        action: { label: "Makro Oranlarını Hesapla 🍎", tab: "/hesaplama/makro", isRoute: true },
        timestamp: new Date()
      };
    }

    // 11. Protein & Nutrition
    if (bestItem.id === "protein_nutrition") {
      let advice = `Vücut kompozisyonunu değiştirmek için makro besin öğelerinin doğru dağıtılması kritik önem taşır. 🥩\n\n`;
      if (biometricReport?.userProfile?.weight > 0) {
        const weight = biometricReport.userProfile.weight;
        const targetPro = Math.round(weight * 2);
        advice += `Ağırlığınıza (**${weight} kg**) göre günlük tavsiye edilen protein alımınız: **${targetPro} gramdır** (Kilo başına ~2g).\n\n`;
      } else {
        advice += `Günlük protein alımınız sporcular için vücut ağırlığınızın kilogramı başına **1.8 - 2.2 gram** aralığında olmalıdır.\n\n`;
      }
      advice += `**Makro Dağılım İlkeleri:**\n`;
      advice += `• **Protein:** Kas sentezi (MPS) ve hücre yenilenmesi için yapı taşıdır (Tavuk, hindi, balık, yumurta, lor peyniri).\n`;
      advice += `• **Karbonhidrat:** Antrenmanda birincil enerji kaynağıdır (Pirinç, yulaf, patates, makarna). Sıfırlanmamalıdır.\n`;
      advice += `• **Yağlar:** Testosteron ve hormonal sentez için elzemdir (Zeytinyağı, avokado, kuruyemişler).\n\n`;
      advice += `**Bilgi:** Günlük beslenmenizi kontrol etmek için Hesabım panelindeki 'Beslenme' sekmesinden kayıt ekleyebilirsiniz.`;

      return {
        sender: "assistant",
        text: advice,
        action: { label: "Beslenme Planına Git 🍽️", tab: "/hesap", isRoute: true },
        timestamp: new Date()
      };
    }

    // 13. Hydration
    if (bestItem.id === "hydration") {
      let advice = `Su, kas hücrelerinin %70'inden fazlasını oluşturur. Dehidre (susuz) kalmış bir hücrede protein sentezi ve ATP (enerji) üretimi önemli ölçüde yavaşlar. 💧\n\n`;
      if (biometricReport?.userProfile?.weight > 0) {
        const targetWater = (biometricReport.userProfile.weight * 0.035).toFixed(1);
        advice += `Mevcut ağırlığınıza göre günlük asgari su ihtiyacınız: **${targetWater} Litre** düzeyindedir.\n\n`;
      } else {
        advice += `Spor yapan bireyler için günlük su tüketimi kilo başına **35 ml** (Ortalama 2.5 - 3.5 Litre) olmalıdır.\n\n`;
      }
      advice += `**Susuzluğun Etkileri:** %2'lik bir su kaybı bile antrenman performansınızı ve odaklanmanızı %15-20 oranında baltalayabilir. Böbreklerin süzüm gücü ve vücut ısısı dengesi için su tüketimini gün içine yayın.`;

      return {
        sender: "assistant",
        text: advice,
        action: { label: "Su İhtiyacını Hesapla 🥛", tab: "/hesaplama/su", isRoute: true },
        timestamp: new Date()
      };
    }

    // 17. Heart Rate Zones
    if (bestItem.id === "heart_rate") {
      let ageVal = 25;
      if (biometricReport?.userProfile?.age) {
        ageVal = biometricReport.userProfile.age;
      }
      const maxBpm = 220 - ageVal;
      const zone2Min = Math.round(maxBpm * 0.6);
      const zone2Max = Math.round(maxBpm * 0.7);
      const zone3Min = Math.round(maxBpm * 0.7);
      const zone3Max = Math.round(maxBpm * 0.8);
      
      let advice = `Kalp damar sağlığı ve yağ yakımı için antrenman sırasındaki nabız aralığınız son derece önemlidir. 💓\n\n`;
      advice += `Yaşınıza (**${ageVal}**) göre tahmini Maksimum Nabzınız: **${maxBpm} BPM**\n\n`;
      advice += `**Hedef Nabız Bölgeleri (Zones):**\n`;
      advice += `• **Yağ Yakımı (Zone 2 - %60-70):** **${zone2Min} - ${zone2Max} BPM** aralığıdır. Yağ asitlerinin enerji kaynağı olarak en aktif kullanıldığı, mitokondriyal yoğunluğu artıran optimal seviyedir.\n`;
      advice += `• **Kondisyon/Aerobik (Zone 3 - %70-80):** **${zone3Min} - ${zone3Max} BPM** aralığıdır. Kardiyovasküler kapasitenizi, akciğer ve kalp kondisyonunuzu geliştirir.\n`;
      advice += `• **Anaerobik Eşik (Zone 4 - %80-90):** **${Math.round(maxBpm * 0.8)} - ${Math.round(maxBpm * 0.9)} BPM** aralığıdır. Laktik asit toleransını yükseltir ve yüksek güç üretimi sağlar.`;

      return {
        sender: "assistant",
        text: advice,
        action: { label: "Hedef Nabzını Hesapla 💓", tab: "/hesaplama/nabiz", isRoute: true },
        timestamp: new Date()
      };
    }

    // 18. Ideal Weight
    if (bestItem.id === "ideal_weight") {
      let heightVal = 175;
      let genderVal = "erkek";
      if (biometricReport?.userProfile?.height) {
        heightVal = biometricReport.userProfile.height;
        genderVal = biometricReport.userProfile.gender;
      }
      
      // Robinson Formula
      const heightInInches = heightVal / 2.54;
      const inchesOver5Foot = Math.max(0, heightInInches - 60);
      let robinsonIdeal = 0;
      if (genderVal === "erkek") {
        robinsonIdeal = 50 + 1.9 * inchesOver5Foot;
      } else {
        robinsonIdeal = 45.5 + 1.7 * inchesOver5Foot;
      }
      robinsonIdeal = parseFloat(robinsonIdeal.toFixed(1));

      let advice = `İdeal vücut ağırlığı sadece boyunuza değil; kemik yoğunluğunuza, kas kütlenize ve genel vücut tipinize bağlıdır. 📏\n\n`;
      advice += `Boyunuza (**${heightVal} cm**) ve cinsiyetinize (**${genderVal === "erkek" ? "Erkek" : "Kadın"}**) göre klinik Robinson (1983) formülüyle ideal kilonuz: **${robinsonIdeal} KG** olarak hesaplanmıştır.\n\n`;
      advice += `**Gelişim Tavsiyesi:** Yağ oranınız atletik sınırlardaysa (%8-15 erkekler, %16-23 kadınlar), bu ideal kilonun üzerinde olmanız kas kütlenizin yüksek olduğunu gösterir ve oldukça sağlıklıdır. Detaylı sınır analizleri için ideal kilo aracını inceleyin.`;

      return {
        sender: "assistant",
        text: advice,
        action: { label: "İdeal Kilo Analizörünü Aç 📏", tab: "/hesaplama/ideal-kilo", isRoute: true },
        timestamp: new Date()
      };
    }

    // Standard static/title text for everything else
    let finalOutput = bestItem.text;
    if (bestItem.title) {
      finalOutput = `**Biyometrik Bilgi Bankası - ${bestItem.title}**\n\n${bestItem.text}`;
    }

    return {
      sender: "assistant",
      text: finalOutput,
      action: bestItem.action,
      timestamp: new Date()
    };
  }

  // -------------------------------------------------------------
  // FALLBACK (No close match found)
  // -------------------------------------------------------------
  let fallbackText = `Sorunuzu spor fizyolojisi kurallarımızla tam olarak eşleştiremedim. 🧐\n\nBana şu konularda sorular yöneltebilirsiniz:\n`;
  fallbackText += `• **Biyometri:** 'yağ oranım', 'BMI endeksi', 'ideal kilom kaç'\n`;
  fallbackText += `• **Beslenme:** 'günlük protein ihtiyacı', 'yulaf', 'yumurta', 'kreatin', 'su tüketimi'\n`;
  fallbackText += `• **Antrenman:** 'progressive overload', 'antrenman spliti', 'ısınma protokolü', 'kas ağrısı'\n`;
  fallbackText += `• **Mitler:** 'bölgesel zayıflama', 'aç kardiyo', 'gece yemek yemek'\n`;
  fallbackText += `• **Sosyal:** 'nasılsın', 'sen kimsin', 'mutsuzum', 'günaydın'\n\n`;

  if (biometricReport?.training) {
    if (biometricReport.training.consistencyScore === 0) {
      fallbackText += `💡 **Koç İpucu:** Bu hafta henüz antrenman tamamlamamış görünüyorsunuz. Yeni bir program başlatmak için 'program' yazabilirsiniz!`;
    } else if (measurements.length === 0) {
      fallbackText += `💡 **Koç İpucu:** Henüz vücut ölçümlerinizi girmemişsiniz. Biyometrik analizi başlatmak için panelden 'Ölçümler' sekmesine gidin.`;
    }
  }

  return {
    sender: "assistant",
    text: fallbackText,
    timestamp: new Date(),
    unmatched: true
  };
}

/**
 * Sohbet balonuna uygun kısa yanıt üretir: ilk paragraflar + en fazla 3 madde,
 * toplamda ~460 karakter. Cümle ortasında kesmez; fazla maddeleri atar.
 */
export function compactReply(text: string): string {
  const MAX_CHARS = 460;
  const MAX_BULLETS = 3;
  const lines = text.split("\n");
  const kept: string[] = [];
  let chars = 0;
  let bullets = 0;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const isBullet = /^[•\-]\s+/.test(line.trim());

    if (isBullet) {
      bullets += 1;
      if (bullets > MAX_BULLETS) continue;
    }

    if (line.trim() && chars + line.length > MAX_CHARS && kept.some((item) => item.trim())) break;

    // Tek başına aşırı uzun paragrafı cümle sonunda kırp.
    let candidate = line;
    if (!isBullet && candidate.length > 300) {
      const slice = candidate.slice(0, 300);
      const cut = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
      if (cut > 80) candidate = slice.slice(0, cut + 1);
    }

    kept.push(candidate);
    chars += candidate.length;
  }

  // Sondaki boş satırları temizle.
  while (kept.length && !kept[kept.length - 1].trim()) kept.pop();
  return kept.join("\n") || text;
}

export function processAssistantQuery(
  text: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  biometricReport: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  measurements: any[],
  assistantChecklist: string[],
  scienceScore: number
): ChatMessage {
  const message = resolveAssistantQuery(text, biometricReport, profile, measurements, assistantChecklist, scienceScore);
  return { ...message, text: compactReply(message.text) };
}

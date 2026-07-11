export type MeasurementAnalysisKey =
  | "vki"
  | "calorie"
  | "macro"
  | "oneRm"
  | "heartRate"
  | "water"
  | "idealWeight"
  | "waistHeight"
  | "waistHip"
  | "cardio"
  | "volume"
  | "plates"
  | "bodyComposition";

export interface MeasurementAnalysisDefinition {
  title: string;
  intro: string;
  metrics: Array<{ label: string; description: string }>;
  ranges?: Array<{ value: string; label: string; meaning: string }>;
  interpretation: string[];
  limitations: string;
  nextSteps: string[];
}

export const MEASUREMENT_ANALYSES: Record<MeasurementAnalysisKey, MeasurementAnalysisDefinition> = {
  vki: {
    title: "VKİ sonucunuzu nasıl okumalısınız?",
    intro: "VKİ, vücut ağırlığınızı boyunuza göre standartlaştırır. Tek başına tanı koymaz; ilk risk taraması ve zaman içindeki değişimi izlemek için kullanılır.",
    metrics: [
      { label: "VKİ skoru", description: "Kilonun, metre cinsinden boyun karesine bölünmesiyle oluşan orandır." },
      { label: "Durum sınıfı", description: "Skorun yetişkinler için kullanılan referans aralıklarından hangisine düştüğünü gösterir." },
      { label: "Ölçek konumu", description: "Sonucunuzun komşu sınırlara ne kadar yakın olduğunu görmenizi sağlar." },
    ],
    ranges: [
      { value: "<18,5", label: "Düşük", meaning: "Kilo ve beslenme yeterliliği ayrıca değerlendirilmelidir." },
      { value: "18,5–24,9", label: "Referans", meaning: "Genel yetişkin popülasyonu için referans aralıktır." },
      { value: "25,0–29,9", label: "Yüksek", meaning: "Bel çevresi ve vücut kompozisyonuyla birlikte yorumlanmalıdır." },
      { value: "≥30,0", label: "Obezite aralığı", meaning: "Kardiyometabolik risk açısından profesyonel değerlendirme önerilir." },
    ],
    interpretation: ["Kas kütlesi yüksek sporcularda VKİ yağ oranını olduğundan yüksek gösterebilir.", "Aynı skor farklı bel çevresi ve yağ dağılımına sahip kişilerde farklı risk anlamına gelebilir."],
    limitations: "Gebelikte, büyüme çağında, ileri yaşta ve yüksek kas kütlesine sahip kişilerde standart yetişkin sınıfları tek başına kullanılmamalıdır.",
    nextSteps: ["Bel-boy oranı ve vücut kompozisyonu analiziyle sonucu tamamlayın.", "Aynı koşullarda düzenli aralıklarla ölçerek eğilimi takip edin."],
  },
  calorie: {
    title: "Enerji değerleri ne ifade ediyor?",
    intro: "Bu analiz, dinlenme metabolizmanız ile günlük hareket düzeyinizi birleştirerek kilo koruma ve hedef kalori için başlangıç noktası üretir.",
    metrics: [
      { label: "BMR", description: "Tam dinlenmede solunum, dolaşım ve organ fonksiyonları için gereken tahmini minimum enerjidir." },
      { label: "TDEE", description: "BMR'nin seçilen aktivite katsayısıyla çarpılmasıyla bulunan günlük toplam enerji harcamasıdır." },
      { label: "Hedef kalori", description: "Yağ kaybı için kontrollü açık, kas kazanımı için kontrollü fazlalık uygulanmış değerdir." },
    ],
    interpretation: ["TDEE kesin bir sayı değil, 2–3 haftalık kilo eğilimiyle kalibre edilmesi gereken başlangıç tahminidir.", "Günlük dalgalanma yerine haftalık ortalama kalori ve ağırlık değişimine bakın."],
    limitations: "Uyku, stres, ilaçlar, hormonal durum, adım sayısı ve aktivite beyanındaki hata gerçek enerji harcamasını değiştirebilir.",
    nextSteps: ["Hedef kaloriyi makro besin analizine aktarın.", "İki hafta sonra kilo eğilimine göre günlük hedefi 100–150 kcal düzeltin."],
  },
  macro: {
    title: "Makro dağılımınızı nasıl yorumlamalısınız?",
    intro: "Protein, yağ ve karbonhidrat hedefleri toplam enerjiyi farklı fizyolojik işlevlere dağıtır; gram hedefleri günlük ortalama olarak değerlendirilmelidir.",
    metrics: [
      { label: "Protein", description: "Kas dokusunun korunması, onarımı ve tokluk için temel yapı taşıdır; gram başına 4 kcal sağlar." },
      { label: "Yağ", description: "Hormon üretimi, hücre yapısı ve yağda çözünen vitaminler için gereklidir; gram başına 9 kcal sağlar." },
      { label: "Karbonhidrat", description: "Antrenman performansı ve glikojen depoları için ana enerji kaynağıdır; gram başına 4 kcal sağlar." },
    ],
    interpretation: ["Tek bir öğünde kusursuz dağılım yerine gün sonu toplamına ve haftalık tutarlılığa odaklanın.", "Protein hedefini 3–5 öğüne yaymak kas protein sentezini destekler."],
    limitations: "Kronik böbrek, karaciğer veya metabolik hastalıklarda standart makro önerileri klinik değerlendirme olmadan uygulanmamalıdır.",
    nextSteps: ["Her ana öğünde bir protein kaynağı planlayın.", "Antrenman günlerinde karbonhidratın daha büyük bölümünü egzersiz çevresine yerleştirin."],
  },
  oneRm: {
    title: "1RM ve antrenman yüzdeleri ne anlama geliyor?",
    intro: "Tahmini 1RM, seçilen ağırlık ve tekrar sayısından tek tekrarlık maksimum kuvveti hesaplar. Programlama yüzdeleri bu üst sınırdan türetilir.",
    metrics: [
      { label: "Tahmini 1RM", description: "İyi teknikle bir kez kaldırabileceğiniz teorik maksimum ağırlıktır." },
      { label: "%85 güç bölgesi", description: "Genellikle düşük tekrar ve uzun dinlenmeyle maksimal kuvvet çalışmalarında kullanılır." },
      { label: "%65–80 çalışma bölgesi", description: "Hipertrofi ve teknik hacmi için sık kullanılan yük aralığıdır." },
    ],
    interpretation: ["Tahmin, 1–10 tekrar aralığında ve tükenişe yakın setlerde daha güvenilirdir.", "Günlük performansa göre çalışma yükünde küçük ayarlamalar yapılmalıdır."],
    limitations: "Formül egzersize, deneyime, tempo ve yorgunluk düzeyine göre gerçek maksimumdan sapabilir; güvenlik ekipmanı olmadan maksimum deneme yapılmamalıdır.",
    nextSteps: ["Programda doğrudan 1RM yerine antrenman maksimumunun %90–95'ini temel alın.", "Aynı egzersizde 4–6 haftada bir yeniden ölçün."],
  },
  heartRate: {
    title: "Nabız bölgeleri ne anlatıyor?",
    intro: "Hedef nabız bölgeleri, egzersiz yoğunluğunu kişiselleştirir. Dinlenik nabzı kullanan Karvonen yaklaşımı, kalp atım rezervinizi hesaba katar.",
    metrics: [
      { label: "Alt sınır", description: "İlgili bölgenin amaçlanan fizyolojik uyaranı oluşturmaya başladığı yaklaşık nabızdır." },
      { label: "Üst sınır", description: "Bir sonraki yoğunluk bölgesine geçmeden önceki yaklaşık nabızdır." },
      { label: "Bölge amacı", description: "Toparlanma, aerobik taban, tempo veya yüksek yoğunluk gibi baskın antrenman etkisini açıklar." },
    ],
    interpretation: ["Isı, kafein, susuzluk, stres ve uykusuzluk aynı eforda nabzı yükseltebilir.", "Konuşma testi ve algılanan eforu nabızla birlikte kullanın."],
    limitations: "Kalp ritmini etkileyen ilaçlar veya bilinen kardiyovasküler hastalık varsa bölgeler hekim değerlendirmesi olmadan kullanılmamalıdır.",
    nextSteps: ["Haftalık kardiyonun çoğunu düşük-orta yoğunlukta planlayın.", "Dinlenik nabzı sabah aynı koşullarda düzenli takip edin."],
  },
  water: {
    title: "Su hedefiniz ne ifade ediyor?",
    intro: "Hesaplanan değer, vücut ağırlığı ve aktiviteye dayalı günlük toplam sıvı için pratik bir başlangıç hedefidir.",
    metrics: [
      { label: "Litre hedefi", description: "Gün boyunca içeceklerden alınması önerilen yaklaşık sıvı miktarını gösterir." },
      { label: "Bardak karşılığı", description: "Hedefi günlük rutine bölmeyi kolaylaştıran pratik porsiyon sayısıdır." },
      { label: "Aktivite eklemesi", description: "Egzersizle artan ter kaybını telafi etmek için temel ihtiyaca eklenen miktardır." },
    ],
    interpretation: ["Açık saman rengi idrar çoğu sağlıklı yetişkinde pratik hidrasyon göstergesidir.", "Uzun ve terli egzersizlerde yalnız su değil sodyum kaybı da dikkate alınmalıdır."],
    limitations: "Hava sıcaklığı, terleme hızı, gebelik, emzirme ve böbrek/kalp hastalıkları ihtiyacı önemli ölçüde değiştirebilir.",
    nextSteps: ["Hedefi gün içine bölün; kısa sürede aşırı su tüketmeyin.", "Egzersiz öncesi ve sonrası ağırlık farkıyla kişisel terleme hızınızı izleyin."],
  },
  idealWeight: {
    title: "İdeal kilo tahmini nasıl kullanılmalı?",
    intro: "Formül, boy ve cinsiyet bilgisinden referans bir ağırlık üretir. Tek bir zorunlu hedef değil, klinik ve performans değerlendirmesi için başlangıç noktasıdır.",
    metrics: [
      { label: "Formül sonucu", description: "Devine yaklaşımıyla hesaplanan merkezi referans ağırlıktır." },
      { label: "Sağlıklı aralık", description: "Vücut yapısı ve günlük değişkenlik için merkezi değerin çevresinde verilen toleranstır." },
      { label: "Kişisel hedef", description: "Yağ oranı, kas kütlesi, sağlık geçmişi ve sürdürülebilirliğe göre ayrıca belirlenmelidir." },
    ],
    interpretation: ["Kas kütlesi yüksek kişiler formül sonucunun üzerinde olup sağlıklı olabilir.", "Bel çevresi ve vücut kompozisyonu, yalnız ağırlıktan daha açıklayıcı olabilir."],
    limitations: "Devine formülü başlangıçta ilaç dozlaması için geliştirilmiştir; estetik veya performans hedefini tek başına belirlemez.",
    nextSteps: ["Hedefi vücut kompozisyonu ölçümüyle birlikte değerlendirin.", "Hızlı kilo değişimi yerine sürdürülebilir haftalık eğilim planlayın."],
  },
  waistHeight: {
    title: "Bel-boy oranı neyi gösteriyor?",
    intro: "Bel çevresini boya oranlayan bu metrik, karın bölgesi yağlanması ve kardiyometabolik risk için pratik bir tarama göstergesidir.",
    metrics: [
      { label: "Oran", description: "Bel çevresinin aynı birimdeki boya bölünmesiyle hesaplanır." },
      { label: "Risk sınıfı", description: "Karın çevresinin boya göre düşük, referans veya yüksek düzeyde olduğunu gösterir." },
      { label: "Değişim", description: "Kilo aynı kalsa bile karın bölgesindeki değişimi izlemeye yardımcı olur." },
    ],
    ranges: [
      { value: "<0,40", label: "Düşük", meaning: "Düşük vücut ağırlığı veya ölçüm hatası ayrıca incelenebilir." },
      { value: "0,40–0,49", label: "Referans", meaning: "Genel yetişkin popülasyonu için daha düşük risk aralığıdır." },
      { value: "0,50–0,59", label: "Artmış", meaning: "Merkezi yağlanma açısından yaşam tarzı değerlendirmesi önerilir." },
      { value: "≥0,60", label: "Yüksek", meaning: "Kardiyometabolik risk için profesyonel değerlendirme önerilir." },
    ],
    interpretation: ["Bel çevresinin boyun yarısından düşük tutulması pratik bir genel hedeftir.", "Ölçümü nefes verdikten sonra, mezurayı sıkmadan ve aynı noktadan yapın."],
    limitations: "Gebelik, karın şişkinliği ve ölçüm noktasındaki tutarsızlık sonucu etkiler.",
    nextSteps: ["Bel çevresini ayda bir aynı koşullarda ölçün.", "VKİ ve kan basıncı gibi diğer göstergelerle birlikte değerlendirin."],
  },
  waistHip: {
    title: "Bel-kalça oranı neyi ifade ediyor?",
    intro: "Bu oran, yağın karın ve kalça çevresindeki dağılımını karşılaştırarak merkezi yağlanma hakkında bilgi verir.",
    metrics: [
      { label: "Bel-kalça oranı", description: "Bel çevresinin kalçanın en geniş çevresine bölünmesiyle hesaplanır." },
      { label: "Cinsiyete göre eşik", description: "Risk sınıfı, kadın ve erkekler için farklı referans sınırlarla yorumlanır." },
      { label: "Risk düzeyi", description: "Karın bölgesinde yağ depolanmasına bağlı göreli metabolik risk sinyalidir." },
    ],
    interpretation: ["Orandaki düşüş, toplam kilo değişmese bile yağ dağılımında iyileşme gösterebilir.", "Mezurayı yatay tutmak ve aynı anatomik noktaları kullanmak önemlidir."],
    limitations: "Vücut şekli, yaş, etnik köken ve ölçüm tekniği referans eşiklerin yorumunu etkileyebilir.",
    nextSteps: ["Bel-boy oranıyla birlikte merkezi yağlanmayı değerlendirin.", "Yüksek risk sonucunu kan basıncı ve laboratuvar bulgularıyla profesyonel olarak ele alın."],
  },
  cardio: {
    title: "Kardiyo kalori tahmini nasıl okunmalı?",
    intro: "Sonuç, aktivitenin MET değeri, vücut ağırlığı ve süre kullanılarak egzersiz sırasında harcanan enerjiyi tahmin eder.",
    metrics: [
      { label: "Yakılan enerji", description: "Seçilen aktivite süresince harcanması beklenen yaklaşık kilokaloridir." },
      { label: "MET değeri", description: "Aktivitenin dinlenmeye göre kaç kat enerji gerektirdiğini ifade eder." },
      { label: "Süre etkisi", description: "Aynı yoğunlukta süre uzadıkça tahmini toplam harcama doğrusal artar." },
    ],
    interpretation: ["Cihaz ve formül sonuçlarında %10–30 sapma normal kabul edilmelidir.", "Kardiyo kalorilerini beslenme bütçesine tamamen geri eklemek yağ kaybını yavaşlatabilir."],
    limitations: "Tempo, eğim, kondisyon, nabız ve hareket ekonomisi bilinmediği için sonuç kişisel gerçek harcamadan farklı olabilir.",
    nextSteps: ["Kalori sayısından çok süre, yoğunluk ve haftalık düzenliliği takip edin.", "Benzer koşullarda aynı aktivitenin eğilimini karşılaştırın."],
  },
  volume: {
    title: "Antrenman hacmi ne anlatıyor?",
    intro: "Hacim yükü; set, tekrar ve ağırlığı birleştirerek yapılan toplam mekanik işi izlemek için kullanılan pratik bir göstergedir.",
    metrics: [
      { label: "Toplam hacim", description: "Her egzersizde set × tekrar × ağırlık sonuçlarının toplamıdır." },
      { label: "Egzersiz payı", description: "Toplam yükün hangi hareketlerden geldiğini ve dağılımı gösterir." },
      { label: "Haftalık eğilim", description: "Aynı hareket ve teknik korunarak yüklenmenin zaman içindeki değişimini izler." },
    ],
    interpretation: ["Daha yüksek hacim her zaman daha iyi değildir; toparlanma ve set kalitesiyle birlikte değerlendirilir.", "Farklı egzersizlerin kilogram hacimleri doğrudan eşdeğer değildir."],
    limitations: "Hareket mesafesi, tempo, efor düzeyi ve teknik kalite formülde yer almaz.",
    nextSteps: ["Hacmi haftadan haftaya küçük ve kontrollü adımlarla artırın.", "Performans düşüşü ve aşırı ağrı varsa hacmi geçici azaltın."],
  },
  plates: {
    title: "Plaka yükleme planı nasıl uygulanır?",
    intro: "Plan, hedef toplam ağırlıktan bar ağırlığını çıkarır ve kalan yükü barın iki tarafına eşit dağıtır.",
    metrics: [
      { label: "Hedef toplam", description: "Bar ve iki taraftaki tüm plakalar dahil kaldırılacak toplam ağırlıktır." },
      { label: "Her taraf", description: "Dengeyi korumak için barın tek tarafına takılması gereken plaka kombinasyonudur." },
      { label: "Kalan fark", description: "Mevcut plaka seçenekleriyle tam karşılanamayan ağırlığı gösterir." },
    ],
    interpretation: ["Listelenen her plaka adedi barın tek tarafı içindir; diğer tarafa aynı düzen uygulanır.", "Büyük plakaları içe, küçük plakaları dışa yerleştirin."],
    limitations: "Bar ve plakaların gerçek ağırlıkları üretim toleransı nedeniyle nominal değerden küçük sapmalar gösterebilir.",
    nextSteps: ["Yüklemeden önce iki tarafı görsel olarak karşılaştırın.", "Plakaları kilitleyin ve bar kapasitesini aşmayın."],
  },
  bodyComposition: {
    title: "Vücut kompozisyonu değerleri ne demek?",
    intro: "Çevre ölçümlerine dayalı model, toplam ağırlığı tahmini yağ kütlesi ve yağsız kütle bileşenlerine ayırır.",
    metrics: [
      { label: "Yağ oranı", description: "Toplam vücut ağırlığının tahmini olarak ne kadarının yağ dokusu olduğunu gösterir." },
      { label: "Yağ kütlesi", description: "Yağ oranının kilogram karşılığıdır." },
      { label: "Yağsız kütle", description: "Kas, kemik, organ ve vücut suyunu birlikte içeren yağ dışı toplam kütledir." },
    ],
    interpretation: ["Tek ölçümden çok, aynı yöntemle oluşan 4–8 haftalık eğilim daha anlamlıdır.", "Yağsız kütle yalnız kas kütlesi değildir; su değişimleri sonucu etkiler."],
    limitations: "Mezura konumu, hidrasyon ve formülün popülasyon varsayımları nedeniyle bireysel hata oluşabilir; DEXA eşdeğeri değildir.",
    nextSteps: ["Ölçümü sabah, benzer hidrasyon ve beslenme koşullarında tekrarlayın.", "Sonucu bel çevresi, performans ve fotoğraf takibiyle birlikte değerlendirin."],
  },
};

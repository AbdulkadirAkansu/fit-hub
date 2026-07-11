import { Dumbbell, Target, Zap, Sparkles, Flame } from "lucide-react";

export const PROGRAMS_DATA = [
  {
    id: "yeni-baslayan-fitness",
    title: "Yeni Başlayan Adaptasyon",
    category: "Fitness",
    level: "Başlangıç",
    duration: "4 Hafta",
    daysPerWeek: 3,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    desc: "Spora yeni adım atanlar için nöral adaptasyonu artıracak ve eklem mobilitesini sağlayacak tüm vücut programı.",
    icon: Target,
    scientificRationale: "Bu program, motor ünite koordinasyonunu artırmak ve tendon dayanıklılığını geliştirmek amacıyla 'Tüm Vücut' (Full Body) metodolojisine dayanır. Haftalık yüksek sıklıkta (3 gün) temel hareketlerin tekrarlanması nöromüsküler öğrenmeyi hızlandırır.",
    progressiveOverloadTip: "Her hafta hareketlerin formunu bozmadan toplam kaldırılan ağırlığı %2.5-5 oranında artırın ya da aynı ağırlıkla 1-2 fazla tekrar yapmayı hedefleyin.",
    workout: [
      {
        dayName: "1. Gün: Tüm Vücut Adaptasyonu (A)",
        isRest: false,
        exercises: [
          { name: "Goblet Squat", sets: "3", reps: "12-15", rest: "90 sn" },
          { name: "Push-up (Şınav)", sets: "3", reps: "10-12", rest: "60 sn" },
          { name: "Lat Pulldown", sets: "3", reps: "12", rest: "60 sn" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "12", rest: "60 sn" },
          { name: "Plank", sets: "3", reps: "30-45 sn", rest: "45 sn" }
        ]
      },
      {
        dayName: "2. Gün: Kas Rejenerasyonu & Aktif Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "3. Gün: Tüm Vücut Adaptasyonu (B)",
        isRest: false,
        exercises: [
          { name: "Leg Press", sets: "3", reps: "12-15", rest: "90 sn" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "12", rest: "75 sn" },
          { name: "Bent Over Barbell Row", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Lateral Raise", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Single Leg Stretch (Pilates)", sets: "3", reps: "15", rest: "45 sn" }
        ]
      },
      {
        dayName: "4. Gün: Kas Rejenerasyonu & Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "5. Gün: Tüm Vücut Adaptasyonu (C)",
        isRest: false,
        exercises: [
          { name: "Romanian Deadlift", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Bench Press", sets: "3", reps: "10", rest: "90 sn" },
          { name: "Pull-up (Barfiks)", sets: "3", reps: "Max", rest: "120 sn" },
          { name: "Biceps Curl / Triceps Pushdown Süper Set", sets: "3", reps: "12", rest: "60 sn" },
          { name: "Plank", sets: "3", reps: "45 sn", rest: "45 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Haftalık Toparlanma & Esneme Akışı",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "3-gunluk-full-body",
    title: "3 Günlük Yoğun Full Body",
    category: "Fitness",
    level: "Orta",
    duration: "8 Hafta",
    daysPerWeek: 3,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    desc: "Hacim ve yoğunluğun optimize edildiği, kas protein sentezi döngüsünü zirvede tutan orta seviye güç programı.",
    icon: Zap,
    scientificRationale: "Araştırmalar, her kas grubunun haftada 3 kez uyarılmasının, protein sentezini sürekli aktif tuttuğunu ve hipertrofiyi hızlandırdığını göstermektedir. Bu program, mekanik gerilimi artırmak için bileşik ana hareketlere odaklanır.",
    progressiveOverloadTip: "Squat, Bench Press ve Deadlift gibi ana kaldırışlarda her hafta toplam kaldırdığınız seti veya ağırlığı küçük bir oranda (örn: 2.5 kg) artırmaya çalışın.",
    workout: [
      {
        dayName: "1. Gün: Alt Vücut ve Yatay İtiş Ağırlıklı",
        isRest: false,
        exercises: [
          { name: "Barbell Back Squat", sets: "4", reps: "8-10", rest: "120 sn" },
          { name: "Bench Press", sets: "4", reps: "8-10", rest: "90 sn" },
          { name: "Bent Over Barbell Row", sets: "3", reps: "10", rest: "90 sn" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12-15", rest: "60 sn" }
        ]
      },
      {
        dayName: "2. Gün: Aktif Yenilenme ve Hafif Yürüyüş",
        isRest: true,
        exercises: []
      },
      {
        dayName: "3. Gün: Posterior Zincir ve Dikey Çekiş Ağırlıklı",
        isRest: false,
        exercises: [
          { name: "Deadlift", sets: "3", reps: "5-8", rest: "180 sn" },
          { name: "Pull-up (Barfiks)", sets: "4", reps: "Max", rest: "120 sn" },
          { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", rest: "90 sn" },
          { name: "Lateral Raise", sets: "4", reps: "12-15", rest: "60 sn" },
          { name: "Triceps Pushdown", sets: "3", reps: "12-15", rest: "60 sn" }
        ]
      },
      {
        dayName: "4. Gün: Dinlenme & Gıda Alım Kontrolü",
        isRest: true,
        exercises: []
      },
      {
        dayName: "5. Gün: Metabolik Stres & Hacim Odaklı Tüm Vücut",
        isRest: false,
        exercises: [
          { name: "Leg Press", sets: "4", reps: "12-15", rest: "90 sn" },
          { name: "Romanian Deadlift", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Dumbbell Chest Fly", sets: "3", reps: "12-15", rest: "75 sn" },
          { name: "Face Pull", sets: "4", reps: "15", rest: "60 sn" },
          { name: "Biceps Curl", sets: "3", reps: "12", rest: "60 sn" },
          { name: "Plank", sets: "3", reps: "60 sn", rest: "45 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Dinlenme & Zihinsel Hazırlık",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "ileri-seviye-hipertrofi",
    title: "İleri Seviye PPL Split",
    category: "Fitness",
    level: "İleri",
    duration: "12 Hafta",
    daysPerWeek: 5,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    desc: "Vücut kompozisyonunu değiştirmek ve hipertrofiyi maksimize etmek için tasarlanmış Push-Pull-Legs planı.",
    icon: Dumbbell,
    scientificRationale: "Kas gruplarına yüksek hacimler uygulayarak mekanik gerilimi ve kas hasarını en üst düzeye çıkarır. Bölünmüş gün yapısı (Split), hedef kasın tamamen yıpratılmasını sağlarken diğer günlerde o kas grubuna tam toparlanma süresi tanır.",
    progressiveOverloadTip: "Setlerinizde RPE 8-9 (Tükenişe 1-2 tekrar kala) hedefini tutturun. 4 haftada bir kez hacmi düşürerek (Deload) merkezi sinir sistemini dinlendirin.",
    workout: [
      {
        dayName: "1. Gün: İtme (Push) - Göğüs, Ön Omuz & Triceps",
        isRest: false,
        exercises: [
          { name: "Bench Press", sets: "4", reps: "6-8", rest: "120 sn" },
          { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", rest: "90 sn" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-10", rest: "90 sn" },
          { name: "Dumbbell Chest Fly", sets: "3", reps: "12-15", rest: "75 sn" },
          { name: "Triceps Pushdown", sets: "4", reps: "12-15", rest: "60 sn" }
        ]
      },
      {
        dayName: "2. Gün: Çekme (Pull) - Sırt, Arka Omuz & Biceps",
        isRest: false,
        exercises: [
          { name: "Pull-up (Barfiks)", sets: "4", reps: "Max", rest: "120 sn" },
          { name: "Bent Over Barbell Row", sets: "4", reps: "8-10", rest: "90 sn" },
          { name: "Lat Pulldown", sets: "3", reps: "10-12", rest: "75 sn" },
          { name: "Face Pull", sets: "4", reps: "15-20", rest: "60 sn" },
          { name: "Biceps Curl", sets: "4", reps: "10-12", rest: "60 sn" }
        ]
      },
      {
        dayName: "3. Gün: Bacak & Core - Ön/Arka Bacak, Baldır & Karın",
        isRest: false,
        exercises: [
          { name: "Barbell Back Squat", sets: "4", reps: "6-8", rest: "150 sn" },
          { name: "Romanian Deadlift", sets: "4", reps: "10-12", rest: "90 sn" },
          { name: "Leg Press", sets: "3", reps: "12-15", rest: "90 sn" },
          { name: "Walking Lunges", sets: "3", reps: "12 (her bacak)", rest: "90 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "15", rest: "60 sn" }
        ]
      },
      {
        dayName: "4. Gün: Aktif Yenilenme & Kalp Sağlığı (LISS Kardiyo)",
        isRest: true,
        exercises: []
      },
      {
        dayName: "5. Gün: Üst Vücut Hipertrofi Ağırlıklı",
        isRest: false,
        exercises: [
          { name: "Incline Dumbbell Press", sets: "4", reps: "8-10", rest: "90 sn" },
          { name: "Bent Over Barbell Row", sets: "4", reps: "8-10", rest: "90 sn" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "90 sn" },
          { name: "Lateral Raise", sets: "4", reps: "15", rest: "65 sn" },
          { name: "Biceps Curl / Triceps Pushdown Süper Set", sets: "4", reps: "12", rest: "60 sn" }
        ]
      },
      {
        dayName: "6. Gün: Alt Vücut ve Core Yoğunluklu",
        isRest: false,
        exercises: [
          { name: "Leg Press", sets: "4", reps: "10-12", rest: "90 sn" },
          { name: "Romanian Deadlift", sets: "3", reps: "12", rest: "90 sn" },
          { name: "Walking Lunges", sets: "3", reps: "10 adım", rest: "75 sn" },
          { name: "Plank", sets: "3", reps: "90 sn", rest: "45 sn" }
        ]
      },
      {
        dayName: "7. Gün: Tam Sistem Reset & Dinlenme",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "core-odakli-pilates",
    title: "Core ve Duruş Pilatesi",
    category: "Pilates",
    level: "Orta",
    duration: "8 Hafta",
    daysPerWeek: 3,
    image: "https://images.unsplash.com/photo-1518611012118-296072bb5604?q=80&w=2070&auto=format&fit=crop",
    desc: "Gövde stabilizasyonu sağlayan, derin transversus abdominis kaslarını uyarıp omurgayı destekleyen pilates planı.",
    icon: Sparkles,
    scientificRationale: "Lomber stabilite ve pelvik kontrol ilkelerine dayanır. Derin omurga stabilizatörleri (multifidus, transversus abdominis) ve diyafram solunum entegrasyonu ile postüral simetriyi düzeltmeyi hedefler.",
    progressiveOverloadTip: "Pilates hareketlerinde zorluğu artırmak için hareketin hızını yavaşlatın, yer çekimi açısını dikleştirin ve eksantrik kasılma fazlarını uzatın.",
    workout: [
      {
        dayName: "1. Gün: Core Gücü ve Transversus Aktivasyonu",
        isRest: false,
        exercises: [
          { name: "The Hundred", sets: "10", reps: "100 vuruş", rest: "-" },
          { name: "Single Leg Stretch", sets: "3", reps: "15", rest: "30 sn" },
          { name: "Criss Cross", sets: "3", reps: "20", rest: "30 sn" },
          { name: "Plank", sets: "3", reps: "60 sn", rest: "45 sn" }
        ]
      },
      {
        dayName: "2. Gün: Omurga Mobilizasyonu & Toparlanma",
        isRest: true,
        exercises: []
      },
      {
        dayName: "3. Gün: Omurga Artikülasyonu & Denge Kontrolü",
        isRest: false,
        exercises: [
          { name: "Teaser", sets: "3", reps: "8-10", rest: "45 sn" },
          { name: "Single Leg Stretch", sets: "3", reps: "12", rest: "30 sn" },
          { name: "The Hundred", sets: "5", reps: "50 vuruş", rest: "30 sn" },
          { name: "Criss Cross", sets: "3", reps: "16", rest: "30 sn" }
        ]
      },
      {
        dayName: "4. Gün: Omurga Sağlığı & Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "5. Gün: Posterior Zincir & Derin Sırt Aktivasyonu",
        isRest: false,
        exercises: [
          { name: "Swan Dive", sets: "4", reps: "8-10", rest: "60 sn" },
          { name: "Plank", sets: "3", reps: "60 sn", rest: "30 sn" },
          { name: "Teaser", sets: "3", reps: "8", rest: "60 sn" },
          { name: "Criss Cross", sets: "3", reps: "20", rest: "30 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Esneklik & Zihinsel Meditasyon",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "kilo-verme-kardiyo",
    title: "Yağ Yakımı & Kondisyon",
    category: "Fitness",
    level: "Orta",
    duration: "6 Hafta",
    daysPerWeek: 4,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    desc: "Kardiyovasküler dayanıklılığı artıran, yüksek yoğunluklu istasyon çalışmalarıyla bazal metabolizma hızını yükselten program.",
    icon: Flame,
    scientificRationale: "EPOC (Egzersiz Sonrası Aşırı Oksijen Tüketimi) etkisini uyarmak üzere tasarlanmıştır. Yüksek yoğunluklu interval çalışmalar, antrenman sonrasında da vücudun kalori yakım hızını yüksek tutmasını sağlar.",
    progressiveOverloadTip: "Egzersizler arasındaki geçiş sürelerini (dinlenmeleri) kademeli olarak 5-10 saniye azaltmayı veya aynı sürede daha fazla tur tamamlamayı hedefleyin.",
    workout: [
      {
        dayName: "1. Gün: Yüksek Yoğunluklu İstasyon Antrenmanı (HIIT)",
        isRest: false,
        exercises: [
          { name: "Walking Lunges", sets: "3", reps: "15 adım", rest: "30 sn" },
          { name: "Push-up (Şınav)", sets: "3", reps: "12-15", rest: "30 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "15", rest: "30 sn" },
          { name: "Plank", sets: "3", reps: "60 sn", rest: "30 sn" }
        ]
      },
      {
        dayName: "2. Gün: Alt Vücut Kondisyon & Güç Dayanıklılığı",
        isRest: false,
        exercises: [
          { name: "Barbell Back Squat", sets: "4", reps: "12-15", rest: "60 sn" },
          { name: "Romanian Deadlift", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Leg Press", sets: "3", reps: "15", rest: "60 sn" },
          { name: "Single Leg Stretch (Pilates)", sets: "3", reps: "20", rest: "30 sn" }
        ]
      },
      {
        dayName: "3. Gün: Kardiyovasküler Toparlanma & Düşük Yoğunluk",
        isRest: true,
        exercises: []
      },
      {
        dayName: "4. Gün: Üst Vücut Kondisyon & Süper Set Uyarımı",
        isRest: false,
        exercises: [
          { name: "Incline Dumbbell Press", sets: "3", reps: "12-15", rest: "45 sn" },
          { name: "Lat Pulldown", sets: "3", reps: "12-15", rest: "45 sn" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "12", rest: "45 sn" },
          { name: "Triceps Pushdown", sets: "3", reps: "15", rest: "30 sn" }
        ]
      },
      {
        dayName: "5. Gün: Core & Kardiyo Yağ Yakım Düzlüğü",
        isRest: false,
        exercises: [
          { name: "The Hundred", sets: "10", reps: "100 vuruş", rest: "30 sn" },
          { name: "Criss Cross", sets: "3", reps: "20", rest: "30 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "30 sn" },
          { name: "Plank", sets: "3", reps: "60 sn", rest: "30 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme & Kas Toparlanması",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Pasif Dinlenme",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "push-pull-legs",
    title: "Push / Pull / Legs (PPL)",
    category: "Fitness",
    level: "İleri",
    duration: "8 Hafta",
    daysPerWeek: 6,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop",
    desc: "Her kas grubunu haftada 2 kez çalıştıran yüksek frekanslı hipertrofi split'i. İleri seviye için maksimum hacim ve toparlanma dengesi.",
    icon: Flame,
    scientificRationale: "Schoenfeld ve ark. (2016) meta-analizi, bir kası haftada en az 2 kez çalıştırmanın haftada 1 keze kıyasla hipertrofiyi anlamlı şekilde artırdığını göstermiştir. PPL bölünmesi, itme (göğüs/omuz/triceps), çekme (sırt/biceps) ve bacak kaslarını ayırarak kas grubu başına haftalık 12-20 set optimal hacme ulaşmayı ve aynı kas grubunun antrenmanları arasında 48-72 saatlik toparlanma penceresi bırakmayı sağlar.",
    progressiveOverloadTip: "Çift ilerleme (double progression) uygulayın: hedef tekrar aralığının üst sınırına tüm setlerde ulaştığınızda ağırlığı %2.5-5 artırıp aralığın alt sınırına dönün.",
    workout: [
      {
        dayName: "1. Gün: İtiş (Göğüs · Omuz · Triceps)",
        isRest: false,
        exercises: [
          { name: "Bench Press", sets: "4", reps: "6-8", rest: "120 sn" },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8-10", rest: "90 sn" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-10", rest: "90 sn" },
          { name: "Lateral Raise", sets: "4", reps: "12-15", rest: "45 sn" },
          { name: "Triceps Pushdown", sets: "3", reps: "10-12", rest: "60 sn" }
        ]
      },
      {
        dayName: "2. Gün: Çekiş (Sırt · Biceps · Arka Omuz)",
        isRest: false,
        exercises: [
          { name: "Pull-up (Barfiks)", sets: "4", reps: "6-10", rest: "120 sn" },
          { name: "Bent Over Barbell Row", sets: "4", reps: "8-10", rest: "90 sn" },
          { name: "Lat Pulldown", sets: "3", reps: "10-12", rest: "75 sn" },
          { name: "Face Pull", sets: "3", reps: "15-20", rest: "45 sn" },
          { name: "Biceps Curl", sets: "3", reps: "10-12", rest: "60 sn" }
        ]
      },
      {
        dayName: "3. Gün: Bacak (Quadriceps · Hamstring · Kalf)",
        isRest: false,
        exercises: [
          { name: "Barbell Squat", sets: "4", reps: "6-8", rest: "150 sn" },
          { name: "Romanian Deadlift", sets: "3", reps: "8-10", rest: "120 sn" },
          { name: "Leg Press", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Lying Leg Curl", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Standing Calf Raise", sets: "4", reps: "15-20", rest: "45 sn" }
        ]
      },
      {
        dayName: "4. Gün: İtiş (Hacim & İzolasyon Odaklı)",
        isRest: false,
        exercises: [
          { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", rest: "90 sn" },
          { name: "Dumbbell Fly", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Barbell Overhead Press", sets: "3", reps: "8-10", rest: "90 sn" },
          { name: "Lateral Raise", sets: "4", reps: "15-20", rest: "45 sn" },
          { name: "Dips", sets: "3", reps: "Max", rest: "75 sn" }
        ]
      },
      {
        dayName: "5. Gün: Çekiş (Genişlik & Sırt Yoğunluğu)",
        isRest: false,
        exercises: [
          { name: "Lat Pulldown", sets: "4", reps: "10-12", rest: "75 sn" },
          { name: "Bent Over Barbell Row", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Face Pull", sets: "4", reps: "15-20", rest: "45 sn" },
          { name: "Dumbbell Hammer Curl", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Biceps Curl", sets: "3", reps: "12-15", rest: "60 sn" }
        ]
      },
      {
        dayName: "6. Gün: Bacak (Hamstring & Kalça Vurgulu)",
        isRest: false,
        exercises: [
          { name: "Romanian Deadlift", sets: "4", reps: "8-10", rest: "120 sn" },
          { name: "Leg Press", sets: "4", reps: "12-15", rest: "90 sn" },
          { name: "Walking Lunges", sets: "3", reps: "12 (her bacak)", rest: "75 sn" },
          { name: "Lying Leg Curl", sets: "4", reps: "12-15", rest: "60 sn" },
          { name: "Standing Calf Raise", sets: "4", reps: "15-20", rest: "45 sn" }
        ]
      },
      {
        dayName: "7. Gün: Tam Dinlenme & Toparlanma",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "upper-lower-split",
    title: "Üst / Alt Split (Upper-Lower)",
    category: "Fitness",
    level: "Orta",
    duration: "6 Hafta",
    daysPerWeek: 4,
    image: "https://images.unsplash.com/photo-1534368786749-d6c1e26df49f?q=80&w=2070&auto=format&fit=crop",
    desc: "Haftada 4 gün ile her kası 2 kez çalıştıran, iş-yaşam dengesi olanlar için en verimli kuvvet-hipertrofi şablonu.",
    icon: Dumbbell,
    scientificRationale: "Üst/Alt bölünmesi, haftada 4 antrenman gününe sığarken her kas grubuna haftada 2 uyaran (frekans) sunar; bu, ACSM'in orta-ileri seviye için önerdiği frekans aralığıyla uyumludur. Üst ve alt vücut günlerinin dönüşümlü olması, lokal kas toparlanmasını bozmadan toplam haftalık hacmin yüksek tutulmasını sağlar.",
    progressiveOverloadTip: "Bileşik hareketlerde haftalık küçük ağırlık artışı (alt vücut +2.5-5 kg, üst vücut +1.25-2.5 kg); izolasyonlarda tekrar artışıyla ilerleyin.",
    workout: [
      {
        dayName: "1. Gün: Üst Vücut (Kuvvet)",
        isRest: false,
        exercises: [
          { name: "Bench Press", sets: "4", reps: "5-8", rest: "120 sn" },
          { name: "Bent Over Barbell Row", sets: "4", reps: "6-8", rest: "120 sn" },
          { name: "Barbell Overhead Press", sets: "3", reps: "6-8", rest: "90 sn" },
          { name: "Pull-up (Barfiks)", sets: "3", reps: "Max", rest: "90 sn" },
          { name: "Biceps Curl", sets: "3", reps: "10-12", rest: "60 sn" }
        ]
      },
      {
        dayName: "2. Gün: Alt Vücut (Kuvvet)",
        isRest: false,
        exercises: [
          { name: "Barbell Squat", sets: "4", reps: "5-8", rest: "150 sn" },
          { name: "Romanian Deadlift", sets: "3", reps: "8-10", rest: "120 sn" },
          { name: "Leg Press", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Lying Leg Curl", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sn" }
        ]
      },
      {
        dayName: "3. Gün: Aktif Dinlenme & Mobilite",
        isRest: true,
        exercises: []
      },
      {
        dayName: "4. Gün: Üst Vücut (Hipertrofi)",
        isRest: false,
        exercises: [
          { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", rest: "75 sn" },
          { name: "Lat Pulldown", sets: "4", reps: "10-12", rest: "75 sn" },
          { name: "Lateral Raise", sets: "4", reps: "12-15", rest: "45 sn" },
          { name: "Triceps Pushdown", sets: "3", reps: "12-15", rest: "60 sn" },
          { name: "Dumbbell Hammer Curl", sets: "3", reps: "12-15", rest: "60 sn" }
        ]
      },
      {
        dayName: "5. Gün: Alt Vücut (Hipertrofi)",
        isRest: false,
        exercises: [
          { name: "Leg Press", sets: "4", reps: "12-15", rest: "90 sn" },
          { name: "Romanian Deadlift", sets: "3", reps: "10-12", rest: "90 sn" },
          { name: "Walking Lunges", sets: "3", reps: "12 (her bacak)", rest: "75 sn" },
          { name: "Lying Leg Curl", sets: "4", reps: "15", rest: "60 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12-15", rest: "60 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Pasif Dinlenme",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "5x5-guc-programi",
    title: "5x5 Temel Kuvvet",
    category: "Fitness",
    level: "Orta",
    duration: "8 Hafta",
    daysPerWeek: 3,
    image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=2070&auto=format&fit=crop",
    desc: "Bileşik hareketlere ve lineer ilerlemeye dayanan klasik güç programı. Maksimal kuvvet ve nöral verim için ideal.",
    icon: Zap,
    scientificRationale: "Düşük tekrar (5) ve yüksek yük (1RM'in ~%80-85'i) ile çalışmak, nöromüsküler verimliliği ve motor ünite katılımını maksimize ederek miyofibriler hipertrofi yerine ham kuvvet kazanımını önceler. Bileşik hareketlerin (squat, deadlift, bench) sık tekrarı, beceri öğrenimini (skill acquisition) ve yüksek mekanik gerilimi destekler.",
    progressiveOverloadTip: "Lineer ilerleme: 5 tekrarın 5 setini de tamamladığınız her antrenmanda alt vücut hareketlerine +2.5 kg, üst vücut hareketlerine +1.25 kg ekleyin. Başarısız olursanız aynı ağırlıkta kalın.",
    workout: [
      {
        dayName: "1. Gün: Antrenman A",
        isRest: false,
        exercises: [
          { name: "Barbell Squat", sets: "5", reps: "5", rest: "180 sn" },
          { name: "Bench Press", sets: "5", reps: "5", rest: "180 sn" },
          { name: "Bent Over Barbell Row", sets: "5", reps: "5", rest: "150 sn" },
          { name: "Plank", sets: "3", reps: "60 sn", rest: "60 sn" }
        ]
      },
      {
        dayName: "2. Gün: Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "3. Gün: Antrenman B",
        isRest: false,
        exercises: [
          { name: "Barbell Squat", sets: "5", reps: "5", rest: "180 sn" },
          { name: "Barbell Overhead Press", sets: "5", reps: "5", rest: "180 sn" },
          { name: "Barbell Deadlift", sets: "1", reps: "5", rest: "240 sn" },
          { name: "Pull-up (Barfiks)", sets: "3", reps: "Max", rest: "120 sn" }
        ]
      },
      {
        dayName: "4. Gün: Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "5. Gün: Antrenman A (Tekrar)",
        isRest: false,
        exercises: [
          { name: "Barbell Squat", sets: "5", reps: "5", rest: "180 sn" },
          { name: "Bench Press", sets: "5", reps: "5", rest: "180 sn" },
          { name: "Bent Over Barbell Row", sets: "5", reps: "5", rest: "150 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "12", rest: "60 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Pasif Dinlenme",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "ileri-mat-pilates",
    title: "İleri Mat Pilates & Kontrol",
    category: "Pilates",
    level: "İleri",
    duration: "6 Hafta",
    daysPerWeek: 4,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop",
    desc: "Klasik Pilates repertuarının ileri hareketleriyle core kontrolü, omurga mobilitesi ve nefes senkronizasyonunu derinleştiren akış odaklı program.",
    icon: Sparkles,
    scientificRationale: "Pilates'in 'Contrology' prensipleri (konsantrasyon, kontrol, merkez, akış, hassasiyet, nefes), derin stabilizatör kaslar olan transversus abdominis ve multifidusun aktivasyonunu hedefler. Araştırmalar düzenli mat Pilates'in core dayanıklılığını, postüral hizalanmayı ve dinamik dengeyi anlamlı şekilde geliştirdiğini; alt sırt ağrısını azaltmada etkili olduğunu göstermektedir.",
    progressiveOverloadTip: "Tekrar sayısını artırmak yerine hareket kalitesini derinleştirin: her tekrarın tempoyu yavaşlatın, nefes-hareket senkronunu koruyun ve hareket genişliğini (ROM) kontrollü biçimde genişletin.",
    workout: [
      {
        dayName: "1. Gün: Core Aktivasyon & Nefes",
        isRest: false,
        exercises: [
          { name: "The Hundred", sets: "1", reps: "100 vuruş", rest: "30 sn" },
          { name: "Single Leg Stretch", sets: "3", reps: "15 (her bacak)", rest: "20 sn" },
          { name: "Criss Cross", sets: "3", reps: "20", rest: "20 sn" },
          { name: "Plank", sets: "3", reps: "45-60 sn", rest: "30 sn" }
        ]
      },
      {
        dayName: "2. Gün: Omurga Mobilitesi & Esneme",
        isRest: false,
        exercises: [
          { name: "Swan Dive", sets: "3", reps: "10", rest: "30 sn" },
          { name: "Roll Up", sets: "3", reps: "8-10", rest: "30 sn" },
          { name: "Single Leg Stretch", sets: "3", reps: "15 (her bacak)", rest: "20 sn" },
          { name: "Side Kick Series", sets: "3", reps: "12 (her taraf)", rest: "30 sn" }
        ]
      },
      {
        dayName: "3. Gün: Aktif Dinlenme & Germe",
        isRest: true,
        exercises: []
      },
      {
        dayName: "4. Gün: İleri Kontrol & Güç",
        isRest: false,
        exercises: [
          { name: "Teaser", sets: "3", reps: "8-10", rest: "45 sn" },
          { name: "Criss Cross", sets: "3", reps: "24", rest: "20 sn" },
          { name: "Swan Dive", sets: "3", reps: "12", rest: "30 sn" },
          { name: "Hanging Leg Raise", sets: "3", reps: "10-12", rest: "45 sn" }
        ]
      },
      {
        dayName: "5. Gün: Akış (Flow) Seansı",
        isRest: false,
        exercises: [
          { name: "The Hundred", sets: "1", reps: "100 vuruş", rest: "30 sn" },
          { name: "Roll Up", sets: "2", reps: "10", rest: "20 sn" },
          { name: "Single Leg Stretch", sets: "2", reps: "20 (her bacak)", rest: "20 sn" },
          { name: "Teaser", sets: "2", reps: "8", rest: "45 sn" }
        ]
      },
      {
        dayName: "6. Gün: Tam Dinlenme",
        isRest: true,
        exercises: []
      },
      {
        dayName: "7. Gün: Pasif Dinlenme",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "minimum-etkili-doz-2-gun",
    title: "2 Günlük Sürdürülebilir Kuvvet",
    category: "Fitness",
    level: "Başlangıç",
    duration: "8 Hafta",
    daysPerWeek: 2,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    desc: "Yoğun programı olanlar için tüm büyük kas gruplarını haftada iki kez çalıştıran kısa ve sürdürülebilir plan.",
    icon: Target,
    scientificRationale: "2026 ACSM pozisyon bildirisi, tüm büyük kas gruplarının haftada en az iki kez yüksek eforla çalıştırılmasını temel öneri olarak sunar. Bu plan, karmaşıklığı azaltıp devamlılığı önceler.",
    progressiveOverloadTip: "Her sette 2-3 tekrar yedek (RIR) bırakın. Tüm setlerde tekrar aralığının üst sınırına ulaştığınızda yükü üst vücutta %2-5, alt vücutta %5-10 artırın.",
    workout: [
      { dayName: "1. Gün: Tüm Vücut A", isRest: false, exercises: [
        { name: "Goblet Squat", sets: "3", reps: "8-12", rest: "120 sn" },
        { name: "Bench Press", sets: "3", reps: "6-10", rest: "120 sn" },
        { name: "Seated Cable Row", sets: "3", reps: "8-12", rest: "90 sn" },
        { name: "Romanian Deadlift", sets: "2", reps: "8-12", rest: "120 sn" },
        { name: "Plank", sets: "2", reps: "30-60 sn", rest: "60 sn" }
      ]},
      { dayName: "2. Gün: Dinlenme / Yürüyüş", isRest: true, exercises: [] },
      { dayName: "3. Gün: Dinlenme", isRest: true, exercises: [] },
      { dayName: "4. Gün: Tüm Vücut B", isRest: false, exercises: [
        { name: "Leg Press", sets: "3", reps: "10-15", rest: "120 sn" },
        { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-12", rest: "90 sn" },
        { name: "Lat Pulldown", sets: "3", reps: "8-12", rest: "90 sn" },
        { name: "Hip Thrust", sets: "2", reps: "8-12", rest: "120 sn" },
        { name: "Dead Bug", sets: "2", reps: "8-12 / taraf", rest: "60 sn" }
      ]},
      { dayName: "5. Gün: Dinlenme", isRest: true, exercises: [] },
      { dayName: "6. Gün: Orta Tempo Yürüyüş", isRest: true, exercises: [] },
      { dayName: "7. Gün: Dinlenme", isRest: true, exercises: [] }
    ]
  },
  {
    id: "kuvvet-kardiyo-hibrit",
    title: "Kuvvet + Kardiyo Hibrit",
    category: "Fitness",
    level: "Orta",
    duration: "8 Hafta",
    daysPerWeek: 4,
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2070&auto=format&fit=crop",
    desc: "Kas ve kuvveti korurken WHO aerobik aktivite hedeflerine yaklaşmak isteyenler için dengeli eşzamanlı plan.",
    icon: Flame,
    scientificRationale: "Direnç antrenmanı iki tam vücut seansıyla korunurken iki aerobik seans haftalık kardiyorespiratuvar hacmi artırır. Yüksek yorgunluklu seanslar ardışık günlere yığılmaz.",
    progressiveOverloadTip: "Direnç günlerinde çift ilerleme kullanın. Kardiyoda önce süreyi, sonra hızı artırın; aynı hafta iki değişkeni birden yükseltmeyin.",
    workout: [
      { dayName: "1. Gün: Tüm Vücut Kuvvet", isRest: false, exercises: [
        { name: "Barbell Back Squat", sets: "3", reps: "5-8", rest: "180 sn" },
        { name: "Bench Press", sets: "3", reps: "5-8", rest: "150 sn" },
        { name: "Bent Over Barbell Row", sets: "3", reps: "6-10", rest: "120 sn" }
      ]},
      { dayName: "2. Gün: Bölge 2 Kardiyo", isRest: false, exercises: [{ name: "Tempolu yürüyüş / bisiklet", sets: "1", reps: "35-45 dk", rest: "-" }] },
      { dayName: "3. Gün: Dinlenme", isRest: true, exercises: [] },
      { dayName: "4. Gün: Tüm Vücut Hipertrofi", isRest: false, exercises: [
        { name: "Romanian Deadlift", sets: "3", reps: "8-12", rest: "120 sn" },
        { name: "Incline Dumbbell Press", sets: "3", reps: "8-12", rest: "90 sn" },
        { name: "Lat Pulldown", sets: "3", reps: "8-12", rest: "90 sn" },
        { name: "Walking Lunges", sets: "2", reps: "10 / bacak", rest: "90 sn" }
      ]},
      { dayName: "5. Gün: Dinlenme", isRest: true, exercises: [] },
      { dayName: "6. Gün: Kardiyo İnterval", isRest: false, exercises: [{ name: "1 dk hızlı / 2 dk kolay", sets: "6", reps: "18 dk", rest: "Aktif" }] },
      { dayName: "7. Gün: Dinlenme", isRest: true, exercises: [] }
    ]
  }
];

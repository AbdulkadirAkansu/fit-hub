export const EXERCISES_DATA = [
  // --- GÖĞÜS (CHEST) ---
  {
    id: "bench-press",
    name: "Bench Press",
    targetMuscle: "Göğüs (Pectoralis Major)",
    difficulty: "Orta",
    equipment: "Barbell & Düz Sehpa",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Sehpaya sırt üstü uzanın. Barı omuz genişliğinden biraz daha geniş bir açıyla kavrayın. Kürek kemiklerinizi birleştirerek stabilite sağlayın. Barı kontrollü şekilde göğüs hizasına indirin ve nefes vererek yukarı itin.",
    biomechanics: "Pectoralis major (sternokostal lifler), anterior deltoid ve triceps brachii kaslarının sinerjik olarak çalıştığı en temel yatay itiş hareketidir. Kürek kemiği retraksiyonu, rotator manşet ekleminin korunmasını sağlar.",
    breathing: "Eksantrik evrede (barı indirirken) nefes alın, konsantrik evrede (barı iterken) nefes verin.",
    riskFactors: "Omuz ekleminin öne çıkması, barı göğse çarptırmak, belin aşırı köprülenmesi omuz ve omurga sakatlıklarını tetikler.",
    steps: [
      "Sehpaya yatıp ayaklarınızı yere sabitleyin.",
      "Barı omuz hizasından geniş şekilde kavrayıp kilitten kurtarın.",
      "Kürek kemiklerinizi birleştirerek göğsünüzü yukarı çıkarın.",
      "Barı sternumun (iman tahtası) alt ucuna doğru yavaşça indirin.",
      "Dirseklerinizi kilitlemeden, patlayıcı bir güçle yukarı doğru itin."
    ]
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    targetMuscle: "Üst Göğüs (Pectoralis Major Clavicular)",
    difficulty: "Orta",
    equipment: "Dumbbell & Eğik Sehpa",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "30-45 derece eğimli sehpaya uzanın. Dumbbell'ları omuz hizasında tutun. Ağırlıkları yukarıya doğru, göğüs kaslarınızı sıkarak itin. İndirirken omuz açısını korumaya dikkat edin.",
    biomechanics: "Göğüs kasının klavikular (üst) liflerini izole etmede etkilidir. Serbest ağırlık kullanımı, dengeleyici kasların (rotator cuff) daha aktif çalışmasını zorunlu kılar.",
    breathing: "Ağırlığı indirirken nefes alın, yukarı iterken nefes verin.",
    riskFactors: "Sehpa açısının 45 dereceden yüksek olması yükü omuza (anterior deltoid) kaydırır. Aşırı derin inişler omuz kapsülünü zorlar.",
    steps: [
      "Sehpayı 30-45 derece açıya ayarlayıp sırtınızı yaslayın.",
      "Dumbbell'ları dizlerinizden destek alarak omuz seviyesine getirin.",
      "Nefes alarak ağırlıkları dirsekler 90 derece olana dek yanlara indirin.",
      "Nefes vererek dumbbell'ları tepe noktasında birleştirecek şekilde yukarı itin."
    ]
  },
  {
    id: "dumbbell-fly",
    name: "Dumbbell Fly",
    targetMuscle: "Göğüs (Pectoralis Major)",
    difficulty: "Orta",
    equipment: "Dumbbell & Düz Sehpa",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Düz sehpaya yatın. Dumbbell'ları avuç içleri birbirine bakacak şekilde yukarıda tutun. Dirseklerinizi hafif bükük tutarak kollarınızı yanlara doğru genişçe açın, göğsünüzde gerilmeyi hissedin ve başlangıç pozisyonuna dönün.",
    biomechanics: "Humerus adduksiyonunu izole eden, pres hareketlerine kıyasla triceps aktivasyonunu sıfırlayan ve göğüs liflerini en geniş esneme pozisyonunda çalıştıran bir harekettir.",
    breathing: "Kolları yana açarken nefes alın, göğüs kaslarını sıkarak kapatırken nefes verin.",
    riskFactors: "Dirsekleri tamamen düzleştirmek biceps tendonunu ve dirsek eklemini aşırı zorlar. Aşırı derin inişler omuz yırtıklarına sebep olabilir.",
    steps: [
      "Düz sehpaya uzanıp dumbbell'ları göğüs üzerinde dikey konumlandırın.",
      "Dirseklerinizi sabit bir açıyla (yaklaşık 10-15 derece) bükün.",
      "Ağırlıkları yanlara doğru geniş bir yay çizerek omuz seviyesine indirin.",
      "Göğüs kaslarınızı sıkarak ağırlıkları başlangıç noktasına geri getirin."
    ]
  },

  // --- SIRT (BACK) ---
  {
    id: "pull-up",
    name: "Pull-up (Barfiks)",
    targetMuscle: "Sırt (Latissimus Dorsi)",
    difficulty: "İleri",
    equipment: "Barfiks Demiri",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Barfiks demirini omuz genişliğinden geniş ve üstten tutuşla kavrayın. Kendinizi, dirseklerinizi aşağı ve geriye çekerek, çeneniz barı geçene kadar yukarı çekin. Yavaşça kontrollü şekilde aşağı inin.",
    biomechanics: "Gövde stabilizasyonu ile birlikte skapular depresyon ve humerus adduksiyonunu birleştiren en etkili üst gövde çekiş egzersizidir. Latissimus dorsi ve teres major başrol oynar.",
    breathing: "Kendinizi yukarı çekerken nefes verin, aşağı inerken kontrollü şekilde nefes alın.",
    riskFactors: "Omuzları kulaklara sıkıştırmak, sallanarak ivme almak (kipping) ve kontrolsüzce aşağı bırakmak eklemlere ani şok bindirir.",
    steps: [
      "Barı omuzlardan geniş bir açıyla kavrayıp asılı kalın.",
      "Karın ve kalça kaslarınızı sıkarak vücudunuzu sabitleyin.",
      "Kürek kemiklerinizi aşağı bastırarak hareketi sırtınızla başlatın.",
      "Çeneniz barın üzerine çıkana dek kendinizi yukarı çekin.",
      "Kaslardaki gerilimi kaybetmeden, kontrollü bir şekilde başlangıç pozisyonuna inin."
    ]
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    targetMuscle: "Sırt (Latissimus Dorsi)",
    difficulty: "Başlangıç",
    equipment: "Lat Pulldown İstasyonu",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Makineye oturun ve dizlerinizi sabitleyin. Geniş barı omuz genişliğinden fazla olacak şekilde kavrayın. Göğsünüzü hafif yukarı kaldırarak barı köprücük kemiğinize doğru çekin.",
    biomechanics: "Barfikse geçişte Latissimus dorsi kasının gücünü artırmak için kullanılan kontrollü bir açık zincir hareketidir. Alt trapez ve rhomboidler ikincil olarak çalışır.",
    breathing: "Barı aşağı çekerken nefes verin, yukarı bırakırken nefes alın.",
    riskFactors: "Barı boynun arkasına çekmek servikal omurgayı ve omuz rotator manşetini tehlikeli bir açıda zorlar.",
    steps: [
      "Dizlikleri bacaklarınızı sıkıca tutacak şekilde ayarlayıp oturun.",
      "Barı geniş açıyla kavrayıp kalçanızı koltuğa sabitleyin.",
      "Göğsünüzü yukarı kaldırıp barı üst göğüs bölgenize doğru çekin.",
      "Çekiş esnasında dirseklerinizin doğrudan aşağıyı göstermesine dikkat edin.",
      "Ağırlığı yukarıya yavaşça ve sırt kaslarındaki gerilimi koruyarak bırakın."
    ]
  },
  {
    id: "bent-over-row",
    name: "Bent Over Barbell Row",
    targetMuscle: "Orta Sırt (Trapezius & Rhomboids)",
    difficulty: "Orta",
    equipment: "Barbell",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Ayaklarınızı omuz genişliğinde açın. Kalçanızı geriye iterek gövdenizi yaklaşık 45 derece eğin. Barı alt karın bölgenize doğru, dirseklerinizi vücudunuza yakın tutarak çekin.",
    biomechanics: "Sırt kalınlığı ve postüral dayanıklılık için mükemmeldir. Erector spinae, hamstring ve gluteus kasları gövdeyi eğik tutmak için izometrik olarak kasılırken, latissimus ve rhomboidler dinamik çekiş yapar.",
    breathing: "Barı karnınıza doğru çekerken nefes verin, aşağı indirirken nefes alın.",
    riskFactors: "Omurganın bükülmesi (kamburlaşma) alt bel omurlarına binen kesme kuvvetini (shear force) artırarak fıtık riskini yükseltir.",
    steps: [
      "Ayaklar omuz genişliğinde, barı avuç içleri yere bakacak şekilde kavrayın.",
      "Dizleri hafif büküp kalçayı geriye vererek gövdeyi öne eğin (sırt düz).",
      "Barı uyluklarınızın üzerinden kaydırarak alt karın bölgenize çekin.",
      "Çekiş noktasında kürek kemiklerinizi birbirine doğru sıkıştırın.",
      "Kolları yavaşça uzatarak barı başlangıç pozisyonuna indirin."
    ]
  },

  // --- BACAK (LEGS) ---
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    targetMuscle: "Ön Bacak (Quadriceps) & Kalça",
    difficulty: "Orta",
    equipment: "Barbell & Squat Rack",
    image: "https://images.unsplash.com/photo-1574673139082-13d66730039c?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Barı sırtınızın üst kısmına (trapezlerin üzerine) yerleştirin. Ayaklarınızı omuz genişliğinde açın. Kalçanızı geriye ve aşağıya doğru iterek dizlerinizi bükün, uyluklarınız yere paralel olana kadar inin ve kalkın.",
    biomechanics: "Alt vücudun kralı kabul edilen çok eklemli (bileşik) harekettir. Quadriceps, Gluteus Maximus, Soleus ve stabilizasyon için tüm karın/bel duvarı aktif çalışır.",
    breathing: "Aşağı inerken (eksantrik) nefes alın, yukarı kalkarken (konsantrik) nefes verin.",
    riskFactors: "Dizlerin içe çökmesi (Valgus), topukların yerden kesilmesi ve belin alt noktada yuvarlanması (Butt Wink) diz ve omurga için tehlikelidir.",
    steps: [
      "Barı trapez kaslarınızın üzerine yerleştirip askıdan alın.",
      "Ayaklarınızı omuz genişliğinde açıp parmak uçlarını hafif dışa çevirin.",
      "Karın kaslarınızı kilitleyip göğsü dik tutarak geriye doğru oturun.",
      "Kalçanız diz kapağınızın altına inene kadar (paralel veya altı) alçalın.",
      "Topuklarınızdan güç alarak patlayıcı şekilde yukarı kalkın."
    ]
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    targetMuscle: "Arka Bacak (Hamstrings) & Kalça",
    difficulty: "Orta",
    equipment: "Barbell veya Dumbbell",
    image: "https://images.unsplash.com/photo-1603503364272-9118559092be?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Ayakta dik durun, barı elinizde tutun. Dizlerinizi çok hafif bükük (sabit) tutarak kalçanızı olabildiğince geriye itin. Sırtınız düz şekilde ağırlığı kaval kemiğiniz boyunca indirin ve kalçayı sıkarak doğrulun.",
    biomechanics: "Arka bacak ve kalça kaslarını eksantrik (uzayarak) yüklenme altında en iyi çalıştıran Hip Hinge (Kalça Menteşesi) hareketidir. Hamstring esnekliğini ve gücünü artırır.",
    breathing: "Ağırlığı indirirken nefes alın, doğrularak kalçayı kilitlerken nefes verin.",
    riskFactors: "Dizleri aşırı bükmek hareketi squat'a çevirir. Sırtı bükmek ise tüm yükü omurgaya bindirerek sakatlığa yol açar.",
    steps: [
      "Barı üstten tutuşla kavrayıp dik pozisyonda başlayın.",
      "Dizlerinizi hafifçe bükün ve bu açıyı hareket boyunca kilitleyin.",
      "Gövdenizi bükmeden, kalçanızı duvarı arkaya itiyormuş gibi geriye doğru kaydırın.",
      "Barı uyluklarınızın üzerinde, diz hizasının altına inene kadar indirin.",
      "Hamstring kaslarındaki gerilimi kullanarak doğrulum sağlayın ve tepe noktasında kalçayı sıkın."
    ]
  },
  {
    id: "leg-press",
    name: "Leg Press",
    targetMuscle: "Ön Bacak (Quadriceps)",
    difficulty: "Başlangıç",
    equipment: "Leg Press Makinesi",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Makineye sırtınız tam yaslanacak şekilde oturun. Ayaklarınızı platforma omuz genişliğinde koyun. Güvenlik kilitlerini açıp platformu dizlerinizi bükerek göğsünüze yaklaştırın, ardından itin.",
    biomechanics: "Sırtı stabilize ettiği için omurga üzerindeki eksenel yükü minimize eden, quadriceps kaslarını yüksek hacimle izole etmeye yarayan kinetik zincir hareketidir.",
    breathing: "Platformu kendinize doğru indirirken nefes alın, yukarı doğru iterken nefes verin.",
    riskFactors: "Tepe noktasında dizleri tam kilitlemek (hiperekstansiyon) eklem hasarına yol açar. Kalçanın koltuktan yukarı kalkması alt beli aşırı sıkıştırır.",
    steps: [
      "Sırtınızı koltuğa tamamen yaslayıp ayaklarınızı platforma yerleştirin.",
      "Ağırlığı yukarı hafifçe iterek kilit mekanizmasını dev dışı bırakın.",
      "Dizlerinizi bükerek platformu kontrollü şekilde göğsünüze doğru indirin.",
      "Topuklarınızla platformu geri iterken dizleri asla kilitlemeyin (%95 uzatın)."
    ]
  },
  {
    id: "walking-lunges",
    name: "Walking Lunges",
    targetMuscle: "Bacak (Quads & Glutes)",
    difficulty: "Orta",
    equipment: "Dumbbell",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Her iki elinize birer dumbbell alın. İleriye doğru büyük bir adım atın. Arkadaki diziniz yere değecek kadar alçalın. İki diziniz de 90 derece açı yapmalıdır. Doğrularak diğer ayağınızla adım atın.",
    biomechanics: "Unilateral (tek taraflı) uyarım sağlayarak bacaklar arasındaki kuvvet dengesizliğini giderir. Kalça stabilizörleri (Gluteus Medius) üst düzey aktifleşir.",
    breathing: "Adım atıp alçalırken nefes alın, yukarı doğrulurken nefes verin.",
    riskFactors: "Diz kapağının öne doğru aşırı kayıp ayak parmak ucunu çok geçmesi diz bağlarına binen yükü artırır. Denge kaybına dikkat edilmelidir.",
    steps: [
      "Ellerinizde dumbbell'larla dik duruş pozisyonu alın.",
      "Öne doğru kontrollü ve geniş bir adım atın.",
      "Arka dizinizi yere yaklaştırırken ön dizinizi 90 dereceye getirin.",
      "Öndeki topuğunuzdan güç alarak doğrulum sağlayın ve bir sonraki adımı atın."
    ]
  },

  // --- OMUZ (SHOULDERS) ---
  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    targetMuscle: "Omuz (Anterior & Lateral Deltoid)",
    difficulty: "Orta",
    equipment: "Dumbbell & Sehpa",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Dik ayarlanmış sehpaya oturun. Dumbbell'ları kulak hizasında, avuç içleri karşıya bakacak şekilde tutun. Ağırlıkları dirseklerinizi kilitlemeden başınızın üzerine itin.",
    biomechanics: "Omuz kemerinin en temel dikey itiş hareketidir. Deltoid kasının ön ve yan başlarını çalıştırırken trapezler ve triceps de harekete eşlik eder.",
    breathing: "Ağırlığı yukarı iterken nefes verin, indirirken nefes alın.",
    riskFactors: "Belin sehpadan ayrılıp aşırı kavislenmesi, dirseklerin geriye kaçması omuz eklem sıkışması sendromunu tetikler.",
    steps: [
      "Sehpayı 85-90 derece açıya getirip sırtınızı yaslayın.",
      "Dumbbell'ları omuz hizasında avuç içleri karşıya bakacak açıda konumlandırın.",
      "Nefes vererek ağırlıkları dikey eksende yukarı doğru sürün.",
      "Dumbbell'ları kontrollü şekilde kulak memesi hizasına kadar geri indirin."
    ]
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    targetMuscle: "Yan Omuz (Lateral Deltoid)",
    difficulty: "Başlangıç",
    equipment: "Dumbbell",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Ayakta dik durun, dumbbell'ları yanlarda tutun. Dirseklerinizi çok hafif bükerek, kollarınızı omuz hizasına gelene kadar yanlara doğru kaldırın ve yavaşça indirin.",
    biomechanics: "Omuz genişliği ve omuzun yuvarlak hatlara sahip olması için lateral deltoid liflerini en iyi izole eden egzersizdir. Üst trapez kasının katılımını en aza indirmek önemlidir.",
    breathing: "Kolları kaldırırken nefes verin, indirirken nefes alın.",
    riskFactors: "Ağırlığı savurarak kaldırmak, omuz hizasının üzerine çıkarmak omuz bağlarında (supraspinatus) sürtünme ve inflamasyona yol açar.",
    steps: [
      "Ayaklar omuz genişliğinde, dumbbell'lar vücudun yanında avuçlar içe dönük durun.",
      "Gövdenizi hafifçe (5 derece) öne eğin ve dirsekleri hafif bükün.",
      "Kolları omuz seviyesine gelene kadar yana doğru geniş bir kavisle kaldırın.",
      "İndiriş fazını (negatif) yerçekimine karşı koyarak yavaşça gerçekleştirin."
    ]
  },
  {
    id: "face-pull",
    name: "Face Pull",
    targetMuscle: "Arka Omuz (Posterior Deltoid) & Rotator Cuff",
    difficulty: "Başlangıç",
    equipment: "Kablo İstasyonu & Halat",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Kablo makarasını üst göğüs hizasına ayarlayın. Halatı iki ucundan kavrayın. Bir adım geri atıp halatı alnınıza doğru çekerken dirseklerinizi yukarıda tutun ve omuzlarınızı dışa doğru döndürün.",
    biomechanics: "Omuz sağlığı, duruş (postür) düzeltme ve arka deltoid/infraspinatus kaslarının güçlenmesi için kritik bir egzersizdir. Skapular retraksiyon ve dış rotasyon birleşir.",
    breathing: "Halatı kendinize çekerken nefes verin, başlangıç pozisyonuna bırakırken nefes alın.",
    riskFactors: "Dirseklerin aşağı düşmesi hareketin arka omuzdan çıkıp sırt kaslarına (lats) kaymasına sebep olur.",
    steps: [
      "Kabloyu göz hizasına sabitleyip halat aparatını takın.",
      "Halatı baş parmaklarınız arkayı gösterecek şekilde kavrayıp geriye adım atın.",
      "Halatın orta noktasını alnınıza doğru çekerken dirsekleri dışarı açın.",
      "Çekişin sonunda halat uçlarını yanlara doğru ayırarak omuzları dışa döndürün.",
      "Yavaşça kollarınızı uzatarak ağırlığı geri bırakın."
    ]
  },

  // --- KOL (ARMS) ---
  {
    id: "biceps-curl",
    name: "Biceps Curl",
    targetMuscle: "Ön Kol (Biceps Brachii)",
    difficulty: "Başlangıç",
    equipment: "Dumbbell veya Barbell",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Ayakta durun, dumbbell'ları avuç içleri karşıya bakacak şekilde tutun. Dirseklerinizi vücudunuza sabitleyerek ağırlıkları omuz hizasına doğru bükün ve kontrollü şekilde indirin.",
    biomechanics: "Dirsek fleksiyonunu ve ön kol supinasyonunu izole eden en popüler kol egzersizidir. Biceps brachii'nin kısa ve uzun başını uyarır.",
    breathing: "Ağırlığı yukarı bükerken nefes verin, aşağı indirirken nefes alın.",
    riskFactors: "Dirseklerin öne doğru kayması ve sırtı sallayarak belden güç almak (cheating) hedef kasın aktivasyonunu azaltır.",
    steps: [
      "Dumbbell'ları kavrayıp dik durun, dirsekleri gövdeye yakın tutun.",
      "Avuç içlerini yukarı/dışa doğru çevirerek (supinasyon) dirseği bükün.",
      "Ağırlığı omuz yüksekliğine yaklaştırıp biceps kasını tepe noktasında sıkın.",
      "Kontrollü bir şekilde kolları uzatarak başlangıç noktasına dönün."
    ]
  },
  {
    id: "triceps-pushdown",
    name: "Triceps Pushdown",
    targetMuscle: "Arka Kol (Triceps Brachii)",
    difficulty: "Başlangıç",
    equipment: "Kablo İstasyonu & Halat/Bar",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Üst kablo makarasına halatı takın. Dirseklerinizi 90 derece büküp gövdenize sabitleyin. Dirseklerinizi kilit noktasına kadar aşağı doğru açarak halatı çekin.",
    biomechanics: "Triceps brachii kasının lateral ve medial kafalarını yüksek oranda çalıştıran dirsek ekstansiyonu hareketidir. Dirseklerin gövde yanında sabitlenmesi izolasyon için şarttır.",
    breathing: "Halatı aşağı doğru iterken (ekstansiyon) nefes verin, yukarı bırakırken nefes alın.",
    riskFactors: "Dirseklerin yanlara doğru açılması omuz ve göğüs kaslarının harekete dahil olmasına yol açar.",
    steps: [
      "Halatı göğüs üstü seviyesinde kavrayıp dirsekleri vücudunuza yaslayın.",
      "Hafifçe öne eğilin, karın kaslarınızı sıkın.",
      "Sadece ön kollarınızı hareket ettirerek halatı yere doğru itin.",
      "İtişin sonunda halat uçlarını iki yana açarak triceps'i iyice sıkın.",
      "Dirsek açısını 90 dereceye getirene kadar kontrollü şekilde yukarı bırakın."
    ]
  },

  // --- CORE (KARIN & BEL) ---
  {
    id: "plank",
    name: "Plank",
    targetMuscle: "Karın Kasları (Rectus Abdominis & Transversus)",
    difficulty: "Başlangıç",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1571019623954-41499b785307?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness/Pilates",
    instructions: "Şınav pozisyonu alın ancak dirseklerinizin üzerinde durun. Vücudunuzu baştan topuklara kadar düz bir çizgide tutun. Karın ve kalça kaslarınızı sıkarak bu pozisyonu koruyun.",
    biomechanics: "Yerçekimine karşı omurganın fleksiyonunu ve ekstansiyonunu önleyen (anti-extension) en temel izometrik core stabilizasyon egzersizidir.",
    breathing: "Pozisyonu korurken nefesinizi tutmayın, derin ve ritmik nefes almaya devam edin.",
    riskFactors: "Kalçanın yukarı fırlaması veya aşağı çökmesi bel omurlarına aşırı yük binmesine ve bel ağrılarına neden olur.",
    steps: [
      "Ön kollarınızı matın üzerine koyarak şınav pozisyonuna geçin.",
      "Dirseklerinizin doğrudan omuzlarınızın altında durmasına dikkat edin.",
      "Ayak parmak uçlarında yükselip kalçayı ve karnı maksimum düzeyde sıkın.",
      "Baş, boyun, sırt ve kalçayı düz bir hat üzerinde hizalayın.",
      "Hedef süre boyunca izometrik olarak kasılmayı sürdürün."
    ]
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    targetMuscle: "Alt Karın (Rectus Abdominis) & Hip Flexors",
    difficulty: "İleri",
    equipment: "Barfiks Demiri",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Barfiks demirine asılın. Bacaklarınızı düz tutarak, kalçanızı yukarı bükerek bacaklarınızı yere paralel olana kadar kaldırın ve yavaşça indirin.",
    biomechanics: "Alt karın liflerini hedefleyen, pelvisin posterior rotasyonunu zorunlu kılan ileri seviye bir core hareketidir. Kalça fleksörleri de dinamik olarak eşlik eder.",
    breathing: "Bacakları yukarı kaldırırken nefes verin, aşağı indirirken nefes alın.",
    riskFactors: "Vücudu sallayarak (momentum kullanarak) bacak kaldırmak karın aktivasyonunu düşürür ve omuzlara yük bindirir.",
    steps: [
      "Barfiks barında asılı kalarak vücudunuzu tamamen uzatın.",
      "Bacaklarınızı birleştirip dizlerinizi düz tutun.",
      "Gövdenizi sallamadan, karın gücüyle bacaklarınızı 90 dereceye kaldırın.",
      "Bacakları indirirken yerçekimine karşı koyarak yavaşça başlangıç pozisyonuna getirin."
    ]
  },

  // --- PİLATES ---
  {
    id: "the-hundred",
    name: "The Hundred",
    targetMuscle: "Derin Karın (Transversus Abdominis)",
    difficulty: "Orta",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518611012118-296072bb5604?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Sırt üstü yatın. Baş ve omuzlarınızı yerden kaldırıp bacaklarınızı 45 derece havaya kaldırın. Kollarınızı yanlarda hızlıca aşağı yukarı hareket ettirirken 100'e kadar nefes döngüsünü tamamlayın.",
    biomechanics: "Pilates metodolojisinin klasik ısınma ve core stabilizasyon hareketidir. Kollardaki dinamik salınım, stabil tutulması gereken core bölgesi üzerinde bozucu bir kuvvet oluşturarak derin transversus liflerini zorlar.",
    breathing: "5 kol vuruşunda burundan nefes alın, 5 kol vuruşunda ağızdan nefes verin. Toplamda 100 vuruş (10 nefes döngüsü).",
    riskFactors: "Boynun öne aşırı bükülmesi, belin mat ile temasının kesilip kavislenmesi boyun ve bel incinmelerine sebep olur.",
    steps: [
      "Sırt üstü yatın, bacakları masa (tabletop) pozisyonuna getirin.",
      "Baş, boyun ve omuzları kürek kemiklerinin alt ucuna kadar mattan kaldırın.",
      "Bacakları ileriye, 45 derece açıya doğru düzleştirin.",
      "Kolları mat hizasında uzatarak aşağı yukarı küçük ve dinamik vuruşlar yapın.",
      "Her 5 vuruşta nefes alıp, her 5 vuruşta nefes vererek 10 set tamamlayın."
    ]
  },
  {
    id: "single-leg-stretch",
    name: "Single Leg Stretch",
    targetMuscle: "Karın Kasları & Kalça Fleksörleri",
    difficulty: "Başlangıç",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518611012118-296072bb5604?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Sırt üstü yatın. Baş ve omuzlarınızı kaldırın. Bir dizinizi göğsünüze çekerken diğer bacağınızı 45 derece açıyla ileriye uzatın. Bacakları sırayla değiştirerek hareketi sürdürün.",
    biomechanics: "Pelvik stabiliteyi korurken bacakların sırayla hareket ettirilmesiyle sagital düzlemde core kontrolünü geliştiren mükemmel bir başlangıç pilates egzersizidir.",
    breathing: "Her bacak değişiminde bir kez nefes alın, diğer değişimde nefes verin.",
    riskFactors: "Gövdenin sağa sola sallanması, belin yerden kalkması pelvik stabilite kaybını gösterir.",
    steps: [
      "Sırt üstü yatıp dizlerinizi göğsünüze çekin.",
      "Baş ve omuzlarınızı mattan kaldırıp kürek kemiklerini sabitleyin.",
      "Sağ dizinizi göğsünüze çekip sol bacağınızı ileriye düz uzatın.",
      "Ellerinizle sağ dizinizi hafifçe kendinize çekerken omurgayı koruyun.",
      "Bacakları değiştirerek harekete ritmik şekilde devam edin."
    ]
  },
  {
    id: "teaser",
    name: "Teaser",
    targetMuscle: "Tüm Karın Kasları & Spinal Ekstansörler",
    difficulty: "İleri",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518611012118-296072bb5604?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Sırt üstü yatın, kollarınızı başınızın arkasına uzatın. Nefes alırken aynı anda kollarınızı, başınızı ve bacaklarınızı kaldırarak vücudunuzu 'V' pozisyonuna getirin, dengede kalın ve yavaşça inin.",
    biomechanics: "Pilatesin en zorlu güç, denge ve esneklik egzersizlerinden biridir. Spinal artikülasyonu (omurların tek tek hareket etmesi) ve pelvik stabiliteyi üst düzeyde sınar.",
    breathing: "Yerdeyken nefes alın, 'V' pozisyonuna yükselirken yavaşça nefes verin.",
    riskFactors: "Omurgayı yuvarlamadan küt küt yükselmek omurlar arası disklere baskı yapar. Yeterli hamstring esnekliği yoksa dizler bükülebilir.",
    steps: [
      "Sırt üstü yatıp bacakları 45 dereceye kaldırın, kolları başın arkasına uzatın.",
      "Kolları yukarı kaldırırken baş ve sırtı sırayla mattan yuvarlayarak kaldırın.",
      "Gövdeyi ve bacakları dengede tutacak şekilde 'V' harfi oluşturun.",
      "Kolları bacaklara paralel uzatıp göğsü dikleştirin.",
      "Omurgayı tek tek mat üzerine yuvarlayarak başlangıç pozisyonuna kontrollü şekilde inin."
    ]
  },
  {
    id: "criss-cross",
    name: "Criss Cross",
    targetMuscle: "Eğik Karın Kasları (Obliques)",
    difficulty: "Orta",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518611012118-296072bb5604?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Sırt üstü yatın, ellerinizi başınızın arkasına koyun. Omuzlarınızı kaldırın. Sol dizinizi çekerken sağ dirseğinizi sol dizinize doğru döndürün, diğer bacağı uzatın. Yön değiştirerek devam edin.",
    biomechanics: "Omurganın rotasyonu ve fleksiyonunun birleştirilmesiyle oblik kas grubunu en etkili çalıştıran pilates egzersizidir. Pelvisin yerde sabit kalması gerekir.",
    breathing: "Her rotasyonda (dönüş aşamasında) derin nefes verin, merkezde nefes alın.",
    riskFactors: "Dirsekleri içeri kapatıp boynu çekiştirmek boyun omurlarını zedeler. Hareketi kollarla değil, gövde rotasyonuyla yapın.",
    steps: [
      "Sırt üstü yatıp elleri başın arkasında birleştirin, dizler tabletop pozisyonunda.",
      "Baş ve omuzları mattan kaldırın.",
      "Sağ dirseğinizi sol dizinize yaklaştırırken sağ bacağınızı 45 derece ileri uzatın.",
      "Merkeze dönüp hemen sol dirseği sağ dize yaklaştırırken sol bacağı uzatın.",
      "Kalçanın mat üzerinde sağa sola oynamamasına dikkat edin."
    ]
  },
  {
    id: "swan-dive",
    name: "Swan Dive",
    targetMuscle: "Sırt Ekstansörleri & Kalça Kasları",
    difficulty: "İleri",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518611012118-296072bb5604?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Yüz üstü yatın, ellerinizi omuz hizasında yere koyun. Göğsünüzü kaldırarak omurganızı geriye doğru uzatın. Kolları yana açarak vücudunuzu bir tahterevalli gibi öne ve arkaya doğru sallayın.",
    biomechanics: "Posterior zincirin tamamını yerçekimine karşı hiper-ekstansiyona sokan, omurga esnekliğini ve sırt kaslarının dayanıklılığını maksimum düzeyde zorlayan bir harekettir.",
    breathing: "Göğsü kaldırıp yükselirken nefes alın, öne doğru yuvarlanırken nefes verin.",
    riskFactors: "Gluteal (kalça) kasları sıkmadan alt beli aşırı sıkıştırmak lomber omurgada ciddi ağrılara yol açabilir.",
    steps: [
      "Yüz üstü yatıp elleri omuzların altına koyun, bacakları birleştirip kalçayı sıkın.",
      "Nefes alarak göğsünüzü yukarı kaldırın, dirsekleri hafif açın (Kuğu pozisyonu).",
      "Kolları ileri uzatıp vücudu öne doğru yuvarlarken bacakları havaya kaldırın.",
      "Vücudu gergin bir yay gibi tutarak kontrollü şekilde salınım yapın."
    ]
  },
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    targetMuscle: "Tüm Posterior Zincir (Sırt, Bel, Kalça, Arka Bacak)",
    difficulty: "İleri",
    equipment: "Barbell",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Ayaklarınızı kalça genişliğinde açın, bar kaval kemiklerinize yakın olsun. Kalçanızı geriye iterek çömelin ve barı kavrayın. Sırtınızı düz tutarak, topuklarınızla yeri iterek dik durun. Barı uyluklarınız hizasında kilitleyin.",
    biomechanics: "Vücuttaki en temel ve en çok kası uyardığı bilinen bileşik çekiş hareketidir. Erector spinae, gluteus maximus, hamstringler ve quadriceps kaslarını yoğun şekilde uyarır.",
    breathing: "Yerdeyken nefes alın, yukarı kalkarken ve kilit noktasında nefes verin.",
    riskFactors: "Belin bükülmesi, barın vücuttan uzaklaşması lomber disklere aşırı yük bindirerek fıtıklara sebep olabilir.",
    steps: [
      "Bar ayak ortanızın üzerine gelecek şekilde durun.",
      "Sırtı düz tutarak kalçadan eğilin ve barı omuz genişliğinde kavrayın.",
      "Göğsü dikleştirip omuzları geriye çekerek omurgayı kilitleyin.",
      "Topuklarınızla yeri iterek barı bacaklarınıza yakın tutarak yukarı çekin.",
      "Kalça ve dizlerinizi tamamen uzatarak dik pozisyonda kilitleyin."
    ]
  },
  {
    id: "dips",
    name: "Dips",
    targetMuscle: "Alt Göğüs & Triceps",
    difficulty: "Orta",
    equipment: "Dips Barı",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Paralel barlarda kendinizi yukarı itin. Gövdenizi hafifçe öne eğerek (göğüs için) dirseklerinizi büküp vücudunuzu aşağı indirin. Dirsekleriniz 90 dereceye geldiğinde kendinizi yukarı itin.",
    biomechanics: "Kendi vücut ağırlığınızla yapabileceğiniz en etkili itiş egzersizlerinden biridir. Alt göğüs liflerini (pectoralis major abdominal) ve triceps brachii kasını yüksek düzeyde aktifleştirir.",
    breathing: "Aşağı inerken nefes alın, kendinizi yukarı iterken nefes verin.",
    riskFactors: "Omuzların öne yuvarlanması ve aşırı derin inişler rotator cuff tendonlarını sıkıştırarak omuz hasarına yol açabilir.",
    steps: [
      "Dips barlarını kavrayıp kendinizi yukarı kaldırın ve dirseklerinizi kilitleyin.",
      "Gövdenizi hafifçe (yaklaşık 15 derece) öne doğru eğin ve dizlerinizi bükün.",
      "Dirseklerinizi dışa doğru hafifçe açarak 90 derece olana kadar alçalın.",
      "Göğüs ve arka kol gücünüzü kullanarak kendinizi başlangıç pozisyonuna itin."
    ]
  },
  {
    id: "barbell-overhead-press",
    name: "Barbell Overhead Press (OHP)",
    targetMuscle: "Omuz (Ön Deltoid) & Triceps",
    difficulty: "İleri",
    equipment: "Barbell",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Barı omuz yüksekliğindeki raftan alın, elleriniz omuz hizasından biraz geniş olsun. Gövdenizi sıkı tutup barı başınızın üzerine doğru dikey bir hat boyunca itin.",
    biomechanics: "Omuz gücü ve stabilizasyonu için altın standart olan dikey itiş hareketidir. Ön omuz, yan omuz, triceps ve serratus anterior kaslarını hedeflerken core bölgesi izometrik çalışır.",
    breathing: "İtmeden önce karın basıncı oluşturmak için nefes alın, bar baş üstündeyken veya inişte nefes verin.",
    riskFactors: "Belin aşırı arkaya bükülmesi (hiperekstansiyon) omurga eklemlerine zarar verir. Gluteus ve core kaslarının sıkılması gerekir.",
    steps: [
      "Barı omuz yüksekliğinde kavrayıp üst göğse yerleştirin, dirsekler hafif önde olmalıdır.",
      "Karın ve kalça kaslarınızı sıkıp ayaklarınızı yere sabitleyin.",
      "Barın geçmesi için kafanızı hafifçe geriye çekerek barı yukarı itin.",
      "Bar kafayı geçtikten sonra başınızı öne getirin ve barı kilitleyin.",
      "Kontrollü bir şekilde barı tekrar köprücük kemiğinize indirin."
    ]
  },
  {
    id: "dumbbell-hammer-curl",
    name: "Dumbbell Hammer Curl",
    targetMuscle: "Ön Kol (Brachialis & Brachioradialis)",
    difficulty: "Başlangıç",
    equipment: "Dumbbell",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Ayakta durun, dumbbell'ları avuç içleriniz birbirine bakacak şekilde (nötr tutuş) yanlarda tutun. Dirseklerinizi oynatmadan ağırlıkları omuzlarınıza bükün.",
    biomechanics: "Biceps brachii'nin altındaki brachialis kasını ve ön kolun ana kası olan brachioradialis'i geliştirerek kolun kalın görünmesini sağlayan nötr tutuş fleksiyonudur.",
    breathing: "Ağırlığı kaldırırken nefes verin, indirirken nefes alın.",
    riskFactors: "Vücudu sallamak ve dirsekleri öne kaçırmak biceps dışındaki kasların devreye girmesine yol açar.",
    steps: [
      "Ayaklar omuz genişliğinde durun, dumbbell'ları nötr (çekiç) tutuşla tutun.",
      "Dirsekleri gövdeye sabitleyip oynatmadan ağırlığı yukarı bükün.",
      "Tepe noktasında brachialis kasındaki sıkışmayı hissedin.",
      "Yerçekimine karşı koyarak ağırlığı yavaşça aşağı indirin."
    ]
  },
  {
    id: "lying-leg-curl",
    name: "Lying Leg Curl",
    targetMuscle: "Arka Bacak (Hamstrings)",
    difficulty: "Başlangıç",
    equipment: "Leg Curl Makinesi",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Makineye yüz üstü yatın, silindiri ayak bileklerinizin arkasına yerleştirin. Tutacakları kavrayıp kalçanızı oynatmadan dizlerinizi bükerek ağırlığı kalçanıza çekin.",
    biomechanics: "Hamstringlerin (biceps femoris, semitendinosus, semimembranosus) diz fleksiyon fonksiyonunu doğrudan ve izole şekilde uyaran tek eklemli açık zincir hareketidir.",
    breathing: "Ağırlığı bükerken nefes verin, yavaşça uzatırken nefes alın.",
    riskFactors: "Aşırı ağırlık kullanarak kalçanın pedden yukarı fırlaması belin gerilmesine ve yükün hamstringden kaçmasına neden olur.",
    steps: [
      "Yüz üstü yatıp silindiri aşil tendonunuzun üzerine yerleştirin.",
      "Tutamakları sıkıca kavrayarak kalçanızı pede bastırın.",
      "Dizlerinizi bükerek ağırlığı kontrollü şekilde kalçanıza yaklaştırın.",
      "Arka bacak kaslarınızı sıkıp, başlangıç pozisyonuna yavaşça geri bırakın."
    ]
  },
  {
    id: "standing-calf-raise",
    name: "Standing Calf Raise",
    targetMuscle: "Baldır (Gastrocnemius & Soleus)",
    difficulty: "Başlangıç",
    equipment: "Calf Makinesi veya Dumbbell",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Bir platformun ucuna ayak parmak uçlarınızla basın. Topuklarınızı aşağı sarkıtarak kalf kaslarınızı esnetin. Ardından parmak uçlarınızda yükselebildiğiniz kadar yükselin.",
    biomechanics: "Gastrocnemius ve soleus kaslarının plantar fleksiyon hareketidir. Kasın en uzun eksantrik (esneme) pozisyonundan konsantrik (sıkışma) pozisyonuna tam eklem hareketiyle çalıştırılması önemlidir.",
    breathing: "Yukarı doğru yükselirken nefes verin, aşağı doğru inerken nefes alın.",
    riskFactors: "Dizlerin bükülmesi yükü kalf kasından quadriceps'e kaydırır. Zıplayarak momentum kullanmak tendon sakatlıklarına yol açar.",
    steps: [
      "Ayak parmak uçlarınızla platformun kenarına basın ve topukları serbest bırakın.",
      "Dizlerinizi düz/kilitli tutarak topukları aşağı doğru yavaşça indirin (tam esneme).",
      "Parmak uçlarınızdan güç alarak gövdenizi dikey olarak yukarı itin (maksimum kasılma).",
      "Yukarıda 1 saniye bekledikten sonra kontrollü bir şekilde aşağı inin."
    ]
  },

  // --- BACAK & KALÇA (LEGS & GLUTES) ---
  {
    id: "hip-thrust",
    name: "Barbell Hip Thrust",
    targetMuscle: "Kalça (Gluteus Maximus)",
    difficulty: "Orta",
    equipment: "Barbell & Bench",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Sırtınızın üst kısmını bir sehpaya yaslayın, barı kalça çizginize yerleştirin. Topuklardan güç alarak kalçanızı tavana doğru itin ve tepe noktada gluteal kasları sıkın.",
    biomechanics: "Gluteus maximus'un kalça ekstansiyonundaki en yüksek aktivasyonunu sağlayan harekettir. EMG çalışmaları, hip thrust'ın squat'a kıyasla daha yüksek gluteal kas aktivasyonu ürettiğini göstermektedir; çünkü direnç vektörü yatay ve kasın en kısa boyunda maksimum yüklenir.",
    breathing: "Kalçayı yukarı iterken nefes verin, kontrollü inişte nefes alın.",
    riskFactors: "Belin aşırı ekstansiyona girmesi (kaburgaların açılması) lomber omurgayı zorlar; hareket boyunca kaburgalar kapalı ve çene içeride tutulmalıdır.",
    steps: [
      "Üst sırtınızı sehpaya yaslayıp barı kalça çizginize (pelvis) yerleştirin.",
      "Ayaklarınızı omuz genişliğinde, dizler 90 derece olacak şekilde konumlandırın.",
      "Topuklardan iterek kalçanızı gövdeniz yere paralel olana dek kaldırın.",
      "Tepede gluteal kasları 1-2 saniye sıkın, ardından kontrollü inin."
    ]
  },
  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    targetMuscle: "Bacak & Kalça (Quadriceps · Gluteus)",
    difficulty: "Orta",
    equipment: "Dumbbell & Bench",
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Arka ayağınızın üstünü bir sehpaya koyun, ön bacağınızla öne adım atın. Gövdeyi dik tutarak ön diziniz 90 dereceye gelene dek alçalın ve topuktan iterek yükselin.",
    biomechanics: "Tek taraflı (unilateral) bir harekettir; her bacağı izole ederek kas dengesizliklerini giderir ve dengeleyici kasları (gluteus medius) yoğun çalıştırır. Çift taraflı squat'a göre omurgaya binen aksiyel yükü azaltır.",
    breathing: "Alçalırken nefes alın, yukarı çıkarken nefes verin.",
    riskFactors: "Ön dizin ayak parmaklarını aşırı geçmesi diz patellofemoral baskısını artırır. Adım mesafesinin kısa olması quadriceps yerine dize yük bindirir.",
    steps: [
      "Arka ayağınızın üstünü arkanızdaki sehpaya yerleştirin.",
      "Ön bacağınızla, dizin topuk hizasında kalacağı kadar öne adım atın.",
      "Gövdeyi hafif öne eğip ön diz 90 derece olana dek kontrollü alçalın.",
      "Ön topuktan güç alarak başlangıç pozisyonuna yükselin."
    ]
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    targetMuscle: "Ön Bacak (Quadriceps)",
    difficulty: "Başlangıç",
    equipment: "Leg Extension Makinesi",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Makineye oturup ayak bileklerinizi pedin altına yerleştirin. Quadriceps kaslarınızı sıkarak bacaklarınızı kontrollü şekilde tam düz hale getirin ve yavaşça geri bırakın.",
    biomechanics: "Quadriceps'in (özellikle rektus femoris ve vastus medialis) izole edildiği tek eklemli (diz ekstansiyonu) harekettir. Kasın tepe kasılmasında (peak contraction) yüksek metabolik stres oluşturur.",
    breathing: "Bacakları düzleştirirken nefes verin, indirirken nefes alın.",
    riskFactors: "Çok ağır yükle ani hareket, ön çapraz bağ (ACL) üzerinde kesme kuvveti oluşturabilir. Hareket kontrollü ve orta yükle yapılmalıdır.",
    steps: [
      "Sırtınızı destekleyerek oturun, ayak bileklerini pedin altına alın.",
      "Quadriceps'i sıkarak dizleri tam ekstansiyona getirin.",
      "Tepede 1 saniye bekleyip kasılmayı hissedin.",
      "Ağırlığı yere değdirmeden kontrollü şekilde başlangıca indirin."
    ]
  },

  // --- SIRT (BACK) ---
  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    targetMuscle: "Orta Sırt (Rhomboids · Latissimus)",
    difficulty: "Başlangıç",
    equipment: "Kablo Makinesi",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Tutamağı kavrayıp dizleri hafif bükülü tutun. Kürek kemiklerinizi birbirine yaklaştırarak tutamağı karın bölgenize çekin, ardından kontrollü bırakın.",
    biomechanics: "Yatay çekiş hareketi olup rhomboid, orta trapez ve latissimus dorsi kaslarını hedefler. Skapular retraksiyon (kürek kemiği sıkıştırma) postür sağlığı için kritik olan sırt kaslarını güçlendirir.",
    breathing: "Tutamağı kendinize çekerken nefes verin, uzatırken nefes alın.",
    riskFactors: "Gövdeyi geriye yaslayarak momentum kullanmak beli zorlar. Omuzların yukarı kalkması (shrug) trapezi aşırı devreye sokar.",
    steps: [
      "Ayak desteğine basıp tutamağı iki elle kavrayın, sırt dik.",
      "Kürek kemiklerinizi geriye ve aşağıya sıkıştırın.",
      "Tutamağı göbek hizasına, dirsekler gövdeye yakın kalacak şekilde çekin.",
      "Sırt kaslarınızı kontrol ederek başlangıç pozisyonuna uzatın."
    ]
  },
  {
    id: "t-bar-row",
    name: "T-Bar Row",
    targetMuscle: "Sırt Kalınlığı (Latissimus · Trapezius)",
    difficulty: "Orta",
    equipment: "T-Bar / Landmine",
    image: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Barın üzerine eğilerek tutamağı kavrayın, sırtınızı düz tutun. Barı göğsünüze doğru çekip sırt kaslarınızı sıkın, kontrollü indirin.",
    biomechanics: "Destekli eğik çekiş hareketidir; latissimus dorsi, orta trapez ve rhomboidlerde yüksek mekanik gerilim oluşturur. Nötr/dar tutuş, sırt kalınlığını artıran iç sırt kaslarını vurgular.",
    breathing: "Barı çekerken nefes verin, indirirken nefes alın.",
    riskFactors: "Belin yuvarlanması (fleksiyon) disk basıncını tehlikeli düzeye çıkarır. Nötr omurga ve sıkı core boyunca korunmalıdır.",
    steps: [
      "Ayaklar bara iki yana, kalçadan eğilip nötr omurga alın.",
      "Tutamağı kavrayıp kolları uzatarak başlangıç gerilimini oluşturun.",
      "Dirseklerinizi geriye sürerek barı alt göğse çekin.",
      "Kürek kemiklerini sıkın, ardından kontrollü uzatın."
    ]
  },
  {
    id: "hyperextension",
    name: "Hyperextension (Bel Ekstansiyonu)",
    targetMuscle: "Bel (Erector Spinae)",
    difficulty: "Başlangıç",
    equipment: "Roman Chair",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Roman chair'e yüzüstü yerleşip ayak desteğine sabitleyin. Gövdeyi nötr omurga ile aşağı indirip, bel ve kalça kaslarıyla yatay hizaya kadar kaldırın.",
    biomechanics: "Erector spinae, gluteus maximus ve hamstring kaslarının oluşturduğu posterior zincirin izometrik ve konsantrik dayanıklılığını geliştirir. Lomber stabiliteyi artırarak bel sağlığını destekler.",
    breathing: "Gövdeyi kaldırırken nefes verin, indirirken nefes alın.",
    riskFactors: "Tepe noktada aşırı hiperekstansiyon (geriye kavis) bel omurlarını sıkıştırır. Gövde, vücut hizasını geçmemelidir.",
    steps: [
      "Yüzüstü yerleşip kalça pedin üst kenarında olacak şekilde ayarlayın.",
      "Elleri göğüste veya başın yanında tutun, omurgayı nötr alın.",
      "Gövdeyi kalçadan kıvırarak kontrollü aşağı indirin.",
      "Gluteal ve bel kaslarıyla vücut hizasına kadar kaldırın (fazla geçmeyin)."
    ]
  },

  // --- OMUZ (SHOULDERS) ---
  {
    id: "arnold-press",
    name: "Arnold Press",
    targetMuscle: "Omuz (Deltoid - Tüm Başlar)",
    difficulty: "Orta",
    equipment: "Dumbbell",
    image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Dumbbell'ları avuç içleri size dönük şekilde tutun. İterken bilekleri dışa çevirerek (rotasyon) ağırlıkları baş üstünde birleştirin, aynı yoldan geri dönün.",
    biomechanics: "Bilek rotasyonu sayesinde deltoidin ön, yan ve arka liflerini tek harekette devreye sokan bir omuz pres varyasyonudur. Artan eklem hareket açıklığı (ROM) kas altında geçen süreyi (TUT) uzatır.",
    breathing: "Ağırlıkları yukarı iterken nefes verin, indirirken nefes alın.",
    riskFactors: "Çok ağır yükle yapılan rotasyon, omuz rotator manşetini zorlayabilir. Orta yükle ve kontrollü tempoda uygulanmalıdır.",
    steps: [
      "Oturup dumbbell'ları çene hizasında, avuçlar size dönük tutun.",
      "İtmeye başlarken bileklerinizi dışa doğru çevirin.",
      "Ağırlıkları baş üstünde, avuçlar öne bakacak şekilde birleştirin.",
      "Aynı rotasyon yolunu izleyerek kontrollü başlangıca dönün."
    ]
  },
  {
    id: "rear-delt-fly",
    name: "Rear Delt Fly (Ters Fly)",
    targetMuscle: "Arka Omuz (Posterior Deltoid)",
    difficulty: "Başlangıç",
    equipment: "Dumbbell",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Kalçadan öne eğilip dumbbell'ları sarkıtın. Kürek kemiklerini sabit tutarak kolları yanlara doğru, arka omuz kaslarıyla açın.",
    biomechanics: "Posterior deltoid ve orta trapezi izole eder. Bu kaslar, omuz ekleminin dengesi ve 'yuvarlak omuz' postür bozukluğunun düzeltilmesi için kritiktir; modern yaşamda ihmal edildiği için önceliklidir.",
    breathing: "Kolları açarken nefes verin, indirirken nefes alın.",
    riskFactors: "Momentumla savurmak ve trapezi shrug ile devreye sokmak hareketi etkisizleştirir. Hafif ağırlık ve kontrol esastır.",
    steps: [
      "Kalçadan ~45 derece öne eğilin, sırt düz, kollar aşağı sarkık.",
      "Dirsekleri çok hafif bükülü sabitleyin.",
      "Kolları yana doğru, kürek kemiklerini sıkarak kaldırın.",
      "Omuz hizasında durup kontrollü indirin."
    ]
  },

  // --- KOL (ARMS) ---
  {
    id: "preacher-curl",
    name: "Preacher Curl",
    targetMuscle: "Biceps (Brachialis)",
    difficulty: "Başlangıç",
    equipment: "EZ Bar & Preacher Bench",
    image: "https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Kollarınızı preacher sehpasının eğimli yüzeyine yaslayın. Barı kontrollü şekilde yukarı kıvırın ve indirirken tam gerilime kadar uzatın.",
    biomechanics: "Üst kolun sabitlenmesi momentumu ortadan kaldırarak biceps brachii ve brachialis'i sıkı izole eder. Eğimli destek, hareketin alt fazında (esneme) maksimum gerilim sağlar.",
    breathing: "Barı yukarı kıvırırken nefes verin, indirirken nefes alın.",
    riskFactors: "Alt noktada ağırlığı aniden bırakmak dirsek tendonlarını (biceps tendon) zorlar; eksantrik faz kontrollü olmalıdır.",
    steps: [
      "Üst kollarınızı eğimli ped üzerine tam temas edecek şekilde yaslayın.",
      "Barı omuz genişliğinde, avuçlar yukarı kavrayın.",
      "Biceps'i sıkarak barı kontrollü yukarı kıvırın.",
      "Dirsekleri tam kilitlemeden, gerilimi koruyarak indirin."
    ]
  },
  {
    id: "skull-crusher",
    name: "Skull Crusher (Lying Triceps Extension)",
    targetMuscle: "Triceps (Uzun Baş)",
    difficulty: "Orta",
    equipment: "EZ Bar & Bench",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Sırt üstü uzanıp barı alın hizasında tutun. Dirsekleri sabit tutarak barı alnınıza/baş üstüne indirin, ardından triceps ile yukarı uzatın.",
    biomechanics: "Triceps brachii'nin (özellikle uzun başın) omuz fleksiyonu pozisyonunda gerilerek çalıştırıldığı izolasyon hareketidir. Uzun başın esnetilmesi, izole pushdown'a göre daha geniş kas uyarımı sağlar.",
    breathing: "Barı uzatırken nefes verin, indirirken nefes alın.",
    riskFactors: "Dirseklerin yana açılması yükü omuza kaydırır ve dirsek eklemini zorlar. Dirsekler sabit ve içeride kalmalıdır.",
    steps: [
      "Sırt üstü uzanıp barı triceps ile yukarı kilitleyin.",
      "Üst kolları sabit tutup yalnızca ön kolu bükerek barı alın hizasına indirin.",
      "Triceps'i sıkarak barı başlangıç pozisyonuna uzatın.",
      "Dirsekleri tam kilitlemeyip gerilimi koruyun."
    ]
  },
  {
    id: "cable-crossover",
    name: "Cable Crossover",
    targetMuscle: "Göğüs (İç Pektoral)",
    difficulty: "Orta",
    equipment: "Kablo Makinesi",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "İki kablonun ortasında durup tutamakları kavrayın. Hafif öne eğilerek kolları bir kavis çizerek önde birleştirin ve göğsü sıkın.",
    biomechanics: "Sabit gerilimli kablo, pectoralis major'ün adduksiyon (kolların gövde önünde birleşmesi) fonksiyonunu hareket boyunca yüklü tutar. Tepe noktadaki kasılma, serbest ağırlığın aksine yer çekiminden bağımsız maksimum sıkışma yaratır.",
    breathing: "Kolları birleştirirken nefes verin, açarken nefes alın.",
    riskFactors: "Aşırı ağırlıkla omuzun öne çıkması (protraksiyon) ve dirsek kilitleme omuz eklemini zorlar. Dirsekler hafif bükülü kalmalıdır.",
    steps: [
      "Makaraları yüksek konuma alıp tutamakları kavrayın.",
      "Bir ayağı öne atıp gövdeyi hafif öne eğin, dirsekleri hafif bükün.",
      "Kolları geniş bir kavisle göbek/göğüs önünde birleştirin.",
      "Göğsü sıkıp kontrollü şekilde açılış pozisyonuna dönün."
    ]
  },

  // --- CORE & KARIN ---
  {
    id: "russian-twist",
    name: "Russian Twist",
    targetMuscle: "Yan Karın (Obliques)",
    difficulty: "Başlangıç",
    equipment: "Dumbbell / Plate (opsiyonel)",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Oturup dizleri bükün, gövdeyi hafif geriye yaslayın. Ağırlığı iki elle tutup gövdenizi sağa ve sola kontrollü şekilde döndürün.",
    biomechanics: "İnternal ve eksternal oblik kasların rotasyonel (dönme) ve anti-rotasyon işlevini çalıştırır. Gövdenin geriye yaslanması rektus abdoministe izometrik yük oluşturur.",
    breathing: "Her dönüşte nefes verin, merkeze dönerken nefes alın.",
    riskFactors: "Belden hızlı savurmak lomber omurgayı zorlar. Hareket kontrollü ve core kilitliyken yapılmalıdır; bel ağrısı olanlar dikkatli olmalıdır.",
    steps: [
      "Oturup dizleri bükün, gövdeyi ~45 derece geriye yaslayın.",
      "Ağırlığı göğüs önünde iki elle tutun.",
      "Core'u kilitleyip gövdeyi bir tarafa döndürün.",
      "Kontrollü şekilde diğer tarafa geçin (1 tekrar = iki taraf)."
    ]
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    targetMuscle: "Derin Core (Transversus Abdominis)",
    difficulty: "Başlangıç",
    equipment: "Vücut Ağırlığı",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness",
    instructions: "Sırt üstü uzanın, kollar tavana, dizler 90 derece havada. Belinizi yere yapışık tutarak zıt kol ve bacağı kontrollü şekilde uzatıp geri çekin.",
    biomechanics: "Anti-ekstansiyon core egzersizidir; transversus abdominis ve multifidus gibi derin stabilizatörleri, omurgayı hareketsiz tutarken ekstremiteleri hareket ettirerek çalıştırır. Bel sağlığı ve rehabilitasyon için güvenli ve etkilidir.",
    breathing: "Kontrollü, sürekli nefes alıp verin; uzanırken nefes verin.",
    riskFactors: "Belin yerden kalkıp kavislenmesi egzersizi etkisizleştirir ve beli zorlar. Lomber bölge tüm hareket boyunca yere temas etmelidir.",
    steps: [
      "Sırt üstü uzanıp kolları dikey, dizleri 90 derece havaya alın.",
      "Belinizi yere bastırarak core'u kilitleyin.",
      "Zıt kol ve bacağı (sağ kol-sol bacak) yere yaklaştırarak uzatın.",
      "Kontrollü şekilde geri çekip diğer çaprazı uygulayın."
    ]
  },

  // --- PILATES ---
  {
    id: "roll-up",
    name: "Roll Up",
    targetMuscle: "Karın & Omurga Mobilitesi",
    difficulty: "Orta",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Sırt üstü uzanıp kollar baş üstünde. Omurganızı tek tek yerden kaldırarak (segmenter) öne doğru uzanın, ardından aynı kontrolle geri uzanın.",
    biomechanics: "Omurganın segmenter (omur omur) fleksiyon-ekstansiyon kontrolünü öğretir. Rektus abdominis ve derin core eksantrik olarak çalışırken omurganın esnekliğini ve farkındalığını (proprioception) geliştirir.",
    breathing: "Yukarı kıvrılırken nefes verin, geri uzanırken nefes alın.",
    riskFactors: "Momentumla 'fırlamak' hareketin amacını bozar ve boynu zorlar. Hareket yavaş, kontrollü ve omur omur olmalıdır.",
    steps: [
      "Sırt üstü uzanın, bacaklar bitişik, kollar baş üstünde uzanık.",
      "Kolları tavana getirip çeneyi göğse yaklaştırın.",
      "Omurganızı tek tek yerden kaldırarak ayak uçlarına uzanın.",
      "Aynı kontrollü tempoyla omur omur başlangıca uzanın."
    ]
  },
  {
    id: "side-kick-series",
    name: "Side Kick Series",
    targetMuscle: "Kalça & Yan Core (Gluteus Medius · Obliques)",
    difficulty: "Orta",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Yan yatıp gövdeyi sabit tutun. Üstteki bacağı kalça hizasında öne-arkaya, yukarı-aşağı kontrollü şekilde hareket ettirin.",
    biomechanics: "Gluteus medius ve minimus (kalça abdüktörleri) ile lateral core'u (oblikler, quadratus lumborum) çalıştırır. Pelvis stabilitesini sağlayan bu kaslar, yürüyüş ve koşu mekaniği ile diz sağlığı için kritiktir.",
    breathing: "Düzenli ve kontrollü nefes alın; bacak hareketinde gövdeyi sabit tutun.",
    riskFactors: "Pelvisin öne-arkaya yalpalaması core kontrolünü kaybettirir. Gövde tek bir hat üzerinde kilitli kalmalıdır.",
    steps: [
      "Yan yatıp vücudu düz bir çizgi haline getirin, baş kolla desteklenir.",
      "Üstteki bacağı kalça hizasına kaldırın.",
      "Bacağı kontrollü şekilde öne ve arkaya salının (gövde sabit).",
      "Seti tamamlayıp diğer tarafa geçin."
    ]
  },
  {
    id: "swimming-pilates",
    name: "Swimming (Pilates)",
    targetMuscle: "Sırt & Posterior Zincir (Erector Spinae · Gluteus)",
    difficulty: "Orta",
    equipment: "Mat",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop",
    category: "Pilates",
    instructions: "Yüzüstü uzanıp kol ve bacaklarınızı uzatın. Zıt kol ve bacağı yerden kaldırarak kontrollü, hızlı 'yüzme' ritmiyle dönüşümlü çalıştırın.",
    biomechanics: "Posterior zinciri (erector spinae, gluteus, omuz arka kasları) anti-ekstansiyon kontrolüyle çalıştırır. Karın merkezini stabil tutarken ekstremitelerin koordineli hareketi, postürü destekler ve bel-sırt dayanıklılığını artırır.",
    breathing: "Ritmik şekilde 5 vuruşta nefes alın, 5 vuruşta verin.",
    riskFactors: "Boynun aşırı geriye atılması servikal omurgayı zorlar; bakış yere dönük ve boyun uzun kalmalıdır. Bel ağrısı olanlar hareketi alçak tutmalıdır.",
    steps: [
      "Yüzüstü uzanıp kollar öne, bacaklar arkaya uzanık.",
      "Göbeği içe çekip core'u aktive edin, bakış yere dönük.",
      "Zıt kol-bacağı (sağ kol-sol bacak) yerden kaldırın.",
      "Kontrollü ve ritmik şekilde tarafları hızlıca değiştirin."
    ]
  }
];

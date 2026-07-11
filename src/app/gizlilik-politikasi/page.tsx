import PolicyDocument, { type PolicySection } from "@/components/common/PolicyDocument";

const SECTIONS: PolicySection[] = [
  {
    id: "toplanan-veriler",
    title: "Topladığımız veriler",
    body: [
      "Hesap oluşturduğunuzda kimlik doğrulama için e-posta adresiniz ve profil adınız işlenir. Analiz araçlarına girdiğiniz yaş, boy, kilo ve çevre ölçümleri yalnızca seçtiğiniz hesaplamayı üretmek ve siz kaydetmeyi seçerseniz gelişim geçmişinizi oluşturmak için kullanılır.",
      "Hesap açmadan kullanılan hesaplayıcılardaki girdiler, sonuç üretildikten sonra FitHub hesabına kaydedilmez.",
    ],
    bullets: ["Hesap ve profil bilgileri", "Kaydetmeyi seçtiğiniz ölçümler", "Antrenman ve beslenme kayıtları", "Teknik güvenlik kayıtları"],
  },
  {
    id: "kullanim-amaci",
    title: "Veriyi neden kullanıyoruz",
    body: [
      "Verileriniz kişisel panelinizi, gelişim grafiklerinizi, kayıtlı programlarınızı ve talep ettiğiniz analizleri sunmak için işlenir. Sağlık veya performans verilerinizi reklam profili oluşturmak amacıyla kullanmayız ve üçüncü taraflara satmayız.",
    ],
  },
  {
    id: "guvenlik",
    title: "Saklama ve güvenlik",
    body: [
      "Kimlik doğrulama ve veri saklama altyapısı Supabase üzerinde çalışır. Kullanıcıya özel tablolarda satır düzeyi erişim politikaları uygulanır; bu sayede oturum açmış bir kullanıcı yalnızca kendisine ait kayıtları okuyabilir ve yönetebilir.",
      "Hiçbir çevrim içi sistem mutlak güvenlik garantisi veremez. Şüpheli bir erişim fark ederseniz parolanızı yenileyip bizimle iletişime geçmenizi öneririz.",
    ],
  },
  {
    id: "cerezler",
    title: "Çerezler ve yerel tercihler",
    body: [
      "Oturumunuzu sürdürmek, tema tercihinizi hatırlamak ve temel ürün işlevlerini sağlamak için zorunlu çerezler veya yerel depolama kullanılabilir. Zorunlu olmayan analiz ya da pazarlama çerezleri devreye alınırsa ayrıca açık bilgilendirme ve tercih seçeneği sunulur.",
    ],
  },
  {
    id: "haklariniz",
    title: "Kontrol sizde",
    body: [
      "Panelinizden ölçüm, hesaplama ve antrenman kayıtlarınızı yönetebilirsiniz. Verilerinize erişme, düzeltme veya hesabınızın ve ilişkili kayıtların silinmesini talep etme hakkınız vardır. Talepler için destek@fithub.com adresine yazabilirsiniz.",
    ],
  },
];

export default function GizlilikPolitikasiPage() {
  return (
    <PolicyDocument
      kicker="Gizlilik merkezi"
      title="Verinizin kontrolü sizde."
      description="FitHub'ın hangi verileri neden işlediğini ve hesabınız üzerindeki haklarınızı açık, okunabilir bir çerçevede sunuyoruz."
      label="Gizlilik politikası"
      updated="05 Temmuz 2026"
      sections={SECTIONS}
      notice="Kısa özet: Verilerinizi ürünü çalıştırmak ve seçtiğiniz kişisel takip özelliklerini sunmak için kullanırız; satmayız."
    />
  );
}

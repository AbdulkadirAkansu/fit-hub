import PolicyDocument, { type PolicySection } from "@/components/common/PolicyDocument";

const SECTIONS: PolicySection[] = [
  {
    id: "hizmet-kapsami",
    title: "Hizmetin kapsamı",
    body: [
      "FitHub; egzersiz, beslenme ve vücut ölçümü alanlarında eğitim amaçlı hesaplayıcılar, içerikler, program araçları ve kişisel takip özellikleri sunar. Sonuçlar tahmindir; profesyonel tıbbi değerlendirme veya kişiye özel sağlık hizmeti değildir.",
    ],
  },
  {
    id: "hesap-sorumlulugu",
    title: "Hesap sorumluluğu",
    body: [
      "Hesap bilgilerinizin güncelliğinden ve parolanızın gizliliğinden siz sorumlusunuz. Yetkisiz kullanım şüphesinde parolanızı yenilemeli ve destek ekibine bildirimde bulunmalısınız.",
    ],
    bullets: ["Doğru ve güncel bilgi kullanın", "Hesabınızı üçüncü kişilerle paylaşmayın", "Şüpheli erişimi gecikmeden bildirin", "Kendi fiziksel sınırlarınızı gözetin"],
  },
  {
    id: "kabul-edilebilir-kullanim",
    title: "Kabul edilebilir kullanım",
    body: [
      "Platformun güvenliğini bozmaya, başka kullanıcıların verilerine erişmeye, topluluk alanlarında taciz veya yanıltıcı sağlık iddiaları yaymaya yönelik kullanım yasaktır. Güvenliği ve topluluk bütünlüğünü korumak için ihlalli içerikleri kaldırabilir veya ilgili hesabın erişimini sınırlayabiliriz.",
    ],
  },
  {
    id: "fikri-mulkiyet",
    title: "İçerik ve fikri mülkiyet",
    body: [
      "FitHub arayüzü, özgün içerikleri, marka unsurları ve uygulama kodu ilgili fikri mülkiyet mevzuatı kapsamında korunur. Kişisel ve ticari olmayan kullanım dışında çoğaltma, yeniden yayımlama veya türev hizmet oluşturma için yazılı izin gerekir.",
    ],
  },
  {
    id: "degisiklikler",
    title: "Değişiklikler ve iletişim",
    body: [
      "Ürün ve mevzuat geliştikçe bu koşulları güncelleyebiliriz. Önemli değişikliklerde güncelleme tarihini yeniler ve uygun kanallardan bilgilendirme yaparız. Platformu güncel koşullar sonrasında kullanmaya devam etmeniz yeni koşulları kabul ettiğiniz anlamına gelir.",
    ],
  },
];

export default function KullanimSartlariPage() {
  return (
    <PolicyDocument
      kicker="Hizmet çerçevesi"
      title="Açık kurallar, güvenli kullanım."
      description="FitHub'ı kullanırken tarafların sorumluluklarını ve platformun sınırlarını kısa, anlaşılır maddelerle açıklıyoruz."
      label="Kullanım şartları"
      updated="05 Temmuz 2026"
      sections={SECTIONS}
      notice="FitHub bir eğitim ve takip platformudur. Buradaki araçlar tıbbi tanı, tedavi veya uzman gözetiminin yerine geçmez."
    />
  );
}

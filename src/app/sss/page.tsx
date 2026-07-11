import Link from "next/link";
import { ArrowRight, ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import OpenAssistantButton from "@/components/common/OpenAssistantButton";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Sıkça Sorulan Sorular | FitHub",
  description: "Üyelik, program oluşturma, veri güvenliği ve FitHub araçları hakkında en çok sorulan sorular ve net yanıtları.",
  path: "/sss",
});

const FAQ_GROUPS = [
  {
    title: "Başlarken",
    items: [
      {
        q: "FitHub ücretsiz mi?",
        a: "Evet. Hesaplayıcılar, hazır programlar ve program oluşturucu üyeliksiz kullanılabilir. Ücretsiz hesap açtığında ise ölçümlerini, programlarını ve antrenman kayıtlarını saklayabilir, gelişimini grafiklerle takip edebilirsin.",
      },
      {
        q: "Nereden başlamalıyım?",
        a: "Başlangıç rehberi senin için hazırlandı: hedefini seç, sana ilk üç adımı gösterelim. Genellikle en iyi ilk adım, 2 dakika süren program oluşturucuyla haftalık planını çıkarmaktır.",
      },
      {
        q: "Spor geçmişim hiç yok. Programlar bana uygun mu?",
        a: "Evet. Program oluşturucuda \"Yeni başlıyorum\" seviyesini seçtiğinde set sayıları ve hareket seçimi başlangıç düzeyine göre ayarlanır. Hazır programlarda da seviye etiketi her kartın üzerinde yazar.",
      },
    ],
  },
  {
    title: "Program ve antrenman",
    items: [
      {
        q: "Kendi programımı oluşturabilir miyim?",
        a: "Evet. Oluşturucuda hedefini, deneyimini, ortamını (ev/salon) ve haftalık gün sayını seç; planın anında hazırlanır. Sonrasında istediğin hareketi çıkarabilir, yerine yenisini ekleyebilirsin.",
      },
      {
        q: "Canlı antrenman ekranı ne yapar?",
        a: "Programındaki günü açtığında set set ilerlersin: ağırlık ve tekrarını girer, seti tamamlar, dinlenme sayacını görürsün. Antrenman bitince süre ve toplam hacim hesabına otomatik işlenir; kişisel rekor kırarsan anında bildirilir.",
      },
      {
        q: "Programı PDF olarak alabilir miyim?",
        a: "Evet. Hem hazır program detaylarında hem de oluşturucunun sonuç ekranında \"PDF indir\" ile planını antrenman salonuna götürebileceğin temiz bir belge olarak alabilirsin.",
      },
      {
        q: "Hazır programı kendi hesabıma nasıl eklerim?",
        a: "Program detay sayfasındaki \"Programı hesabıma kaydet\" butonuna bas. Program \"Planım\" sekmene eklenir ve canlı antrenman ekranından çalıştırılabilir.",
      },
    ],
  },
  {
    title: "Ölçüm ve takip",
    items: [
      {
        q: "Hangi ölçümleri takip edebilirim?",
        a: "Kilo zorunlu; bel, kalça, göğüs, boyun, omuz, kol ve bacak çevresi isteğe bağlıdır. Ayrıca günlük kalori, protein ve su kaydı tutabilir; hepsinin değişimini grafikte görebilirsin.",
      },
      {
        q: "Hesaplayıcı sonuçlarım kayboluyor mu?",
        a: "Giriş yaptıysan \"Sonucu kaydet\" ile her hesaplama hesabına işlenir ve panelinde listelenir. Giriş yapmadan kullandığında sonuçlar yalnızca o an ekranda kalır.",
      },
      {
        q: "Gelişim skoru nasıl hesaplanır?",
        a: "Haftalık antrenman sıklığın, beslenme kayıt düzenin, güncel ölçümün ve kullandığın analiz araçlarının çeşitliliği birlikte puanlanır. Skor; tutarlılığını tek bakışta görmek içindir, yarış için değil.",
      },
    ],
  },
  {
    title: "Güvenlik ve hesap",
    items: [
      {
        q: "Verilerim güvende mi?",
        a: "Evet. Tüm kişisel tablolar satır düzeyi güvenlik (RLS) ile korunur: ölçümlerine, programlarına ve kayıtlarına yalnızca sen erişebilirsin — başka bir kullanıcı, kayıt kimliğini bilse dahi veri çekemez. Şifreler Supabase Auth ile saklanır; sağlık verilerin üçüncü taraflarla paylaşılmaz.",
      },
      {
        q: "Akıllı asistan verilerimi nasıl kullanıyor?",
        a: "Asistan, yanıtını kişiselleştirmek için yalnızca hesabındaki özet biyometrik bilgileri (ör. VKİ, hedef, haftalık seans) kullanır. Sohbet geçmişin kendi cihazında saklanır; asistan tıbbi teşhis koymaz.",
      },
      {
        q: "Hesabımı ve verilerimi silebilir miyim?",
        a: "Ölçüm, program ve hesaplama kayıtlarını panelinden tek tek silebilirsin. Hesabının tamamen kaldırılmasını istersen iletişim sayfasından yazman yeterli; talebin KVKK kapsamında işleme alınır.",
      },
      {
        q: "FitHub tıbbi tavsiye verir mi?",
        a: "Hayır. Tüm içerik ve araçlar genel bilgilendirme amaçlıdır. Ağrın, kronik bir rahatsızlığın veya şüphen varsa önce hekimine danış — bu uyarıyı ilgili her sayfada ayrıca görürsün.",
      },
    ],
  },
];

export default function SssPage() {
  return (
    <main className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      <PageHeader
        title="Sıkça sorulan sorular"
        description="Kısa ve net yanıtlar. Aradığını bulamazsan asistana sorabilir veya bize yazabilirsin."
        kicker="Destek"
      />

      <div className="container mx-auto px-5 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.32fr_0.68fr]">
          {/* Bölüm haritası */}
          <nav className="lg:sticky lg:top-24 lg:self-start" aria-label="SSS bölümleri">
            <p className="kicker">İçindekiler</p>
            <ul className="mt-5 space-y-1">
              {FAQ_GROUPS.map((group, index) => (
                <li key={group.title}>
                  <a
                    href={`#sss-${index}`}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-950/[0.04] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                  >
                    <span className="font-mono text-[10px] font-bold text-zinc-400 group-hover:text-primary">{String(index + 1).padStart(2, "0")}</span>
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="card-lab corner-ticks mt-8 hidden p-5 lg:block">
              <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles size={12} /> Hâlâ soru mu var?
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Asistan, hesabındaki veriye göre kişisel yanıt verir.</p>
              <OpenAssistantButton className="group mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
                Koça sor <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </OpenAssistantButton>
            </div>
          </nav>

          {/* Sorular */}
          <div className="space-y-12">
            {FAQ_GROUPS.map((group, groupIndex) => (
              <section key={group.title} id={`sss-${groupIndex}`} className="scroll-mt-28">
                <h2 className="flex items-baseline gap-3 font-display text-2xl font-black tracking-tight">
                  <span className="font-mono text-xs font-bold text-primary">{String(groupIndex + 1).padStart(2, "0")}</span>
                  {group.title}
                </h2>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <details
                      key={item.q}
                      className="group card-lab overflow-hidden open:border-primary/30 open:shadow-lg"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-base font-black tracking-tight [&::-webkit-details-marker]:hidden sm:p-6">
                        {item.q}
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-950/10 text-zinc-400 transition-all duration-300 group-open:rotate-180 group-open:border-primary group-open:bg-primary group-open:text-white dark:border-white/10">
                          <ChevronDown size={15} />
                        </span>
                      </summary>
                      <div className="px-5 pb-6 sm:px-6">
                        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            {/* Alt CTA */}
            <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-8 text-white dark:bg-surface sm:p-10">
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Yanıt bulamadın mı?</p>
                  <h2 className="mt-3 font-display text-2xl font-black tracking-tight">Bize doğrudan ulaş.</h2>
                  <p className="mt-2 max-w-md text-sm text-zinc-400">Genellikle 24 saat içinde dönüş yapıyoruz.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <OpenAssistantButton className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-black text-zinc-950 transition-all duration-300 hover:-translate-y-0.5">
                    <Sparkles size={15} /> Koça sor
                  </OpenAssistantButton>
                  <Link href="/iletisim" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]">
                    <MessageCircle size={15} /> İletişim
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

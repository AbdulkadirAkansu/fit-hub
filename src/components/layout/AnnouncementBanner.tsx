"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Megaphone, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteAnnouncement {
  text: string;
  type: "info" | "success" | "warning";
}

/**
 * Site geneli duyuru banner'ı — admin panelindeki "Site Ayarları > Duyuru"
 * ayarını gerçek hale getirir. site_settings tablosundan okur, duyuru aktifse
 * tüm ziyaretçilere gösterir. Kullanıcı kapatabilir (aynı metin tekrar açılmaz).
 */
export default function AnnouncementBanner() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState<SiteAnnouncement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("announcement_text, announcement_active, announcement_type")
          .eq("id", "global")
          .maybeSingle();

        if (!active || error || !data) return;
        if (data.announcement_active && data.announcement_text) {
          const text: string = data.announcement_text;
          // Kullanıcı bu metni daha önce kapattıysa gösterme.
          const lastDismissed = localStorage.getItem("fithub_announcement_dismissed");
          if (lastDismissed === text) return;
          setAnnouncement({ text, type: (data.announcement_type as SiteAnnouncement["type"]) || "info" });
        }
      } catch {
        /* sessiz geç — duyuru kritik değil */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Admin paneli ve giriş ekranlarında banner gösterme.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/hesap/giris")) return null;
  if (!announcement || dismissed) return null;

  const styles = {
    info: "bg-primary text-white",
    success: "bg-zinc-950 text-white",
    warning: "bg-accent text-zinc-950",
  }[announcement.type];

  const dismiss = () => {
    try {
      localStorage.setItem("fithub_announcement_dismissed", announcement.text);
    } catch {
      /* yok say */
    }
    setDismissed(true);
  };

  return (
    <div className={cn("relative z-[60] w-full text-sm font-semibold", styles)}>
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-2.5 text-center">
        <Megaphone size={16} className="shrink-0" />
        <span className="leading-snug">{announcement.text}</span>
        <button
          onClick={dismiss}
          aria-label="Duyuruyu kapat"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/15 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

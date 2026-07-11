"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssistant } from "@/hooks/useAssistant";

const SUGGESTIONS = ["Bugün ne yapmalıyım?", "Programımı özetle", "Protein hedefim ne?"];

/** Mini markdown: **kalın** ve "• " maddelerini balon içinde biçimlendirir. */
function MessageText({ text }: { text: string }) {
  const renderInline = (line: string, keyPrefix: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={`${keyPrefix}-${index}`} className="font-black">{part.slice(2, -2)}</strong>
        : <span key={`${keyPrefix}-${index}`}>{part}</span>,
    );

  return (
    <div className="space-y-1.5 text-[13px] leading-6">
      {text.split("\n").map((line, index) => {
        if (!line.trim()) return <div key={index} className="h-0.5" />;
        const isBullet = /^[•-]\s+/.test(line.trim());
        const content = line.trim().replace(/^[•-]\s+/, "");
        return isBullet ? (
          <div key={index} className="flex gap-2"><span className="text-primary" aria-hidden>•</span><span>{renderInline(content, `b${index}`)}</span></div>
        ) : <p key={index}>{renderInline(line, `p${index}`)}</p>;
      })}
    </div>
  );
}

export default function GlobalAssistant() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/hesap/giris") || pathname?.startsWith("/hesap/antrenman")) return null;

  return <GlobalAssistantPanel />;
}

function GlobalAssistantPanel() {
  const router = useRouter();
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    session,
    authStatus,
    loadingData,
    chatMessages,
    chatInput,
    setChatInput,
    chatScrollRef,
    isTyping,
    handleSendMessage,
  } = useAssistant();

  return (
    <>
      {/* ── Balon (launcher) ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isAssistantOpen && (
          <motion.button
            key="launcher"
            type="button"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            onClick={() => setIsAssistantOpen(true)}
            aria-label="FitHub Koç'u aç"
            title="FitHub Koç"
            className="group fixed bottom-4 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all duration-300 ease-spring hover:scale-105 active:scale-95 hover:bg-primary-hover sm:bottom-6 sm:right-6"
          >
            <Sparkles size={22} className="transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -left-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-paper bg-accent dark:border-bg-dark" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Panel ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.section
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-3 bottom-3 z-[110] flex h-[min(600px,calc(100dvh-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-[2rem] border border-zinc-950/5 bg-white shadow-2xl shadow-black/20 dark:border-white/5 dark:bg-surface sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
            aria-label="FitHub Koç"
          >
            {/* Başlık */}
            <header className="bg-zinc-950 dark:bg-surface px-6 py-5 text-white border-b border-white/5">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <Sparkles size={17} className="text-accent" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-accent" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-sm font-black leading-tight">FitHub Koç</h2>
                    <p className="text-[11px] font-semibold text-white/70">Kısa ve net · verine göre konuşur</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsAssistantOpen(false)} aria-label="Asistanı kapat" className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white">
                  <X size={17} />
                </button>
              </div>
            </header>

            {/* Mesajlar */}
            <div ref={chatScrollRef} className="relative flex-1 overflow-y-auto bg-zinc-950/[0.02] p-5 dark:bg-black/20">
              {(loadingData || authStatus === "loading") && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-surface/80">
                  <Loader2 className="animate-spin text-primary" size={22} />
                </div>
              )}
              <div className="space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={`${message.timestamp}-${index}`} className={cn("flex max-w-[88%] flex-col", message.sender === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4.5 py-3.5 shadow-sm",
                        message.sender === "user"
                          ? "rounded-br-sm bg-primary text-white"
                          : "rounded-bl-sm border border-zinc-950/5 bg-white text-zinc-800 dark:border-white/5 dark:bg-surface dark:text-zinc-200",
                      )}
                    >
                      <MessageText text={message.text} />
                      {message.action && (
                        <button
                          type="button"
                          onClick={() => { router.push(message.action!.tab); setIsAssistantOpen(false); }}
                          className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl bg-primary-soft px-3.5 py-2.5 text-xs font-black text-primary transition-colors hover:bg-primary hover:text-white dark:bg-primary/15"
                        >
                          {message.action.label} <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-950/[0.07] bg-white px-4 py-3.5 text-primary dark:border-white/[0.07] dark:bg-white/[0.05]" aria-label="Koç yazıyor">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                  </div>
                )}
              </div>
            </div>

            {/* Alt bölüm */}
            <footer className="border-t border-zinc-950/5 bg-white/70 backdrop-blur-xl p-4 dark:border-white/5 dark:bg-surface/70">
              {session ? (
                <>
                  {chatMessages.length <= 1 && (
                    <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
                      {SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleSendMessage(suggestion)}
                          disabled={isTyping}
                          className="shrink-0 rounded-full border border-primary/25 bg-primary-soft/60 px-3.5 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-40 dark:bg-primary/10"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <form onSubmit={(event) => { event.preventDefault(); handleSendMessage(chatInput); }} className="flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      disabled={isTyping}
                      placeholder="Kısaca sor…"
                      aria-label="Koça mesaj yaz"
                      className="h-11 min-w-0 flex-1 rounded-full border border-zinc-950/10 bg-zinc-950/[0.03] px-4.5 pl-4 text-sm outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-white/[0.05]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isTyping}
                      aria-label="Mesaj gönder"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-40"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </>
              ) : authStatus === "loading" ? (
                <div className="flex h-11 items-center justify-center gap-2 text-xs font-bold text-zinc-400">
                  <Loader2 size={14} className="animate-spin" /> Oturum kontrol ediliyor
                </div>
              ) : (
                <Link href="/hesap/giris" onClick={() => setIsAssistantOpen(false)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-white transition-all duration-300 ease-spring hover:bg-primary-hover hover:-translate-y-0.5 active:scale-97 active:translate-y-0 hover:shadow-lg hover:shadow-primary/20">
                  Kişisel yanıtlar için giriş yap <ArrowRight size={15} />
                </Link>
              )}
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

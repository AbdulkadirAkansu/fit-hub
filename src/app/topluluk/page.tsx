"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Heart, Plus, Users, Send, Loader2, Sparkles,
  ArrowLeft, Search, Calendar, User, Shield, AlertCircle, Flag,
  ChevronDown, CheckCircle2, ScrollText, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseAvatarToken } from "@/lib/avatar";
import { useCommunity } from "@/hooks/useCommunity";
import { Post, Comment, Profile } from "@/types/community";

function errorDetails(error: unknown) {
  if (error && typeof error === "object") {
    const value = error as { message?: unknown; code?: unknown };
    return {
      message: typeof value.message === "string" ? value.message : "",
      code: typeof value.code === "string" ? value.code : "",
    };
  }
  return { message: "", code: "" };
}

const CATEGORIES = ["Hepsi", "Genel", "Antrenman", "Beslenme", "Motivasyon"];

const CATEGORY_HINTS: Record<string, string> = {
  Genel: "Platform, hedef ve genel sorular",
  Antrenman: "Program, teknik ve toparlanma",
  Beslenme: "Kalori, makro ve öğün düzeni",
  Motivasyon: "Deneyim, ilerleme ve destek",
};

/* Gönderi standartları: her paylaşım bu doğrulamalardan geçer. */
const TITLE_MIN = 10;
const TITLE_MAX = 120;
const CONTENT_MIN = 40;
const CONTENT_MAX = 2000;
const RULES_STORAGE_KEY = "fithub_forum_rules_accepted";

const COMMUNITY_RULES = [
  { title: "Gerçek deneyim paylaş", text: "Soru, ölçülebilir bir sonuç veya kendi deneyimini anlat; boş ve tek cümlelik gönderi paylaşma." },
  { title: "Açıklayıcı başlık yaz", text: "Başlık konuyu özetlesin (en az 10 karakter). \"Yardım!!\" gibi başlıklar kaldırılır." },
  { title: "Tanı koyma, reklam yapma", text: "Tıbbi tavsiye/kesin sonuç verme; ürün, satış ve yönlendirme bağlantısı paylaşma." },
  { title: "Saygılı kal", text: "Hakaret, alay ve kişisel veri paylaşımı kalıcı yasaklamayla sonuçlanır." },
];

/** Avatar: profildeki emoji token'ını okur; yoksa isim baş harfini gösterir. */
function ProfileAvatar({ profile, size = "md" }: { profile?: Profile; size?: "sm" | "md" }) {
  const avatar = parseAvatarToken(profile?.avatar_url);
  const dimension = size === "sm" ? "h-8 w-8 rounded-lg text-sm" : "h-10 w-10 rounded-xl text-lg";
  if (avatar) {
    return <div className={cn("flex shrink-0 items-center justify-center shadow-sm", dimension, avatar.hue.solid)} aria-hidden>{avatar.emoji}</div>;
  }
  return (
    <div className={cn("flex shrink-0 items-center justify-center bg-primary font-bold uppercase text-white", dimension, size === "sm" && "text-xs")} aria-hidden>
      {profile?.full_name?.substring(0, 1) || "S"}
    </div>
  );
}

function AuthorLine({ profile, size = "md" }: { profile?: Profile; size?: "sm" | "md" }) {
  const isCoach = profile?.role === "admin";
  return (
    <div className="flex items-center gap-2.5">
      <ProfileAvatar profile={profile} size={size} />
      <div className="min-w-0">
        <p className={cn("flex items-center gap-1.5 truncate font-black", size === "sm" ? "text-xs" : "text-sm")}>
          {profile?.full_name || "FitHub Üyesi"}
          {isCoach && <Shield size={12} className="shrink-0 text-primary" aria-label="Koç" />}
        </p>
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">{isCoach ? "Koç" : "Sporcu"}</p>
      </div>
    </div>
  );
}

export default function ToplulukPage() {
  const {
    posts, loadingPosts: loading, loadingMore, hasMore, loadMorePosts,
    currentUser, toggleLike, createPost, getComments, addComment, reportPost, reportComment,
  } = useCommunity();

  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const [searchQuery, setSearchQuery] = useState("");

  // Gönderi oluşturma
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [showRulesStep, setShowRulesStep] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Genel");
  const [submittingPost, setSubmittingPost] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Detay + yorumlar
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Şikayet akışı
  const [reportTarget, setReportTarget] = useState<{ type: "post" | "comment"; id: string } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const REPORT_REASONS = ["Spam / Reklam", "Uygunsuz İçerik", "Taciz / Nefret Söylemi", "Yanlış Bilgi", "Diğer"];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* ── Doğrulama: gönderi standartları ── */
  const titleLength = newPostTitle.trim().length;
  const contentLength = newPostContent.trim().length;
  const titleError = titleLength === 0 ? "Başlık gerekli." : titleLength < TITLE_MIN ? `En az ${TITLE_MIN} karakter (${titleLength}/${TITLE_MIN}).` : null;
  const contentError = contentLength === 0 ? "İçerik gerekli." : contentLength < CONTENT_MIN ? `En az ${CONTENT_MIN} karakter (${contentLength}/${CONTENT_MIN}).` : null;
  const formValid = !titleError && !contentError;

  const openComposer = () => {
    if (!currentUser) {
      showToast("Paylaşım için giriş yapmalısınız.");
      return;
    }
    setTriedSubmit(false);
    const alreadyAccepted = typeof window !== "undefined" && localStorage.getItem(RULES_STORAGE_KEY) === "1";
    setShowRulesStep(!alreadyAccepted);
    setRulesAccepted(alreadyAccepted);
    setShowCreateModal(true);
  };

  const acceptRules = () => {
    if (!rulesAccepted) return;
    try { localStorage.setItem(RULES_STORAGE_KEY, "1"); } catch { /* storage yok */ }
    setShowRulesStep(false);
  };

  const handleOpenReport = (e: React.MouseEvent, type: "post" | "comment", id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast("Şikayet etmek için giriş yapmalısınız.");
      return;
    }
    setReportReason("");
    setReportTarget({ type, id });
  };

  const handleSubmitReport = async () => {
    if (!reportTarget || !reportReason) return;
    setSubmittingReport(true);
    try {
      if (reportTarget.type === "post") await reportPost(reportTarget.id, reportReason);
      else await reportComment(reportTarget.id, reportReason);
      showToast("Şikayetiniz alındı. Ekibimiz inceleyecek.");
      setReportTarget(null);
    } catch (err: unknown) {
      const { code } = errorDetails(err);
      if (code === "23505") {
        showToast("Bu içeriği zaten şikayet ettiniz.");
        setReportTarget(null);
      } else {
        showToast("Şikayet gönderilemedi. Lütfen tekrar deneyin.");
      }
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleLikePost = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast("Gönderileri beğenmek için giriş yapmalısınız.");
      return;
    }
    try {
      await toggleLike(post);
      if (selectedPost?.id === post.id) {
        setSelectedPost((prev) => prev ? { ...prev, is_liked_by_user: !prev.is_liked_by_user, likes_count: (prev.likes_count || 0) + (prev.is_liked_by_user ? -1 : 1) } : prev);
      }
    } catch (err: unknown) {
      const { message: msg } = errorDetails(err);
      if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("42501")) {
        showToast("Beğeni işlemi için giriş yapmalısınız.");
      } else {
        showToast("Bağlantı hatası. İnternetini kontrol et.");
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!currentUser || !formValid) return;

    setSubmittingPost(true);
    try {
      await createPost(newPostTitle.trim(), newPostContent.trim(), newPostCategory);
      showToast("Gönderin paylaşıldı. 🎉");
      setNewPostTitle("");
      setNewPostContent("");
      setTriedSubmit(false);
      setShowCreateModal(false);
    } catch (err: unknown) {
      const { message: msg } = errorDetails(err);
      showToast(msg.includes("network") || msg.includes("fetch") || !msg ? "Bağlantı hatası. Lütfen tekrar deneyin." : "Gönderi oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleFetchComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      setComments(await getComments(postId));
    } catch {
      showToast("Yorumlar yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleOpenPostDetails = (post: Post) => {
    setSelectedPost(post);
    handleFetchComments(post.id);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Yorum yapmak için giriş yapmalısınız.");
      return;
    }
    if (!newCommentText.trim() || !selectedPost) return;

    setSubmittingComment(true);
    try {
      await addComment(selectedPost.id, newCommentText.trim());
      setNewCommentText("");
      handleFetchComments(selectedPost.id);
      setSelectedPost({ ...selectedPost, comments_count: (selectedPost.comments_count || 0) + 1 });
      showToast("Yorumun eklendi.");
    } catch (err: unknown) {
      const { message: msg, code } = errorDetails(err);
      if (code === "42501" || msg.includes("row-level security") || msg.includes("policy")) showToast("Yorum yapmak için giriş yapmalısınız.");
      else showToast("Yorum eklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const filteredPosts = useMemo(() => posts.filter((post: Post) => {
    const matchesCategory = activeCategory === "Hepsi" || post.category === activeCategory;
    const query = searchQuery.toLocaleLowerCase("tr-TR");
    const matchesSearch = post.title.toLocaleLowerCase("tr-TR").includes(query) || post.content.toLocaleLowerCase("tr-TR").includes(query);
    return matchesCategory && matchesSearch;
  }), [posts, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) counts[post.category] = (counts[post.category] || 0) + 1;
    return counts;
  }, [posts]);

  return (
    <div className="min-h-screen bg-paper pb-24 text-zinc-950 dark:bg-bg-dark dark:text-white">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-zinc-950/10 dark:border-white/10 bg-zinc-950 dark:bg-surface px-5 pb-12 pt-24 text-white sm:px-6 sm:pb-14 sm:pt-32">
        <div className="grid-lab pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" aria-hidden />
        <div className="container relative mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white">
            <ArrowLeft size={14} /> Ana sayfa
          </Link>
          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="kicker reveal text-accent">Sporcular arası bilgi paylaşımı</p>
              <h1 className="reveal reveal-1 mt-4 font-display text-6xl font-black uppercase leading-[0.85] sm:text-7xl">Topluluk</h1>
              <p className="reveal reveal-2 mt-4 max-w-xl leading-7 text-zinc-300">
                Soru sor, deneyimini paylaş, başkalarının yolculuğundan öğren. Belirli standartlarla, güvenli ve temiz bir akış.
              </p>
            </div>
            <div className="reveal reveal-3 flex shrink-0 items-center gap-3">
              {currentUser ? (
                <button type="button" onClick={openComposer} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-black text-zinc-950 shadow-xl shadow-accent/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
                  <Plus size={16} /> Yeni gönderi
                </button>
              ) : (
                <Link href="/hesap/giris" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-6 py-4 text-sm font-black text-white backdrop-blur-sm transition-colors hover:border-accent hover:text-accent">
                  <User size={16} /> Paylaşım için giriş yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* ── Standartlar bandı ───────────────────────────────────── */}
        <section className="mt-6 grid gap-4 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 dark:bg-primary/[0.07] sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary dark:bg-primary/15">
            <ScrollText size={19} />
          </span>
          <div>
            <p className="font-black">Topluluk standartları</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Gerçek deneyim veya soru paylaş · açıklayıcı başlık yaz · tanı koyma, reklam yapma · saygılı kal.
              İlk paylaşımından önce kuralları onaylaman istenir; uymayan içerik kaldırılır.
            </p>
          </div>
        </section>

        {/* ── Filtre çubuğu ───────────────────────────────────────── */}
        <section className="sticky top-[4.25rem] z-30 -mx-5 mt-5 border-b border-zinc-950/[0.07] bg-paper/90 px-5 py-3.5 backdrop-blur-xl dark:border-white/[0.07] dark:bg-bg-dark/90 sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition-colors",
                    activeCategory === category ? "bg-primary text-white" : "bg-zinc-950/[0.05] text-zinc-600 hover:bg-primary/10 hover:text-primary dark:bg-white/[0.06] dark:text-zinc-300",
                  )}
                >
                  {category}
                  {category !== "Hepsi" && (categoryCounts[category] || 0) > 0 && (
                    <span className={cn("rounded-full px-1.5 text-[10px] font-bold tabular", activeCategory === category ? "bg-white/20" : "bg-zinc-950/[0.07] text-zinc-500 dark:bg-white/10 dark:text-zinc-400")}>
                      {categoryCounts[category]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <label className="relative min-w-0 flex-1 sm:ml-auto sm:max-w-xs">
              <span className="sr-only">Gönderilerde ara</span>
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Gönderilerde ara…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-zinc-950/10 bg-white pl-10 pr-4 text-sm font-semibold outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-white/[0.04]"
              />
            </label>
          </div>
        </section>

        {/* ── Akış ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-lab animate-pulse rounded-2xl p-6">
                <div className="flex justify-between"><div className="skeleton skeleton-shimmer h-6 w-24" /><div className="skeleton skeleton-shimmer h-4 w-24" /></div>
                <div className="mt-5 space-y-3"><div className="skeleton skeleton-shimmer h-5 w-3/4" /><div className="skeleton skeleton-shimmer h-4 w-full" /><div className="skeleton skeleton-shimmer h-4 w-5/6" /></div>
                <div className="mt-6 flex items-center justify-between border-t border-zinc-950/[0.06] pt-5 dark:border-white/[0.06]">
                  <div className="flex items-center gap-3"><div className="skeleton skeleton-shimmer h-10 w-10 rounded-xl" /><div className="space-y-1.5"><div className="skeleton skeleton-shimmer h-3.5 w-24" /><div className="skeleton skeleton-shimmer h-3 w-14" /></div></div>
                  <div className="flex gap-2"><div className="skeleton skeleton-shimmer h-8 w-16" /><div className="skeleton skeleton-shimmer h-8 w-16" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-zinc-300 p-14 text-center dark:border-white/15">
            <Users className="mx-auto text-zinc-300 dark:text-zinc-700" size={44} />
            <h3 className="mt-5 font-display text-2xl font-black uppercase">Gönderi bulunamadı</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Bu kategoride veya aramanda henüz paylaşım yok. {currentUser ? "İlk gönderiyi sen paylaş!" : "Giriş yaparak ilk gönderiyi sen paylaşabilirsin."}
            </p>
            {currentUser && (
              <button type="button" onClick={openComposer} className="btn-brand mt-6 !py-3 text-sm"><Plus size={15} /> Yeni gönderi</button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  onClick={() => handleOpenPostDetails(post)}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/[0.07] dark:border-white/10 dark:bg-surface"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-md bg-primary/[0.08] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary dark:bg-primary/15">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-400">
                        <Calendar size={11} />
                        {new Date(post.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-black leading-tight transition-colors group-hover:text-primary">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{post.content}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-950/[0.06] pt-5 dark:border-white/[0.06]">
                    <AuthorLine profile={post.profiles} />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleLikePost(e, post)}
                        aria-label={post.is_liked_by_user ? "Beğeniyi geri al" : "Beğen"}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black transition-colors",
                          post.is_liked_by_user ? "bg-rose-500/10 text-rose-500" : "bg-zinc-950/[0.04] text-zinc-500 hover:text-rose-500 dark:bg-white/[0.06] dark:text-zinc-400",
                        )}
                      >
                        <Heart size={13} fill={post.is_liked_by_user ? "currentColor" : "none"} /> {post.likes_count || 0}
                      </button>
                      <span className="flex items-center gap-1.5 rounded-full bg-zinc-950/[0.04] px-3 py-2 text-xs font-black text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
                        <MessageSquare size={13} /> {post.comments_count || 0}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleOpenReport(e, "post", post.id)}
                        title="Şikayet et"
                        aria-label="Gönderiyi şikayet et"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950/[0.04] text-zinc-400 transition-colors hover:text-amber-500 dark:bg-white/[0.06]"
                      >
                        <Flag size={12} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && hasMore && (
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={loadMorePosts} disabled={loadingMore} className="btn-outline !py-3 text-sm disabled:opacity-50">
              {loadingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronDown size={14} />}
              {loadingMore ? "Yükleniyor…" : "Daha fazla yükle"}
            </button>
          </div>
        )}
      </div>

      {/* ── GÖNDERİ OLUŞTURMA ──────────────────────────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.94, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 16, opacity: 0 }}
              className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-[1.5rem] border border-zinc-950/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface sm:p-8"
            >
              {showRulesStep ? (
                /* ── Adım 1: kurallar onayı (ilk paylaşımda bir kez) ── */
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="kicker">İlk paylaşımdan önce</p>
                      <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none">Topluluk kuralları</h3>
                    </div>
                    <button type="button" onClick={() => setShowCreateModal(false)} aria-label="Kapat" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-950/[0.05] dark:hover:bg-white/[0.07]">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-6 space-y-3">
                    {COMMUNITY_RULES.map((rule, index) => (
                      <div key={rule.title} className="flex gap-3.5 rounded-xl border border-zinc-950/[0.07] bg-zinc-950/[0.02] p-4 dark:border-white/[0.07] dark:bg-white/[0.03]">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft font-mono text-[11px] font-bold text-primary dark:bg-primary/15">{index + 1}</span>
                        <div>
                          <p className="text-sm font-black">{rule.title}</p>
                          <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{rule.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] p-4 text-sm font-bold dark:bg-primary/10">
                    <input type="checkbox" checked={rulesAccepted} onChange={(e) => setRulesAccepted(e.target.checked)} className="h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
                    Kuralları okudum; paylaşımlarımın bu standartlara uyacağını onaylıyorum.
                  </label>

                  <button type="button" onClick={acceptRules} disabled={!rulesAccepted} className="btn-brand mt-5 w-full !py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">
                    <CheckCircle2 size={16} /> Onayla ve devam et
                  </button>
                </div>
              ) : (
                /* ── Adım 2: gönderi formu ── */
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="kicker">Yeni paylaşım</p>
                      <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none">Ne paylaşacaksın?</h3>
                    </div>
                    <button type="button" onClick={() => setShowCreateModal(false)} aria-label="Kapat" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-950/[0.05] dark:hover:bg-white/[0.07]">
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePost} className="mt-6 space-y-5">
                    <div>
                      <p className="field-label">Kategori</p>
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {CATEGORIES.slice(1).map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setNewPostCategory(category)}
                            aria-pressed={newPostCategory === category}
                            className={cn(
                              "rounded-xl border p-3 text-left transition-all duration-200",
                              newPostCategory === category
                                ? "border-primary bg-primary/[0.06] shadow-sm dark:bg-primary/12"
                                : "border-zinc-950/10 hover:border-primary/40 dark:border-white/10",
                            )}
                          >
                            <span className={cn("block text-sm font-black", newPostCategory === category && "text-primary")}>{category}</span>
                            <span className="mt-0.5 block text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">{CATEGORY_HINTS[category]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between">
                        <label htmlFor="post-title" className="field-label">Başlık</label>
                        <span className={cn("font-mono text-[10px] font-bold tabular", titleLength > TITLE_MAX - 10 ? "text-amber-500" : "text-zinc-400")}>{titleLength}/{TITLE_MAX}</span>
                      </div>
                      <input
                        id="post-title"
                        type="text"
                        placeholder="Örn: 8 haftada bench press'i 60'tan 80'e nasıl çıkardım"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        maxLength={TITLE_MAX}
                        className={cn("field-input mt-2", triedSubmit && titleError && "!border-rose-400 focus:!ring-rose-400/15")}
                      />
                      {triedSubmit && titleError && <p role="alert" className="mt-1.5 text-xs font-bold text-rose-500">{titleError}</p>}
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between">
                        <label htmlFor="post-content" className="field-label">İçerik</label>
                        <span className={cn("font-mono text-[10px] font-bold tabular", contentLength < CONTENT_MIN ? "text-zinc-400" : "text-primary")}>{contentLength}/{CONTENT_MAX} · en az {CONTENT_MIN}</span>
                      </div>
                      <textarea
                        id="post-content"
                        placeholder="Sorunu, deneyimini veya önerini detaylandır: ne yaptın, ne sonuç aldın, neyi merak ediyorsun?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        maxLength={CONTENT_MAX}
                        rows={5}
                        className={cn("field-input mt-2 h-auto py-3 leading-6", triedSubmit && contentError && "!border-rose-400 focus:!ring-rose-400/15")}
                      />
                      {triedSubmit && contentError && <p role="alert" className="mt-1.5 text-xs font-bold text-rose-500">{contentError}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={submittingPost || (triedSubmit && !formValid)}
                      className="btn-brand w-full !py-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submittingPost ? <><Loader2 size={16} className="animate-spin" /> Paylaşılıyor…</> : <><Sparkles size={16} /> Toplulukta paylaş</>}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── GÖNDERİ DETAYI + YORUMLAR ──────────────────────────────── */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPost(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-zinc-950/10 bg-white shadow-2xl dark:border-white/10 dark:bg-surface"
            >
              <div className="flex items-center justify-between border-b border-zinc-950/[0.07] bg-zinc-950/[0.02] p-5 dark:border-white/[0.07] dark:bg-white/[0.02] sm:px-7">
                <button type="button" onClick={() => setSelectedPost(null)} className="inline-flex items-center gap-2 rounded-full border border-zinc-950/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:border-primary hover:text-primary dark:border-white/10">
                  <ArrowLeft size={13} /> Geri dön
                </button>
                <span className="rounded-md bg-primary/[0.08] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary dark:bg-primary/15">{selectedPost.category}</span>
              </div>

              <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <AuthorLine profile={selectedPost.profiles} />
                  <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-400">
                    <Calendar size={11} />
                    {new Date(selectedPost.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>

                <div className="border-b border-zinc-950/[0.07] pb-7 dark:border-white/[0.07]">
                  <h2 className="font-display text-3xl font-black leading-tight">{selectedPost.title}</h2>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">{selectedPost.content}</p>

                  <div className="mt-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleLikePost(e, selectedPost)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-black transition-colors",
                        selectedPost.is_liked_by_user ? "bg-rose-500/10 text-rose-500" : "bg-zinc-950/[0.04] text-zinc-500 hover:text-rose-500 dark:bg-white/[0.06] dark:text-zinc-400",
                      )}
                    >
                      <Heart size={13} fill={selectedPost.is_liked_by_user ? "currentColor" : "none"} /> {selectedPost.likes_count || 0} beğeni
                    </button>
                    <span className="flex items-center gap-1.5 rounded-full bg-zinc-950/[0.04] px-4 py-2.5 text-xs font-black text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
                      <MessageSquare size={13} /> {selectedPost.comments_count || 0} yorum
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleOpenReport(e, "post", selectedPost.id)}
                      className="ml-auto flex items-center gap-1.5 rounded-full bg-zinc-950/[0.04] px-4 py-2.5 text-xs font-black text-zinc-400 transition-colors hover:text-amber-500 dark:bg-white/[0.06]"
                    >
                      <Flag size={13} /> Şikayet et
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg font-black uppercase tracking-tight">Yorumlar ({comments.length})</h3>
                  {loadingComments ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={26} /></div>
                  ) : comments.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 py-10 text-center dark:border-white/15">
                      <MessageSquare className="mx-auto text-zinc-300 dark:text-zinc-700" size={28} />
                      <p className="mt-3 text-sm font-bold text-zinc-500">İlk yorumu sen yaz!</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="rounded-2xl border border-zinc-950/[0.07] bg-zinc-950/[0.02] p-4 dark:border-white/[0.07] dark:bg-white/[0.03]">
                          <div className="flex items-start justify-between gap-3">
                            <AuthorLine profile={comment.profiles} size="sm" />
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="font-mono text-[9px] font-bold text-zinc-400">
                                {new Date(comment.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                              </span>
                              <button type="button" onClick={(e) => handleOpenReport(e, "comment", comment.id)} title="Yorumu şikayet et" aria-label="Yorumu şikayet et" className="p-1 text-zinc-300 transition-colors hover:text-amber-500 dark:text-zinc-600">
                                <Flag size={11} />
                              </button>
                            </div>
                          </div>
                          <p className="mt-2.5 pl-10 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-950/[0.07] bg-zinc-950/[0.02] p-5 dark:border-white/[0.07] dark:bg-white/[0.02] sm:px-7">
                {currentUser ? (
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tartışmaya katıl, bir yorum yaz…"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      required
                      className="h-11 min-w-0 flex-1 rounded-full border border-zinc-950/10 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-white/[0.05]"
                    />
                    <button type="submit" disabled={submittingComment} aria-label="Yorumu gönder" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 disabled:scale-100 disabled:opacity-50">
                      {submittingComment ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-primary/20 bg-primary/[0.05] p-4 text-xs font-bold text-primary dark:bg-primary/10">
                    <AlertCircle size={15} />
                    Yorum yazmak için <Link href="/hesap/giris" className="underline underline-offset-2">giriş yap</Link>.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ŞİKAYET ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {reportTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submittingReport && setReportTarget(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative z-10 w-full max-w-sm rounded-[1.5rem] border border-zinc-950/10 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-surface"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight">
                  <Flag size={17} className="text-amber-500" /> İçeriği şikayet et
                </h3>
                <button type="button" onClick={() => !submittingReport && setReportTarget(null)} aria-label="Kapat" className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-950/[0.05] dark:hover:bg-white/[0.07]">
                  <X size={14} />
                </button>
              </div>
              <p className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Bu {reportTarget.type === "post" ? "gönderiyi" : "yorumu"} neden şikayet ediyorsun?
              </p>
              <div className="mb-6 space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportReason(reason)}
                    aria-pressed={reportReason === reason}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition-all",
                      reportReason === reason
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-zinc-950/10 text-zinc-600 hover:border-amber-500/30 dark:border-white/10 dark:text-zinc-300",
                    )}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={!reportReason || submittingReport}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3.5 text-sm font-black text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
              >
                {submittingReport ? <Loader2 size={15} className="animate-spin" /> : <Flag size={15} />} Şikayeti gönder
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-24 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-zinc-950 px-6 py-3.5 text-sm font-bold text-white shadow-2xl"
          >
            <Sparkles className="text-accent" size={15} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

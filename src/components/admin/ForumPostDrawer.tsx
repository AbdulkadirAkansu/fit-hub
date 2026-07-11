"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Shield, MessageSquare, Heart, Trash2, Loader2, Flag, CheckCircle2 } from "lucide-react";
import { AdminForumPost, AdminForumComment } from "@/services/admin.service";
import { EmptyState } from "./EmptyState";

export interface ForumPostDrawerProps {
  post: AdminForumPost | null;
  comments: AdminForumComment[];
  loadingComments: boolean;
  onClose: () => void;
  onRequestDeletePost: (post: AdminForumPost) => void;
  onRequestDeleteComment: (comment: AdminForumComment) => void;
  onClearReports: (postId: string) => void;
}

export function ForumPostDrawer({
  post,
  comments,
  loadingComments,
  onClose,
  onRequestDeletePost,
  onRequestDeleteComment,
  onClearReports,
}: ForumPostDrawerProps) {
  return (
    <AnimatePresence>
      {post && (
        <div className="fixed inset-0 z-[105] flex items-center justify-end p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white dark:bg-surface border-l border-zinc-200 dark:border-zinc-800 h-full w-full max-w-xl shadow-2xl relative z-10 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-bg-dark shrink-0">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold"
              >
                <ArrowLeft size={14} /> Geri
              </button>
              <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                {post.category}
              </span>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Author */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-sm uppercase">
                    {post.profiles?.full_name?.substring(0, 1) || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1">
                      {post.profiles?.full_name || "Bilinmeyen Kullanıcı"}
                      {post.profiles?.role === "admin" && <Shield size={13} className="text-primary" />}
                    </p>
                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1.5">
                      <Calendar size={11} />
                      {new Date(post.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRequestDeletePost(post)}
                  className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shrink-0"
                  title="Gönderiyi sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Post body */}
              <div className="space-y-3 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">{post.title}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-4 pt-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                    <Heart size={14} /> {post.likes_count} beğeni
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                    <MessageSquare size={14} /> {post.comments_count} yorum
                  </span>
                </div>

                {post.reports_count > 0 && (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <Flag size={14} /> Bu gönderi {post.reports_count} kez şikayet edildi
                    </span>
                    <button
                      onClick={() => onClearReports(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface border border-amber-200 dark:border-amber-500/20 rounded-lg text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors shrink-0"
                    >
                      <CheckCircle2 size={12} /> İncelendi
                    </button>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Yorumlar ({comments.length})</h3>

                {loadingComments ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-7 h-7 text-rose-500 animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <EmptyState icon={MessageSquare} title="Henüz yorum yok" subtitle="Bu gönderiye henüz kimse yorum yapmamış." />
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-[10px] uppercase shrink-0">
                              {comment.profiles?.full_name?.substring(0, 1) || "?"}
                            </div>
                            <div>
                              <span className="text-xs font-bold flex items-center gap-1">
                                {comment.profiles?.full_name || "Bilinmeyen Kullanıcı"}
                                {comment.profiles?.role === "admin" && <Shield size={10} className="text-primary" />}
                              </span>
                              <span className="text-[9px] font-medium text-zinc-400">
                                {new Date(comment.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onRequestDeleteComment(comment)}
                            className="p-1.5 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            title="Yorumu sil"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pl-9">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

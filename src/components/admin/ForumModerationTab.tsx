"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Trash2, Calendar, Shield, ChevronLeft, ChevronRight, Hash, Flag } from "lucide-react";
import { AdminForumPost } from "@/services/admin.service";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 15;

export interface ForumModerationTabProps {
  posts: AdminForumPost[];
  searchQuery: string;
  onOpenPost: (post: AdminForumPost) => void;
  onRequestDeletePost: (post: AdminForumPost) => void;
}

export function ForumModerationTab({ posts, searchQuery, onOpenPost, onRequestDeletePost }: ForumModerationTabProps) {
  const [page, setPage] = useState(1);
  const [reportedOnly, setReportedOnly] = useState(false);

  const reportedCount = useMemo(() => posts.filter((p) => p.reports_count > 0).length, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (reportedOnly) result = result.filter((p) => p.reports_count > 0);
    if (!searchQuery) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.profiles?.full_name || "").toLowerCase().includes(q)
    );
  }, [posts, searchQuery, reportedOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black tracking-tight">Forum Moderasyonu</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{filtered.length} gönderi bulundu</p>
        </div>
        <button
          onClick={() => { setReportedOnly((v) => !v); setPage(1); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
            reportedOnly ? "bg-amber-500 text-white shadow-md shadow-amber-500/25" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-500"
          )}
        >
          <Flag size={13} /> Sadece Şikayetli {reportedCount > 0 && `(${reportedCount})`}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface">
          <EmptyState
            icon={MessageSquare}
            title="Henüz gönderi yok"
            subtitle="Topluluk üyeleri gönderi paylaştığında burada görünecek."
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pageItems.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onOpenPost(post)}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-5 cursor-pointer hover:border-rose-300 dark:hover:border-rose-500/30 transition-colors group relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[9px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                      <Hash size={9} /> {post.category}
                    </span>
                    {post.reports_count > 0 && (
                      <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                        <Flag size={9} /> {post.reports_count} Şikayet
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDeletePost(post);
                    }}
                    className="p-1.5 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Gönderiyi sil"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 mb-1.5">{post.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">{post.content}</p>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-[10px] uppercase shrink-0">
                      {post.profiles?.full_name?.substring(0, 1) || "?"}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 truncate flex items-center gap-1">
                      {post.profiles?.full_name || "Bilinmeyen"}
                      {post.profiles?.role === "admin" && <Shield size={10} className="text-primary shrink-0" />}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-bold"><Heart size={11} /> {post.likes_count}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold"><MessageSquare size={11} /> {post.comments_count}</span>
                  </div>
                </div>
                <span className="absolute top-5 right-5 text-[9px] font-medium text-zinc-400 flex items-center gap-1 group-hover:opacity-0 transition-opacity">
                  <Calendar size={10} /> {new Date(post.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                </span>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-400 font-medium">
                Sayfa {page} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

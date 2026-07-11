"use client";

import { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentItem, Profile } from "@/services/admin.service";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 15;

type SortDir = "asc" | "desc";

export interface GenericContentTableProps {
  kind: "blog" | "exercise" | "program" | "users";
  title: string;
  searchQuery: string;
  contentData?: ContentItem[];
  usersData?: Profile[];
  onAdd?: () => void;
  onEdit?: (item: ContentItem) => void;
  onDeleteContent?: (item: ContentItem) => void;
  onRoleChange?: (user: Profile) => void;
}

export function GenericContentTable({
  kind,
  title,
  searchQuery,
  contentData = [],
  usersData = [],
  onAdd,
  onEdit,
  onDeleteContent,
  onRoleChange,
}: GenericContentTableProps) {
  const isUsers = kind === "users";
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filteredContent = useMemo(() => {
    if (isUsers) return [];
    if (!searchQuery) return contentData;
    const q = searchQuery.toLowerCase();
    return contentData.filter((item) => (item.title || item.name || "").toLowerCase().includes(q));
  }, [isUsers, contentData, searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!isUsers) return [];
    if (!searchQuery) return usersData;
    const q = searchQuery.toLowerCase();
    return usersData.filter((u) => (u.full_name || "").toLowerCase().includes(q));
  }, [isUsers, usersData, searchQuery]);

  const sortedContent = useMemo(() => {
    const arr = [...filteredContent];
    arr.sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
    return arr;
  }, [filteredContent, sortDir]);

  const sortedUsers = useMemo(() => {
    const arr = [...filteredUsers];
    arr.sort((a, b) => {
      const diff = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
    return arr;
  }, [filteredUsers, sortDir]);

  const total = isUsers ? sortedUsers.length : sortedContent.length;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedContent = sortedContent.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pagedUsers = sortedUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight">{title}</h1>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500 mt-1"><span className="text-primary tabular">{total}</span> kayıt bulundu</p>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition-all duration-300 ease-spring hover:bg-primary-hover hover:-translate-y-0.5 active:scale-97 active:translate-y-0 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus size={15} /> Yeni Ekle
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-surface">
        {total === 0 ? (
          <EmptyState
            icon={isUsers ? Users : ImageIcon}
            title="Kayıt bulunamadı"
            subtitle={searchQuery ? "Arama kriterlerinizi değiştirip tekrar deneyin." : "Henüz buraya bir kayıt eklenmemiş."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-surface/50 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-5 py-3 font-mono font-black uppercase text-[9px] tracking-[0.18em] text-zinc-400">
                    {isUsers ? "Kullanıcı" : "İçerik"}
                  </th>
                  <th className="px-5 py-3 font-mono font-black uppercase text-[9px] tracking-[0.18em] text-zinc-400">
                    {isUsers ? "Rol" : "Kategori"}
                  </th>
                  <th
                    className="px-5 py-3 font-mono font-black uppercase text-[9px] tracking-[0.18em] text-zinc-400 hidden md:table-cell cursor-pointer select-none hover:text-zinc-600 dark:hover:text-zinc-300"
                    onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  >
                    <span className="flex items-center gap-1">
                      Tarih {sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </span>
                  </th>
                  <th className="px-5 py-3 font-mono font-black uppercase text-[9px] tracking-[0.18em] text-zinc-400 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {isUsers
                  ? pagedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                                u.role === "admin"
                                  ? "bg-primary/10 dark:bg-primary/15 text-primary"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                              )}
                            >
                              {u.full_name?.substring(0, 1).toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{u.full_name || "İsimsiz"}</p>
                              <p className="text-[10px] text-zinc-400 font-mono">{u.id.substring(0, 12)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                              u.role === "admin"
                                ? "bg-primary/10 dark:bg-primary/15 text-primary border border-primary/20"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                            )}
                          >
                            {u.role === "admin" ? "Yönetici" : "Üye"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-zinc-500 hidden md:table-cell">
                          {new Date(u.updated_at).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => onRoleChange?.(u)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 dark:hover:bg-primary/15 hover:text-primary dark:hover:text-primary transition-colors"
                          >
                            Rol Değiştir
                          </button>
                        </td>
                      </tr>
                    ))
                  : pagedContent.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                              {item.image_url || item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image_url || item.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                  <ImageIcon size={14} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-sm truncate max-w-[200px] lg:max-w-[300px]">
                                {item.title || item.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-mono">{item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-zinc-500 hidden md:table-cell">
                          {new Date(item.created_at).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEdit?.(item)}
                              className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-primary hover:text-white rounded-lg transition-colors text-zinc-500"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => onDeleteContent?.(item)}
                              className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-zinc-500"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
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
    </div>
  );
}

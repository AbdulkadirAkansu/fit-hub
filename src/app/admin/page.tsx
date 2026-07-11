"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import {
  LayoutDashboard, FileText, Dumbbell, Users, Target, Plus,
  Loader2, X, Save, AlertTriangle, Menu, Search,
  ChevronRight, ChevronLeft, Eye, Image as ImageIcon,
  Settings as SettingsIcon, Bell, Shield, Zap, Database, Globe,
  LogOut, ExternalLink,
  CheckCircle2, XCircle, Layers, PieChart, MessageSquare,
  Dumbbell as DumbbellIcon, Tag, Gauge, Wrench, CalendarDays, Megaphone,
  ListChecks, FlaskConical, Wind, ShieldAlert,
  Type, AlignLeft, Sparkles
} from "lucide-react";
import {
  BLOG_CATEGORIES, EXERCISE_CATEGORIES, PROGRAM_CATEGORIES, DIFFICULTY_LEVELS,
  MUSCLE_GROUPS, EQUIPMENT_OPTIONS, PROGRAM_DURATIONS, DAYS_PER_WEEK_OPTIONS,
  ANNOUNCEMENT_TYPES
} from "@/constants/adminOptions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ForumModerationTab } from "@/components/admin/ForumModerationTab";
import { ForumPostDrawer } from "@/components/admin/ForumPostDrawer";
import { GenericContentTable } from "@/components/admin/GenericContentTable";
import { InputField, TextAreaField, SelectField, FIELD_CLS } from "@/components/admin/AdminFields";
import { SectionCard, StepBuilder, WorkoutBuilder } from "@/components/admin/AdminBuilders";
import { StatCard, CategoryBreakdown, MarkdownPreview, FADE_IN } from "@/components/admin/AdminWidgets";

// ─── Main Admin OS ─────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const admin = useAdmin();
  const [settingsTab, setSettingsTab] = useState<"general" | "security" | "about">("general");

  // Computed real metrics
  const totalContent = admin.blogs.length + admin.exercises.length + admin.programs.length;
  const totalUsers = admin.allUsers.length;
  const adminCount = admin.allUsers.filter(u => u.role === "admin").length;
  const totalForumPosts = admin.forumPosts.length;
  const totalForumComments = useMemo(() => admin.forumPosts.reduce((sum, p) => sum + (p.comments_count || 0), 0), [admin.forumPosts]);
  const mostActiveForumCategory = useMemo(() => {
    if (admin.forumPosts.length === 0) return "—";
    const counts: Record<string, number> = {};
    admin.forumPosts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  }, [admin.forumPosts]);

  // Content added this month
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const contentThisMonth = useMemo(() => {
    const all = [...admin.blogs, ...admin.exercises, ...admin.programs];
    return all.filter(item => {
      const d = new Date(item.created_at);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
  }, [admin.blogs, admin.exercises, admin.programs, thisMonth, thisYear]);

  if (admin.loading) return (
    <div className="min-h-screen bg-paper dark:bg-bg-dark flex flex-col items-center justify-center gap-6 relative overflow-hidden" suppressHydrationWarning>
      <div className="grid-lab absolute inset-0 pointer-events-none" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative z-10 flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/15" />
        <div className="absolute inset-0 animate-spin rounded-2xl border-2 border-transparent border-t-primary" />
        <div className="absolute -inset-2 animate-spin-slow rounded-3xl border border-dashed border-primary/20" />
        <Zap size={22} className="text-primary" fill="currentColor" />
      </div>
      <p className="z-10 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Admin OS Yükleniyor</p>
    </div>
  );

  if (admin.error) return (
    <div className="min-h-screen bg-paper dark:bg-bg-dark flex flex-col items-center justify-center gap-5 px-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-5 max-w-sm text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-200 dark:border-red-500/20"><AlertTriangle size={28} /></div>
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">Yetkisiz Erişim</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5 font-medium">{admin.error}</p>
        </div>
      </motion.div>
    </div>
  );

  const GENERIC_TABLE_TABS = ["blog-yonetimi", "egzersiz-yonetimi", "program-yonetimi", "kullanicilar"];

  const navGroups = [
    {
      title: "Genel Bakış",
      items: [{ id: "istatistikler", label: "Dashboard", icon: LayoutDashboard }]
    },
    {
      title: "İçerik Yönetimi",
      items: [
        { id: "blog-yonetimi", label: "Blog Yazıları", icon: FileText },
        { id: "egzersiz-yonetimi", label: "Egzersizler", icon: Dumbbell },
        { id: "program-yonetimi", label: "Programlar", icon: Target },
        { id: "forum-yonetimi", label: "Forum Moderasyonu", icon: MessageSquare },
      ]
    },
    {
      title: "Yönetim",
      items: [
        { id: "kullanicilar", label: "Kullanıcılar", icon: Users },
        { id: "ayarlar", label: "Site Ayarları", icon: SettingsIcon },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-paper dark:bg-bg-dark text-zinc-900 dark:text-white flex font-sans overflow-hidden relative">
      
      {/* Toast */}
      <AnimatePresence>
        {admin.toast && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-5 left-1/2 z-[100]">
            <div className={cn("px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 border backdrop-blur-md", admin.toast.type === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20")}>
              {admin.toast.type === "success" ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
              {admin.toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {admin.isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden" onClick={() => admin.setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 bg-white/90 dark:bg-surface/90 backdrop-blur-xl border-r border-zinc-200/80 dark:border-zinc-800 flex flex-col transition-all duration-300", admin.isSidebarCollapsed ? "w-[72px]" : "w-[264px]", admin.isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>

        {/* Logo */}
        <div className={cn("h-16 border-b border-zinc-100 dark:border-zinc-800 flex items-center shrink-0", admin.isSidebarCollapsed ? "px-4 justify-center" : "px-5 justify-between")}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 bg-zinc-950 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-950 shadow-lg group-hover:rotate-6 transition-transform duration-300">
              <Zap size={17} fill="currentColor" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent dark:border-surface" aria-hidden />
            </div>
            {!admin.isSidebarCollapsed && (
              <div>
                <span className="font-display text-sm font-black tracking-tight">FitHub</span>
                <span className="block font-mono text-[8px] font-bold text-primary -mt-0.5 tracking-[0.22em]">ADMIN OS</span>
              </div>
            )}
          </Link>
          <button onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) admin.setIsSidebarOpen(false); else admin.setIsSidebarCollapsed(!admin.isSidebarCollapsed); }} className={cn("p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors", admin.isSidebarCollapsed && "hidden")}>
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-5 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="px-3">
              {!admin.isSidebarCollapsed && <p className="font-mono text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] px-3 mb-1.5">{group.title}</p>}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <button key={item.id} onClick={() => { admin.setActiveTab(item.id); admin.setSearchQuery(""); if (typeof window !== 'undefined' && window.innerWidth < 1024) admin.setIsSidebarOpen(false); }} className={cn("w-full flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 group relative", admin.activeTab === item.id ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white", admin.isSidebarCollapsed ? "justify-center py-2.5 px-2" : "py-2.5 px-3")}>
                    <item.icon size={17} className="shrink-0" />
                    {!admin.isSidebarCollapsed && <span className="ml-2.5 truncate">{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User mini-profile + Footer */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-3 space-y-2">
          {!admin.isSidebarCollapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-primary/30">
                {admin.profile?.full_name?.substring(0, 1).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate leading-tight">{admin.profile?.full_name || "Admin"}</p>
                <p className="text-[10px] text-primary font-semibold leading-tight">Yönetici</p>
              </div>
            </div>
          )}
          <div className="space-y-0.5">
            <Link href="/" className={cn("w-full flex items-center rounded-lg text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white py-2 transition-colors", admin.isSidebarCollapsed ? "justify-center px-2" : "px-3")}>
              <ExternalLink size={17} />{!admin.isSidebarCollapsed && <span className="ml-2.5">Siteye Git</span>}
            </Link>
            <button onClick={admin.logout} className={cn("w-full flex items-center rounded-lg text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 py-2 transition-colors", admin.isSidebarCollapsed ? "justify-center px-2" : "px-3")}>
              <LogOut size={17} />{!admin.isSidebarCollapsed && <span className="ml-2.5">Çıkış Yap</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <main className={cn("flex-1 flex flex-col h-screen overflow-hidden relative z-10 transition-all duration-300", admin.isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[264px]")}>

        {/* Header */}
        <header className="h-16 shrink-0 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-surface/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => admin.setIsSidebarOpen(true)} className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 rounded-lg"><Menu size={18} /></button>
            {admin.isSidebarCollapsed && <button onClick={() => admin.setIsSidebarCollapsed(false)} className="hidden lg:flex p-1.5 text-zinc-400 hover:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 rounded-lg"><ChevronRight size={16} /></button>}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100/80 dark:bg-white/[0.04] rounded-full px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
              <span className="text-zinc-400">Admin</span> <ChevronRight size={11} className="text-zinc-300 dark:text-zinc-600" /> <span className="text-zinc-900 dark:text-white font-black">{admin.activeTab.replace(/-/g, ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(admin.activeTab.includes("yonetimi") || admin.activeTab === "kullanicilar") && (
              <div className="relative hidden md:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" size={15} />
                <input type="text" placeholder="Ara..." value={admin.searchQuery} onChange={(e) => admin.setSearchQuery(e.target.value)} className="w-56 lg:w-72 bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-zinc-900 rounded-xl pl-9 pr-3 py-2 text-sm font-medium outline-none transition-all placeholder:text-zinc-400" />
              </div>
            )}
            <button className="relative p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200 dark:border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/25">
                {admin.profile?.full_name?.substring(0, 1).toUpperCase() || "A"}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold leading-tight">{admin.profile?.full_name || "Admin"}</p>
                <p className="text-[10px] text-zinc-400 leading-tight">Yönetici</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* ═══════════ DASHBOARD ═══════════ */}
            {admin.activeTab === "istatistikler" && (
              <motion.div key="dashboard" variants={FADE_IN} initial="initial" animate="animate" exit="exit" className="max-w-[1200px] mx-auto space-y-6">
                
                {/* Welcome Banner */}
                <div className="corner-ticks rounded-[1.5rem] bg-zinc-950 p-6 lg:p-8 text-white relative overflow-hidden dark:border dark:border-white/[0.08]">
                  <div className="absolute inset-0 opacity-100 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px)", backgroundSize: "44px 44px" }} aria-hidden />
                  <div className="absolute top-0 right-0 w-72 h-72 bg-primary/25 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" aria-hidden />
                  <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-accent/15 rounded-full blur-3xl -mb-16 pointer-events-none" aria-hidden />
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-accent mb-3">
                        <Sparkles size={11} /> Admin OS v2 — Kontrol Merkezi
                      </span>
                      <h1 className="font-display text-2xl lg:text-4xl font-black tracking-tight">Hoş geldin, {admin.profile?.full_name || "Admin"}</h1>
                      <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-zinc-400">İçerik, topluluk ve platform operasyonları için tek karar ekranı.</p>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <p className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-[0.18em]">Bu Ay Eklenen</p>
                        <p className="font-display text-3xl font-black tabular text-accent">{contentThisMonth}</p>
                      </div>
                      <div className="w-px bg-white/15" />
                      <div>
                        <p className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-[0.18em]">Toplam Kullanıcı</p>
                        <p className="font-display text-3xl font-black tabular">{totalUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatCard label="Toplam İçerik" value={totalContent} sub="öğe" icon={Layers} color="text-primary" trend={contentThisMonth > 0 ? `+${contentThisMonth} bu ay` : "—"} />
                  <StatCard label="Blog Yazısı" value={admin.blogs.length} icon={FileText} color="text-emerald-500" />
                  <StatCard label="Egzersiz" value={admin.exercises.length} icon={Dumbbell} color="text-blue-500" />
                  <StatCard label="Kayıtlı Kullanıcı" value={totalUsers} sub={`${adminCount} admin`} icon={Users} color="text-amber-500" />
                  <StatCard label="Forum Gönderisi" value={totalForumPosts} sub={`${totalForumComments} yorum`} icon={MessageSquare} color="text-rose-500" />
                </div>
                
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Area Chart */}
                  <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-bold">İçerik Büyümesi</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">{thisYear} yılı aylık kayıt grafiği</p>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Blog</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Kullanıcı</span>
                      </div>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={admin.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBlog" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.06]" />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} dy={8} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                          <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 600 }} />
                          <Area type="monotone" dataKey="blog" name="Blog" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorBlog)" />
                          <Area type="monotone" dataKey="users" name="Kullanıcı" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-5">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-base font-bold">İçerik Dağılımı</h2>
                      <PieChart size={16} className="text-zinc-400" />
                    </div>
                    <CategoryBreakdown blogs={admin.blogs} exercises={admin.exercises} programs={admin.programs} />
                    
                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Hızlı Ekle</h3>
                      <div className="space-y-2">
                        <button onClick={() => { admin.setActiveTab("blog-yonetimi"); admin.openModal("blog"); }} className="w-full flex items-center justify-between p-2.5 rounded-xl bg-primary/10 dark:bg-primary/15 text-primary font-bold text-xs hover:bg-primary/15 dark:hover:bg-primary/25 transition-colors">
                          <span className="flex items-center gap-2"><FileText size={14}/> Blog Yazısı</span><Plus size={14}/>
                        </button>
                        <button onClick={() => { admin.setActiveTab("egzersiz-yonetimi"); admin.openModal("exercise"); }} className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                          <span className="flex items-center gap-2"><Dumbbell size={14} className="text-emerald-500"/> Egzersiz</span><Plus size={14} className="text-zinc-400"/>
                        </button>
                        <button onClick={() => { admin.setActiveTab("program-yonetimi"); admin.openModal("program"); }} className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                          <span className="flex items-center gap-2"><Target size={14} className="text-blue-500"/> Program</span><Plus size={14} className="text-zinc-400"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity & System Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold">Son Aktiviteler</h2>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Canlı</span>
                    </div>
                    <div className="space-y-1">
                      {admin.recentActivities.length > 0 ? admin.recentActivities.slice(0, 8).map((act, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                          <div className={cn("p-2 rounded-lg shrink-0", act.type === "blog" ? "bg-primary/10 dark:bg-primary/15 text-primary" : act.type === "exercise" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : act.type === "program" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" : act.type === "forum" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" : "bg-amber-50 dark:bg-amber-500/10 text-amber-500")}>
                            <act.icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{act.title}</p>
                            <p className="text-[10px] text-zinc-400 capitalize">{act.type === "user" ? "Kullanıcı" : act.type === "blog" ? "Blog" : act.type === "exercise" ? "Egzersiz" : act.type === "forum" ? "Forum" : "Program"}</p>
                          </div>
                          <p className="text-[10px] font-medium text-zinc-400 shrink-0">{new Date(act.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      )) : <p className="text-sm text-zinc-400 py-8 text-center">Henüz aktivite yok.</p>}
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold">Sistem Durumu</h2>
                      <Shield size={16} className="text-zinc-400" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Veri katmanı", status: "Veri alındı", ok: true, detail: "Supabase PostgreSQL" },
                        { label: "Yönetici oturumu", status: "Doğrulandı", ok: !!admin.profile, detail: "Supabase Auth" },
                        { label: "Blog Tablosu", status: `${admin.blogs.length} kayıt`, ok: admin.blogs.length >= 0, detail: "blog_posts" },
                        { label: "Egzersiz Tablosu", status: `${admin.exercises.length} kayıt`, ok: admin.exercises.length >= 0, detail: "exercises" },
                        { label: "Program Tablosu", status: `${admin.programs.length} kayıt`, ok: admin.programs.length >= 0, detail: "programs" },
                        { label: "Forum Gönderi Tablosu", status: `${admin.forumPosts.length} kayıt`, ok: admin.forumPosts.length >= 0, detail: "forum_posts" },
                        { label: "En Aktif Forum Kategorisi", status: mostActiveForumCategory, ok: true, detail: "forum_posts.category" },
                        { label: "Site Ayarları", status: admin.siteSettings?.id ? "Yapılandırıldı" : "Tablo oluşturulmamış", ok: !!admin.siteSettings?.id, detail: "site_settings" },
                        { label: "Bakım Modu", status: admin.siteSettings?.maintenance_mode ? "AKTİF ⚠️" : "Kapalı", ok: !admin.siteSettings?.maintenance_mode, detail: admin.siteSettings?.maintenance_mode ? "Site erişime kapalı" : "Ziyaretçilere açık" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full shrink-0", item.ok ? "bg-emerald-500" : "bg-red-500")} />
                            <div>
                              <p className="text-xs font-bold">{item.label}</p>
                              <p className="text-[10px] text-zinc-400 font-mono">{item.detail}</p>
                            </div>
                          </div>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", item.ok ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10")}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ═══════════ SETTINGS ═══════════ */}
            {admin.activeTab === "ayarlar" && (
              <motion.div key="settings" variants={FADE_IN} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto space-y-6">
                
                <div>
                  <h1 className="text-2xl font-black tracking-tight">Site Ayarları</h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sitenin genel işleyişini buradan kontrol edin.</p>
                </div>

                {/* Settings Tabs */}
                <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
                  {[
                    { id: "general" as const, label: "Genel", icon: Globe },
                    { id: "security" as const, label: "Güvenlik", icon: Shield },
                    { id: "about" as const, label: "Sistem Bilgisi", icon: Database },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setSettingsTab(tab.id)} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all", settingsTab === tab.id ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300")}>
                      <tab.icon size={14} /> {tab.label}
                    </button>
                  ))}
                </div>

                {settingsTab === "general" && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface overflow-hidden">
                    <form onSubmit={(e) => { e.preventDefault(); admin.saveSettings(admin.siteSettings); }}>
                      
                      {/* Maintenance */}
                      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/> Bakım Modu</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Aktif edildiğinde siteye sadece yöneticiler erişebilir.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={admin.siteSettings.maintenance_mode || false} onChange={(e) => admin.setSiteSettings({...admin.siteSettings, maintenance_mode: e.target.checked})} />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                          </label>
                        </div>
                      </div>

                      {/* Announcement */}
                      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-bold flex items-center gap-2"><Bell size={16} className="text-primary"/> Site Duyurusu</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Tüm ziyaretçilere gösterilecek bir banner mesajı.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={admin.siteSettings.announcement_active || false} onChange={(e) => admin.setSiteSettings({...admin.siteSettings, announcement_active: e.target.checked})} />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                          </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <TextAreaField label="Duyuru Mesajı" rows={3} value={admin.siteSettings.announcement_text || ""} onChange={(e) => admin.setSiteSettings({...admin.siteSettings, announcement_text: e.target.value})} placeholder="Tüm ziyaretçilere site üstünde gösterilecek duyuru mesajı..." />
                          </div>
                          <SelectField label="Duyuru Türü" icon={Megaphone} value={admin.siteSettings.announcement_type || "info"} onChange={(e) => admin.setSiteSettings({...admin.siteSettings, announcement_type: e.target.value})} options={ANNOUNCEMENT_TYPES} />
                        </div>
                        {admin.siteSettings.announcement_active && admin.siteSettings.announcement_text && (
                          <div className="mt-4">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1 mb-1.5">Canlı Önizleme</p>
                            <div className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 border",
                              admin.siteSettings.announcement_type === "warning" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20" :
                              admin.siteSettings.announcement_type === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20" :
                              "bg-primary/10 dark:bg-primary/15 text-primary border-primary/20")}>
                              <Megaphone size={15} className="shrink-0" /> {admin.siteSettings.announcement_text}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-zinc-50 dark:bg-surface/50 flex justify-end">
                        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2">
                          <Save size={14}/> Kaydet
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {settingsTab === "security" && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-6 space-y-4">
                    <h3 className="font-bold mb-2">Güvenlik Politikaları</h3>
                    {[
                      { label: "Row Level Security (RLS)", status: "Aktif", desc: "Tüm tablolarda satır bazlı güvenlik politikaları uygulanıyor." },
                      { label: "Admin Yetkilendirmesi", status: "Aktif", desc: "Sadece 'admin' rolüne sahip kullanıcılar bu panele erişebilir." },
                      { label: "Auth Trigger", status: "Aktif", desc: "Yeni kayıt olan kullanıcılar otomatik olarak profil tablosuna eklenir." },
                    ].map((p, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold">{p.label} <span className="text-emerald-500 text-[10px] font-bold ml-1">{p.status}</span></p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {settingsTab === "about" && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-6">
                    <h3 className="font-bold mb-4">Sistem Bilgisi</h3>
                    <div className="space-y-2">
                      {[
                        { k: "Platform", v: "Next.js 16 + Turbopack" },
                        { k: "Veritabanı", v: "Supabase (PostgreSQL)" },
                        { k: "Auth", v: "Supabase Auth (Email/Password)" },
                        { k: "Admin", v: admin.profile?.full_name || "—" },
                        { k: "Admin Rolü", v: "admin" },
                        { k: "Toplam İçerik", v: `${totalContent} öğe` },
                        { k: "Toplam Kullanıcı", v: `${totalUsers} kişi` },
                        { k: "Son Güncelleme", v: new Date().toLocaleDateString('tr-TR') },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{row.k}</span>
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════ DATA TABLES ═══════════ */}
            {GENERIC_TABLE_TABS.includes(admin.activeTab) && (
              <motion.div key="datatable" variants={FADE_IN} initial="initial" animate="animate" exit="exit" className="max-w-[1200px] mx-auto">
                {admin.activeTab === "blog-yonetimi" && (
                  <GenericContentTable
                    kind="blog"
                    title="Blog Yazıları"
                    searchQuery={admin.searchQuery}
                    contentData={admin.blogs}
                    onAdd={() => admin.openModal("blog")}
                    onEdit={(item) => admin.openModal("blog", item)}
                    onDeleteContent={(item) => admin.requestDelete("blog_posts", item.id)}
                  />
                )}
                {admin.activeTab === "egzersiz-yonetimi" && (
                  <GenericContentTable
                    kind="exercise"
                    title="Egzersizler"
                    searchQuery={admin.searchQuery}
                    contentData={admin.exercises}
                    onAdd={() => admin.openModal("exercise")}
                    onEdit={(item) => admin.openModal("exercise", item)}
                    onDeleteContent={(item) => admin.requestDelete("exercises", item.id)}
                  />
                )}
                {admin.activeTab === "program-yonetimi" && (
                  <GenericContentTable
                    kind="program"
                    title="Programlar"
                    searchQuery={admin.searchQuery}
                    contentData={admin.programs}
                    onAdd={() => admin.openModal("program")}
                    onEdit={(item) => admin.openModal("program", item)}
                    onDeleteContent={(item) => admin.requestDelete("programs", item.id)}
                  />
                )}
                {admin.activeTab === "kullanicilar" && (
                  <GenericContentTable
                    kind="users"
                    title="Kullanıcılar"
                    searchQuery={admin.searchQuery}
                    usersData={admin.allUsers}
                    onRoleChange={(user) => admin.requestRoleChange(user.id, user.role)}
                  />
                )}
              </motion.div>
            )}

            {/* ═══════════ FORUM MODERASYONU ═══════════ */}
            {admin.activeTab === "forum-yonetimi" && (
              <motion.div key="forum" variants={FADE_IN} initial="initial" animate="animate" exit="exit" className="max-w-[1200px] mx-auto">
                <ForumModerationTab
                  posts={admin.forumPosts}
                  searchQuery={admin.searchQuery}
                  onOpenPost={admin.openForumPostDrawer}
                  onRequestDeletePost={admin.requestDeleteForumPost}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ─── MODAL ───────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {admin.isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => admin.setIsModalOpen(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }} className="bg-white dark:bg-surface w-full max-w-4xl h-full max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-zinc-200 dark:border-zinc-800 flex flex-col">

              {/* Modal Header */}
              <div className="px-6 pt-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-3.5 bg-zinc-50 dark:bg-bg-dark">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black flex items-center gap-2.5">
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm bg-gradient-to-br shrink-0",
                      admin.formType === "blog" ? "from-primary to-secondary" : admin.formType === "exercise" ? "from-emerald-500 to-teal-600" : "from-blue-500 to-cyan-600")}>
                      {admin.formType === "blog" ? <FileText size={15}/> : admin.formType === "exercise" ? <Dumbbell size={15}/> : <Target size={15}/>}
                    </span>
                    {admin.formType === "blog" ? "Blog Yazısı" : admin.formType === "exercise" ? "Egzersiz" : "Program"}
                  </h2>
                  <button onClick={() => admin.setIsModalOpen(false)} className="p-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"><X size={14}/></button>
                </div>
                <div className="flex gap-1 bg-zinc-200/60 dark:bg-zinc-800 p-1 rounded-xl w-fit">
                  <button onClick={() => admin.setModalTab("edit")} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", admin.modalTab === "edit" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300")}>Düzenle</button>
                  <button onClick={() => admin.setModalTab("preview")} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", admin.modalTab === "preview" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300")}><Eye size={12}/> Önizleme</button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {admin.modalTab === "edit" ? (
                  <form id="adminForm" onSubmit={admin.saveForm} className="max-w-3xl mx-auto space-y-5">
                    {/* ─────────── BLOG ─────────── */}
                    {admin.formType === "blog" && (
                      <>
                        <SectionCard icon={Type} title="Temel Bilgiler" desc="Başlık, kategori ve özet" accent="indigo">
                          <InputField label="Başlık" value={admin.blogForm.title} onChange={(e) => admin.setBlogForm({ ...admin.blogForm, title: e.target.value })} required />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectField label="Kategori" icon={Tag} value={admin.blogForm.category} onChange={(e) => admin.setBlogForm({ ...admin.blogForm, category: e.target.value })} options={BLOG_CATEGORIES} required />
                            <InputField label="Yazar" value={admin.blogForm.author} onChange={(e) => admin.setBlogForm({ ...admin.blogForm, author: e.target.value })} required />
                          </div>
                          <TextAreaField label="Özet" rows={2} value={admin.blogForm.description} onChange={(e) => admin.setBlogForm({ ...admin.blogForm, description: e.target.value })} placeholder="Listede ve detay başında görünecek kısa özet..." required />
                        </SectionCard>

                        <SectionCard icon={ImageIcon} title="Kapak Görseli" desc="Bir görsel URL'si yapıştırın" accent="blue">
                          <InputField label="Görsel URL" icon={ImageIcon} value={admin.blogForm.image_url} onChange={(e) => admin.setBlogForm({ ...admin.blogForm, image_url: e.target.value })} placeholder="https://..." />
                          {admin.blogForm.image_url && (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                              <Image src={admin.blogForm.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                            </div>
                          )}
                        </SectionCard>

                        <SectionCard icon={AlignLeft} title="İçerik (Markdown)" desc="# başlık, **kalın**, - madde, > alıntı desteklenir" accent="indigo">
                          <textarea value={admin.blogForm.content} onChange={(e) => admin.setBlogForm({ ...admin.blogForm, content: e.target.value })} placeholder={"# Ana Başlık\n\nGiriş paragrafı...\n\n## Alt Başlık\n- Madde 1\n- Madde 2"} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl p-4 font-mono text-sm outline-none focus:border-primary transition-all min-h-[260px] text-zinc-900 dark:text-white" />
                          <p className="text-[11px] text-zinc-400">Önizleme için üstteki <strong>Önizleme</strong> sekmesini kullanın.</p>
                        </SectionCard>
                      </>
                    )}

                    {/* ─────────── EGZERSİZ ─────────── */}
                    {admin.formType === "exercise" && (
                      <>
                        <SectionCard icon={DumbbellIcon} title="Temel Bilgiler" desc="Egzersiz adı ve sınıflandırma" accent="emerald">
                          <InputField label="Egzersiz Adı" value={admin.exForm.name} onChange={(e) => admin.setExForm({ ...admin.exForm, name: e.target.value })} required />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectField label="Hedef Kas" icon={Target} value={admin.exForm.target_muscle} onChange={(e) => admin.setExForm({ ...admin.exForm, target_muscle: e.target.value })} options={MUSCLE_GROUPS} required />
                            <SelectField label="Ekipman" icon={Wrench} value={admin.exForm.equipment} onChange={(e) => admin.setExForm({ ...admin.exForm, equipment: e.target.value })} options={EQUIPMENT_OPTIONS} required />
                            <SelectField label="Zorluk" icon={Gauge} value={admin.exForm.difficulty} onChange={(e) => admin.setExForm({ ...admin.exForm, difficulty: e.target.value })} options={DIFFICULTY_LEVELS} required />
                            <SelectField label="Kategori" icon={Tag} value={admin.exForm.category} onChange={(e) => admin.setExForm({ ...admin.exForm, category: e.target.value })} options={EXERCISE_CATEGORIES} required />
                          </div>
                        </SectionCard>

                        <SectionCard icon={ImageIcon} title="Görsel / GIF" accent="blue">
                          <InputField label="Görsel URL" icon={ImageIcon} value={admin.exForm.image_url} onChange={(e) => admin.setExForm({ ...admin.exForm, image_url: e.target.value })} placeholder="https://..." />
                          {admin.exForm.image_url && (
                            <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                              <Image src={admin.exForm.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
                            </div>
                          )}
                        </SectionCard>

                        <SectionCard icon={ListChecks} title="Uygulama Rehberi" desc="Kısa açıklama ve adım adım talimatlar" accent="emerald">
                          <TextAreaField label="Genel Talimat" rows={2} value={admin.exForm.instructions} onChange={(e) => admin.setExForm({ ...admin.exForm, instructions: e.target.value })} placeholder="Hareketin kısa özeti..." required />
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1">Adım Adım Talimatlar</label>
                            <StepBuilder steps={admin.exForm.steps} onChange={(steps) => admin.setExForm({ ...admin.exForm, steps })} />
                          </div>
                        </SectionCard>

                        <SectionCard icon={FlaskConical} title="Bilimsel Notlar" desc="Detay sayfasında gösterilir (opsiyonel)" accent="indigo">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5"><Zap size={12} className="text-primary" /> Biyomekanik Analiz</label>
                            <textarea value={admin.exForm.biomechanics} onChange={(e) => admin.setExForm({ ...admin.exForm, biomechanics: e.target.value })} rows={2} placeholder="Kas aktivasyonu ve eklem mekaniği..." className={cn(FIELD_CLS, "min-h-[64px] resize-y")} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5"><Wind size={12} className="text-primary" /> Nefes Tekniği</label>
                            <textarea value={admin.exForm.breathing} onChange={(e) => admin.setExForm({ ...admin.exForm, breathing: e.target.value })} rows={2} placeholder="Eksantrik/konsantrik nefes döngüsü..." className={cn(FIELD_CLS, "min-h-[64px] resize-y")} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5"><ShieldAlert size={12} className="text-rose-500" /> Risk Faktörleri & Güvenlik</label>
                            <textarea value={admin.exForm.risk_factors} onChange={(e) => admin.setExForm({ ...admin.exForm, risk_factors: e.target.value })} rows={2} placeholder="Sakatlık riskleri ve önlemler..." className={cn(FIELD_CLS, "min-h-[64px] resize-y")} />
                          </div>
                        </SectionCard>
                      </>
                    )}

                    {/* ─────────── PROGRAM ─────────── */}
                    {admin.formType === "program" && (
                      <>
                        <SectionCard icon={Target} title="Temel Bilgiler" desc="Program adı, açıklama ve sınıflandırma" accent="blue">
                          <InputField label="Program Adı" value={admin.progForm.title} onChange={(e) => admin.setProgForm({ ...admin.progForm, title: e.target.value })} required />
                          <TextAreaField label="Açıklama" rows={2} value={admin.progForm.desc} onChange={(e) => admin.setProgForm({ ...admin.progForm, desc: e.target.value })} placeholder="Programın amacı ve kime uygun olduğu..." required />
                          <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Seviye" icon={Gauge} value={admin.progForm.level} onChange={(e) => admin.setProgForm({ ...admin.progForm, level: e.target.value })} options={DIFFICULTY_LEVELS} required />
                            <SelectField label="Süre" icon={CalendarDays} value={admin.progForm.duration} onChange={(e) => admin.setProgForm({ ...admin.progForm, duration: e.target.value })} options={PROGRAM_DURATIONS} required />
                            <SelectField label="Kategori" icon={Tag} value={admin.progForm.category} onChange={(e) => admin.setProgForm({ ...admin.progForm, category: e.target.value })} options={PROGRAM_CATEGORIES} required />
                            <SelectField label="Gün/Hafta" icon={CalendarDays} value={admin.progForm.days_per_week} onChange={(e) => admin.setProgForm({ ...admin.progForm, days_per_week: Number(e.target.value) })} options={DAYS_PER_WEEK_OPTIONS} required />
                          </div>
                        </SectionCard>

                        <SectionCard icon={ImageIcon} title="Kapak Görseli" accent="blue">
                          <InputField label="Görsel URL" icon={ImageIcon} value={admin.progForm.image} onChange={(e) => admin.setProgForm({ ...admin.progForm, image: e.target.value })} placeholder="https://..." />
                          {admin.progForm.image && (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                              <Image src={admin.progForm.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                            </div>
                          )}
                        </SectionCard>

                        <SectionCard icon={CalendarDays} title="Antrenman Planı" desc="Gün gün egzersizleri ekleyin (tek gün veya split)" accent="blue">
                          <WorkoutBuilder days={admin.progForm.schedule} onChange={(schedule) => admin.setProgForm({ ...admin.progForm, schedule })} />
                        </SectionCard>

                        <SectionCard icon={FlaskConical} title="Bilimsel Notlar" desc="Detay sayfasında gösterilir (opsiyonel)" accent="indigo">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5"><Zap size={12} className="text-primary" /> Bilimsel Dayanak</label>
                            <textarea value={admin.progForm.scientific_rationale} onChange={(e) => admin.setProgForm({ ...admin.progForm, scientific_rationale: e.target.value })} rows={2} placeholder="Programın fizyolojik mantığı..." className={cn(FIELD_CLS, "min-h-[64px] resize-y")} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] ml-1 flex items-center gap-1.5"><Sparkles size={12} className="text-emerald-500" /> İlerleyiş (Overload) Önerisi</label>
                            <textarea value={admin.progForm.progressive_overload_tip} onChange={(e) => admin.setProgForm({ ...admin.progForm, progressive_overload_tip: e.target.value })} rows={2} placeholder="Haftalık aşamalı yüklenme tavsiyesi..." className={cn(FIELD_CLS, "min-h-[64px] resize-y")} />
                          </div>
                        </SectionCard>
                      </>
                    )}
                  </form>
                ) : (
                  <div className="max-w-3xl mx-auto py-4">
                    {admin.formType === "blog" && (
                      <div className="space-y-6">
                        <div className="text-center space-y-3">
                          <h1 className="text-3xl font-black">{admin.blogForm.title || "Başlık"}</h1>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm">{admin.blogForm.description}</p>
                          <div className="flex justify-center gap-3 text-xs font-bold text-primary"><span>{admin.blogForm.category}</span><span>•</span><span>{admin.blogForm.author}</span></div>
                        </div>
                        {admin.blogForm.image_url && <div className="relative w-full aspect-video rounded-2xl overflow-hidden"><Image src={admin.blogForm.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>}
                        <MarkdownPreview content={admin.blogForm.content} />
                      </div>
                    )}
                    {admin.formType === "exercise" && (
                      <div className="space-y-6 text-center">
                        <h1 className="text-2xl font-black">{admin.exForm.name || "Egzersiz"}</h1>
                        {admin.exForm.image_url && <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden"><Image src={admin.exForm.image_url} alt="" fill sizes="192px" className="object-cover" /></div>}
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{admin.exForm.instructions}</p>
                      </div>
                    )}
                    {admin.formType === "program" && (
                      <div className="space-y-6 text-center">
                        <h1 className="text-2xl font-black">{admin.progForm.title || "Program"}</h1>
                        {admin.progForm.image && <div className="relative w-full aspect-video rounded-2xl overflow-hidden"><Image src={admin.progForm.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>}
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{admin.progForm.desc}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-bg-dark flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => admin.setIsModalOpen(false)} className="px-4 py-2 font-semibold text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">İptal</button>
                <button type="submit" form="adminForm" disabled={admin.formLoading} className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50">
                  {admin.formLoading ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15}/> Kaydet</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── FORUM POST DRAWER ──────────────────────────────────────────────────── */}
      <ForumPostDrawer
        post={admin.selectedForumPost}
        comments={admin.forumComments}
        loadingComments={admin.loadingForumComments}
        onClose={admin.closeForumPostDrawer}
        onRequestDeletePost={admin.requestDeleteForumPost}
        onRequestDeleteComment={admin.requestDeleteForumComment}
        onClearReports={admin.clearPostReports}
      />

      {/* ─── CONFIRM DIALOG ─────────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={admin.confirmState.open}
        title={admin.confirmState.title || ""}
        description={admin.confirmState.description}
        confirmLabel={admin.confirmState.confirmLabel}
        destructive={admin.confirmState.destructive}
        loading={admin.confirmLoading}
        onConfirm={admin.confirmAction}
        onCancel={admin.cancelConfirm}
      />

    </div>
  );
}

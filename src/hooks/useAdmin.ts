import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AdminService, Profile, ContentItem, AdminForumPost, AdminForumComment } from "@/services/admin.service";
import { FileText, Dumbbell, Target, Users, MessageSquare } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
import type { SiteSettings } from "@/types";

type AdminDeletableTable =
  | "blog_posts" | "exercises" | "programs" | "profiles" | "forum_posts" | "forum_comments";

type ConfirmPayload =
  | { table: AdminDeletableTable; id: string }
  | { userId: string; newRole: string }
  | { postId: string }
  | { commentId: string };

export type FormType = "blog" | "exercise" | "program";

// Program antrenman planı yapısı (public program detayı + antrenman çalıştırıcı bu şekli bekler).
export interface WorkoutExercise { name: string; sets: string; reps: string; rest: string; }
export interface WorkoutDay { dayName: string; isRest: boolean; exercises: WorkoutExercise[]; }

type ConfirmKind = "delete-content" | "role-change" | "delete-forum-post" | "delete-forum-comment";

interface ConfirmState {
  open: boolean;
  kind?: ConfirmKind;
  title?: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  payload?: ConfirmPayload;
}

export function useAdmin() {
  const router = useRouter();

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [blogs, setBlogs] = useState<ContentItem[]>([]);
  const [exercises, setExercises] = useState<ContentItem[]>([]);
  const [programs, setPrograms] = useState<ContentItem[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [forumPosts, setForumPosts] = useState<AdminForumPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ maintenance_mode: false, announcement_text: "", announcement_active: false, announcement_type: "info" });

  // Forum moderation drawer state
  const [forumComments, setForumComments] = useState<AdminForumComment[]>([]);
  const [loadingForumComments, setLoadingForumComments] = useState(false);
  const [selectedForumPost, setSelectedForumPost] = useState<AdminForumPost | null>(null);

  // Confirm dialog state machine (replaces native window.confirm everywhere)
  const [confirmState, setConfirmState] = useState<ConfirmState>({ open: false });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState("istatistikler");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<FormType>("blog");
  const [formLoading, setFormLoading] = useState(false);
  const [modalTab, setModalTab] = useState<"edit" | "preview">("edit");

  // Forms
  const [blogForm, setBlogForm] = useState({ id: "", title: "", description: "", category: "Beslenme", image_url: "", author: "FitHub Admin", content: "" });
  const [exForm, setExForm] = useState({
    id: "", name: "", target_muscle: "Göğüs", difficulty: "Başlangıç", equipment: "Vücut Ağırlığı",
    image_url: "", category: "Fitness", instructions: "", biomechanics: "", breathing: "", risk_factors: "",
    steps: [] as string[],
  });
  const [progForm, setProgForm] = useState({
    id: "", title: "", category: "Fitness", level: "Başlangıç", duration: "4 Hafta", days_per_week: 3,
    image: "", desc: "", scientific_rationale: "", progressive_overload_tip: "",
    schedule: [] as WorkoutDay[],
  });

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const data = await AdminService.fetchAllData();
      setBlogs(data.blogs);
      setExercises(data.exercises);
      setPrograms(data.programs);
      setAllUsers(data.profiles);
      setForumPosts(data.forumPosts);
      if (data.settings) setSiteSettings(data.settings);
    } catch (err: unknown) {
      showToast("Veri yüklenirken hata oluştu: " + getErrorMessage(err), "error");
    }
  }, [showToast]);

  const initAdmin = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/hesap/giris");
        return;
      }

      // Self-heal: profil yoksa otomatik oluştur
      let { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (!profileData) {
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Kullanıcı";
        await supabase.from("profiles").insert({ id: session.user.id, full_name: fullName, role: "user" });
        const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        profileData = newProfile;
      }

      if (process.env.NODE_ENV === "development") {
        console.log("[AdminOS] Giriş yapan:", profileData?.full_name, "| Rol:", profileData?.role);
      }

      if (profileData?.role?.trim() !== "admin") {
        setError(`"${profileData?.full_name || session.user.email}" hesabının rolü "${profileData?.role || 'yok'}". Admin paneline erişmek için rol "admin" olmalıdır.`);
        setTimeout(() => router.push("/hesap"), 3000);
        return;
      }

      setProfile(profileData as Profile);
      await loadData();
    } catch (err: unknown) {
      setError("Bağlantı hatası: " + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [router, loadData]);

  useEffect(() => {
    const task = window.setTimeout(() => { void initAdmin(); }, 0);
    return () => window.clearTimeout(task);
  }, [initAdmin]);

  // Derived Real Activity (combining all recent items)
  const recentActivities = useMemo(() => {
    const items = [
      ...blogs.map(b => ({ type: "blog", title: b.title || "", date: b.created_at, icon: FileText, color: "primary" })),
      ...exercises.map(e => ({ type: "exercise", title: e.name || "", date: e.created_at, icon: Dumbbell, color: "emerald" })),
      ...programs.map(p => ({ type: "program", title: p.title || "", date: p.created_at, icon: Target, color: "blue" })),
      ...allUsers.map(u => ({ type: "user", title: u.full_name || "Yeni Kullanıcı", date: u.updated_at, icon: Users, color: "amber" })),
      ...forumPosts.map(p => ({ type: "forum", title: p.title || "", date: p.created_at, icon: MessageSquare, color: "rose" })),
    ];
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [blogs, exercises, programs, allUsers, forumPosts]);

  // Derived Chart Data (Real data grouped by month for current year)
  const chartData = useMemo(() => {
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const currentYear = new Date().getFullYear();
    const data = months.map((month, index) => ({ blog: 0, exercise: 0, program: 0, users: 0, label: month, monthIndex: index }));

    const countByMonth = <T extends object>(items: T[], key: string, dateField: string = "created_at") => {
      items.forEach(item => {
        const raw = (item as Record<string, unknown>)[dateField];
        if (typeof raw === "string" || typeof raw === "number") {
          const d = new Date(raw);
          if (d.getFullYear() === currentYear) {
            const m = d.getMonth();
            if (m >= 0 && m < 12) (data[m] as unknown as Record<string, number>)[key] += 1;
          }
        }
      });
    };

    countByMonth(blogs, "blog");
    countByMonth(exercises, "exercise");
    countByMonth(programs, "program");
    countByMonth(allUsers, "users", "updated_at");

    let maxVal = 1;
    data.forEach(m => {
      const total = m.blog + m.exercise + m.program + m.users;
      if (total > maxVal) maxVal = total;
    });

    return data.map(m => ({
      ...m,
      blogPercent: maxVal > 0 ? (m.blog / maxVal) * 100 : 0,
      exercisePercent: maxVal > 0 ? (m.exercise / maxVal) * 100 : 0,
      programPercent: maxVal > 0 ? (m.program / maxVal) * 100 : 0,
      total: m.blog + m.exercise + m.program + m.users
    }));
  }, [blogs, exercises, programs, allUsers]);

  // ─── Confirm Dialog (replaces native window.confirm) ───────────────────────
  const requestDelete = useCallback((table: "blog_posts" | "exercises" | "programs" | "profiles", id: string) => {
    setConfirmState({
      open: true,
      kind: "delete-content",
      title: "Bu öğeyi kalıcı olarak silmek istediğinize emin misiniz?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Sil",
      destructive: true,
      payload: { table, id },
    });
  }, []);

  const requestRoleChange = useCallback((userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setConfirmState({
      open: true,
      kind: "role-change",
      title: newRole === "admin" ? "Bu kullanıcıya admin yetkisi vermek istediğinize emin misiniz?" : "Bu kullanıcının admin yetkisini kaldırmak istediğinize emin misiniz?",
      description: newRole === "admin" ? "Admin olan kullanıcılar bu panele erişip tüm içerik ve kullanıcıları yönetebilir." : undefined,
      confirmLabel: "Değiştir",
      destructive: false,
      payload: { userId, newRole },
    });
  }, []);

  const requestDeleteForumPost = useCallback((post: AdminForumPost) => {
    setConfirmState({
      open: true,
      kind: "delete-forum-post",
      title: "Gönderiyi silmek istediğinize emin misiniz?",
      description: `"${post.title}" başlıklı gönderi ve tüm yorumları kalıcı olarak silinecek.`,
      confirmLabel: "Sil",
      destructive: true,
      payload: { postId: post.id },
    });
  }, []);

  const requestDeleteForumComment = useCallback((comment: AdminForumComment) => {
    setConfirmState({
      open: true,
      kind: "delete-forum-comment",
      title: "Yorumu silmek istediğinize emin misiniz?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Sil",
      destructive: true,
      payload: { commentId: comment.id },
    });
  }, []);

  const cancelConfirm = useCallback(() => {
    if (confirmLoading) return;
    setConfirmState({ open: false });
  }, [confirmLoading]);

  const confirmAction = useCallback(async () => {
    if (!confirmState.kind) return;
    setConfirmLoading(true);
    try {
      if (confirmState.kind === "delete-content") {
        const { table, id } = confirmState.payload as { table: AdminDeletableTable; id: string };
        await AdminService.deleteItem(table, id);
        showToast("Öğe başarıyla silindi.", "success");
        await loadData();
      } else if (confirmState.kind === "role-change") {
        const { userId, newRole } = confirmState.payload as { userId: string; newRole: string };
        await AdminService.updateRole(userId, newRole);
        showToast("Kullanıcı rolü güncellendi.", "success");
        await loadData();
      } else if (confirmState.kind === "delete-forum-post") {
        const { postId } = confirmState.payload as { postId: string };
        await AdminService.deleteForumPost(postId);
        showToast("Gönderi silindi.", "success");
        setForumPosts(prev => prev.filter(p => p.id !== postId));
        setSelectedForumPost(prev => {
          if (prev?.id === postId) {
            setForumComments([]);
            return null;
          }
          return prev;
        });
      } else if (confirmState.kind === "delete-forum-comment") {
        const { commentId } = confirmState.payload as { commentId: string };
        await AdminService.deleteForumComment(commentId);
        showToast("Yorum silindi.", "success");
        setForumComments(prev => prev.filter(c => c.id !== commentId));
        setForumPosts(prev => prev.map(p => p.id === selectedForumPost?.id ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p));
      }
      setConfirmState({ open: false });
    } catch (err: unknown) {
      showToast("İşlem sırasında hata oluştu: " + getErrorMessage(err), "error");
    } finally {
      setConfirmLoading(false);
    }
  }, [confirmState, showToast, loadData, selectedForumPost]);

  // ─── Forum Moderation ────────────────────────────────────────────────────
  const openForumPostDrawer = useCallback(async (post: AdminForumPost) => {
    setSelectedForumPost(post);
    setLoadingForumComments(true);
    try {
      const comments = await AdminService.fetchForumCommentsForPost(post.id);
      setForumComments(comments);
    } catch (err: unknown) {
      showToast("Yorumlar yüklenirken hata oluştu: " + getErrorMessage(err), "error");
    } finally {
      setLoadingForumComments(false);
    }
  }, [showToast]);

  const closeForumPostDrawer = useCallback(() => {
    setSelectedForumPost(null);
    setForumComments([]);
  }, []);

  // Şikayetleri "incelendi" işaretler (içerik kalır, rozet kalkar).
  const clearPostReports = useCallback(async (postId: string) => {
    try {
      await AdminService.clearPostReports(postId);
      setForumPosts(prev => prev.map(p => (p.id === postId ? { ...p, reports_count: 0 } : p)));
      setSelectedForumPost(prev => (prev?.id === postId ? { ...prev, reports_count: 0 } : prev));
      showToast("Şikayetler incelendi olarak işaretlendi.", "success");
    } catch (err: unknown) {
      showToast("Şikayetler temizlenirken hata oluştu: " + getErrorMessage(err), "error");
    }
  }, [showToast]);

  const openModal = (type: FormType, item?: ContentItem) => {
    setFormType(type);
    setModalTab("edit");
    if (type === "blog") {
      const it = item as unknown as Partial<typeof blogForm> | undefined;
      setBlogForm(it ? { ...blogForm, ...it, content: it.content || "" } : { id: "", title: "", description: "", category: "Beslenme", image_url: "", author: profile?.full_name || "Admin", content: "" });
    } else if (type === "exercise") {
      const it = item as unknown as Partial<typeof exForm> | undefined;
      setExForm(it ? {
        ...exForm,
        ...it,
        instructions: it.instructions || "",
        biomechanics: it.biomechanics || "",
        breathing: it.breathing || "",
        risk_factors: it.risk_factors || "",
        steps: Array.isArray(it.steps) ? it.steps : [],
      } : {
        id: "", name: "", target_muscle: "Göğüs", difficulty: "Başlangıç", equipment: "Vücut Ağırlığı",
        image_url: "", category: "Fitness", instructions: "", biomechanics: "", breathing: "", risk_factors: "", steps: [],
      });
    } else {
      const it = item as unknown as Partial<typeof progForm> | undefined;
      setProgForm(it ? {
        ...progForm,
        ...it,
        scientific_rationale: it.scientific_rationale || "",
        progressive_overload_tip: it.progressive_overload_tip || "",
        schedule: Array.isArray(it.schedule) ? it.schedule : [],
      } : {
        id: "", title: "", category: "Fitness", level: "Başlangıç", duration: "4 Hafta", days_per_week: 3,
        image: "", desc: "", scientific_rationale: "", progressive_overload_tip: "", schedule: [],
      });
    }
    setIsModalOpen(true);
  };

  // Türkçe karakterleri çevirerek temiz URL slug üretir (göğüs → gogus).
  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (formType === "blog") {
        await AdminService.upsertBlog({ ...blogForm, id: blogForm.id || generateSlug(blogForm.title) });
      } else if (formType === "exercise") {
        const payload = {
          ...exForm,
          steps: exForm.steps.map(s => s.trim()).filter(Boolean),
          id: exForm.id || generateSlug(exForm.name),
        };
        await AdminService.upsertExercise(payload);
      } else {
        // Boş günleri/egzersizleri ayıkla.
        const cleanedSchedule = progForm.schedule
          .filter(d => d.dayName.trim())
          .map(d => ({
            ...d,
            exercises: d.isRest ? [] : d.exercises.filter(ex => ex.name.trim()),
          }));
        const payload = { ...progForm, schedule: cleanedSchedule, id: progForm.id || generateSlug(progForm.title) };
        await AdminService.upsertProgram(payload);
      }
      showToast("İçerik başarıyla kaydedildi.", "success");
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      showToast("Kayıt sırasında hata oluştu: " + getErrorMessage(err), "error");
    } finally {
      setFormLoading(false);
    }
  };

  const saveSettings = async (settingsPayload: SiteSettings) => {
    try {
      await AdminService.updateSettings(settingsPayload);
      setSiteSettings(settingsPayload);
      showToast("Site ayarları güncellendi.", "success");
    } catch {
      showToast("Ayarlar kaydedilirken hata oluştu.", "error");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/hesap/giris");
  };

  return {
    loading, error, profile,
    blogs, exercises, programs, allUsers, forumPosts, siteSettings, setSiteSettings,
    forumComments, loadingForumComments, selectedForumPost, openForumPostDrawer, closeForumPostDrawer, clearPostReports,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    isSidebarCollapsed, setIsSidebarCollapsed,
    isSidebarOpen, setIsSidebarOpen,
    toast, recentActivities, chartData,
    isModalOpen, setIsModalOpen, formType, modalTab, setModalTab, formLoading,
    blogForm, setBlogForm, exForm, setExForm, progForm, setProgForm,
    confirmState, confirmLoading, requestDelete, requestRoleChange, requestDeleteForumPost, requestDeleteForumComment, confirmAction, cancelConfirm,
    openModal, saveForm, saveSettings, logout
  };
}

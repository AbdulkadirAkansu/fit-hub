import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title?: string;
  name?: string;
  category: string;
  description?: string;
  image_url?: string;
  image?: string;
  created_at: string;
  difficulty?: string;
  level?: string;
  target_muscle?: string;
  equipment?: string;
  author?: string;
  desc?: string;
  duration?: string;
  days_per_week?: number;
}

export interface SiteSettings {
  id: string;
  maintenance_mode: boolean;
  announcement_text: string;
  announcement_active: boolean;
  updated_at?: string;
}

export interface ForumProfile {
  full_name: string;
  avatar_url: string;
  role: string;
}

export interface AdminForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  profiles?: ForumProfile | null;
  comments_count: number;
  likes_count: number;
  reports_count: number;
}

export interface AdminForumComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: ForumProfile | null;
}

// forum_posts sorgusunun ham satırı: join'lenmiş profil ve embedded count alanlarını içerir.
type RawForumPostRow = Omit<AdminForumPost, "comments_count" | "likes_count" | "reports_count"> & {
  forum_comments?: unknown;
  forum_likes?: unknown;
};

// PostgREST embedded count bazen `{ count }` nesnesi, bazen `[{ count }]` dizisi döndürür.
function extractCount(value: unknown): number {
  if (Array.isArray(value)) return value[0]?.count ?? 0;
  if (value && typeof value === "object") return (value as { count?: number }).count ?? 0;
  return 0;
}

export const AdminService = {
  // Fetch everything concurrently - resilient to missing tables
  async fetchAllData() {
    const [blogs, exercises, programs, profiles, forumPostsRaw, pendingReports] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("exercises").select("*").order("created_at", { ascending: false }),
      supabase.from("programs").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("updated_at", { ascending: false }),
      // Yorum/beğeni sayıları TEK sorguda embedded count ile gelir (önceki sürüm her
      // gönderi için 2 ayrı sorgu atıyordu — N gönderi için ~2N sorgu, N+1 deseni).
      supabase
        .from("forum_posts")
        .select(`*, profiles:user_id (full_name, avatar_url, role), forum_comments(count), forum_likes(count)`)
        .order("created_at", { ascending: false }),
      // Bekleyen şikayetleri tek sorguda çek, sonra gönderi başına grupla.
      supabase.from("forum_reports").select("post_id").eq("status", "pending"),
    ]);

    // Debug: yalnızca geliştirme ortamında veri yükleme özetini logla.
    if (process.env.NODE_ENV === "development") {
      console.log("[AdminOS] Veri Yüklendi:", {
        blogs: blogs.data?.length ?? 0, blogsError: blogs.error?.message,
        exercises: exercises.data?.length ?? 0, exercisesError: exercises.error?.message,
        programs: programs.data?.length ?? 0, programsError: programs.error?.message,
        profiles: profiles.data?.length ?? 0, profilesError: profiles.error?.message,
        forumPosts: forumPostsRaw.data?.length ?? 0, forumPostsError: forumPostsRaw.error?.message,
      });
    }

    const reportCountByPost = new Map<string, number>();
    (pendingReports.data || []).forEach((r: { post_id: string | null }) => {
      if (r.post_id) reportCountByPost.set(r.post_id, (reportCountByPost.get(r.post_id) || 0) + 1);
    });

    const forumPosts: AdminForumPost[] = (forumPostsRaw.data || []).map((post: RawForumPostRow) => ({
      ...post,
      comments_count: extractCount(post.forum_comments),
      likes_count: extractCount(post.forum_likes),
      reports_count: reportCountByPost.get(post.id) || 0,
    }));

    // Settings query is separate - table may not exist yet
    let settingsData: SiteSettings | null = null;
    try {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", "global").single();
      if (!error && data) {
        settingsData = data as SiteSettings;
      } else {
        console.warn("[AdminOS] site_settings tablosu bulunamadı veya boş:", error?.message);
      }
    } catch {
      console.warn("[AdminOS] site_settings tablosu mevcut değil.");
    }

    return {
      blogs: (blogs.data || []) as ContentItem[],
      exercises: (exercises.data || []) as ContentItem[],
      programs: (programs.data || []) as ContentItem[],
      profiles: (profiles.data || []) as Profile[],
      forumPosts,
      settings: settingsData,
    };
  },

  // Role verification
  async verifyAdmin(userId: string): Promise<boolean> {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    return data?.role === "admin";
  },

  // Delete generic
  async deleteItem(table: "blog_posts" | "exercises" | "programs" | "profiles" | "forum_posts" | "forum_comments", id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  },

  // Fetch comments for a single forum post (admin drawer drill-in)
  async fetchForumCommentsForPost(postId: string): Promise<AdminForumComment[]> {
    const { data, error } = await supabase
      .from("forum_comments")
      .select(`*, profiles:user_id (full_name, avatar_url, role)`)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []) as AdminForumComment[];
  },

  // Delete a forum post (cascades to comments/likes via FK ON DELETE CASCADE)
  async deleteForumPost(postId: string) {
    const { error } = await supabase.from("forum_posts").delete().eq("id", postId);
    if (error) throw error;
  },

  // Bir gönderiye ait bekleyen şikayetleri "incelendi" olarak işaretler (moderasyon kararı: içerik kalsın).
  async clearPostReports(postId: string) {
    const { error } = await supabase.from("forum_reports").update({ status: "resolved" }).eq("post_id", postId);
    if (error) throw error;
  },

  // Delete a single forum comment
  async deleteForumComment(commentId: string) {
    const { error } = await supabase.from("forum_comments").delete().eq("id", commentId);
    if (error) throw error;
  },

  // Upsert Blog
  async upsertBlog(payload: Partial<ContentItem>) {
    const { error } = await supabase.from("blog_posts").upsert(payload);
    if (error) throw error;
  },

  // Upsert Exercise
  async upsertExercise(payload: Partial<ContentItem>) {
    const { error } = await supabase.from("exercises").upsert(payload);
    if (error) throw error;
  },

  // Upsert Program
  async upsertProgram(payload: Partial<ContentItem>) {
    const { error } = await supabase.from("programs").upsert(payload);
    if (error) throw error;
  },

  // Update Role
  async updateRole(userId: string, newRole: string) {
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (error) throw error;
  },

  // Update Settings
  async updateSettings(payload: Partial<SiteSettings>) {
    const { error } = await supabase.from("site_settings").upsert({ id: "global", ...payload, updated_at: new Date().toISOString() });
    if (error) {
      console.error("Settings error:", error);
      throw new Error("Site ayarları tablosu bulunamadı. Lütfen database.sql dosyasındaki SQL kodlarını Supabase'de çalıştırın.");
    }
  }
};

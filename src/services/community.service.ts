import { supabase } from "@/lib/supabase";
import { Post, Comment, PostsPage } from "@/types/community";

const PAGE_SIZE = 12;

type EmbeddedPost = Post & {
  forum_comments?: unknown;
  forum_likes?: unknown;
};

// Supabase/PostgREST count-embedding bazen `{ count }` nesnesi, bazen
// `[{ count }]` dizisi döndürür (sürüme göre) — ikisini de güvenle ele alır.
function extractCount(value: unknown): number {
  if (Array.isArray(value)) return value[0]?.count ?? 0;
  if (value && typeof value === "object") return (value as { count?: number }).count ?? 0;
  return 0;
}

export const CommunityService = {
  /**
   * Gönderileri sayfalı olarak çeker. Yorum/beğeni sayıları PostgREST'in
   * embedded count özelliğiyle TEK sorguda gelir (önceki sürüm her gönderi
   * için 2-3 ayrı sorgu atıyordu — N gönderi için ~3N sorgu, N+1 deseni).
   * Kullanıcının beğendiği gönderiler ayrı, tek bir toplu sorgu ile işaretlenir.
   */
  async fetchPosts(currentUserId?: string, page = 0): Promise<PostsPage> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: postsData, error: postsError, count } = await supabase
      .from("forum_posts")
      .select(
        `
        *,
        profiles:user_id (full_name, avatar_url, role),
        forum_comments(count),
        forum_likes(count)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (postsError) throw postsError;
    if (!postsData || postsData.length === 0) {
      return { posts: [], hasMore: false, total: count || 0 };
    }

    // Kullanıcının bu sayfadaki gönderilerden hangilerini beğendiğini TEK sorguda öğren.
    let likedPostIds = new Set<string>();
    if (currentUserId) {
      const postIds = postsData.map((p: { id: string }) => p.id);
      const { data: userLikes } = await supabase
        .from("forum_likes")
        .select("post_id")
        .eq("user_id", currentUserId)
        .in("post_id", postIds);
      likedPostIds = new Set((userLikes || []).map((l: { post_id: string }) => l.post_id));
    }

    const posts: Post[] = (postsData as EmbeddedPost[]).map((post) => ({
      ...post,
      comments_count: extractCount(post.forum_comments),
      likes_count: extractCount(post.forum_likes),
      is_liked_by_user: likedPostIds.has(post.id),
    }));

    const total = count || 0;
    return { posts, hasMore: from + posts.length < total, total };
  },

  async fetchComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("forum_comments")
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, role)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Comment[] || [];
  },

  async createPost(userId: string, title: string, content: string, category: string): Promise<Post> {
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    const allowedCategories = new Set(["Genel", "Antrenman", "Beslenme", "Motivasyon"]);
    if (normalizedTitle.length < 5 || normalizedTitle.length > 120) throw new Error("Başlık 5-120 karakter arasında olmalıdır.");
    if (normalizedContent.length < 30 || normalizedContent.length > 2000) throw new Error("İçerik 30-2000 karakter arasında olmalıdır.");
    if (!allowedCategories.has(category)) throw new Error("Geçerli bir topluluk kategorisi seçin.");
    const { data, error } = await supabase
      .from("forum_posts")
      .insert({
        user_id: userId,
        title: normalizedTitle,
        content: normalizedContent,
        category
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async likePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("forum_likes")
      .insert({ post_id: postId, user_id: userId });

    if (error) throw error;
  },

  async unlikePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("forum_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async addComment(postId: string, userId: string, content: string): Promise<void> {
    const normalizedContent = content.trim();
    if (normalizedContent.length < 2 || normalizedContent.length > 1000) throw new Error("Yorum 2-1000 karakter arasında olmalıdır.");
    const { error } = await supabase
      .from("forum_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: normalizedContent
      });

    if (error) throw error;
  },

  /** Bir gönderiyi şikayet eder. Aynı kullanıcı aynı gönderiyi tekrar şikayet edemez (DB kısıtı). */
  async reportPost(postId: string, reporterId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from("forum_reports")
      .insert({ post_id: postId, reporter_id: reporterId, reason });
    if (error) throw error;
  },

  /** Bir yorumu şikayet eder. Aynı kullanıcı aynı yorumu tekrar şikayet edemez (DB kısıtı). */
  async reportComment(commentId: string, reporterId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from("forum_reports")
      .insert({ comment_id: commentId, reporter_id: reporterId, reason });
    if (error) throw error;
  }
};

import { useState, useCallback, useEffect } from "react";
import { CommunityService } from "@/services/community.service";
import { Post } from "@/types/community";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const checkUserSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    } catch (err) {
      console.warn("Check user session warning (offline?):", err);
    }
  }, []);

  const fetchPosts = useCallback(async (showLoading = false) => {
    if (showLoading) setLoadingPosts(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const result = await CommunityService.fetchPosts(session?.user?.id, 0);
      setPosts(result.posts);
      setHasMore(result.hasMore);
      setPage(0);
    } catch (error) {
      console.warn("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { data: { session } } = await supabase.auth.getSession();
      const result = await CommunityService.fetchPosts(session?.user?.id, nextPage);
      setPosts(prev => [...prev, ...result.posts]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.warn("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    const task = window.setTimeout(() => {
      void checkUserSession();
      void fetchPosts(true);
    }, 0);
    return () => window.clearTimeout(task);
  }, [checkUserSession, fetchPosts]);

  const toggleLike = async (post: Post) => {
    if (!currentUser) throw new Error("Giriş yapmalısınız");

    try {
      if (post.is_liked_by_user) {
        await CommunityService.unlikePost(post.id, currentUser.id);
        setPosts(prev => prev.map(p =>
          p.id === post.id
            ? { ...p, is_liked_by_user: false, likes_count: Math.max(0, (p.likes_count || 1) - 1) }
            : p
        ));
      } else {
        await CommunityService.likePost(post.id, currentUser.id);
        setPosts(prev => prev.map(p =>
          p.id === post.id
            ? { ...p, is_liked_by_user: true, likes_count: (p.likes_count || 0) + 1 }
            : p
        ));
      }
    } catch (error) {
      throw error;
    }
  };

  const createPost = async (title: string, content: string, category: string) => {
    if (!currentUser) throw new Error("Giriş yapmalısınız");
    await CommunityService.createPost(currentUser.id, title, content, category);
    await fetchPosts();
  };

  const getComments = async (postId: string) => {
    return await CommunityService.fetchComments(postId);
  };

  const addComment = async (postId: string, content: string) => {
    if (!currentUser) throw new Error("Giriş yapmalısınız");
    await CommunityService.addComment(postId, currentUser.id, content);

    // Yorum sayısını lokalde de güncelle
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comments_count: (p.comments_count || 0) + 1 }
        : p
    ));
  };

  const reportPost = async (postId: string, reason: string) => {
    if (!currentUser) throw new Error("Giriş yapmalısınız");
    await CommunityService.reportPost(postId, currentUser.id, reason);
  };

  const reportComment = async (commentId: string, reason: string) => {
    if (!currentUser) throw new Error("Giriş yapmalısınız");
    await CommunityService.reportComment(commentId, currentUser.id, reason);
  };

  return {
    posts,
    loadingPosts,
    loadingMore,
    hasMore,
    loadMorePosts,
    currentUser,
    fetchPosts,
    toggleLike,
    createPost,
    getComments,
    addComment,
    reportPost,
    reportComment
  };
}

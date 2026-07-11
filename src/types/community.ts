export interface Profile {
  full_name: string;
  avatar_url: string;
  role: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
  comments_count?: number;
  likes_count?: number;
  is_liked_by_user?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles?: Profile;
}

export interface PostsPage {
  posts: Post[];
  hasMore: boolean;
  total: number;
}

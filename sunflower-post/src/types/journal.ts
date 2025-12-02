/**
 * Types for the editorial Journal (blog/articles)
 */

export type ArticleCategory =
  | 'Mental Health'
  | 'Community Stories'
  | 'Self-Care'
  | 'Relationships'
  | 'Personal Growth'
  | 'Healing'
  | 'Creative Expression';

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: ArticleCategory;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  commentCount: number;
  reactionCount: number;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  body: string;
  createdAt: string;
  isAnonymous: boolean;
}

export interface ArticleReaction {
  id: string;
  articleId: string;
  userId: string;
  reactionType: 'heart' | 'support' | 'insightful' | 'saved';
  createdAt: string;
}

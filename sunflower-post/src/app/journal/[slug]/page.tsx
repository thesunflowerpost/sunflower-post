"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import CommunitySidebar from '@/components/CommunitySidebar';
import SaveButton from '@/components/SaveButton';
import { ReactionBar } from '@/components/ui';
import { MOCK_ARTICLES } from '@/data/journalArticles';
import type { JournalArticle, ArticleComment } from '@/types/journal';
import type { ReactionId } from '@/config/reactions';

type Params = Promise<{ slug: string }>;

export default function ArticlePage({ params }: { params: Params }) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reactions, setReactions] = useState<Record<ReactionId, boolean>>({});

  useEffect(() => {
    // Find article by slug
    const foundArticle = MOCK_ARTICLES.find(a => a.slug === resolvedParams.slug);
    setArticle(foundArticle || null);
  }, [resolvedParams.slug]);

  function handleReactionToggle(reactionId: ReactionId, active: boolean) {
    setReactions(prev => ({
      ...prev,
      [reactionId]: active,
    }));
  }

  async function handleSubmitComment() {
    if (!commentText.trim() || !user) return;

    const newComment: ArticleComment = {
      id: Date.now().toString(),
      articleId: article?.id || '',
      userId: user.id,
      userName: isAnonymous ? user.alias : user.name,
      userAvatar: isAnonymous ? '🌻' : user.profilePicture,
      body: commentText,
      createdAt: new Date().toISOString(),
      isAnonymous,
    };

    setComments([...comments, newComment]);
    setCommentText('');
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatCommentDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateString);
  }

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Mental Health': 'bg-blue-100 text-blue-800 border-blue-200',
      'Community Stories': 'bg-purple-100 text-purple-800 border-purple-200',
      'Self-Care': 'bg-green-100 text-green-800 border-green-200',
      'Relationships': 'bg-pink-100 text-pink-800 border-pink-200',
      'Personal Growth': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Healing': 'bg-teal-100 text-teal-800 border-teal-200',
      'Creative Expression': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-4xl">📝</p>
          <p className="text-lg text-[#7A674C]">Article not found</p>
          <Link
            href="/journal"
            className="inline-block px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold transition-all"
          >
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = MOCK_ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <CommunitySidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Back Button */}
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-sm text-[#7A674C] hover:text-[#3A2E1F] transition-colors"
            >
              <span>←</span>
              <span>Back to Journal</span>
            </Link>

            {/* Article */}
            <article className="bg-white rounded-3xl border border-yellow-200/60 overflow-hidden shadow-lg">
              {/* Cover Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {article.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{article.author.avatar}</span>
                      <span>{article.author.name}</span>
                    </span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.readTimeMinutes} min read</span>
                  </div>
                </div>
              </div>

              {/* Article Body */}
              <div className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  {article.body.split('\n\n').map((paragraph, idx) => {
                    // Handle headers
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-2xl font-bold text-[#3A2E1F] mt-8 mb-4">
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-xl font-bold text-[#3A2E1F] mt-6 mb-3">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    // Handle lists
                    if (paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-2 my-4 text-[#5C4A33]">
                          {items.map((item, i) => (
                            <li key={i}>{item.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    // Regular paragraphs
                    return (
                      <p key={idx} className="text-[#5C4A33] leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-yellow-200">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-xs text-[#7A674C]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author Bio */}
                {article.author.bio && (
                  <div className="mt-8 p-6 bg-yellow-50/50 rounded-2xl border border-yellow-200">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{article.author.avatar}</span>
                      <div>
                        <p className="font-semibold text-[#3A2E1F]">{article.author.name}</p>
                        <p className="text-sm text-[#7A674C] mt-1">{article.author.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reactions & Save */}
                <div className="mt-8 pt-8 border-t border-yellow-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <ReactionBar
                      roomId="journal"
                      postId={article.id}
                      reactions={reactions}
                      onReactionToggle={handleReactionToggle}
                      showLabels={true}
                    />
                    <SaveButton
                      itemType="post"
                      itemId={article.id}
                      size="md"
                      showLabel={true}
                    />
                  </div>
                  <p className="text-xs text-[#A08960] italic">
                    Your reactions are private to you.
                  </p>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="bg-white rounded-3xl border border-yellow-200/60 p-8 shadow-lg space-y-6">
              <h2 className="text-2xl font-bold text-[#3A2E1F]">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              {user ? (
                <div className="space-y-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:outline-none resize-none"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-[#7A674C] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-yellow-300 text-yellow-400 focus:ring-yellow-400"
                      />
                      <span>Post anonymously</span>
                    </label>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                      className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-[#3A2E1F] font-semibold transition-all"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-yellow-50/50 rounded-2xl border border-yellow-200">
                  <p className="text-[#7A674C] mb-4">Sign in to join the conversation</p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold transition-all"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-yellow-50/30 rounded-2xl border border-yellow-100"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{comment.userAvatar || '🌻'}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm text-[#3A2E1F]">
                              {comment.userName}
                            </span>
                            <span className="text-xs text-[#A08960]">
                              {formatCommentDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-[#5C4A33] leading-relaxed">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-[#A08960]">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#3A2E1F]">
                  Related Articles
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/journal/${relatedArticle.slug}`}
                      className="bg-white rounded-2xl border border-yellow-200/60 overflow-hidden hover:shadow-lg transition-all group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={relatedArticle.coverImage}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-bold text-[#3A2E1F] group-hover:text-yellow-700 line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-xs text-[#A08960]">
                          {relatedArticle.readTimeMinutes} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

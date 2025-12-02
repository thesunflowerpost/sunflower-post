"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import CommunitySidebar from '@/components/CommunitySidebar';
import SaveButton from '@/components/SaveButton';
import { MOCK_ARTICLES } from '@/data/journalArticles';
import type { JournalArticle, ArticleCategory } from '@/types/journal';

export default function JournalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'All'>('All');

  const categories: (ArticleCategory | 'All')[] = [
    'All',
    'Mental Health',
    'Community Stories',
    'Self-Care',
    'Relationships',
    'Personal Growth',
    'Healing',
    'Creative Expression',
  ];

  // Filter articles
  const filteredArticles = useMemo(() => {
    let articles = [...MOCK_ARTICLES];

    // Filter by category
    if (selectedCategory !== 'All') {
      articles = articles.filter(a => a.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some(tag => tag.toLowerCase().includes(query)) ||
          a.author.name.toLowerCase().includes(query)
      );
    }

    return articles;
  }, [searchQuery, selectedCategory]);

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const recentArticles = filteredArticles.filter(a => !a.featured);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getCategoryColor(category: ArticleCategory): string {
    const colors: Record<ArticleCategory, string> = {
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
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#3A2E1F]">
                The Journal
              </h1>
              <p className="text-lg text-[#7A674C] max-w-2xl mx-auto">
                Stories, insights, and reflections from our community. Here, we share the real work of healing, growing, and showing up.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-3xl border border-yellow-200/60 p-6 shadow-sm space-y-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:outline-none text-[#3A2E1F] placeholder-[#A08960]"
              />

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-yellow-400 text-[#3A2E1F] shadow-md'
                        : 'bg-yellow-50 border border-yellow-200 text-[#7A674C] hover:bg-yellow-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-[#3A2E1F] flex items-center gap-2">
                  <span>⭐</span>
                  Featured Stories
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-3xl border border-yellow-200/60 overflow-hidden hover:shadow-xl transition-all group"
                    >
                      {/* Cover Image */}
                      <Link href={`/journal/${article.slug}`}>
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <Link href={`/journal/${article.slug}`}>
                          <h3 className="text-xl font-bold text-[#3A2E1F] group-hover:text-yellow-700 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-[#5C4A33] line-clamp-3">
                          {article.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-[#A08960]">
                          <div className="flex items-center gap-3">
                            <span>{article.author.name}</span>
                            <span>•</span>
                            <span>{article.readTimeMinutes} min read</span>
                          </div>
                          <SaveButton
                            itemType="post"
                            itemId={article.id}
                            size="sm"
                            showLabel={false}
                          />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-[#7A674C] pt-2 border-t border-yellow-100">
                          <span className="flex items-center gap-1">
                            <span>💬</span>
                            {article.commentCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>❤️</span>
                            {article.reactionCount}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Articles */}
            {recentArticles.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-[#3A2E1F]">
                  Recent Articles
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {recentArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-3xl border border-yellow-200/60 overflow-hidden hover:shadow-xl transition-all group"
                    >
                      {/* Cover Image */}
                      <Link href={`/journal/${article.slug}`}>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>

                        <Link href={`/journal/${article.slug}`}>
                          <h3 className="text-base font-bold text-[#3A2E1F] group-hover:text-yellow-700 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#5C4A33] line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-[10px] text-[#A08960] pt-2 border-t border-yellow-100">
                          <span>{article.readTimeMinutes} min read</span>
                          <SaveButton
                            itemType="post"
                            itemId={article.id}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <p className="text-4xl">📝</p>
                <p className="text-lg text-[#7A674C]">
                  No articles found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

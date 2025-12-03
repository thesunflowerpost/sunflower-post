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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <CommunitySidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                The Journal
              </h1>
              <p className="text-base text-gray-600 max-w-2xl">
                Stories, insights, and reflections from our community
              </p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none text-gray-900 placeholder-gray-400"
              />

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-xs font-medium transition-colors rounded-md ${
                      selectedCategory === category
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Featured
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all group"
                    >
                      {/* Cover Image */}
                      <Link href={`/journal/${article.slug}`}>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">{article.category}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-gray-500">{article.readTimeMinutes} min read</span>
                        </div>

                        <Link href={`/journal/${article.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>{article.author.name}</span>
                          </div>
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

            {/* Recent Articles */}
            {recentArticles.length > 0 && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent
                </h2>
                <div className="space-y-6">
                  {recentArticles.map((article) => (
                    <article
                      key={article.id}
                      className="pb-6 border-b border-gray-200 last:border-b-0 group"
                    >
                      <div className="flex gap-4">
                        {/* Cover Image */}
                        <Link href={`/journal/${article.slug}`} className="flex-shrink-0">
                          <div className="w-32 h-24 overflow-hidden rounded-md">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                            />
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{article.category}</span>
                            <span className="text-gray-300">·</span>
                            <span>{article.readTimeMinutes} min read</span>
                          </div>

                          <Link href={`/journal/${article.slug}`}>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {article.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{article.author.name}</span>
                            <SaveButton
                              itemType="post"
                              itemId={article.id}
                              size="sm"
                              showLabel={false}
                            />
                          </div>
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

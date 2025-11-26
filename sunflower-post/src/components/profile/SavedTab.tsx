"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { SavedItem } from '@/types/profile';

type SavedTabProps = {
  savedItems: SavedItem[];
};

// Type emoji helper
function getTypeEmoji(type: SavedItem['type']): string {
  const emojiMap = {
    post: '💬',
    song: '🎵',
    show: '📺',
    book: '📚',
  };
  return emojiMap[type] || '💬';
}

// Format relative time
function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SavedTab({ savedItems }: SavedTabProps) {
  const [filterType, setFilterType] = useState<SavedItem['type'] | 'all'>('all');

  const filteredItems = filterType === 'all'
    ? savedItems
    : savedItems.filter(item => item.type === filterType);

  const typeLabels: Record<SavedItem['type'], string> = {
    post: 'Posts',
    song: 'Songs',
    show: 'Shows',
    book: 'Books',
  };

  if (savedItems.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="text-2xl">🔖</p>
        <p className="text-[#A08960] text-sm">
          Items you save will appear here.
        </p>
        <p className="text-[#A08960] text-xs">
          Save posts, songs, shows, and books to revisit them later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'all'
              ? 'bg-yellow-400 text-[#3A2E1F] shadow-md'
              : 'bg-white border border-yellow-200 text-[#7A674C] hover:bg-yellow-50'
          }`}
        >
          All Saved
        </button>
        {Object.entries(typeLabels).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setFilterType(type as SavedItem['type'])}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === type
                ? 'bg-yellow-400 text-[#3A2E1F] shadow-md'
                : 'bg-white border border-yellow-200 text-[#7A674C] hover:bg-yellow-50'
            }`}
          >
            {getTypeEmoji(type as SavedItem['type'])} {label}
          </button>
        ))}
      </div>

      {/* Saved Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#A08960] text-sm">
            No saved {filterType}s yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="bg-white border border-yellow-200/60 rounded-2xl p-4 hover:border-yellow-300 hover:shadow-md transition-all group"
            >
              <div className="flex gap-3">
                {item.imageUrl ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-yellow-50 border border-yellow-200 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-100 border border-yellow-200 flex-shrink-0 flex items-center justify-center text-3xl">
                    {getTypeEmoji(item.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium capitalize">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-[#A08960]">
                      Saved {formatTimeAgo(item.savedAt)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-yellow-900 mb-1 line-clamp-2">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[#5C4A33] line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredItems.length > 0 && (
        <p className="text-center text-xs text-[#A08960] pt-2">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} saved
        </p>
      )}
    </div>
  );
}

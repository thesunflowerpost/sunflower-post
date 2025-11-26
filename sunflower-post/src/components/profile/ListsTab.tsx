"use client";

import { useState } from 'react';
import type { UserLists, ListItem } from '@/types/profile';

type ListsTabProps = {
  lists: UserLists;
  isOwnProfile: boolean;
};

type ListType = 'read' | 'watch' | 'listen';

// Get status emoji
function getStatusEmoji(status: ListItem['status']): string {
  if (status.includes('Reading') || status.includes('Watching') || status.includes('Listening')) {
    return '▶️';
  }
  if (status.includes('Finished') || status.includes('Watched') || status.includes('Listened')) {
    return '✅';
  }
  return '📌';
}

// Get status color
function getStatusColor(status: ListItem['status']): string {
  if (status.includes('Reading') || status.includes('Watching') || status.includes('Listening')) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  if (status.includes('Finished') || status.includes('Watched') || status.includes('Listened')) {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
}

export default function ListsTab({ lists, isOwnProfile }: ListsTabProps) {
  const [activeList, setActiveList] = useState<ListType>('read');

  const currentList = activeList === 'read'
    ? lists.readList
    : activeList === 'watch'
    ? lists.watchList
    : lists.listenList;

  const listLabels = {
    read: 'Read List',
    watch: 'Watch List',
    listen: 'Listening List',
  };

  const listIcons = {
    read: '📚',
    watch: '📺',
    listen: '🎵',
  };

  if (currentList.length === 0) {
    return (
      <div className="space-y-4">
        {/* List Tabs */}
        <div className="flex gap-2 border-b border-yellow-200/60">
          {(Object.keys(listLabels) as ListType[]).map((list) => (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                activeList === list
                  ? 'text-yellow-900 border-b-2 border-yellow-500'
                  : 'text-[#A08960] hover:text-[#7A674C] hover:bg-yellow-50/50'
              }`}
            >
              {listIcons[list]} {listLabels[list]}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="text-center py-12 space-y-2">
          <p className="text-3xl">{listIcons[activeList]}</p>
          <p className="text-[#A08960] text-sm">
            {isOwnProfile
              ? `Your ${listLabels[activeList].toLowerCase()} is empty.`
              : `No items in ${listLabels[activeList].toLowerCase()} yet.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Tabs */}
      <div className="flex gap-2 border-b border-yellow-200/60">
        {(Object.keys(listLabels) as ListType[]).map((list) => {
          const count = list === 'read'
            ? lists.readList.length
            : list === 'watch'
            ? lists.watchList.length
            : lists.listenList.length;

          return (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                activeList === list
                  ? 'text-yellow-900 border-b-2 border-yellow-500'
                  : 'text-[#A08960] hover:text-[#7A674C] hover:bg-yellow-50/50'
              }`}
            >
              {listIcons[list]} {listLabels[list]} ({count})
            </button>
          );
        })}
      </div>

      {/* List Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-yellow-200/60 rounded-2xl p-4 hover:border-yellow-300 hover:shadow-md transition-all group"
          >
            {item.imageUrl && (
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-yellow-50 border border-yellow-200 mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-bold text-yellow-900 line-clamp-2 mb-1">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-[#7A674C] line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusEmoji(item.status)} {item.status}
                </span>
                {item.rating && (
                  <span className="text-xs text-yellow-700">
                    {'⭐'.repeat(item.rating)}
                  </span>
                )}
              </div>

              {item.note && (
                <p className="text-xs text-[#5C4A33] line-clamp-2 italic">
                  "{item.note}"
                </p>
              )}

              {isOwnProfile && (
                <div className="flex gap-2 pt-2 border-t border-yellow-100">
                  <button className="text-[10px] text-yellow-700 hover:text-yellow-900 font-medium hover:underline">
                    Edit
                  </button>
                  <span className="text-[#C0A987]">·</span>
                  <button className="text-[10px] text-[#7A674C] hover:text-red-600 font-medium hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

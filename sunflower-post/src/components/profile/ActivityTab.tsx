"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { ActivityItem } from '@/types/profile';

type ActivityTabProps = {
  activity: ActivityItem[];
  isOwnProfile: boolean;
};

// Room emoji helper
function getRoomEmoji(type: ActivityItem['type']): string {
  const emojiMap = {
    lounge: '💬',
    dilemma: '🤔',
    hope: '💛',
    inspo: '✨',
    music: '🎵',
    'tv-movie': '📺',
    book: '📚',
  };
  return emojiMap[type] || '💬';
}

// Format relative time
function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityTab({ activity, isOwnProfile }: ActivityTabProps) {
  const [filterRoom, setFilterRoom] = useState<string>('all');

  // Filter anonymous posts if viewing someone else's profile
  const visibleActivity = isOwnProfile
    ? activity
    : activity.filter(item => !item.isAnonymous);

  // Filter by room if selected
  const filteredActivity = filterRoom === 'all'
    ? visibleActivity
    : visibleActivity.filter(item => item.type === filterRoom);

  // Get unique rooms for filter
  const rooms = Array.from(new Set(activity.map(item => item.type)));
  const roomNames: Record<string, string> = {
    lounge: 'The Lounge',
    dilemma: 'Dilemmas',
    hope: 'Hope Bank',
    inspo: 'Inspo Wall',
    music: 'Music Room',
    'tv-movie': 'TV & Movies',
    book: 'Book Club',
  };

  if (filteredActivity.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#A08960] text-sm">
          {isOwnProfile
            ? filterRoom === 'all'
              ? 'Your activity will appear here as you participate in rooms.'
              : 'No activity in this room yet.'
            : 'No activity to show.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterRoom('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterRoom === 'all'
              ? 'bg-yellow-400 text-[#3A2E1F] shadow-md'
              : 'bg-white border border-yellow-200 text-[#7A674C] hover:bg-yellow-50'
          }`}
        >
          All Rooms
        </button>
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => setFilterRoom(room)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterRoom === room
                ? 'bg-yellow-400 text-[#3A2E1F] shadow-md'
                : 'bg-white border border-yellow-200 text-[#7A674C] hover:bg-yellow-50'
            }`}
          >
            {getRoomEmoji(room as ActivityItem['type'])} {roomNames[room] || room}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivity.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="block bg-white border border-yellow-200/60 rounded-2xl p-5 hover:border-yellow-300 hover:shadow-md transition-all group"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-3xl">
                {getRoomEmoji(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#7A674C]">
                    {item.roomName}
                  </span>
                  {item.isAnonymous && isOwnProfile && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                      Anonymous
                    </span>
                  )}
                  <span className="text-xs text-[#A08960]">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
                {item.title && (
                  <p className="text-base font-bold text-yellow-900 mb-2">
                    {item.title}
                  </p>
                )}
                <p className="text-sm text-[#5C4A33] leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredActivity.length > 0 && (
        <p className="text-center text-xs text-[#A08960] pt-4">
          {filteredActivity.length === 1
            ? '1 post'
            : `${filteredActivity.length} posts`}
          {filterRoom !== 'all' && ' in this room'}
        </p>
      )}
    </div>
  );
}

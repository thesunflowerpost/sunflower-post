"use client";

import Link from 'next/link';
import type { ActivityItem } from '@/types/profile';

type OverviewTabProps = {
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

export default function OverviewTab({ activity, isOwnProfile }: OverviewTabProps) {
  // Filter anonymous posts if viewing someone else's profile
  const visibleActivity = isOwnProfile
    ? activity.slice(0, 5)
    : activity.filter(item => !item.isAnonymous).slice(0, 5);

  if (visibleActivity.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#A08960] text-sm">
          {isOwnProfile
            ? 'Your recent activity will appear here.'
            : 'No recent activity to show.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-yellow-900">Recent Activity</h2>
        <Link
          href="#activity"
          className="text-xs text-yellow-700 hover:text-yellow-900 font-medium hover:underline"
        >
          See all →
        </Link>
      </div>

      <div className="space-y-3">
        {visibleActivity.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="block bg-white border border-yellow-200/60 rounded-2xl p-4 hover:border-yellow-300 hover:shadow-md transition-all group"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 text-2xl">
                {getRoomEmoji(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#7A674C]">
                    {item.roomName}
                  </span>
                  {item.isAnonymous && isOwnProfile && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                      Anonymous
                    </span>
                  )}
                  <span className="text-[10px] text-[#A08960]">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
                {item.title && (
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    {item.title}
                  </p>
                )}
                <p className="text-sm text-[#5C4A33] line-clamp-2 group-hover:line-clamp-none transition-all">
                  {item.body}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';
import Image from 'next/image';

interface UserSummary {
  id: string;
  name: string;
  alias: string;
  bio?: string;
  avatarUrl?: string;
}

interface MutualConnectionsProps {
  targetUserId: string;
  currentUserId: string;
  isOwnProfile: boolean;
}

export default function MutualConnections({
  targetUserId,
  currentUserId,
  isOwnProfile,
}: MutualConnectionsProps) {
  const [mutualUsers, setMutualUsers] = useState<UserSummary[]>([]);
  const [mutualCount, setMutualCount] = useState(0);
  const [suggestions, setSuggestions] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMutualConnections();
  }, [targetUserId, currentUserId]);

  async function loadMutualConnections() {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${targetUserId}/mutual`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load mutual connections');
      }

      const data = await response.json();

      if (isOwnProfile && data.suggestions) {
        setSuggestions(data.suggestions);
      } else if (data.mutualUsers) {
        setMutualUsers(data.mutualUsers);
        setMutualCount(data.mutualCount);
      }
    } catch (error) {
      console.error('Failed to load mutual connections:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (isOwnProfile && suggestions.length > 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-[#3A2E1F]">Suggested for You</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          People you may know based on your connections
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    );
  }

  if (!isOwnProfile && mutualCount > 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-[#3A2E1F]">
            You both follow {mutualCount} {mutualCount === 1 ? 'person' : 'people'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mutualUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {mutualCount > mutualUsers.length && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            and {mutualCount - mutualUsers.length} more
          </p>
        )}
      </div>
    );
  }

  return null;
}

interface UserCardProps {
  user: UserSummary;
}

function UserCard({ user }: UserCardProps) {
  const avatarSrc = user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  return (
    <a
      href={`/profile/${user.id}`}
      className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50/30 transition-all"
    >
      <Image
        src={avatarSrc}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-full border-2 border-yellow-400"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#3A2E1F] truncate">{user.name}</p>
        <p className="text-xs text-gray-600 truncate">@{user.alias}</p>
        {user.bio && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-1">{user.bio}</p>
        )}
      </div>
    </a>
  );
}

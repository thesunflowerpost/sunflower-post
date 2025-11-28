'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, UserCheck } from 'lucide-react';
import Image from 'next/image';

interface UserSummary {
  id: string;
  name: string;
  alias: string;
  bio?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'followers' | 'following';
  currentUserId: string;
  profileUserId: string;
}

export default function FollowersModal({
  isOpen,
  onClose,
  mode,
  currentUserId,
  profileUserId,
}: FollowersModalProps) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUserId === profileUserId;

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      setSearchQuery('');
    }
  }, [isOpen, mode, profileUserId]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.alias.toLowerCase().includes(query) ||
          user.bio?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  async function loadUsers() {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const endpoint = mode === 'followers'
        ? `/api/users/${profileUserId}/followers`
        : `/api/users/${profileUserId}/following`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFollowToggle(userId: string, currentlyFollowing: boolean) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: currentlyFollowing ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isFollowing: !currentlyFollowing } : user
        )
      );
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  }

  const title = mode === 'followers' ? 'Followers' : 'Following';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#3A2E1F]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${title.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-gray-500 text-lg mb-2">
                      {searchQuery
                        ? 'No users found matching your search'
                        : `No ${title.toLowerCase()} yet`}
                    </p>
                    {!searchQuery && (
                      <p className="text-gray-400 text-sm">
                        {mode === 'followers'
                          ? 'When people follow you, they will appear here'
                          : 'Start following people to see them here'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        currentUserId={currentUserId}
                        isOwnProfile={isOwnProfile}
                        onFollowToggle={handleFollowToggle}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredUsers.length > 0 && (
                <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} {title.toLowerCase()}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface UserCardProps {
  user: UserSummary;
  currentUserId: string;
  isOwnProfile: boolean;
  onFollowToggle: (userId: string, isFollowing: boolean) => void;
}

function UserCard({ user, currentUserId, isOwnProfile, onFollowToggle }: UserCardProps) {
  const isCurrentUser = user.id === currentUserId;
  const avatarSrc = user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/30 transition-all">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={avatarSrc}
          alt={user.name}
          width={56}
          height={56}
          className="rounded-full border-2 border-yellow-400"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#3A2E1F] truncate">{user.name}</h3>
        <p className="text-sm text-gray-600 truncate">@{user.alias}</p>
        {user.bio && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
        )}
      </div>

      {/* Follow Button */}
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          <button
            onClick={() => onFollowToggle(user.id, user.isFollowing || false)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
              user.isFollowing
                ? 'bg-white border-2 border-yellow-200 text-[#5C4A33] hover:bg-yellow-50'
                : 'bg-yellow-400 text-[#3A2E1F] hover:bg-yellow-500 shadow-md'
            }`}
          >
            {user.isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 inline mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 inline mr-1" />
                Follow
              </>
            )}
          </button>
        </div>
      )}

      {isCurrentUser && (
        <div className="flex-shrink-0">
          <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold">
            You
          </span>
        </div>
      )}
    </div>
  );
}

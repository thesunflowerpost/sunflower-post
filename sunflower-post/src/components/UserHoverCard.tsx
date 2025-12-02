'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, UserCheck } from 'lucide-react';

interface UserHoverCardProps {
  userId?: string;
  userName: string;
  children?: React.ReactNode;
  className?: string;
}

interface UserPreview {
  id: string;
  name: string;
  alias: string;
  bio?: string;
  avatarUrl?: string;
  isFollowing: boolean;
}

export default function UserHoverCard({
  userId,
  userName,
  children,
  className = '',
}: UserHoverCardProps) {
  const [showCard, setShowCard] = useState(false);
  const [userPreview, setUserPreview] = useState<UserPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cardRef = useRef<HTMLDivElement>(null);

  // If no userId, just render the name without hover functionality
  if (!userId) {
    return (
      <span className={className}>
        {children || userName}
      </span>
    );
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function loadUserPreview() {
    if (userPreview || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/preview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPreview(data);
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Failed to load user preview:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleMouseEnter() {
    // Delay showing the card by 500ms
    timeoutRef.current = setTimeout(() => {
      setShowCard(true);
      loadUserPreview();
    }, 500);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Delay hiding the card by 200ms to allow moving to the card
    setTimeout(() => {
      setShowCard(false);
    }, 200);
  }

  async function handleFollowToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        if (userPreview) {
          setUserPreview({ ...userPreview, isFollowing: !isFollowing });
        }
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  }

  return (
    <div className="relative inline-block">
      <Link
        href={`/profile/${userId}`}
        className={`hover:underline hover:text-yellow-600 transition-colors cursor-pointer ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children || userName}
      </Link>

      {/* Hover Card */}
      {showCard && (
        <div
          ref={cardRef}
          className="absolute z-50 top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-yellow-200/60 p-4 animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          ) : userPreview ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-start gap-3">
                <Image
                  src={
                    userPreview.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userPreview.name}`
                  }
                  alt={userPreview.name}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-yellow-400"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#3A2E1F] truncate">
                    {userPreview.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    @{userPreview.alias}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {userPreview.bio && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {userPreview.bio}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/profile/${userId}`}
                  className="flex-1 text-center px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-50 hover:bg-yellow-100 text-[#5C4A33] border-2 border-yellow-200 transition-all"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                    isFollowing
                      ? 'bg-white border-2 border-yellow-200 text-[#5C4A33] hover:bg-yellow-50'
                      : 'bg-yellow-400 text-[#3A2E1F] hover:bg-yellow-500 shadow-md'
                  }`}
                >
                  {isFollowing ? (
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
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              Failed to load user info
            </div>
          )}
        </div>
      )}
    </div>
  );
}

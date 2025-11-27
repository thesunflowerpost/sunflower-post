"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserProfile } from '@/types/profile';
import EditProfileModal from './EditProfileModal';

type ProfileHeaderProps = {
  profile: UserProfile;
  isOwnProfile: boolean;
};

export default function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);

  function handleFollowToggle() {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow
  }

  function handleEditProfile() {
    setShowEditModal(true);
  }

  function handlePrivacySettings() {
    router.push('/settings/privacy');
  }

  async function handleSaveProfile(data: { name: string; bio: string; avatarUrl?: string }) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(result.user));

      // Update local profile state
      setLocalProfile({
        ...localProfile,
        name: data.name,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      });

      // Trigger a page refresh to update all components
      router.refresh();
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  }

  // Get avatar - use provided URL or generate from name
  const avatarSrc = localProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${localProfile.name}`;

  // Format join date
  const joinDate = new Date(localProfile.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-yellow-200 to-amber-300 border-4 border-white shadow-lg ring-4 ring-yellow-100">
              <img
                src={avatarSrc}
                alt={`${localProfile.name}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-900">
                {localProfile.name}
              </h1>
              <p className="text-sm text-[#A08960] mt-1">
                @{localProfile.alias} · Joined {joinDate}
              </p>
            </div>

            {localProfile.bio && (
              <p className="text-sm text-[#5C4A33] leading-relaxed max-w-2xl">
                {localProfile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-yellow-900">{localProfile.stats.posts}</span>
                <span className="text-[#A08960] text-xs">Posts</span>
              </div>
              {isOwnProfile && (
                <>
                  <div className="flex flex-col">
                    <span className="font-bold text-yellow-900">{localProfile.stats.journals}</span>
                    <span className="text-[#A08960] text-xs">Journals</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-yellow-900">{localProfile.stats.saved}</span>
                    <span className="text-[#A08960] text-xs">Saved</span>
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-yellow-900">{localProfile.stats.followers}</span>
                <span className="text-[#A08960] text-xs">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-yellow-900">{localProfile.stats.following}</span>
                <span className="text-[#A08960] text-xs">Following</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={handleEditProfile}
                    className="px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={handlePrivacySettings}
                    className="px-5 py-2.5 rounded-2xl bg-white hover:bg-yellow-50 border-2 border-yellow-200 text-[#5C4A33] text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    Privacy & visibility
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 ${
                    isFollowing
                      ? 'bg-white hover:bg-yellow-50 border-2 border-yellow-200 text-[#5C4A33]'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F]'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentName={localProfile.name}
          currentBio={localProfile.bio}
          currentAvatarUrl={localProfile.avatarUrl}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}

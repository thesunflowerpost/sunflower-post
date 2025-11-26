"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CommunitySidebar from '@/components/CommunitySidebar';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs, { ProfileTab } from '@/components/ProfileTabs';
import OverviewTab from '@/components/profile/OverviewTab';
import ActivityTab from '@/components/profile/ActivityTab';
import ListsTab from '@/components/profile/ListsTab';
import {
  MOCK_PROFILES,
  MOCK_ACTIVITY,
  MOCK_LISTS,
  getProfileById,
} from '@/data/mockProfiles';

export default function UserProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const profileId = params.id as string;
  const profile = getProfileById(profileId);

  // Check if viewing own profile
  const isOwnProfile = profileId === 'current-user';

  // Redirect to /profile if viewing own profile
  if (isOwnProfile && typeof window !== 'undefined') {
    window.location.href = '/profile';
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🌻</p>
          <h1 className="text-2xl font-bold text-yellow-900">Profile not found</h1>
          <p className="text-[#A08960]">This user doesn't exist or their profile is private.</p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Go home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <CommunitySidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Profile Header */}
            <ProfileHeader profile={profile} isOwnProfile={false} />

            {/* Tabs */}
            <div className="bg-white border border-yellow-200/60 rounded-3xl overflow-hidden shadow-lg">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOwnProfile={false}
              />

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <OverviewTab
                    activity={MOCK_ACTIVITY}
                    isOwnProfile={false}
                  />
                )}
                {activeTab === 'activity' && (
                  <ActivityTab
                    activity={MOCK_ACTIVITY}
                    isOwnProfile={false}
                  />
                )}
                {activeTab === 'lists' && (
                  <ListsTab lists={MOCK_LISTS} isOwnProfile={false} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

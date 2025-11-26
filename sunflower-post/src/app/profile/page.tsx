"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CommunitySidebar from '@/components/CommunitySidebar';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs, { ProfileTab } from '@/components/ProfileTabs';
import OverviewTab from '@/components/profile/OverviewTab';
import ActivityTab from '@/components/profile/ActivityTab';
import SavedTab from '@/components/profile/SavedTab';
import JournalsTab from '@/components/profile/JournalsTab';
import ListsTab from '@/components/profile/ListsTab';
import {
  MOCK_PROFILES,
  MOCK_ACTIVITY,
  MOCK_SAVED,
  MOCK_JOURNALS,
  MOCK_LISTS,
} from '@/data/mockProfiles';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  // Get current user's profile (using mock data)
  const profile = MOCK_PROFILES['current-user'];

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
            <ProfileHeader profile={profile} isOwnProfile={true} />

            {/* Tabs */}
            <div className="bg-white border border-yellow-200/60 rounded-3xl overflow-hidden shadow-lg">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOwnProfile={true}
              />

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <OverviewTab activity={MOCK_ACTIVITY} isOwnProfile={true} />
                )}
                {activeTab === 'activity' && (
                  <ActivityTab activity={MOCK_ACTIVITY} isOwnProfile={true} />
                )}
                {activeTab === 'saved' && (
                  <SavedTab savedItems={MOCK_SAVED} />
                )}
                {activeTab === 'journals' && (
                  <JournalsTab journals={MOCK_JOURNALS} />
                )}
                {activeTab === 'lists' && (
                  <ListsTab lists={MOCK_LISTS} isOwnProfile={true} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

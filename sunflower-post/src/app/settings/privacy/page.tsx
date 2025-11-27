'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, Download, Save } from 'lucide-react';

interface PrivacySettings {
  profileVisibility: 'public' | 'followers_only' | 'private';
  followerApprovalRequired: boolean;
  defaultAnonymousMode: boolean;
  activityVisible: boolean;
  dataExportEnabled: boolean;
}

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    followerApprovalRequired: false,
    defaultAnonymousMode: false,
    activityVisible: true,
    dataExportEnabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load current settings from user
    if (user) {
      setSettings({
        profileVisibility: (user as any).profileVisibility || 'public',
        followerApprovalRequired: (user as any).followerApprovalRequired || false,
        defaultAnonymousMode: (user as any).defaultAnonymousMode || false,
        activityVisible: (user as any).activityVisible !== undefined ? (user as any).activityVisible : true,
        dataExportEnabled: (user as any).dataExportEnabled !== undefined ? (user as any).dataExportEnabled : true,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await response.json();

      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(data.user));

      setSaveMessage({ type: 'success', text: 'Privacy settings saved successfully!' });

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    // TODO: Implement data export functionality
    alert('Data export feature coming soon!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access privacy settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#3A2E1F]">Privacy & Visibility Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage who can see your content and activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Profile Visibility</h2>
                <p className="text-sm text-gray-600 mt-1">Control who can view your full profile</p>
              </div>
            </div>

            <div className="space-y-3 ml-11">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={settings.profileVisibility === 'public'}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as any })}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Public</div>
                  <div className="text-xs text-gray-600">Anyone can view your profile</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="followers_only"
                  checked={settings.profileVisibility === 'followers_only'}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as any })}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Followers Only</div>
                  <div className="text-xs text-gray-600">Only your followers can view your profile</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={settings.profileVisibility === 'private'}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as any })}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Private</div>
                  <div className="text-xs text-gray-600">Only you can view your profile</div>
                </div>
              </label>
            </div>
          </div>

          {/* Follow Settings */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Follow Settings</h2>
                <p className="text-sm text-gray-600 mt-1">Manage who can follow you</p>
              </div>
            </div>

            <div className="ml-11">
              <label className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.followerApprovalRequired}
                  onChange={(e) => setSettings({ ...settings, followerApprovalRequired: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Require Approval</div>
                  <div className="text-xs text-gray-600">Review and approve follow requests before they can see your content</div>
                </div>
              </label>
            </div>
          </div>

          {/* Posting Preferences */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Posting Preferences</h2>
                <p className="text-sm text-gray-600 mt-1">Control your default posting behavior</p>
              </div>
            </div>

            <div className="ml-11">
              <label className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.defaultAnonymousMode}
                  onChange={(e) => setSettings({ ...settings, defaultAnonymousMode: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Post Anonymously by Default</div>
                  <div className="text-xs text-gray-600">Your posts will use your alias instead of your real name by default</div>
                </div>
              </label>
            </div>
          </div>

          {/* Activity Visibility */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <EyeOff className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Activity Visibility</h2>
                <p className="text-sm text-gray-600 mt-1">Control what others can see about your activity</p>
              </div>
            </div>

            <div className="ml-11">
              <label className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.activityVisible}
                  onChange={(e) => setSettings({ ...settings, activityVisible: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Show Activity Feed</div>
                  <div className="text-xs text-gray-600">Allow others to see your recent activity and contributions</div>
                </div>
              </label>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Data & Privacy</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your data and privacy options</p>
              </div>
            </div>

            <div className="ml-11 space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.dataExportEnabled}
                  onChange={(e) => setSettings({ ...settings, dataExportEnabled: e.target.checked })}
                  className="mt-1 w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                />
                <div>
                  <div className="font-semibold text-[#3A2E1F]">Enable Data Export</div>
                  <div className="text-xs text-gray-600">Allow exporting your data at any time</div>
                </div>
              </label>

              {settings.dataExportEnabled && (
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#3A2E1F] font-semibold transition-all"
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Export My Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 inline mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

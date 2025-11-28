'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, Palette, Award, Save, Pin } from 'lucide-react';
import Image from 'next/image';

const THEME_COLORS = [
  { name: 'Sunflower Yellow', value: '#FACC15' },
  { name: 'Sunset Orange', value: '#FB923C' },
  { name: 'Rose Pink', value: '#FB7185' },
  { name: 'Lavender Purple', value: '#C084FC' },
  { name: 'Sky Blue', value: '#38BDF8' },
  { name: 'Mint Green', value: '#34D399' },
  { name: 'Coral Red', value: '#F87171' },
  { name: 'Warm Brown', value: '#A78BFA' },
];

export default function CustomizeProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#FACC15');
  const [badge, setBadge] = useState('');
  const [pinnedPostId, setPinnedPostId] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  useEffect(() => {
    if (user) {
      setCoverPhoto((user as any).coverPhoto || null);
      setThemeColor((user as any).themeColor || '#FACC15');
      setBadge((user as any).badge || '');
      setPinnedPostId((user as any).pinnedPostId || '');
    }
  }, [user]);

  async function handleCoverPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    setIsUploadingCover(true);
    setSaveMessage(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
        setIsUploadingCover(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Failed to upload cover photo' });
      setIsUploadingCover(false);
    }
  }

  async function handleSave() {
    if (!user) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/customize', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverPhoto,
          themeColor,
          badge: badge.trim() || null,
          pinnedPostId: pinnedPostId.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save customization');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));

      setSaveMessage({ type: 'success', text: 'Profile customization saved!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to customize your profile.</p>
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
              <h1 className="text-2xl font-bold text-[#3A2E1F]">Customize Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Personalize your profile appearance</p>
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
          {/* Cover Photo */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Cover Photo</h2>
                <p className="text-sm text-gray-600 mt-1">Add a banner image to your profile</p>
              </div>
            </div>

            {/* Cover Photo Preview */}
            <div className="relative w-full h-48 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-xl overflow-hidden mb-4">
              {coverPhoto ? (
                <Image
                  src={coverPhoto}
                  alt="Cover photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No cover photo</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoUpload}
                className="hidden"
                disabled={isUploadingCover || isSaving}
              />
              <div className="px-4 py-3 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all text-center">
                <span className="text-sm font-semibold text-[#3A2E1F]">
                  {isUploadingCover ? 'Uploading...' : coverPhoto ? 'Change Cover Photo' : 'Upload Cover Photo'}
                </span>
              </div>
            </label>

            {coverPhoto && (
              <button
                onClick={() => setCoverPhoto(null)}
                className="mt-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Remove Cover Photo
              </button>
            )}
          </div>

          {/* Theme Color */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Theme Accent Color</h2>
                <p className="text-sm text-gray-600 mt-1">Choose your profile's accent color</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setThemeColor(color.value)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    themeColor === color.value
                      ? 'border-gray-800 scale-105'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value + '20' }}
                >
                  <div
                    className="w-full h-8 rounded-lg mb-2"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-xs font-medium text-gray-700 text-center">
                    {color.name}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom Color */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Custom Color:</label>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-20 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <span className="text-sm text-gray-600">{themeColor}</span>
            </div>
          </div>

          {/* Badge/Tagline */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Profile Badge</h2>
                <p className="text-sm text-gray-600 mt-1">Add a custom badge or tagline</p>
              </div>
            </div>

            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g., 🌻 Garden Enthusiast, ✨ Creative Soul"
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
              disabled={isSaving}
            />
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-gray-500">{badge.length}/50 characters</span>
              {badge && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Preview:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                    {badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pinned Post */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Pin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#3A2E1F]">Pinned Post</h2>
                <p className="text-sm text-gray-600 mt-1">Pin a post to the top of your profile</p>
              </div>
            </div>

            <input
              type="text"
              value={pinnedPostId}
              onChange={(e) => setPinnedPostId(e.target.value)}
              placeholder="Enter post ID to pin (use Activity Actions menu on posts)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
              disabled={isSaving}
            />
            <p className="mt-2 text-xs text-gray-500">
              Tip: Use the Pin button in the Activity Actions menu on any of your posts to get the post ID
            </p>
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

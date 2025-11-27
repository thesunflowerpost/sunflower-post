'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, User } from 'lucide-react';
import Image from 'next/image';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentBio?: string;
  currentAvatarUrl?: string;
  onSave: (data: { name: string; bio: string; avatarUrl?: string }) => Promise<void>;
}

const BIO_MAX_LENGTH = 160;
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunflower1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunflower2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunflower3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunflower4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunflower5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunflower6',
];

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentBio = '',
  currentAvatarUrl,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [bio, setBio] = useState(currentBio);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [selectedAvatarType, setSelectedAvatarType] = useState<'current' | 'preset' | 'upload'>('current');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setBio(currentBio);
      setAvatarUrl(currentAvatarUrl);
      setSelectedAvatarType('current');
      setUploadedImage(null);
      setError(null);
    }
  }, [isOpen, currentName, currentBio, currentAvatarUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedAvatarType('upload');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (bio.length > BIO_MAX_LENGTH) {
      setError(`Bio must be ${BIO_MAX_LENGTH} characters or less`);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      let finalAvatarUrl = avatarUrl;

      if (selectedAvatarType === 'upload' && uploadedImage) {
        finalAvatarUrl = uploadedImage;
      } else if (selectedAvatarType === 'preset') {
        finalAvatarUrl = avatarUrl;
      }

      await onSave({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: finalAvatarUrl,
      });

      onClose();
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPreviewAvatar = () => {
    if (selectedAvatarType === 'upload' && uploadedImage) {
      return uploadedImage;
    }
    if (selectedAvatarType === 'preset' && avatarUrl) {
      return avatarUrl;
    }
    return currentAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentName}`;
  };

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
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#3A2E1F]">Edit Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={isSaving}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Avatar Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    Profile Picture
                  </label>

                  {/* Current Avatar Preview */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <Image
                        src={getPreviewAvatar()}
                        alt="Profile preview"
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-yellow-400"
                      />
                      <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <Camera className="w-5 h-5 text-[#3A2E1F]" />
                      </div>
                    </div>
                  </div>

                  {/* Avatar Options */}
                  <div className="space-y-3">
                    {/* Upload Custom Image */}
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading || isSaving}
                      />
                      <div className="px-4 py-3 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition-all text-center">
                        <span className="text-sm font-semibold text-[#3A2E1F]">
                          {isUploading ? 'Uploading...' : '📸 Upload Custom Image'}
                        </span>
                      </div>
                    </label>

                    {/* Preset Avatars */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Or choose a preset:</p>
                      <div className="grid grid-cols-6 gap-2">
                        {PRESET_AVATARS.map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setAvatarUrl(preset);
                              setSelectedAvatarType('preset');
                            }}
                            className={`rounded-full border-2 transition-all hover:scale-110 ${
                              selectedAvatarType === 'preset' && avatarUrl === preset
                                ? 'border-yellow-400 scale-110'
                                : 'border-gray-200 hover:border-yellow-300'
                            }`}
                          >
                            <Image
                              src={preset}
                              alt={`Preset ${index + 1}`}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
                      placeholder="Your name"
                      disabled={isSaving}
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#3A2E1F]">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    disabled={isSaving}
                    maxLength={BIO_MAX_LENGTH}
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {bio.length}/{BIO_MAX_LENGTH} characters
                    </span>
                    {bio.length >= BIO_MAX_LENGTH - 10 && (
                      <span className="text-orange-500 font-semibold">
                        {BIO_MAX_LENGTH - bio.length} characters remaining
                      </span>
                    )}
                  </div>
                </div>

                {/* Preview Section */}
                <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">PREVIEW:</p>
                  <div className="flex items-start gap-3">
                    <Image
                      src={getPreviewAvatar()}
                      alt="Preview"
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-yellow-400"
                    />
                    <div>
                      <p className="font-bold text-[#3A2E1F]">{name || 'Your Name'}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {bio || 'Your bio will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold transition-all"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving || !name.trim()}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
